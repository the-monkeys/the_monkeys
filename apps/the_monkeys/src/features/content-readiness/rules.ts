import { normalizeSeoText } from '@/lib/seo';

import {
  addsDescription,
  genericLinkText,
  usefulText,
  usefulTopics,
} from './contentText';
import type { CheckStatus, ReadinessCheck, ReadinessSnapshot } from './types';

/** Structural checks only: these never request a destination or load an image. */
function usableReference(value: string, image = false): boolean {
  if (
    !value ||
    /[\s\u0000-\u001f\u007f\\<>]/.test(value) ||
    value.startsWith('//')
  )
    return false;
  if (value.startsWith('/')) return true;
  if (!image && value.startsWith('#')) return value.length > 1;
  if (!image && /^(mailto|tel):[^:]+$/i.test(value)) return true;
  if (!/^https?:\/\//i.test(value)) return false;
  try {
    const url = new URL(value);
    return (
      ['http:', 'https:'].includes(url.protocol) &&
      !!url.hostname &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

function check(
  id: string,
  section: ReadinessCheck['section'],
  status: CheckStatus,
  label: string,
  finding: string,
  reason: string,
  fieldKey?: string
): ReadinessCheck {
  return {
    id,
    section,
    status,
    scored: section === 'seo',
    label,
    finding,
    reason,
    ...(fieldKey ? { fieldKey } : {}),
  };
}

function seo(
  id: string,
  status: CheckStatus,
  label: string,
  fieldKey: string,
  pass: string,
  improve: string,
  reason: string,
  unknown = 'This information could not be fully checked.'
): ReadinessCheck {
  const finding =
    status === 'pass'
      ? pass
      : status === 'improve'
        ? improve
        : status === 'not-applicable'
          ? 'This check does not apply to the current content.'
          : unknown;
  return check(id, 'seo', status, label, finding, reason, fieldKey);
}

function imageStatus(s: ReadinessSnapshot): CheckStatus {
  if (s.images.some((image) => image.pending)) return 'unknown';
  if (s.images.some((image) => !usableReference(image.source, true)))
    return 'improve';
  if (s.extraction.partial) return 'unknown';
  return s.images.length ? 'pass' : 'not-applicable';
}

function headingStatus(s: ReadinessSnapshot): CheckStatus {
  // The public title is the first header, even when a legacy title block precedes it.
  const headings = s.headings.slice();
  if (headings[0] && normalizeSeoText(headings[0].text, 100) === s.title)
    headings.shift();
  if (
    s.extraction.partial ||
    headings.some(
      (heading) =>
        !Number.isInteger(heading.level) ||
        heading.level < 1 ||
        heading.level > 6
    )
  )
    return 'unknown';
  if (!headings.length) return 'not-applicable';
  let previous = 1;
  for (const heading of headings) {
    if (
      !heading.text.trim() ||
      heading.level === 1 ||
      heading.level > previous + 1
    )
      return 'improve';
    previous = heading.level;
  }
  return 'pass';
}

function linkStatus(s: ReadinessSnapshot): CheckStatus {
  return s.links.some((link) => !usableReference(link.href))
    ? 'improve'
    : s.extraction.partial
      ? 'unknown'
      : s.links.length
        ? 'pass'
        : 'not-applicable';
}

function imageContext(s: ReadinessSnapshot): ReadinessCheck {
  const pending = s.images.some((image) => image.pending);
  return check(
    `${s.kind === 'post' ? 'post' : 'event'}.image-context`,
    'answers',
    pending || s.extraction.partial
      ? 'unknown'
      : s.images.length
        ? 'manual'
        : 'not-applicable',
    'Image context',
    pending || s.extraction.partial
      ? 'Image context could not be fully inspected.'
      : s.images.length
        ? 'Review whether meaningful images have useful descriptions and decorative images are treated appropriately.'
        : 'No image context is needed when no images are used.',
    'A caption is not verified rendered alt text. Image relevance and accessibility need review; an image is optional.',
    s.kind === 'post' ? 'image' : 'cover'
  );
}

function linkText(s: ReadinessSnapshot): ReadinessCheck {
  return check(
    `${s.kind === 'post' ? 'post' : 'event'}.link-text`,
    'answers',
    s.extraction.partial
      ? 'unknown'
      : !s.links.length
        ? 'not-applicable'
        : s.links.some((link) => genericLinkText(link.label))
          ? 'manual'
          : 'pass',
    'Link text',
    s.extraction.partial
      ? 'Link text could not be fully inspected.'
      : !s.links.length
        ? 'No link text needs review.'
        : s.links.some((link) => genericLinkText(link.label))
          ? 'Some inspected links have missing or generic text. Review whether readers can understand their purpose.'
          : 'The inspected links have readable text beyond the recognised generic labels.',
    'This observes draft link text; it does not verify destination availability, rendered accessible names or relevance.',
    s.kind === 'post' ? 'content' : 'description'
  );
}

export function postChecks(s: ReadinessSnapshot): ReadinessCheck[] {
  const metadataKnown = !s.extraction.partial && !!s.preview;
  const observation = (
    id: string,
    section: 'answers' | 'sources',
    present: boolean,
    label: string,
    finding: string,
    absent: string,
    reason: string
  ) =>
    check(
      id,
      section,
      present ? 'pass' : s.extraction.partial ? 'unknown' : 'manual',
      label,
      present
        ? finding
        : s.extraction.partial
          ? 'Some content was left uninspected.'
          : absent,
      reason
    );
  return [
    seo(
      'post.title',
      metadataKnown
        ? usefulText(s.title, 'title')
          ? 'pass'
          : 'improve'
        : 'unknown',
      'Post title',
      'title',
      'The title contains readable text beyond recognised placeholders.',
      'Review the title: add readable text or replace a placeholder if it was not intended.',
      'This checks supplied text, not how well the title matches the article or a search query.'
    ),
    seo(
      'post.description',
      metadataKnown
        ? addsDescription(s.title, s.description)
          ? 'pass'
          : 'improve'
        : 'unknown',
      'Post description',
      'description',
      'The derived description has non-placeholder text beyond a repeat of the title.',
      'Add an introduction or summary beyond the title, and review any placeholder text.',
      'The existing public metadata rules derive this text. Its usefulness and accuracy still need human review.'
    ),
    seo(
      'post.topics',
      usefulTopics(s.topics) ? 'pass' : 'improve',
      'Topics',
      'topics',
      'Topics contain readable labels without recognised placeholders.',
      'Choose a relevant topic and replace any placeholder labels.',
      'The check does not verify topic relevance or reward keyword repetition.'
    ),
    seo(
      'post.image',
      imageStatus(s),
      'Image reference',
      'image',
      'The image reference has a usable structure.',
      'Review the selected image reference.',
      'Images are optional. A structural check does not confirm that a remote file loads.'
    ),
    seo(
      'post.heading-order',
      headingStatus(s),
      'Heading order',
      'content',
      'Body headings follow a readable level order.',
      'Review empty headings, repeated body H1s or skipped heading levels.',
      'Headings can organise content. A post does not need body headings.'
    ),
    seo(
      'post.links',
      linkStatus(s),
      'Link destinations',
      'content',
      'The inspected links use supported destinations.',
      'Review empty or unsupported link destinations.',
      'This checks destination structure only, without opening links or verifying their claims.'
    ),
    imageContext(s),
    linkText(s),
    observation(
      'post.introduction',
      'answers',
      s.hasIntroduction,
      'Introduction or summary',
      'An introduction or summary was identified.',
      'Consider whether the opening gives the reader useful context.',
      'A short post may already give all the context its reader needs.'
    ),
    observation(
      'post.structure',
      'answers',
      s.hasSections,
      'Sections and lists',
      'Sections or lists were identified.',
      'For a longer post, consider whether sections or lists would help.',
      'Structure is optional and there is no required word count or FAQ format.'
    ),
    check(
      'post.answer-review',
      'answers',
      'manual',
      'Reader questions',
      'Review whether the post answers its intended reader, explains unfamiliar terms, and distinguishes experience or opinion from factual claims.',
      'Local structural checks cannot judge the meaning or accuracy of an answer.'
    ),
    check(
      'post.author',
      'sources',
      s.authorName ? 'pass' : 'unknown',
      'Author context',
      s.authorName
        ? 'Author information was supplied.'
        : 'Author information was not supplied.',
      'A name is context, not a measure of authority or expertise.'
    ),
    check(
      'post.sources',
      'sources',
      !s.extraction.sourceCoverageKnown
        ? 'unknown'
        : s.sourceCount
          ? 'pass'
          : 'manual',
      'Supporting information',
      !s.extraction.sourceCoverageKnown
        ? 'Source coverage is unknown because some content was left uninspected.'
        : s.sourceCount
          ? 'Interpretable supporting information or links were identified.'
          : 'Review whether this kind of post needs supporting sources.',
      'A source link does not prove a claim. Poems, personal stories and announcements need not contain academic references.'
    ),
    observation(
      'post.methodology',
      'sources',
      s.hasMethodology,
      'Methodology context',
      'Methodology information was identified.',
      'If relevant, review whether the method needs explanation.',
      'Not every kind of post needs a methodology.'
    ),
    observation(
      'post.dataset',
      'sources',
      s.hasDataset,
      'Dataset context',
      'Dataset information was identified.',
      'If relevant, review the origin and limitations of the data.',
      'A dataset reference does not verify its quality or the claims made from it.'
    ),
    check(
      'post.source-review',
      'sources',
      'manual',
      'Attribution and evidence',
      'Review source relevance, attribution and support for claims where the genre needs evidence.',
      'Source truth and AI citation probability cannot be established by these checks.'
    ),
  ];
}

export function eventChecks(s: ReadinessSnapshot): ReadinessCheck[] {
  const meaningfulDescription = addsDescription(s.title, s.description);
  const venue = s.location?.text ?? '';
  const coordinatesOnly = /^[-+]?\d+(?:\.\d+)?\s*,\s*[-+]?\d+(?:\.\d+)?$/.test(
    venue
  );
  const place: CheckStatus = !s.location
    ? 'unknown'
    : s.location.mode === 'virtual'
      ? 'not-applicable'
      : usefulText(venue, 'venue') &&
          !coordinatesOnly &&
          !/^https?:\/\//i.test(venue)
        ? 'pass'
        : 'improve';
  const groupStatus: CheckStatus =
    s.location?.groupLinked === false
      ? 'not-applicable'
      : s.location?.groupName
        ? 'pass'
        : 'unknown';
  const partial = s.extraction.partial;
  return [
    seo(
      'event.title',
      partial ? 'unknown' : usefulText(s.title, 'title') ? 'pass' : 'improve',
      'Event title',
      'title',
      'The event title contains readable text beyond recognised placeholders.',
      'Add a readable event title and review any placeholder text.',
      'This does not verify whether the title accurately describes the event.'
    ),
    seo(
      'event.description',
      partial ? 'unknown' : meaningfulDescription ? 'pass' : 'improve',
      'Event description',
      'description',
      'The event description has non-placeholder text beyond a repeat of the title.',
      'Describe what attendees can expect beyond the title, and replace placeholder text.',
      'The description should explain the event rather than act as a placeholder.'
    ),
    seo(
      'event.topics',
      usefulTopics(s.topics) ? 'pass' : 'improve',
      'Topics',
      'topics',
      'Topics contain readable labels without recognised placeholders.',
      'Choose a relevant event topic and replace any placeholder labels.',
      'The check does not verify topic relevance.'
    ),
    seo(
      'event.schedule',
      s.schedule?.status === 'valid'
        ? 'pass'
        : s.schedule?.status === 'invalid'
          ? 'improve'
          : 'unknown',
      'Schedule and timezone',
      'schedule',
      'The end follows the start in a valid event timezone.',
      s.schedule?.reason || 'Review the event times and timezone.',
      'Saved instants are preserved for unchanged and ended events. A past event is not a content-quality failure.',
      s.schedule?.timezone
        ? 'The start and end times could not both be resolved in the supplied timezone.'
        : 'Choose an event timezone to check the schedule.'
    ),
    seo(
      'event.place',
      place,
      'Public venue',
      'location',
      'A readable public venue is supplied.',
      'Add a readable public venue or address.',
      'Coordinates, URLs and placeholders alone do not describe a public venue. Online attendance does not require disclosing a private meeting link.'
    ),
    seo(
      'event.cover',
      imageStatus(s),
      'Cover reference',
      'cover',
      'The selected cover reference has a usable structure.',
      'Review the selected cover reference.',
      'A cover is optional. Pending uploads remain unknown; no remote file is loaded.'
    ),
    seo(
      'event.links',
      linkStatus(s),
      'Description links',
      'description',
      'The inspected description links use supported destination structures.',
      'Review empty or unsupported description link destinations.',
      'This checks URL structure only. It does not open links, verify availability or request private meeting access.'
    ),
    imageContext(s),
    linkText(s),
    check(
      'event.attendance',
      'answers',
      'manual',
      'Attendance information',
      s.location?.mode === 'virtual'
        ? 'This is an online event. Review how attendees will receive access.'
        : s.location?.mode === 'hybrid'
          ? 'Review the venue and online attendance instructions separately.'
          : 'Review the public venue and attendance instructions.',
      'Private meeting access is excluded from this report.'
    ),
    check(
      'event.answer-review',
      'answers',
      'manual',
      'Attendee questions',
      'Review who should attend, what will happen, what to prepare, and how participation works. Any existing agenda or FAQ may help.',
      'This review does not invent fields or require a FAQ.'
    ),
    check(
      'event.recurrence',
      'answers',
      s.schedule?.recurrence ? 'pass' : 'not-applicable',
      'Recurrence context',
      s.schedule?.recurrence
        ? `Recurrence: ${s.schedule.recurrence}. Timezone: ${s.schedule.timezone || 'not supplied'}.`
        : 'No recurrence summary was supplied.',
      'This reads the current form only; it does not generate occurrences or change stored instants.'
    ),
    check(
      'event.organizer',
      'sources',
      s.authorName ? 'pass' : 'unknown',
      'Organizer context',
      s.authorName
        ? 'Organizer information was supplied.'
        : 'Organizer information was not supplied.',
      'Organizer context does not establish authority.'
    ),
    check(
      'event.group',
      'sources',
      groupStatus,
      'Group context',
      groupStatus === 'not-applicable'
        ? 'This is a standalone event; no group context is needed.'
        : groupStatus === 'pass'
          ? 'An event/group relationship was supplied.'
          : 'Linked-group context could not be fully established.',
      'Group context is optional and is separate from public visibility.'
    ),
    check(
      'event.source-review',
      'sources',
      'manual',
      'Host and source accuracy',
      'Review whether the public description accurately identifies the host, speakers and relevant sources.',
      'These local checks cannot verify factual accuracy or source truth.'
    ),
  ];
}

export function visibilityCheck(s: ReadinessSnapshot): ReadinessCheck {
  const finding =
    s.visibility === 'restricted'
      ? 'Not intended for public search. This is an intentional visibility setting.'
      : s.visibility === 'unknown'
        ? 'Public search visibility is unknown. The content visibility and any applicable group rules must be known.'
        : s.publicationState === 'draft'
          ? 'Intended for public search after publishing.'
          : 'The supplied visibility setting is public. Search indexing has not been verified.';
  return check(
    'content.visibility',
    'sources',
    s.visibility === 'restricted'
      ? 'not-applicable'
      : s.visibility === 'unknown'
        ? 'unknown'
        : 'pass',
    'Search visibility',
    finding,
    'Visibility is separate from content quality and does not change the readiness estimate.'
  );
}
