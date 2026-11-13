import { normalizeSeoText } from '@/lib/seo';

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
    return ['http:', 'https:'].includes(url.protocol) && !!url.hostname;
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
  reason: string
): ReadinessCheck {
  const finding =
    status === 'pass'
      ? pass
      : status === 'improve'
        ? improve
        : status === 'not-applicable'
          ? 'This check does not apply to the current content.'
          : 'This information could not be fully checked.';
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
    if (heading.level > previous + 1) return 'improve';
    previous = heading.level;
  }
  return 'pass';
}

export function postChecks(s: ReadinessSnapshot): ReadinessCheck[] {
  const metadataKnown = !s.extraction.partial && !!s.preview;
  const linkStatus = s.links.some((link) => !usableReference(link.href))
    ? 'improve'
    : s.extraction.partial
      ? 'unknown'
      : s.links.length
        ? 'pass'
        : 'not-applicable';
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
      metadataKnown ? (s.title ? 'pass' : 'improve') : 'unknown',
      'Post title',
      'title',
      'A title can be derived using the public page rules.',
      'Add a clear title for the reader.',
      'The title helps readers understand the page; length alone does not predict ranking.'
    ),
    seo(
      'post.description',
      metadataKnown ? (s.description ? 'pass' : 'improve') : 'unknown',
      'Post description',
      'description',
      'The public page can derive a description from the post.',
      'Consider a useful introduction or summary.',
      'The current public metadata rules derive this description from existing content.'
    ),
    seo(
      'post.topics',
      s.topics.length ? 'pass' : 'improve',
      'Topics',
      'topics',
      'At least one topic is supplied.',
      'Consider adding a relevant topic.',
      'Topics describe the subject without rewarding keyword repetition.'
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
      'Review heading levels that skip a level after the title.',
      'Headings can organise content. A post does not need body headings.'
    ),
    seo(
      'post.links',
      linkStatus,
      'Link destinations',
      'content',
      'The inspected links use supported destinations.',
      'Review empty or unsupported link destinations.',
      'This checks destination structure only, without opening links or verifying their claims.'
    ),
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
  const meaningfulDescription =
    !!s.description &&
    !/^(?:tbd|tba|todo|coming soon|description|event description|to be (?:announced|confirmed)|more (?:details|information) (?:coming )?soon)[.!\s]*$/i.test(
      s.description
    );
  const venue = s.location?.text ?? '';
  const coordinatesOnly = /^[-+]?\d+(?:\.\d+)?\s*,\s*[-+]?\d+(?:\.\d+)?$/.test(
    venue
  );
  const place: CheckStatus = !s.location
    ? 'unknown'
    : s.location.mode === 'virtual'
      ? 'not-applicable'
      : venue && !coordinatesOnly
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
      partial ? 'unknown' : s.title ? 'pass' : 'improve',
      'Event title',
      'title',
      'The event has a title.',
      'Add a clear event title.',
      'A title helps attendees understand the event.'
    ),
    seo(
      'event.description',
      partial ? 'unknown' : meaningfulDescription ? 'pass' : 'improve',
      'Event description',
      'description',
      'The event has a non-placeholder description.',
      'Describe what attendees can expect.',
      'The description should explain the event rather than act as a placeholder.'
    ),
    seo(
      'event.topics',
      s.topics.length ? 'pass' : 'improve',
      'Topics',
      'topics',
      'At least one topic is supplied.',
      'Consider a relevant event topic.',
      'Topics help describe the event subject.'
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
      'Saved instants are preserved for unchanged and ended events. A past event is not a content-quality failure.'
    ),
    seo(
      'event.place',
      place,
      'Public venue',
      'location',
      'A readable public venue is supplied.',
      'Add a readable public venue or address.',
      'Coordinates alone do not describe a venue. Online attendance does not require disclosing a private meeting link.'
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
