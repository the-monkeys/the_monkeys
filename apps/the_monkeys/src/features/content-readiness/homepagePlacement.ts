import {
  HOMEPAGE_MINIMUM_WORDS,
  usableHomepageCover,
} from '@/lib/homepageEligibility';
import { tokenizeMarkup } from '@/lib/readableMarkup';
import DOMPurify from 'isomorphic-dompurify';

import { comparableText, usefulText } from './contentText';
import type { CheckStatus, ReadinessCheck, ReadinessSnapshot } from './types';

const bodyPlaceholders = new Set([
  'start writing',
  'start writing here',
  'write something',
  'write your story',
  'your content here',
]);
const testTitles = new Set(['test', 'test post', 'test article']);
// Parse visible text as text: escaping literal brackets preserves entity decoding
// exactly once and never reinterprets encoded markup as an HTML element.
const decodeVisibleEntities = (text: string) =>
  !text.includes('&')
    ? text
    : DOMPurify.sanitize(text.replace(/</g, '&lt;').replace(/>/g, '&gt;'), {
        ALLOWED_TAGS: [],
        RETURN_DOM_FRAGMENT: true,
      }).textContent ?? '';
const homepageText = (text: string) =>
  tokenizeMarkup(text, true, decodeVisibleEntities).text.normalize('NFKC');
const comparable = (text: string) =>
  comparableText(text)
    .replace(/^[.!?:;]+/, '')
    .trim();
export function homepageUsefulText(
  value: string,
  kind: 'title' | 'topic' | 'body'
): boolean {
  const visible = homepageText(value);
  const normalized = comparable(visible);
  if (kind === 'title')
    return usefulText(normalized, 'title') && !testTitles.has(normalized);
  if (kind === 'body')
    return usefulText(normalized, 'topic') && !bodyPlaceholders.has(normalized);
  return usefulText(normalized, 'topic');
}

// Unicode L/N runs retain combining marks; scripts without spaces count per rune.
const cjk = new RegExp(
  '[\\p{Script=Han}\\p{Script=Hiragana}\\p{Script=Katakana}]',
  'u'
);
const letterOrNumber = new RegExp('[\\p{L}\\p{N}]', 'u');
const mark = new RegExp('\\p{M}', 'u');
export function countHomepageWords(value: string): number {
  return countVisibleWords(homepageText(value));
}
function countVisibleWords(value: string): number {
  const text = value.replace(/(?:https?:\/\/|www\.)[^\s<>]+/gi, ' ');
  let count = 0;
  let inWord = false;
  for (const rune of Array.from(text)) {
    if (cjk.test(rune)) {
      count++;
      inWord = false;
    } else if (letterOrNumber.test(rune)) {
      if (!inWord) count++;
      inWord = true;
    } else if (!mark.test(rune) && rune !== '\u200c' && rune !== '\u200d')
      inWord = false;
  }
  return count;
}

const markdownText = (value: string) =>
  value
    .replace(/^ {0,3}\[[^\]]+\]:.*$/gm, '')
    .replace(/!?\[([^\]]*)\]\([^\n)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1')
    .replace(/^\s*(?:#{1,6}\s+|[-*+]\s+|\d+[.)]\s+|>\s*)/gm, '');

/** A separate bounded projection keeps the existing SEO/Event extraction and scores intact. */
export function extractHomepageContent(document: unknown) {
  const object = (value: unknown): Record<string, unknown> =>
    value !== null && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};
  const root = object(document);
  const nested = object(root.blog);
  const rawBlocks = Array.isArray(nested.blocks) ? nested.blocks : root.blocks;
  const blocks = Array.isArray(rawBlocks) ? rawBlocks.slice(0, 2000) : [];
  let partial =
    (rawBlocks != null && !Array.isArray(rawBlocks)) ||
    (Array.isArray(rawBlocks) && rawBlocks.length > 2000);
  let budget = 200000;
  const read = (value: unknown) => {
    if (typeof value !== 'string') return '';
    if (value.length > budget) partial = true;
    const text = value.slice(0, budget);
    budget -= text.length;
    if (tokenizeMarkup(text, true).malformed) partial = true;
    return text;
  };
  const isH1 = (block: Record<string, unknown>) => {
    const level = object(block.data).level;
    return block.type === 'header' && (level === 1 || level === '1');
  };
  let titleIndex = blocks.findIndex(
    (raw) => object(raw).type === 'title' || isH1(object(raw))
  );
  if (titleIndex < 0 && !Object.prototype.hasOwnProperty.call(root, 'title'))
    titleIndex = blocks.findIndex((raw) => object(raw).type === 'header');
  const rawTitle = read(
    titleIndex >= 0 ? object(object(blocks[titleIndex]).data).text : root.title
  );
  const normalizedTitle = comparable(homepageText(rawTitle));
  const body: string[] = [];
  let cover = '';
  const bodyUnit = (value: string) =>
    value
      .split('\n')
      .filter((line) => {
        const normalized = comparable(homepageText(line));
        return (
          usefulText(normalized, 'topic') && !bodyPlaceholders.has(normalized)
        );
      })
      .join(' ');
  const fields = (data: Record<string, unknown>, keys: string[]) =>
    keys.map((key) => bodyUnit(read(data[key]))).join(' ');
  const add = (text: string) => {
    for (const line of text.split('\n')) {
      if (comparable(homepageText(line)) !== normalizedTitle) {
        const visible = homepageText(bodyUnit(line));
        if (visible) body.push(visible);
      }
    }
  };
  let nodes = 0;
  const ancestors = new Set<unknown>();
  const list = (items: unknown, depth = 0): string => {
    if (!Array.isArray(items)) return '';
    if (depth > 16 || ancestors.has(items)) {
      partial = true;
      return '';
    }
    ancestors.add(items);
    const parts: string[] = [];
    for (const item of items) {
      if (budget <= 0 || ++nodes > 10000) {
        partial = true;
        break;
      }
      if (typeof item === 'string') parts.push(bodyUnit(read(item)));
      else {
        const node = object(item);
        parts.push(
          bodyUnit(read(node.content)),
          bodyUnit(read(node.text)),
          list(node.items, depth + 1)
        );
      }
    }
    ancestors.delete(items);
    return parts.join(' ');
  };
  for (let index = 0; index < blocks.length; index++) {
    const block = object(blocks[index]);
    const data = object(block.data);
    if (block.type === 'image' && !cover) {
      const image = read(object(data.file).url).trim();
      if (usableHomepageCover(image)) cover = image;
    }
    if (index === titleIndex || isH1(block) || block.type === 'title') continue;
    let text = '';
    switch (block.type) {
      case 'paragraph':
      case 'header':
        text = read(data.text);
        break;
      case 'quote':
        text = fields(data, ['text', 'caption']);
        break;
      case 'list':
      case 'checklist':
        text = list(data.items);
        break;
      case 'table':
        if (Array.isArray(data.content)) {
          const rows: string[] = [];
          for (const row of data.content) {
            if (budget <= 0 || ++nodes > 10000) {
              partial = true;
              break;
            }
            if (!Array.isArray(row)) continue;
            for (const cell of row) {
              if (budget <= 0 || ++nodes > 10000) {
                partial = true;
                break;
              }
              rows.push(bodyUnit(read(cell)));
            }
          }
          text = rows.join(' ');
        }
        break;
      case 'warning':
        text = read(data.message);
        break;
      case 'code':
        text = read(data.code);
        break;
      case 'markdown':
      case 'Markdown':
      case 'MarkdownBlock':
        text = markdownText(
          read(
            [data.markdown, data.content, data.text].find(
              (value) => typeof value === 'string' && value !== ''
            )
          )
        );
        break;
      case 'citation':
        text = fields(data, [
          'title',
          'authors',
          'year',
          'source',
          'identifier',
          'citationText',
        ]);
        break;
      case 'methodology':
        text = fields(data, [
          'studyDesign',
          'dataCollection',
          'analysisMethod',
          'assumptions',
          'limitations',
        ]);
        break;
      case 'dataset':
        text = fields(data, [
          'title',
          'source',
          'sampleSize',
          'collectionDate',
          'license',
          'variables',
          'notes',
        ]);
        break;
      case 'formula':
        text = fields(data, ['description', 'expression']);
        break;
      case 'trend':
        text = fields(data, ['summary']);
        break;
      case 'chart':
        text = fields(data, ['title']);
        break;
      case 'image':
      case 'delimiter':
      case 'linkTool':
        break;
      default:
        partial = true;
    }
    add(text);
    if (budget <= 0) {
      partial = true;
      break;
    }
  }
  if (!blocks.length) add(read(root.body));
  if (!cover) {
    const image = read(root.first_image).trim();
    if (usableHomepageCover(image)) cover = image;
  }
  return {
    title: rawTitle,
    wordCount: countVisibleWords(body.join(' ')),
    cover,
    partial,
  };
}

export function homepagePlacementChecks(
  snapshot: ReadinessSnapshot
): ReadinessCheck[] {
  const content = snapshot.homepage;
  const unknown = !content || content.partial;
  const make = (
    id: string,
    status: CheckStatus,
    label: string,
    finding: string,
    reason: string
  ): ReadinessCheck => ({
    id: `homepage.${id}`,
    section: 'homepage',
    scored: false,
    status,
    label,
    finding,
    reason,
  });
  const publicPublished =
    snapshot.visibility === 'public' &&
    snapshot.publicationState === 'published';
  const cover = usableHomepageCover(content?.cover);
  return [
    make(
      'title',
      unknown
        ? 'unknown'
        : homepageUsefulText(content.title, 'title')
          ? 'pass'
          : 'improve',
      'Authored article title',
      unknown
        ? 'The authored title could not be fully checked.'
        : homepageUsefulText(content.title, 'title')
          ? 'An authored title is present.'
          : 'Replace the blank or placeholder article title.',
      'Homepage articles need their own title; body text is never used as a substitute.'
    ),
    make(
      'body',
      unknown
        ? 'unknown'
        : content.wordCount >= HOMEPAGE_MINIMUM_WORDS
          ? 'pass'
          : 'improve',
      'Readable article body',
      unknown
        ? 'The full readable body could not be checked.'
        : `${content.wordCount} readable body words; at least ${HOMEPAGE_MINIMUM_WORDS} are needed for homepage placement.`,
      'The count excludes the main title, HTML attributes, URLs and editor placeholders. CJK characters count individually.'
    ),
    make(
      'topics',
      snapshot.topics.some((topic) => homepageUsefulText(topic, 'topic'))
        ? 'pass'
        : unknown
          ? 'unknown'
          : 'improve',
      'Homepage topic',
      snapshot.topics.some((topic) => homepageUsefulText(topic, 'topic'))
        ? 'At least one usable topic is present.'
        : 'Choose at least one non-placeholder topic.',
      'One relevant topic is enough for homepage placement.'
    ),
    make(
      'publication',
      snapshot.visibility === 'unknown'
        ? 'unknown'
        : publicPublished
          ? 'pass'
          : 'improve',
      'Public published article',
      publicPublished
        ? 'This article is published with public visibility.'
        : 'Homepage placement needs a public, published article.',
      'Drafts must still be published publicly. These suggestions never block saving or publishing; other feeds keep their existing rules.'
    ),
    make(
      'cover',
      snapshot.images.some((image) => image.pending) || unknown
        ? 'unknown'
        : cover
          ? 'pass'
          : 'improve',
      'Lead image (optional for text cards)',
      cover
        ? 'A persisted cover reference is present for a lead placement.'
        : 'A usable cover is needed only for the lead; qualified articles can appear in text cards without one.',
      'Use an uploaded HTTP(S) or root-relative image, rather than a placeholder or pending upload. Image availability is checked when displayed.'
    ),
  ];
}
