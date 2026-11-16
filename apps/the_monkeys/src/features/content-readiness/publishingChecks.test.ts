// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';

import { toEventSnapshot, toPostSnapshot } from './adapters';
import { analyseReadiness } from './analyse';

const identity = {
  resourceKey: 'local-draft',
  accountKey: 'local-author',
  revision: 1,
};
const header = (text: string, level = 1) => ({
  type: 'header',
  data: { text, level },
});
const paragraph = (text: string) => ({ type: 'paragraph', data: { text } });
const article = (
  title = 'A practical science guide',
  description = 'Explore useful examples from a local science workshop.',
  extra: unknown[] = [],
  topics = ['Science']
) =>
  toPostSnapshot(
    { blocks: [header(title), paragraph(description), ...extra] },
    { ...identity, audience: 'public', topics }
  );
const event = (overrides = {}) =>
  toEventSnapshot(
    {
      title: 'Science workshop',
      description: 'Explore useful experiments together.',
      topics: ['Science'],
      eventType: 'in_person',
      location: 'Community Hall, Bengaluru',
      timezone: 'Asia/Kolkata',
      startLocal: '2099-11-12T19:00',
      endLocal: '2099-11-12T20:30',
      visibility: 'public',
      ...overrides,
    },
    { ...identity, isExistingEvent: false, eventEnded: false }
  );
const check = (snapshot: ReturnType<typeof article>, id: string) =>
  analyseReadiness(snapshot).checks.find((item) => item.id === id);

describe('publishing readiness evidence', () => {
  it.each([
    'Untitled Post',
    'Untitled article',
    'New post',
    'TBD',
    'TODO:',
    'Title',
    '...',
  ])('flags placeholder article title %s', (title) => {
    expect(check(article(title), 'post.title')?.status).toBe('improve');
  });
  it.each(['AI', 'C++', '日本語の詩', 'एक छोटी कविता'])(
    'accepts meaningful short or multilingual title %s without a length target',
    (title) => {
      expect(check(article(title), 'post.title')?.status).toBe('pass');
    }
  );
  it.each([
    'TBD',
    'Coming soon',
    'More details coming soon',
    'More information coming soon',
    'Post description',
    'Lorem ipsum dolor sit amet',
    '...',
  ])('flags placeholder article description %s', (description) => {
    expect(
      check(article(undefined, description), 'post.description')?.status
    ).toBe('improve');
  });
  it('flags descriptions that only repeat the title, including case and markup differences', () => {
    expect(
      check(
        article('Science & community', '<b>SCIENCE &amp; COMMUNITY.</b>'),
        'post.description'
      )?.status
    ).toBe('improve');
    expect(
      check(
        event({ description: '<b>SCIENCE WORKSHOP.</b>' }),
        'event.description'
      )?.status
    ).toBe('improve');
  });
  it('does not collapse meaningful code punctuation when comparing titles and descriptions', () => {
    expect(check(article('C++', 'C#'), 'post.description')?.status).toBe(
      'pass'
    );
  });
  it.each([':', ';'])(
    'does not count a repeated title ending in %s as a description',
    (suffix) => {
      expect(
        check(
          article('Science workshop', `SCIENCE WORKSHOP${suffix}`),
          'post.description'
        )?.status
      ).toBe('improve');
      expect(
        check(
          event({ description: `SCIENCE WORKSHOP${suffix}` }),
          'event.description'
        )?.status
      ).toBe('improve');
    }
  );
  it.each([{ topics: ['TBD'] }, { topics: ['Science', 'TODO'] }])(
    'flags placeholder topics %j without claiming relevance',
    ({ topics }) => {
      expect(
        check(article(undefined, undefined, [], topics), 'post.topics')?.status
      ).toBe('improve');
      expect(check(event({ topics }), 'event.topics')?.status).toBe('improve');
    }
  );
  it.each([
    header('Another title', 1),
    header('', 2),
    header('Skipped level', 4),
  ])('flags body heading problems %j', (heading) => {
    expect(
      check(article(undefined, undefined, [heading]), 'post.heading-order')
        ?.status
    ).toBe('improve');
  });
  it('retains legacy title handling and optional headings', () => {
    const snapshot = toPostSnapshot(
      {
        blocks: [
          { type: 'title', data: { text: 'Legacy title' } },
          header('Public heading', 2),
          paragraph('A useful introduction.'),
        ],
      },
      { ...identity, audience: 'public' }
    );
    expect(check(snapshot, 'post.heading-order')?.status).toBe(
      'not-applicable'
    );
  });
  it('treats image context as optional human review, never verified alt text or a ranking factor', () => {
    const snapshot = article(undefined, undefined, [
      {
        type: 'image',
        data: { file: { url: '/image.png' }, caption: 'Science experiment' },
      },
    ]);
    expect(check(snapshot, 'post.image-context')).toMatchObject({
      status: 'manual',
      scored: false,
    });
    expect(check(snapshot, 'post.image-context')?.reason).toMatch(
      /caption.*not.*verified.*alt/i
    );
    expect(check(article(), 'post.image-context')).toMatchObject({
      status: 'not-applicable',
      scored: false,
    });
    expect(
      check(event({ coverImage: '/cover.png' }), 'event.image-context')
    ).toMatchObject({ status: 'manual', scored: false });
  });
  it('identifies generic link text separately from URL structure, without scoring semantic relevance', () => {
    const snapshot = article(undefined, undefined, [
      paragraph('<a href="/guides">Click here</a>'),
    ]);
    expect(check(snapshot, 'post.links')?.status).toBe('pass');
    expect(check(snapshot, 'post.link-text')).toMatchObject({
      status: 'manual',
      scored: false,
    });
    expect(
      check(
        article(undefined, undefined, [
          paragraph('<a href="/guides">Science workshop guide</a>'),
        ]),
        'post.link-text'
      )
    ).toMatchObject({ status: 'pass', scored: false });
    expect(check(article(), 'post.link-text')?.status).toBe('not-applicable');
  });
  it.each(['Untitled event', 'New event', 'Event title', 'TBA'])(
    'flags placeholder event title %s',
    (title) => {
      expect(check(event({ title }), 'event.title')?.status).toBe('improve');
    }
  );
  it.each([
    'TBD',
    'Venue',
    'Address',
    '12.3, 45.6',
    'https://example.test/private-access',
  ])('does not pass an unhelpful in-person venue %s', (location) => {
    expect(check(event({ location }), 'event.place')?.status).toBe('improve');
  });
  it('preserves virtual venue privacy and meaningful in-person venues', () => {
    expect(
      check(event({ eventType: 'virtual', location: '' }), 'event.place')
        ?.status
    ).toBe('not-applicable');
    expect(check(event(), 'event.place')?.status).toBe('pass');
  });
  it('explains unknown schedule input without exposing raw diagnostic values', () => {
    expect(check(event({ endLocal: '' }), 'event.schedule')?.finding).toMatch(
      /start.*end.*could not.*resolved/i
    );
    expect(check(event({ timezone: '' }), 'event.schedule')?.finding).toMatch(
      /choose.*timezone/i
    );
  });
  it('inspects event description links structurally without retrieving destinations', () => {
    expect(
      check(
        event({
          description: 'Join us. <a href="javascript:alert(1)">Details</a>',
        }),
        'event.links'
      )?.status
    ).toBe('improve');
    expect(
      check(
        event({ description: 'Join us. <a href="/events">Event details</a>' }),
        'event.links'
      )?.status
    ).toBe('pass');
    expect(check(event(), 'event.links')?.status).toBe('not-applicable');
  });
  it('does not turn partial extraction or pending media into confident passes', () => {
    const partial = article(undefined, undefined, [
      { type: 'unsupported-block', data: {} },
    ]);
    expect(check(partial, 'post.title')?.status).toBe('unknown');
    expect(check(partial, 'post.image-context')?.status).toBe('unknown');
    expect(
      check(event({ coverPending: true }), 'event.image-context')?.status
    ).toBe('unknown');
  });
  it('versions revised checks while retaining the legacy percentage fields and no network activity', () => {
    const network = vi.spyOn(globalThis, 'fetch');
    const input = article();
    const before = JSON.stringify(input);
    const report = analyseReadiness(input);
    expect(report.rulesVersion).toBe('publishing-readiness-v2');
    expect(report).toHaveProperty('seoScore');
    expect(report.passedCount).toBeLessThanOrEqual(report.applicableKnownCount);
    expect(JSON.stringify(input)).toBe(before);
    expect(network).not.toHaveBeenCalled();
    network.mockRestore();
  });
});
