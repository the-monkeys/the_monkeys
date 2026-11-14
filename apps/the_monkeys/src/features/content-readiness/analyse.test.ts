// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';

import { toEventSnapshot, toPostSnapshot } from './adapters';
import { analyseReadiness, scoreSeoChecks } from './analyse';
import type { ReadinessCheck, ReadinessSnapshot } from './types';

const identity = { resourceKey: 'post:1', accountKey: 'account', revision: 7 };
const context = { ...identity, audience: 'public', authorName: 'Writer' };
const post = (blocks: unknown[] = [], topics: unknown = ['Science']) =>
  toPostSnapshot({ blocks }, { ...context, topics });
const header = (text: string, level: number) => ({
  type: 'header',
  data: { text, level },
});
const paragraph = (text: string) => ({ type: 'paragraph', data: { text } });
const status = (snapshot: ReadinessSnapshot, id: string) =>
  analyseReadiness(snapshot).checks.find((check) => check.id === id)?.status;
const event = (changes = {}, ctx = {}) =>
  toEventSnapshot(
    {
      title: 'Workshop',
      description: 'Learn together',
      topics: ['Art'],
      timezone: 'UTC',
      startLocal: '2020-01-01T00:00',
      endLocal: '2020-01-01T01:00',
      eventType: 'virtual',
      ...changes,
    },
    { ...identity, isExistingEvent: false, eventEnded: false, ...ctx }
  );

describe('explainable post SEO checks', () => {
  it('scores exactly two of three known applicable checks as 67, with image/headings/links not applicable', () => {
    const report = analyseReadiness(
      post([paragraph('A short title')], ['Science'])
    );
    expect(report).toMatchObject({
      ...identity,
      rulesVersion: 'creator-event-v1',
      seoScore: 67,
      passedCount: 2,
      applicableKnownCount: 3,
      coverage: 'complete',
      publicationState: 'draft',
    });
    expect(
      report.checks
        .filter((check) => check.section === 'seo')
        .map((check) => [check.id, check.status])
    ).toEqual([
      ['post.title', 'pass'],
      ['post.description', 'improve'],
      ['post.topics', 'pass'],
      ['post.image', 'not-applicable'],
      ['post.heading-order', 'not-applicable'],
      ['post.links', 'not-applicable'],
    ]);
    expect(
      report.checks
        .filter((check) => check.section !== 'seo')
        .every((check) => !check.scored)
    ).toBe(true);
  });

  it('requires meaningful metadata title/description and non-empty topics without scoring public fallbacks', () => {
    const empty = post([], []);
    expect(status(empty, 'post.title')).toBe('improve');
    expect(status(empty, 'post.description')).toBe('improve');
    expect(status(empty, 'post.topics')).toBe('improve');
    expect(
      status(
        post([header('Title', 1), paragraph('Summary')]),
        'post.description'
      )
    ).toBe('pass');
  });

  it.each([
    [
      'image',
      { file: { url: 'https://example.org/a.png' } },
      'post.image',
      'pass',
    ],
    ['image', { file: { url: 'javascript:evil()' } }, 'post.image', 'improve'],
    ['image', { file: {} }, 'post.image', 'improve'],
    [
      'paragraph',
      {
        text: '<a href="/relative">Relative</a><a href="mailto:a@example.org">Mail</a><a href="#section">Jump</a>',
      },
      'post.links',
      'pass',
    ],
    ['paragraph', { text: '<a href="">Empty</a>' }, 'post.links', 'improve'],
    [
      'paragraph',
      { text: '<a href="java&#x73;cript:alert(1)">Unsafe</a>' },
      'post.links',
      'improve',
    ],
    [
      'markdown',
      { markdown: '[Unsafe](data:text/html,evil)' },
      'post.links',
      'improve',
    ],
    [
      'paragraph',
      { text: '<a href="//evil.example">Network-relative</a>' },
      'post.links',
      'improve',
    ],
  ])('checks %s URL structure locally: %j', (type, data, id, expected) => {
    expect(status(post([{ type, data }]), id)).toBe(expected);
  });

  it('keeps pending images unknown and accepts no mandatory image', () => {
    expect(
      status(
        toPostSnapshot({}, { ...context, imagePending: true }),
        'post.image'
      )
    ).toBe('unknown');
  });

  it('checks heading progression after the public title, including invalid heading levels', () => {
    expect(
      status(
        post([header('Title', 1), header('Section', 2), header('Detail', 3)]),
        'post.heading-order'
      )
    ).toBe('pass');
    expect(
      status(
        post([header('Title', 1), header('Skipped', 3)]),
        'post.heading-order'
      )
    ).toBe('improve');
    expect(
      status(
        post([
          { type: 'title', data: { text: 'Legacy' } },
          header('Public title', 2),
        ]),
        'post.heading-order'
      )
    ).toBe('not-applicable');
    expect(
      status(
        post([header('Title', 1), header('Malformed', 9)]),
        'post.heading-order'
      )
    ).toBe('unknown');
  });

  it('recognises a long public title header before checking body heading progression', () => {
    expect(
      status(post([header('界'.repeat(150), 1)]), 'post.heading-order')
    ).toBe('not-applicable');
  });

  it.each([
    'HTTP://',
    'https://',
    'http:example.org',
    'https:/example.org',
    '/\\evil.example',
    'javascript:evil()',
    'data:image/png,evil',
  ])('rejects unusable image reference %s without fetching', (source) => {
    expect(
      status(
        post([{ type: 'image', data: { file: { url: source } } }]),
        'post.image'
      )
    ).toBe('improve');
  });

  it('withholds preview-dependent passes and absent-field conclusions when inspection is partial', () => {
    const partial = post([
      paragraph('Known text'),
      { type: 'unsupported-citations', data: { url: 'https://example.org' } },
    ]);
    const report = analyseReadiness(partial);
    expect(report.coverage).toBe('partial');
    expect(report.preview).toBeNull();
    expect(status(partial, 'post.title')).toBe('unknown');
    expect(status(partial, 'post.description')).toBe('unknown');
    expect(status(partial, 'post.image')).toBe('unknown');
    expect(status(partial, 'post.links')).toBe('unknown');
    expect(
      report.checks.find((check) => check.id === 'post.sources')?.status
    ).toBe('unknown');
  });

  it('reports introductions, structure, authors, research and manual source/answer review without AEO/GEO numbers', () => {
    const snapshot = post([
      header('Title', 1),
      paragraph('Introduction'),
      header('Section', 2),
      { type: 'citation', data: { title: 'A study' } },
      { type: 'methodology', data: { studyDesign: 'Survey' } },
      { type: 'dataset', data: { title: 'Survey results' } },
    ]);
    const report = analyseReadiness(snapshot);
    for (const [id, expected] of [
      ['post.introduction', 'pass'],
      ['post.structure', 'pass'],
      ['post.author', 'pass'],
      ['post.sources', 'pass'],
      ['post.methodology', 'pass'],
      ['post.dataset', 'pass'],
      ['post.answer-review', 'manual'],
      ['post.source-review', 'manual'],
    ]) {
      expect(report.checks.find((check) => check.id === id)).toMatchObject({
        status: expected,
        scored: false,
      });
    }
    expect(report).not.toHaveProperty('aeoScore');
    expect(report).not.toHaveProperty('geoScore');
    expect(status(toPostSnapshot(null, identity), 'post.author')).toBe(
      'unknown'
    );
    expect(status(post([paragraph('A poem')]), 'post.sources')).toBe('manual');
  });
});

describe('event checks', () => {
  it('evaluates all stable rule IDs for a past event without penalising archives', () => {
    const snapshot = event(
      {
        eventType: 'in_person',
        location: 'Town Hall',
        coverImage: '/cover.jpg',
        recurrence: 'Weekly',
      },
      { authorName: 'Host', groupName: 'Club', groupVisibility: 'public' }
    );
    const report = analyseReadiness(snapshot);
    expect(report).toMatchObject({
      seoScore: 100,
      passedCount: 6,
      applicableKnownCount: 6,
    });
    expect(
      report.checks.filter((check) => check.scored).map((check) => check.id)
    ).toEqual([
      'event.title',
      'event.description',
      'event.topics',
      'event.schedule',
      'event.place',
      'event.cover',
    ]);
    expect(status(snapshot, 'event.organizer')).toBe('pass');
    expect(status(snapshot, 'event.group')).toBe('pass');
    expect(status(snapshot, 'event.answer-review')).toBe('manual');
    expect(status(snapshot, 'event.source-review')).toBe('manual');
    expect(status(snapshot, 'event.recurrence')).toBe('pass');
  });

  it.each([
    [{ title: '' }, 'event.title', 'improve'],
    [{ description: ' TBD ' }, 'event.description', 'improve'],
    [{ description: 'Coming soon' }, 'event.description', 'improve'],
    [{ description: '' }, 'event.description', 'improve'],
    [{ topics: [' '] }, 'event.topics', 'improve'],
    [{ timezone: '' }, 'event.schedule', 'unknown'],
    [{ timezone: 'Bad/Zone' }, 'event.schedule', 'improve'],
    [{ eventType: 'virtual' }, 'event.place', 'not-applicable'],
    [{ eventType: 'in_person', location: '' }, 'event.place', 'improve'],
    [{ eventType: 'hybrid', location: 'Town Hall' }, 'event.place', 'pass'],
    [
      { eventType: 'in_person', location: '12.3, 45.6' },
      'event.place',
      'improve',
    ],
    [{ coverPending: true }, 'event.cover', 'unknown'],
    [{ coverImage: 'data:text/html,evil' }, 'event.cover', 'improve'],
    [{}, 'event.cover', 'not-applicable'],
  ])('evaluates %s for %j', (changes, id, expected) => {
    expect(status(event(changes), id)).toBe(expected);
  });

  it('keeps visibility independent of quality, explains intentional restrictions and unknown group visibility', () => {
    const restricted = analyseReadiness(event({ visibility: 'private' }));
    expect(restricted.visibility).toBe('restricted');
    expect(
      restricted.checks.find((check) => check.id === 'content.visibility')
    ).toMatchObject({ status: 'not-applicable', scored: false });
    expect(
      restricted.checks.find((check) => check.id === 'content.visibility')
        ?.finding
    ).toContain('Not intended for public search');
    const unknown = analyseReadiness(
      event({ visibility: 'public' }, { groupSlug: 'group' })
    );
    expect(unknown.visibility).toBe('unknown');
    expect(unknown.coverage).toBe('partial');
    const draft = analyseReadiness(event({ visibility: 'public' }));
    expect(
      draft.checks.find((check) => check.id === 'content.visibility')?.finding
    ).toContain('after publishing');
    expect(restricted.seoScore).toBe(draft.seoScore);
  });

  it('treats a deliberately standalone event as complete and keeps its exact preview', () => {
    const snapshot = event(
      { visibility: 'public' },
      { authorName: 'Host', slug: 'workshop' }
    );
    const report = analyseReadiness(snapshot);
    expect(
      report.checks.find((check) => check.id === 'event.group')
    ).toMatchObject({ status: 'not-applicable', scored: false });
    expect(report.coverage).toBe('complete');
    expect(report.coverageReasons).toEqual([]);
    expect(report.preview).toEqual(snapshot.preview);
    expect(report.preview?.url).toContain('/events/workshop');
  });

  it.each([
    [{ groupSlug: 'club' }, 'public'],
    [{ groupSlug: 'club', groupVisibility: 'public' }, 'public'],
    [{ groupSlug: 'club', groupName: 'Club' }, 'public'],
    [{ groupSlug: 'club', groupName: 'Club' }, 'private'],
    [
      { groupSlug: 'club', groupName: '  ', groupVisibility: 'public' },
      'public',
    ],
  ])(
    'keeps linked group context unknown until name and visibility are known: %j',
    (group, visibility) => {
      const report = analyseReadiness(
        event({ visibility }, { authorName: 'Host', ...group })
      );
      expect(
        report.checks.find((check) => check.id === 'event.group')?.status
      ).toBe('unknown');
      expect(report.coverage).toBe('partial');
    }
  );

  it.each(['public', 'private'])(
    'passes known linked group context with %s group visibility',
    (groupVisibility) => {
      const report = analyseReadiness(
        event(
          { visibility: 'public' },
          {
            authorName: 'Host',
            groupSlug: 'club',
            groupName: 'Club',
            groupVisibility,
          }
        )
      );
      expect(
        report.checks.find((check) => check.id === 'event.group')?.status
      ).toBe('pass');
      expect(report.coverage).toBe('complete');
    }
  );

  it('explains unknown post visibility without event-specific language', () => {
    const report = analyseReadiness(toPostSnapshot(null, identity));
    const finding =
      report.checks.find((check) => check.id === 'content.visibility')
        ?.finding ?? '';
    expect(finding).toContain('unknown');
    expect(finding).not.toMatch(/event|enclosing-group/i);
  });

  it('explains group_members as intentionally restricted independently of unresolved group details', () => {
    const report = analyseReadiness(
      event({ visibility: 'group_members' }, { groupSlug: 'club' })
    );
    expect(report.visibility).toBe('restricted');
    expect(
      report.checks.find((check) => check.id === 'content.visibility')
    ).toMatchObject({ status: 'not-applicable', scored: false });
    expect(
      report.checks.find((check) => check.id === 'content.visibility')?.finding
    ).toContain('Not intended for public search');
  });
});

describe('score reduction and purity', () => {
  const check = (
    status: ReadinessCheck['status'],
    section: ReadinessCheck['section'] = 'seo',
    scored = true
  ): ReadinessCheck => ({
    id: status,
    section,
    status,
    scored,
    label: '',
    finding: '',
    reason: '',
  });
  it('excludes unknown, manual, not applicable and unscored observations from the denominator', () => {
    expect(
      scoreSeoChecks([
        check('pass'),
        check('pass'),
        check('improve'),
        check('manual'),
        check('unknown'),
        check('not-applicable'),
        check('pass', 'answers'),
        check('pass', 'seo', false),
      ])
    ).toEqual({ seoScore: 67, passedCount: 2, applicableKnownCount: 3 });
    expect(
      scoreSeoChecks([
        check('unknown'),
        check('manual'),
        check('not-applicable'),
      ])
    ).toEqual({ seoScore: null, passedCount: 0, applicableKnownCount: 0 });
    expect(scoreSeoChecks([]).seoScore).toBeNull();
  });

  it('is deterministic, preserves frozen input, makes no requests, and never displays undefined', () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(() => {
      throw new Error('No network');
    });
    try {
      const snapshot = post([paragraph('<b>Hello</b>')]);
      Object.freeze(snapshot.extraction.reasons);
      Object.freeze(snapshot.extraction);
      Object.freeze(snapshot.topics);
      Object.freeze(snapshot);
      const before = JSON.stringify(snapshot);
      const a = analyseReadiness(snapshot);
      expect(analyseReadiness(snapshot)).toEqual(a);
      expect(JSON.stringify(snapshot)).toBe(before);
      expect(
        a.checks.every(
          (check) =>
            !`${check.label} ${check.finding} ${check.reason}`.includes(
              'undefined'
            )
        )
      ).toBe(true);
      expect(fetch).not.toHaveBeenCalled();
    } finally {
      fetch.mockRestore();
    }
  });
});
