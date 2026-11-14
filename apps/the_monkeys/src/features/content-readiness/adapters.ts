import {
  fromLocalInput,
  isValidTimezone,
  toIsoTime,
  toLocalInput,
} from '@/lib/eventTime';
import { getPostSeoContent } from '@/lib/postSeoContent';
import { absoluteUrl, normalizeSeoText, truncateMeta } from '@/lib/seo';
import type { ProtoTime } from '@/services/events/eventTypes';

import type {
  EventReadinessContext,
  EventReadinessValues,
  PostReadinessContext,
  ReadinessIdentity,
  ReadinessSnapshot,
  VisibilityAssessment,
} from './types';

const MAX_BLOCKS = 2000;
const MAX_CHARACTERS = 200000;
const MAX_LIST_NODES = 10000;
const MAX_LIST_DEPTH = 12;
type RecordData = Record<string, unknown>;
const record = (value: unknown): RecordData =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as RecordData)
    : {};

function decodeEntities(value: string): string {
  return value.replace(
    /&(?:#(x[\da-f]+|\d+)|(amp|quot|apos|lt|gt|nbsp|colon|tab|newline));/gi,
    (whole, numeric: string | undefined, named: string | undefined) => {
      if (numeric) {
        const n =
          numeric[0].toLowerCase() === 'x'
            ? parseInt(numeric.slice(1), 16)
            : Number(numeric);
        return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : '\ufffd';
      }
      return (
        (
          {
            amp: '&',
            quot: '"',
            apos: "'",
            lt: '<',
            gt: '>',
            nbsp: ' ',
            colon: ':',
            tab: '\t',
            newline: '\n',
          } as Record<string, string>
        )[named!.toLowerCase()] ?? whole
      );
    }
  );
}

const cleanText = (value: string) =>
  decodeEntities(value).replace(/\s+/g, ' ').trim();

/** A forward-only tokenizer, not an HTML parser. A nested opener or unfinished
 * tag makes coverage partial. No regex searches repeatedly for a missing `>`.
 * Its output is text only, including when decoded entities contain markup. */
function tokenizeMarkup(value: string) {
  const text: string[] = [];
  const links: { href: string; label: string }[] = [];
  const images: { source: string; description: string }[] = [];
  let cursor = 0;
  let malformed = false;
  let suppressed = '';
  let anchor: { href: string; text: string[] } | undefined;
  const emit = (part: string) => {
    if (suppressed || !part) return;
    text.push(part);
    anchor?.text.push(part);
  };
  const finishAnchor = () => {
    if (!anchor) return;
    links.push({
      href: decodeEntities(anchor.href).trim(),
      label: cleanText(anchor.text.join('')),
    });
    anchor = undefined;
  };
  while (cursor < value.length) {
    const open = value.indexOf('<', cursor);
    if (open < 0) {
      emit(value.slice(cursor));
      break;
    }
    emit(value.slice(cursor, open));
    if (value.startsWith('<!--', open)) {
      const end = value.indexOf('-->', open + 4);
      if (end < 0) {
        malformed = true;
        break;
      }
      emit(' ');
      cursor = end + 3;
      continue;
    }
    let end = open + 1;
    let quote = '';
    for (; end < value.length; end++) {
      const character = value[end];
      // Conservatively reject '<' inside attributes too. The next iteration
      // starts here, so every character is inspected at most a constant times.
      if (character === '<') break;
      if (quote) {
        if (character === quote) quote = '';
      } else if (character === '"' || character === "'") quote = character;
      else if (character === '>') break;
    }
    if (end === value.length || value[end] === '<') {
      malformed = true;
      emit(value.slice(open, end));
      cursor = end;
      continue;
    }
    const token = value.slice(open + 1, end);
    const match = /^(\/?)([a-z][a-z0-9:-]*)\b/i.exec(token);
    if (!match) {
      malformed = true;
      emit(' ');
      cursor = end + 1;
      continue;
    }
    const closing = !!match[1];
    const name = match[2].toLowerCase();
    if (suppressed) {
      if (closing && name === suppressed) suppressed = '';
    } else if (!closing && (name === 'script' || name === 'style')) {
      suppressed = name;
    } else if (name === 'a') {
      if (closing) finishAnchor();
      else {
        if (anchor) {
          malformed = true;
          finishAnchor();
        }
        anchor = {
          href: attributes(token, match[0].length).href ?? '',
          text: [],
        };
      }
    } else if (!closing && name === 'img') {
      const attrs = attributes(token, match[0].length);
      images.push({
        source: decodeEntities(attrs.src ?? '').trim(),
        description: cleanText(attrs.alt ?? ''),
      });
    }
    emit(' ');
    cursor = end + 1;
  }
  if (anchor) {
    malformed = true;
    finishAnchor();
  }
  if (suppressed) malformed = true;
  return { text: cleanText(text.join('')), links, images, malformed };
}

/** Each attribute is consumed once; arbitrary embedded payloads are not read. */
function attributes(token: string, offset: number): Record<string, string> {
  const result: Record<string, string> = {};
  let cursor = offset;
  while (cursor < token.length) {
    while (cursor < token.length && /[\s/]/.test(token[cursor])) cursor++;
    const start = cursor;
    while (cursor < token.length && !/[\s=/>]/.test(token[cursor])) cursor++;
    const name = token.slice(start, cursor).toLowerCase();
    while (cursor < token.length && /\s/.test(token[cursor])) cursor++;
    if (token[cursor] !== '=') {
      if (cursor === start) cursor++;
      continue;
    }
    cursor++;
    while (cursor < token.length && /\s/.test(token[cursor])) cursor++;
    const quote =
      token[cursor] === '"' || token[cursor] === "'" ? token[cursor++] : '';
    const valueStart = cursor;
    while (
      cursor < token.length &&
      (quote ? token[cursor] !== quote : !/\s/.test(token[cursor]))
    )
      cursor++;
    if (name === 'href' || name === 'src' || name === 'alt')
      result[name] = token.slice(valueStart, cursor);
    if (quote) cursor++;
  }
  return result;
}

function plainText(value: string): string {
  return tokenizeMarkup(value).text;
}

function visibility(value: unknown): VisibilityAssessment {
  if (value === 'public') return 'public';
  if (
    [
      'private',
      'unlisted',
      'members_only',
      'members-only',
      'members',
      'group_only',
      'group_members',
      'group-restricted',
    ].includes(String(value))
  )
    return 'restricted';
  return 'unknown';
}

function base(context: ReadinessIdentity): ReadinessSnapshot {
  return {
    resourceKey: context.resourceKey,
    accountKey: context.accountKey,
    revision: context.revision,
    kind: 'post',
    publicationState: 'draft',
    visibility: 'unknown',
    title: '',
    description: '',
    bodyText: '',
    topics: [],
    headings: [],
    images: [],
    links: [],
    hasIntroduction: false,
    hasSections: false,
    sourceCount: 0,
    hasMethodology: false,
    hasDataset: false,
    extraction: { partial: false, reasons: [], sourceCoverageKnown: true },
    preview: null,
  };
}

/** The budget counts inspected strings, including markup, before parsing them. This
 * also bounds work on documents with huge attributes but very little visible text. */
function extractor(snapshot: ReadinessSnapshot) {
  let characters = 0;
  const body: string[] = [];
  function partial(reason: string) {
    snapshot.extraction.partial = true;
    snapshot.extraction.sourceCoverageKnown = false;
    if (!snapshot.extraction.reasons.includes(reason))
      snapshot.extraction.reasons.push(reason);
  }
  function read(value: unknown): string {
    if (typeof value !== 'string') return '';
    const remaining = MAX_CHARACTERS - characters;
    if (value.length > remaining)
      partial('The 200,000 character analysis limit was reached.');
    const result = value.slice(0, remaining);
    characters += result.length;
    if (tokenizeMarkup(result).malformed)
      partial('Malformed markup was left partially inspected.');
    return result;
  }
  function addText(text: string) {
    const clean = plainText(text);
    if (clean) body.push(clean);
    return clean;
  }
  function link(href: string, label: string) {
    const decoded = decodeEntities(href).trim();
    snapshot.links.push({ href: decoded, label: plainText(label) });
    if (/^https?:\/\//i.test(decoded)) snapshot.sourceCount++;
  }
  function markup(text: string) {
    const parsed = tokenizeMarkup(text);
    if (parsed.malformed)
      partial('Malformed markup was left partially inspected.');
    for (const item of parsed.links) {
      snapshot.links.push(item);
      if (/^https?:\/\//i.test(item.href)) snapshot.sourceCount++;
    }
    snapshot.images.push(...parsed.images);
    if (parsed.text) body.push(parsed.text);
    return parsed.text;
  }
  function finish() {
    const text = body.join(' ');
    if (text.length > MAX_CHARACTERS)
      partial('The 200,000 character analysis limit was reached.');
    snapshot.bodyText = text.slice(0, MAX_CHARACTERS);
  }
  return { partial, read, addText, markup, link, finish };
}

function topics(
  value: unknown,
  read: (value: unknown) => string,
  partial: (reason: string) => void
): string[] {
  if (!Array.isArray(value)) return [];
  if (value.length > MAX_BLOCKS)
    partial('Some topics exceeded the analysis limit.');
  return value
    .slice(0, MAX_BLOCKS)
    .map((item) => plainText(read(item)))
    .filter(Boolean);
}

export function toPostSnapshot(
  document: unknown,
  context: PostReadinessContext
): ReadinessSnapshot {
  const snapshot = base(context);
  const scan = extractor(snapshot);
  snapshot.publicationState = context.publicationState ?? 'draft';
  snapshot.visibility = visibility(context.audience);
  const group = visibility(context.groupVisibility);
  if (snapshot.visibility === 'restricted' || group === 'restricted')
    snapshot.visibility = 'restricted';
  else if (
    context.groupResolved === false ||
    (context.groupSlug &&
      (context.groupResolved !== true || group !== 'public'))
  )
    snapshot.visibility = 'unknown';
  snapshot.authorName = plainText(scan.read(context.authorName)) || undefined;
  snapshot.topics = topics(context.topics, scan.read, scan.partial);
  const documentData = record(document);
  if (documentData.blocks != null && !Array.isArray(documentData.blocks))
    scan.partial('The post block format could not be inspected.');
  const blocks = Array.isArray(documentData.blocks) ? documentData.blocks : [];
  if (blocks.length > MAX_BLOCKS)
    scan.partial('The 2,000 block analysis limit was reached.');
  // Project only the fields read by public metadata. Never invoke coercion on an
  // arbitrary list item or pass arbitrary embed data to the public extractor.
  const metadata: {
    type: string;
    data: {
      text?: string;
      caption?: string;
      items?: string[];
      file?: { url: string };
    };
  }[] = [];
  let listNodes = 0;
  const listPath = new Set<unknown>();
  const listItems = (items: unknown, depth: number): void => {
    if (!Array.isArray(items)) {
      scan.partial('Some list content could not be inspected.');
      return;
    }
    if (depth > MAX_LIST_DEPTH) {
      scan.partial('The 12 level list analysis limit was reached.');
      return;
    }
    for (const item of items) {
      if (++listNodes > MAX_LIST_NODES) {
        scan.partial('The 10,000 list node analysis limit was reached.');
        return;
      }
      if (typeof item === 'string') {
        scan.markup(scan.read(item));
        continue;
      }
      const node = record(item);
      if (listPath.has(item)) {
        scan.partial('A cyclic list could not be fully inspected.');
        continue;
      }
      if (typeof node.content !== 'string' && typeof node.text !== 'string')
        scan.partial('Some list content could not be inspected.');
      scan.markup(scan.read(node.content ?? node.text));
      if (node.items != null) {
        listPath.add(item);
        if (!Array.isArray(node.items) || node.items.length)
          listItems(node.items, depth + 1);
        listPath.delete(item);
      }
    }
  };
  const known = new Set([
    'title',
    'header',
    'paragraph',
    'quote',
    'list',
    'checklist',
    'image',
    'linkTool',
    'markdown',
    'citation',
    'methodology',
    'dataset',
    'formula',
    'trend',
    'chart',
    'delimiter',
  ]);
  for (let index = 0; index < Math.min(blocks.length, MAX_BLOCKS); index++) {
    const source = record(blocks[index]);
    if (typeof source.type !== 'string' || !known.has(source.type)) {
      scan.partial('An unsupported block was left uninspected.');
      continue;
    }
    const type = source.type;
    const data = record(source.data);
    if (
      !source.data ||
      typeof source.data !== 'object' ||
      Array.isArray(source.data)
    )
      scan.partial('Some block data could not be inspected.');
    const meta: (typeof metadata)[number] = { type, data: {} };
    metadata.push(meta);
    // All supported blocks can carry the legacy public text/caption fields.
    if (typeof data.text === 'string') meta.data.text = scan.read(data.text);
    if (typeof data.caption === 'string')
      meta.data.caption = scan.read(data.caption);
    if (Array.isArray(data.items)) {
      // First inspect within the shared node/text budgets. Exact metadata is
      // constructed only after all of these values were proven bounded.
      listItems(data.items, 1);
      if (!snapshot.extraction.partial)
        meta.data.items = data.items.map((item) => {
          if (typeof item === 'string') return item;
          return '[object Object]';
        });
    }
    switch (type) {
      case 'title':
      case 'header': {
        const text = plainText(meta.data.text ?? '');
        if (type === 'header')
          snapshot.headings.push({
            text,
            level: typeof data.level === 'number' ? data.level : 0,
          });
        scan.markup(meta.data.text ?? '');
        break;
      }
      case 'paragraph':
      case 'quote': {
        const text = scan.markup(meta.data.text ?? '');
        if (text) snapshot.hasIntroduction = true;
        if (meta.data.caption) scan.markup(meta.data.caption);
        break;
      }
      case 'list':
      case 'checklist':
        if (!Array.isArray(data.items)) listItems(data.items, 1);
        if (Array.isArray(data.items) && data.items.length)
          snapshot.hasSections = true;
        break;
      case 'image': {
        const source = scan.read(record(data.file).url ?? data.url);
        if (typeof record(data.file).url === 'string')
          meta.data.file = { url: source };
        snapshot.images.push({
          source: decodeEntities(source).trim(),
          description: plainText(meta.data.caption ?? ''),
        });
        break;
      }
      case 'linkTool':
        scan.link(scan.read(data.link), scan.read(record(data.meta).title));
        break;
      case 'markdown': {
        const markdown = scan.read(data.markdown);
        for (const match of Array.from(
          markdown.matchAll(/^ {0,3}(#{1,6})\s+(.+?)\s*#*$/gm)
        ))
          snapshot.headings.push({
            text: plainText(match[2]),
            level: match[1].length,
          });
        const references = new Map<string, string>();
        for (const match of Array.from(
          markdown.matchAll(/^ {0,3}\[([^\]]+)\]:\s*<?([^\s>]+)>?.*$/gm)
        ))
          references.set(match[1].toLowerCase(), match[2]);
        let visible = markdown.replace(/^ {0,3}\[[^\]]+\]:.*$/gm, '');
        visible = visible.replace(
          /(!?)\[([^\]]*)\]\(\s*(<[^>]*>|[^\s)]*)(?:\s+["'][^"']*["'])?\s*\)/g,
          (_match, image: string, label: string, href: string) => {
            const destination = href.replace(/^<|>$/g, '');
            if (image)
              snapshot.images.push({
                source: decodeEntities(destination).trim(),
                description: plainText(label),
              });
            else scan.link(destination, label);
            return label;
          }
        );
        visible = visible.replace(
          /\[([^\]]+)\]\[([^\]]*)\]/g,
          (_match, label: string, ref: string) => {
            scan.link(
              references.get((ref || label).toLowerCase()) ?? '',
              label
            );
            return label;
          }
        );
        const text = scan.markup(
          visible
            .replace(/^ {0,3}#{1,6}\s+/gm, '')
            .replace(/^\s*[-*+]\s+/gm, '')
        );
        if (text) snapshot.hasIntroduction = true;
        if (/^\s*(?:[-*+]\s|\d+[.)]\s)/m.test(markdown))
          snapshot.hasSections = true;
        break;
      }
      case 'citation': {
        const fields = [
          'title',
          'authors',
          'year',
          'source',
          'identifier',
          'citationText',
        ].map((key) => scan.markup(scan.read(data[key])));
        const url = scan.read(data.url);
        if (url) scan.link(url, fields[0]);
        if (fields.some(Boolean)) snapshot.sourceCount++;
        break;
      }
      case 'methodology':
      case 'dataset': {
        const keys =
          type === 'methodology'
            ? [
                'studyDesign',
                'dataCollection',
                'analysisMethod',
                'assumptions',
                'limitations',
              ]
            : [
                'title',
                'source',
                'sampleSize',
                'collectionDate',
                'license',
                'variables',
                'notes',
              ];
        const present = keys
          .map((key) => scan.markup(scan.read(data[key])))
          .some(Boolean);
        if (type === 'methodology') snapshot.hasMethodology ||= present;
        else snapshot.hasDataset ||= present;
        break;
      }
      case 'formula':
        scan.markup(scan.read(data.description));
        scan.addText(scan.read(data.expression));
        break;
      case 'trend':
        scan.markup(scan.read(data.summary));
        break;
      case 'chart':
        scan.markup(scan.read(data.title));
        // Chart arrays are not recursively scanned for claims or citations.
        scan.partial(
          'Chart data was left uninspected; only its title was read.'
        );
        break;
    }
  }
  if (context.imagePending)
    snapshot.images.push({ source: '', description: '', pending: true });
  scan.finish();
  if (snapshot.extraction.partial) {
    snapshot.hasSections ||= snapshot.headings.length > 1;
    return snapshot;
  }
  const metadataText = (block: (typeof metadata)[number] | undefined) =>
    block?.data.text ??
    (block?.data.items
      ? block.data.items.join(', ')
      : block?.data.caption ?? '');
  const titleBlock =
    metadata.find((block) => block.type === 'header' && metadataText(block)) ??
    metadata.find((block) => metadataText(block));
  const titleText = metadataText(titleBlock);
  snapshot.title = plainText(normalizeSeoText(titleText, 100));
  const bodyHeadings = snapshot.headings.filter(
    (heading) => heading.text !== plainText(titleText)
  );
  snapshot.hasSections ||= bodyHeadings.length > 0;
  if (!snapshot.extraction.partial) {
    // A full bounded scan is a prerequisite: a late header can change the public
    // title, its canonical slug and description. Never use a truncated document.
    const publicContent = getPostSeoContent({ blocks: metadata });
    snapshot.title =
      titleText && normalizeSeoText(titleText, 100) ? publicContent.title : '';
    const hasDescription = metadata
      .filter((block) =>
        ['paragraph', 'quote', 'list', 'header'].includes(block.type)
      )
      .some((block) => {
        const text = normalizeSeoText(metadataText(block), 500);
        return text && text !== normalizeSeoText(titleText, 500);
      });
    snapshot.description = hasDescription ? publicContent.description : '';
    snapshot.preview = {
      title: `${publicContent.title} | Monkeys`,
      description: publicContent.description,
    };
    // resourceKey is opaque and does not establish a post ID/canonical URL.
  }
  return snapshot;
}

function eventSchedule(
  values: EventReadinessValues,
  context: EventReadinessContext
): NonNullable<ReadinessSnapshot['schedule']> {
  const timezone = typeof values.timezone === 'string' ? values.timezone : '';
  const recurrence =
    typeof values.recurrence === 'string'
      ? plainText(values.recurrence.slice(0, MAX_CHARACTERS))
      : undefined;
  const result = { timezone: timezone || undefined, recurrence };
  if (!timezone)
    return {
      ...result,
      status: 'unknown',
      reason: 'Choose an event timezone to check the schedule.',
    };
  if (!isValidTimezone(timezone))
    return {
      ...result,
      status: 'invalid',
      reason: 'Choose a valid IANA event timezone.',
    };
  try {
    const resolve = (
      value: string | undefined,
      original: ProtoTime
    ): string => {
      if (
        context.isExistingEvent &&
        (context.eventEnded ||
          (timezone === (context.savedTimezone || 'UTC') &&
            (value ?? '') === toLocalInput(original, timezone)))
      )
        return toIsoTime(original) || '';
      return fromLocalInput(value ?? '', timezone);
    };
    const start = resolve(values.startLocal, context.savedStart);
    const end = resolve(values.endLocal, context.savedEnd);
    if (!start || !end)
      return {
        ...result,
        status: 'unknown',
        reason: 'Supply both start and end times to check the schedule.',
      };
    const startMs = new Date(start).getTime();
    const endMs = new Date(end).getTime();
    if (
      !Number.isFinite(startMs) ||
      !Number.isFinite(endMs) ||
      endMs <= startMs
    )
      return {
        ...result,
        status: 'invalid',
        reason: 'The end must be after a valid start time.',
      };
    return { ...result, status: 'valid', start, end };
  } catch {
    // Conversion errors describe form data, never rewrite it or set form errors.
    return {
      ...result,
      status: 'invalid',
      reason:
        'Check the dates and timezone. A clock change can make a wall time missing or ambiguous.',
    };
  }
}

export function toEventSnapshot(
  values: EventReadinessValues,
  context: EventReadinessContext
): ReadinessSnapshot {
  const snapshot = base(context);
  const scan = extractor(snapshot);
  snapshot.kind = 'event';
  snapshot.publicationState = context.publicationState ?? 'draft';
  snapshot.visibility = visibility(values.visibility);
  const groupLinked =
    context.groupLinked === true || !!(context.groupSlug || context.groupName);
  const group = visibility(context.groupVisibility);
  if (groupLinked) {
    snapshot.visibility =
      snapshot.visibility === 'restricted' || group === 'restricted'
        ? 'restricted'
        : snapshot.visibility === 'public' && group === 'public'
          ? 'public'
          : 'unknown';
  }
  const title = scan.read(values.title);
  const description = scan.read(values.description);
  snapshot.title = plainText(title);
  snapshot.description = plainText(description);
  scan.markup(description);
  snapshot.hasIntroduction = !!snapshot.description;
  snapshot.topics = topics(values.topics, scan.read, scan.partial);
  snapshot.authorName = plainText(scan.read(context.authorName)) || undefined;
  const source = scan.read(values.coverImage);
  if (source || values.coverPending)
    snapshot.images.push({
      source: decodeEntities(source).trim(),
      description: '',
      ...(values.coverPending ? { pending: true } : {}),
    });
  const mode = values.eventType;
  const groupName = plainText(scan.read(context.groupName));
  if (mode === 'virtual' || mode === 'in_person' || mode === 'hybrid') {
    // A name alone cannot mark linked-group context resolved. Withhold it from
    // the resolved projection until group visibility is known, independently of
    // the event's visibility (a private event can still have unresolved context).
    snapshot.location = {
      mode,
      text: plainText(scan.read(values.location)),
      groupLinked,
      ...(groupName && group !== 'unknown' ? { groupName } : {}),
    };
  }
  snapshot.schedule = eventSchedule(
    {
      startLocal: scan.read(values.startLocal),
      endLocal: scan.read(values.endLocal),
      timezone: scan.read(values.timezone),
      recurrence: scan.read(values.recurrence),
    },
    context
  );
  scan.finish();
  if (!snapshot.extraction.partial) {
    snapshot.preview = {
      title,
      description: truncateMeta(
        description || `${title}. A Monkeys event. RSVP and join the session.`
      ),
    };
    if (
      typeof context.slug === 'string' &&
      /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(context.slug) &&
      context.slug.length <= 500
    )
      snapshot.preview.url = absoluteUrl(`/events/${context.slug}`);
  }
  return snapshot;
}
