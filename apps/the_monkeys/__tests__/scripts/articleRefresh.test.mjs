import { describe, expect, it } from 'vitest';

import { prepareArticleRefresh } from '../../scripts/preview-article-refresh.mjs';

const draft = {
  blogId: 'target',
  expectedTitle: 'Existing public title',
  expectedIntroduction: 'Existing introduction',
  introduction: 'A clearer direct answer.',
  additions: [
    {
      id: 'search-refresh-answer',
      type: 'paragraph',
      data: { text: 'A practical answer.' },
    },
  ],
};
const source = {
  blog_id: 'target',
  owner_account_id: 'owner',
  is_draft: false,
  published_time: '2026-01-01',
  blog: {
    time: 1,
    blocks: [
      { id: 'title', type: 'header', data: { text: draft.expectedTitle } },
      {
        id: 'intro',
        type: 'paragraph',
        data: { text: draft.expectedIntroduction },
      },
    ],
  },
};
describe('local editorial refresh preparation', () => {
  it('changes only reviewed body copy, retaining title, ID, ownership and dates', () => {
    const before = JSON.stringify(source),
      next = prepareArticleRefresh(source, draft);
    expect(next.blog.blocks[0]).toEqual(source.blog.blocks[0]);
    expect(next.blog.blocks[1].data.text).toBe(draft.introduction);
    expect(next.blog.blocks[2].data.text).toBe('A practical answer.');
    expect({ ...next, blog: undefined }).toEqual({
      ...source,
      blog: undefined,
    });
    expect(JSON.stringify(source)).toBe(before);
    expect(prepareArticleRefresh(next, draft)).toEqual(next);
  });
  it('refuses changed titles, revised introductions, wrong IDs, draft and private records', () => {
    for (const article of [
      { ...source, blog_id: 'other' },
      { ...source, is_draft: true },
      { ...source, audience: 'group_only' },
      {
        ...source,
        blog: {
          ...source.blog,
          blocks: [
            { ...source.blog.blocks[0], data: { text: 'Revised title' } },
            source.blog.blocks[1],
          ],
        },
      },
      {
        ...source,
        blog: {
          ...source.blog,
          blocks: [
            source.blog.blocks[0],
            { ...source.blog.blocks[1], data: { text: 'New author revision' } },
          ],
        },
      },
    ]) {
      expect(() => prepareArticleRefresh(article, draft)).toThrow();
    }
  });
});

it('preserves the title when legacy blocks have missing or duplicate IDs', () => {
  for (const id of [undefined, 'same']) {
    const article = {
      ...source,
      blog: {
        ...source.blog,
        blocks: source.blog.blocks.map((block) => ({ ...block, id })),
      },
    };
    const next = prepareArticleRefresh(article, draft);
    expect(next.blog.blocks[0].data.text).toBe(draft.expectedTitle);
    expect(next.blog.blocks[1].data.text).toBe(draft.introduction);
  }
});
