// @vitest-environment node
import { fromLocalInput, toLocalInput } from '@/lib/eventTime';
import * as publicSeo from '@/lib/postSeoContent';
import { absoluteUrl, pageMetadata, truncateMeta } from '@/lib/seo';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { toEventSnapshot, toPostSnapshot } from './adapters';
import type { EventReadinessContext, EventReadinessValues } from './types';

const identity = { resourceKey: 'post:42', accountKey: 'author', revision: 3 };
const context = { ...identity, audience: 'public' };
const block = (type: string, data: unknown) => ({ type, data });
const paragraph = (text: string) => block('paragraph', { text });
function freeze<T>(input: T): T {
  if (input && typeof input === 'object') {
    Object.values(input).forEach(freeze);
    Object.freeze(input);
  }
  return input;
}
const eventContext: EventReadinessContext = {
  ...identity,
  isExistingEvent: false,
  eventEnded: false,
};
const eventValues: EventReadinessValues = {
  title: 'Community workshop',
  description: 'Learn and share practical ideas.',
  eventType: 'virtual',
  startLocal: '2026-11-01T01:30',
  endLocal: '2026-11-01T02:45',
  timezone: 'America/New_York',
  visibility: 'public',
};
afterEach(() => vi.restoreAllMocks());

describe('post snapshots', () => {
  it('preserves legacy public title preference and exact metadata limits without mutation', () => {
    const doc = freeze({
      blocks: [
        block('title', { text: 'Legacy title' }),
        block('header', { text: 'Public heading', level: 1 }),
        paragraph(
          'A meaningful introduction with enough detail for the existing public metadata.'
        ),
        paragraph('界'.repeat(6000)),
      ],
    });
    const before = JSON.stringify(doc);
    const snapshot = toPostSnapshot(doc, context);
    expect(snapshot.title).toBe('Public heading');
    expect(snapshot.preview).toEqual({
      title: 'Public heading | Monkeys',
      description:
        'A meaningful introduction with enough detail for the existing public metadata.',
    });
    expect(snapshot.description).toBe(
      publicSeo.getPostSeoContent(doc).description
    );
    expect(snapshot.bodyText).toContain('界'.repeat(6000));
    expect(snapshot.extraction.partial).toBe(false);
    expect(JSON.stringify(doc)).toBe(before);
    const long = toPostSnapshot(
      {
        blocks: [
          block('header', { text: '界'.repeat(150), level: 1 }),
          paragraph('文'.repeat(300)),
        ],
      },
      context
    );
    expect(long.title).toHaveLength(100);
    expect(long.description).toHaveLength(160);
  });

  it.each([
    null,
    undefined,
    {},
    { blocks: null },
    { blocks: [null, 5, {}, { type: 'image', data: null }] },
  ])('accepts malformed or missing documents: %j', (doc) => {
    const snapshot = toPostSnapshot(freeze(doc), context);
    expect(snapshot.kind).toBe('post');
    expect(snapshot.bodyText).toBe('');
    expect(snapshot.authorName).toBeUndefined();
  });

  it('extracts supported Markdown, nested legacy lists, and research fields without embeds or HTML execution', () => {
    const doc = freeze({
      blocks: [
        block('title', { text: 'Research notes' }),
        paragraph(
          '<script>secret()</script><b>Introduction</b> &amp; context <a href="https://example.org/paper">paper</a>'
        ),
        block('list', {
          items: [
            'First',
            { content: 'Second', items: [{ content: 'Nested', items: [] }] },
          ],
        }),
        block('markdown', {
          markdown:
            '## Results\nIntroductory text\n- Item\n[Study](https://example.org/study)\n![Chart](/chart.png)\n[Ref][r]\n[r]: https://example.org/ref',
        }),
        block('citation', {
          title: 'Study title',
          authors: 'A researcher',
          year: '2024',
          source: 'Journal',
          url: 'https://example.org/citation',
          citationText: 'A researcher (2024)',
        }),
        block('methodology', {
          studyDesign: 'Observational',
          limitations: 'Small sample',
        }),
        block('dataset', {
          title: 'Survey',
          source: 'Public archive',
          notes: 'Documented sample',
        }),
      ],
    });
    const snapshot = toPostSnapshot(doc, {
      ...context,
      topics: [' Science ', null, '', 5],
      authorName: ' ',
    });
    expect(snapshot.bodyText).toContain('Nested');
    expect(snapshot.bodyText).toContain('Observational');
    expect(snapshot.bodyText).toContain('Survey');
    expect(snapshot.bodyText).not.toMatch(/<script|<b>|secret\(\)/);
    expect(snapshot.topics).toEqual(['Science']);
    expect(snapshot.hasIntroduction).toBe(true);
    expect(snapshot.hasSections).toBe(true);
    expect(snapshot.headings).toContainEqual({ text: 'Results', level: 2 });
    expect(snapshot.links.map((link) => link.href)).toEqual(
      expect.arrayContaining([
        'https://example.org/paper',
        'https://example.org/study',
        'https://example.org/ref',
        'https://example.org/citation',
      ])
    );
    expect(snapshot.images).toContainEqual({
      source: '/chart.png',
      description: 'Chart',
    });
    expect(snapshot.sourceCount).toBeGreaterThanOrEqual(4);
    expect(snapshot.hasMethodology).toBe(true);
    expect(snapshot.hasDataset).toBe(true);
    expect(snapshot.extraction.sourceCoverageKnown).toBe(true);
    expect(snapshot.authorName).toBeUndefined();
  });

  it('retains unsafe or empty link destinations for structural checks and malformed images', () => {
    const doc = {
      blocks: [
        paragraph(
          '<a href="java&#115;cript:alert(1)">unsafe</a><a href="">empty</a><a>missing</a>'
        ),
        block('image', { file: { url: 4 }, caption: '<b>caption</b>' }),
        block('linkTool', { link: 'data:text/html,evil' }),
      ],
    };
    const snapshot = toPostSnapshot(doc, context);
    expect(snapshot.links.map((link) => link.href)).toEqual([
      'javascript:alert(1)',
      '',
      '',
      'data:text/html,evil',
    ]);
    expect(snapshot.images[0]).toEqual({ source: '', description: 'caption' });
  });

  it('does not inspect arbitrary unsupported data or claim known source coverage', () => {
    const payload = {
      get text() {
        throw new Error('must not inspect embed');
      },
    };
    const snapshot = toPostSnapshot(
      { blocks: [paragraph('Known'), block('unknown-source-widget', payload)] },
      context
    );
    expect(snapshot.bodyText).toBe('Known');
    expect(snapshot.extraction).toMatchObject({
      partial: true,
      sourceCoverageKnown: false,
    });
    expect(snapshot.preview).toBeNull();
  });

  it('never calls uncapped public extraction for 2,001 blocks with a late canonical-changing heading', () => {
    const doc = freeze({
      blocks: [
        ...Array.from({ length: 2000 }, () => paragraph('Earlier text')),
        block('header', { text: 'Late public title', level: 1 }),
      ],
    });
    expect(publicSeo.getPostSeoContent(doc).title).toBe('Late public title');
    const spy = vi.spyOn(publicSeo, 'getPostSeoContent');
    const snapshot = toPostSnapshot(doc, context);
    expect(snapshot.preview).toBeNull();
    expect(snapshot.extraction.partial).toBe(true);
    expect(snapshot.headings).toEqual([]);
    expect(spy).not.toHaveBeenCalled();
    expect(doc.blocks).toHaveLength(2001);
  });

  it.each(['characters', 'nodes', 'depth'] as const)(
    'bounds %s and withholds an exact preview without modifying input',
    (limit) => {
      let items: unknown[] = ['leaf'];
      for (let i = 0; i < 13; i++) items = [{ content: 'nested', items }];
      const doc = freeze({
        blocks:
          limit === 'characters'
            ? [paragraph('界'.repeat(200001))]
            : [
                block('list', {
                  items:
                    limit === 'nodes'
                      ? Array.from({ length: 10001 }, () => 'x')
                      : items,
                }),
              ],
      });
      const before = JSON.stringify(doc);
      const spy = vi.spyOn(publicSeo, 'getPostSeoContent');
      const snapshot = toPostSnapshot(doc, context);
      expect(snapshot.extraction).toMatchObject({
        partial: true,
        sourceCoverageKnown: false,
      });
      expect(snapshot.extraction.reasons.length).toBeGreaterThan(0);
      expect(snapshot.bodyText.length).toBeLessThanOrEqual(200000);
      expect(snapshot.preview).toBeNull();
      expect(spy).not.toHaveBeenCalled();
      expect(JSON.stringify(doc)).toBe(before);
    }
  );

  it('handles cyclic lists without unbounded recursion', () => {
    const item: { content: string; items: unknown[] } = {
      content: 'cycle',
      items: [],
    };
    item.items.push(item);
    expect(
      toPostSnapshot({ blocks: [block('list', { items: [item] })] }, context)
        .extraction.partial
    ).toBe(true);
  });

  it('counts extracted separators toward the character limit instead of silently claiming complete coverage', () => {
    const doc = {
      blocks: [paragraph('a'.repeat(100000)), paragraph('b'.repeat(100000))],
    };
    const snapshot = toPostSnapshot(doc, context);
    expect(snapshot.extraction.partial).toBe(true);
    expect(snapshot.preview).toBeNull();
    expect(snapshot.bodyText.length).toBeLessThanOrEqual(200000);
  });

  it('supports exact block, character and list bounds without losing complete coverage', () => {
    expect(
      toPostSnapshot(
        { blocks: Array.from({ length: 2000 }, () => paragraph('a')) },
        context
      ).extraction.partial
    ).toBe(false);
    expect(
      toPostSnapshot({ blocks: [paragraph('界'.repeat(200000))] }, context)
        .extraction.partial
    ).toBe(false);
    expect(
      toPostSnapshot(
        {
          blocks: [
            block('list', { items: Array.from({ length: 10000 }, () => 'a') }),
          ],
        },
        context
      ).extraction.partial
    ).toBe(false);
  });

  it('marks adversarial unterminated HTML partial and skips public normalization instead of repeatedly rescanning', () => {
    const doc = { blocks: [paragraph('<a '.repeat(20000))] };
    const publicHelper = vi.spyOn(publicSeo, 'getPostSeoContent');
    const started = performance.now();
    const snapshot = toPostSnapshot(doc, context);
    console.info(
      `unterminated HTML (60k): ${(performance.now() - started).toFixed(2)}ms`
    );
    expect(snapshot.extraction.partial).toBe(true);
    expect(snapshot.extraction.sourceCoverageKnown).toBe(false);
    expect(snapshot.preview).toBeNull();
    expect(publicHelper).not.toHaveBeenCalled();
  }, 30000);

  it.each(['characters', 'unsupported', 'blocks'])(
    'does not allocate an oversized metadata list join after %s coverage becomes partial',
    (reason) => {
      const huge = 'x'.repeat(20000);
      const list = block('list', {
        items: Array.from({ length: 2000 }, () => huge),
      });
      const blocks =
        reason === 'unsupported'
          ? [block('unknown-source', {}), list]
          : reason === 'blocks'
            ? [list, ...Array.from({ length: 2000 }, () => paragraph(''))]
            : [list];
      const publicHelper = vi.spyOn(publicSeo, 'getPostSeoContent');
      const originalJoin = Array.prototype.join;
      // Guard the actual allocation boundary so RED does not allocate 40 MB just
      // to demonstrate the bug. Ordinary bounded body joins remain real.
      vi.spyOn(Array.prototype, 'join').mockImplementation(function (
        this: unknown[],
        separator?: string
      ) {
        if (this.length === 2000 && this[0] === huge)
          throw new Error('Unbounded 40-million-character metadata allocation');
        return originalJoin.call(this, separator);
      });
      const snapshot = toPostSnapshot({ blocks }, context);
      expect(snapshot.extraction.partial).toBe(true);
      expect(snapshot.bodyText.length).toBeLessThanOrEqual(200000);
      expect(snapshot.preview).toBeNull();
      expect(publicHelper).not.toHaveBeenCalled();
    }
  );

  it.each([
    [
      { groupSlug: 'club', groupResolved: false, groupVisibility: 'public' },
      'unknown',
    ],
    [{ groupSlug: 'club', groupResolved: true }, 'unknown'],
    [
      { groupSlug: 'club', groupResolved: true, groupVisibility: 'private' },
      'restricted',
    ],
    [
      { groupSlug: 'club', groupResolved: true, groupVisibility: 'unlisted' },
      'restricted',
    ],
    [
      { groupSlug: 'club', groupResolved: false, groupVisibility: 'private' },
      'restricted',
    ],
    [
      { groupSlug: 'club', groupResolved: true, groupVisibility: 'public' },
      'public',
    ],
    [{ groupResolved: false }, 'unknown'],
    [{}, 'public'],
  ])(
    'combines post audience with resolved enclosing-group context %j',
    (group, expected) => {
      expect(toPostSnapshot(null, { ...context, ...group }).visibility).toBe(
        expected
      );
    }
  );

  it.each([
    ['public', 'public'],
    ['group_only', 'restricted'],
    ['members_only', 'restricted'],
    ['private', 'restricted'],
    ['unlisted', 'restricted'],
    [undefined, 'unknown'],
    ['unexpected', 'unknown'],
  ])(
    'assesses post audience %s independently of content',
    (audience, visibility) => {
      expect(toPostSnapshot(null, { ...identity, audience }).visibility).toBe(
        visibility
      );
    }
  );
});

describe('event snapshots', () => {
  it('retains legacy group linkage without a slug or name as unknown rather than standalone', () => {
    const snapshot = toEventSnapshot(eventValues, {
      ...eventContext,
      groupLinked: true,
    });
    expect(snapshot.location).toMatchObject({ groupLinked: true });
    expect(snapshot.visibility).toBe('unknown');
  });
  it('preserves the original repeated DST occurrence and seconds for unchanged fields', () => {
    const ctx = freeze({
      ...eventContext,
      isExistingEvent: true,
      savedTimezone: 'America/New_York',
      savedStart: '2026-11-01T06:30:37.123Z',
      savedEnd: '2026-11-01T07:45:42.000Z',
    });
    const snapshot = toEventSnapshot(freeze(eventValues), ctx);
    expect(snapshot.schedule).toMatchObject({
      status: 'valid',
      start: '2026-11-01T06:30:37.123Z',
      end: '2026-11-01T07:45:42.000Z',
      timezone: 'America/New_York',
    });
  });

  it('preserves seconds on each unchanged field while resolving changed wall times', () => {
    const ctx = {
      ...eventContext,
      isExistingEvent: true,
      savedTimezone: 'America/New_York',
      savedStart: '2026-11-01T06:30:37Z',
      savedEnd: '2026-11-01T07:45:42Z',
    };
    const snapshot = toEventSnapshot(
      { ...eventValues, endLocal: '2026-11-01T03:00' },
      ctx
    );
    expect(snapshot.schedule).toMatchObject({
      start: '2026-11-01T06:30:37.000Z',
      end: '2026-11-01T08:00:00.000Z',
    });
    const changed = toEventSnapshot(
      { ...eventValues, timezone: 'Asia/Kolkata' },
      ctx
    );
    expect(changed.schedule).toMatchObject({
      status: 'valid',
      start: '2026-10-31T20:00:00.000Z',
      end: '2026-10-31T21:15:00.000Z',
    });
    expect(changed.schedule?.start).toBe(
      fromLocalInput(eventValues.startLocal!, 'Asia/Kolkata')
    );
  });

  it('keeps ended-event instants despite changed form fields and uses saved UTC fallback for legacy data', () => {
    const savedStart = { seconds: '1577836809', nanos: 123000000 };
    const savedEnd = '2020-01-01T01:00:11Z';
    const ctx = {
      ...eventContext,
      isExistingEvent: true,
      savedStart,
      savedEnd,
    };
    const values = {
      ...eventValues,
      timezone: 'UTC',
      startLocal: toLocalInput(savedStart, 'UTC'),
      endLocal: toLocalInput(savedEnd, 'UTC'),
    };
    expect(toEventSnapshot(values, ctx).schedule).toMatchObject({
      status: 'valid',
      start: '2020-01-01T00:00:09.123Z',
      end: '2020-01-01T01:00:11.000Z',
    });
    expect(
      toEventSnapshot(
        {
          ...eventValues,
          timezone: 'Asia/Kolkata',
          startLocal: 'changed',
          endLocal: 'changed',
        },
        { ...ctx, eventEnded: true }
      ).schedule
    ).toMatchObject({
      status: 'valid',
      start: '2020-01-01T00:00:09.123Z',
      end: '2020-01-01T01:00:11.000Z',
    });
  });

  it.each([
    [{ timezone: undefined }, 'unknown'],
    [{ timezone: 'Not/AZone' }, 'invalid'],
    [{ startLocal: '' }, 'unknown'],
    [{ startLocal: 'bad' }, 'invalid'],
    [{ startLocal: '2026-03-08T02:30' }, 'invalid'],
    [{}, 'invalid'],
    [
      {
        timezone: 'UTC',
        startLocal: '2020-01-01T02:00',
        endLocal: '2020-01-01T01:00',
      },
      'invalid',
    ],
    [
      {
        timezone: 'UTC',
        startLocal: '2020-01-01T00:00',
        endLocal: '2020-01-01T01:00',
      },
      'valid',
    ],
  ])(
    'distinguishes missing, invalid, DST gaps/folds, and valid past schedules: %j',
    (changes, status) => {
      expect(
        toEventSnapshot({ ...eventValues, ...changes }, eventContext).schedule
          ?.status
      ).toBe(status);
    }
  );

  it('mirrors public event page preview rules, keeps recurrence and public venue, excludes private fields', () => {
    const values = freeze({
      ...eventValues,
      timezone: 'UTC',
      description: 'A workshop '.repeat(30),
      eventType: 'hybrid' as const,
      location: 'Public Library, Main Road',
      recurrence: 'Weekly on Tuesday',
      coverPending: true,
      meeting_url: 'https://secret.example/join?token=PRIVATE',
      attendees: ['private-person'],
      cookies: 'private-cookie',
      token: 'private-token',
      ticket_tiers: [{ price: 12345 }],
    });
    const ctx = {
      ...eventContext,
      slug: 'community-workshop',
      authorName: 'Host',
      groupSlug: 'club',
      groupName: 'Club',
      groupVisibility: 'public',
    };
    const snapshot = toEventSnapshot(values, ctx);
    const metadata = pageMetadata({
      title: values.title!,
      description: truncateMeta(values.description!),
      path: '/events/community-workshop',
    });
    expect(snapshot.preview).toEqual({
      title: 'Community workshop',
      description: metadata.description,
      url: absoluteUrl('/events/community-workshop'),
    });
    expect(snapshot.location).toEqual({
      mode: 'hybrid',
      text: 'Public Library, Main Road',
      groupName: 'Club',
      groupLinked: true,
    });
    expect(snapshot.schedule?.recurrence).toBe('Weekly on Tuesday');
    expect(snapshot.images).toContainEqual({
      source: '',
      description: '',
      pending: true,
    });
    const serialized = JSON.stringify(snapshot);
    expect(serialized).not.toMatch(
      /secret\.example|PRIVATE|private-person|private-cookie|private-token|meeting_url|attendees|ticket_tiers/
    );
    expect(values.ticket_tiers[0].price).toBe(12345);
  });

  it('uses the existing public fallback description and omits unsafe or unestablished URLs', () => {
    expect(
      toEventSnapshot(
        { ...eventValues, description: '' },
        { ...eventContext, slug: '../private?x' }
      ).preview
    ).toEqual({
      title: 'Community workshop',
      description:
        'Community workshop. A Monkeys event. RSVP and join the session.',
    });
  });

  it.each([
    ['public', undefined, undefined, 'public'],
    ['public', 'group', undefined, 'unknown'],
    ['public', 'group', 'public', 'public'],
    ['public', 'group', 'private', 'restricted'],
    ['private', 'group', undefined, 'restricted'],
    ['unlisted', undefined, undefined, 'restricted'],
    ['group_members', 'group', undefined, 'restricted'],
    ['members_only', undefined, undefined, 'restricted'],
    [undefined, undefined, undefined, 'unknown'],
  ])(
    'assesses event/group visibility without assuming legacy public defaults',
    (visibility, groupSlug, groupVisibility, expected) => {
      expect(
        toEventSnapshot(
          { ...eventValues, visibility },
          { ...eventContext, groupSlug, groupVisibility }
        ).visibility
      ).toBe(expected);
    }
  );

  it('runs adapters offline against frozen inputs without browser globals', () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(() => {
      throw new Error('network forbidden');
    });
    expect(() =>
      toPostSnapshot(freeze({ blocks: [paragraph('Draft')] }), freeze(context))
    ).not.toThrow();
    expect(() =>
      toEventSnapshot(freeze(eventValues), freeze(eventContext))
    ).not.toThrow();
    expect(fetch).not.toHaveBeenCalled();
    expect(typeof window).toBe('undefined');
  });
});
