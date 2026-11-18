import { describe, expect, it } from 'vitest';

import {
  selectLandingDiscussions,
  selectLandingGroups,
} from './landingCommunity';

const post = (id: string, extra = {}) => ({
  public_id: id,
  body: `A public thought ${id}`,
  status: 'visible',
  audience: 'public',
  author_username: 'dave',
  ...extra,
});
const group = (id: number, extra = {}) => ({
  id,
  slug: `group-${id}`,
  name: `Group ${id}`,
  visibility: 'public',
  status: 'published',
  ...extra,
});

describe('landing public selection', () => {
  it('omits dates outside the JavaScript date range instead of breaking server rendering', () => {
    const [result] = selectLandingDiscussions({
      discussions: [post('date', { created_at: { seconds: 1e20 } })],
    });
    expect(result.created_at).toBeUndefined();
  });
  it('ranks recent discussions by genuine activity, then date, and bounds at three', () => {
    const rows = [
      post('older', { like_count: 2, created_at: '2026-11-01' }),
      post('newer', { reply_count: 2, created_at: { seconds: 1794873600 } }),
      post('busy', { like_count: 3, reply_count: 2 }),
      post('quiet'),
    ];
    const copy = JSON.stringify(rows);
    expect(
      selectLandingDiscussions({ discussions: rows }).map((p) => p.public_id)
    ).toEqual(['busy', 'newer', 'older']);
    expect(JSON.stringify(rows)).toBe(copy);
  });

  it('excludes hidden, deleted, members-only, unknown audiences and malformed records', () => {
    const rows = [
      post('public'),
      post('hidden', { status: 'hidden' }),
      post('deleted', { status: 'deleted' }),
      post('member', { audience: 'group_only' }),
      post('unknown', { audience: 'private' }),
      post('empty', { body: ' ' }),
      post('', { like_count: 100 }),
      null,
      {},
      post('bad', { author_username: 44 }),
    ];
    expect(
      selectLandingDiscussions({ discussions: rows }).map((p) => p.public_id)
    ).toEqual(['public']);
  });

  it('supports old site posts without audience but requires explicit public for group posts', () => {
    expect(
      selectLandingDiscussions({
        discussions: [
          post('legacy', { audience: undefined, author_username: undefined }),
          post('group-unknown', { audience: undefined, group_slug: 'a-group' }),
          post('public-group', { group_slug: 'a-group' }),
        ],
      }).map((p) => p.public_id)
    ).toEqual(['legacy', 'public-group']);
  });

  it('deduplicates and normalizes invalid counts without losing Unicode or deleted-account posts', () => {
    const rows = selectLandingDiscussions({
      discussions: [
        post('a', {
          body: 'हिन्दी 中文 🌍',
          author_gone: true,
          like_count: -2,
          reply_count: Infinity,
        }),
        post('a'),
        post('b', { like_count: '999' }),
      ],
    });
    expect(rows).toHaveLength(2);
    expect(rows.find((p) => p.public_id === 'a')).toMatchObject({
      body: 'हिन्दी 中文 🌍',
      author_gone: true,
      like_count: 0,
      reply_count: 0,
    });
  });

  it('selects only two unique named, public, published groups', () => {
    expect(
      selectLandingGroups({
        groups: [
          group(1, { visibility: 'private' }),
          group(2, { visibility: 'unlisted' }),
          group(3, { status: 'draft' }),
          group(4, { status: 'suspended' }),
          group(5, { name: '' }),
          group(6, { slug: '' }),
          group(7),
          group(7),
          group(8),
          group(9),
          null,
        ],
      }).map((g) => g.id)
    ).toEqual([7, 8]);
  });

  it('treats omitted/null legacy lists as empty and never invents preview content', () => {
    for (const value of [
      null,
      undefined,
      {},
      { discussions: null, groups: null },
    ]) {
      expect(selectLandingDiscussions(value)).toEqual([]);
      expect(selectLandingGroups(value)).toEqual([]);
    }
  });
});
