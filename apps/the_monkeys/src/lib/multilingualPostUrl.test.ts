// @vitest-environment node
import {
  canonicalBlogSlug,
  getBlogIdFromSlug,
} from '@/app/blog/[slug]/blogSeo';
import { describe, expect, it } from 'vitest';

import {
  canonicalPostTitleSlug,
  postLinkTitleSlug,
  publicationPostSlug,
} from './postUrl';

const id = 'aB123x';
const title = 'भारत में तकनीक';
const document = {
  blocks: [{ type: 'header', data: { text: `<b>${title}</b>`, level: 1 } }],
};

describe('multilingual publication and reading URL boundaries', () => {
  it('publishes a raw Unicode slug and encodes public links exactly once', () => {
    expect(publicationPostSlug(document, id)).toBe(
      `${title.replaceAll(' ', '-')}-${id}`
    );
    expect(canonicalPostTitleSlug(title)).toBe(
      encodeURIComponent('भारत-में-तकनीक')
    );
    expect(canonicalBlogSlug({ blog_id: id, blog: document } as any)).toBe(
      `${encodeURIComponent('भारत-में-तकनीक')}-${id}`
    );
  });
  it.each([
    `-${id}`,
    `old-ascii-title-${id}`,
    `भारत-में-तकनीक-${id}`,
    `${encodeURIComponent('भारत-में-तकनीक')}-${id}`,
  ])('keeps the same ID for the old/new alias %s', (slug) => {
    expect(getBlogIdFromSlug(slug)).toBe(id);
  });
  it.each([
    'भारत-में-तकनीक',
    `भारत-में-तकनीक-${id}`,
    encodeURIComponent('भारत-में-तकनीक'),
    `${encodeURIComponent('भारत-में-तकनीक')}-${id}`,
  ])(
    'accepts stored raw/encoded bare/full slug %s without doubling ID or encoding',
    (stored) => {
      const prefix = postLinkTitleSlug(title, id, stored);
      expect(`${prefix}-${id}`).toBe(
        `${encodeURIComponent('भारत-में-तकनीक')}-${id}`
      );
      expect(prefix).not.toContain('%25E0');
    }
  );
  it('does not remove a legitimate title suffix that happens to equal the ID', () => {
    expect(postLinkTitleSlug('A post 123', '123', 'a-post-123')).toBe(
      'a-post-123'
    );
  });
  it.each([
    'https://evil.test/path',
    '../other',
    'bad?query',
    'bad#hash',
    '%E0%A4',
    'bad%0Avalue',
    '\u0301',
  ])('falls back safely for malformed/path-like stored slug %s', (stored) => {
    expect(postLinkTitleSlug(title, id, stored)).toBe(
      canonicalPostTitleSlug(title)
    );
  });
  it('keeps the existing public-title length boundary for publishing', () => {
    const longTitle = `${'a'.repeat(99)} word beyond the boundary`;
    expect(
      publicationPostSlug(
        { blocks: [{ type: 'header', data: { text: longTitle, level: 1 } }] },
        id
      )
    ).toBe(`${'a'.repeat(99)}-${id}`);
  });
});
