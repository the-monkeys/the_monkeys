import type { MetaBlog } from '@/services/blog/blogTypes';
import { describe, expect, it } from 'vitest';

import { selectDeveloperLearningPosts } from './learningDiscovery';

function post(blog_id: string, changes: Partial<MetaBlog> = {}): MetaBlog {
  return {
    blog_id,
    title: 'Understanding database indexes',
    first_paragraph: 'Compare a query plan before and after adding an index.',
    first_image: '',
    owner_account_id: 'test-author',
    published_time: '2026-11-01T00:00:00Z',
    tags: ['Databases'],
    audience: 'public',
    ...changes,
  };
}

describe('developer learning collection', () => {
  it('selects relevant public catalog posts by developer tags or specific titles', () => {
    const selected = selectDeveloperLearningPosts([
      post('database'),
      post('javascript', { tags: [' JavaScript '] }),
      post('legacy', { audience: undefined, tags: ['Software Engineering'] }),
      post('title', {
        tags: ['Technology'],
        title: 'Debugging Python applications',
      }),
      post('unrelated', { title: 'Learning to cook', tags: ['Food'] }),
      post('generic', {
        title: 'The future of technology',
        tags: ['Technology'],
      }),
      post('substring', { title: 'Going to the market', tags: ['Travel'] }),
    ]);
    expect(selected.map((entry) => entry.blog_id)).toEqual([
      'database',
      'javascript',
      'legacy',
      'title',
    ]);
  });

  it('excludes group context, restricted audiences, drafts and malformed entries', () => {
    const selected = selectDeveloperLearningPosts([
      post('public'),
      post('group', { audience: 'group_only' }),
      post('group-context', { group_slug: 'private-group' }),
      { ...post('private'), audience: 'private' } as unknown as MetaBlog,
      { ...post('draft'), is_draft: true },
      { ...post('hidden'), visibility: 'private' },
      post('', {}),
      post('no-title', { title: ' ' }),
      null as unknown as MetaBlog,
    ]);
    expect(selected.map((entry) => entry.blog_id)).toEqual(['public']);
  });

  it('deduplicates and bounds the reading list without changing the catalog', () => {
    const input = Array.from({ length: 20 }, (_, i) => post(`post${i}`));
    input.splice(1, 0, post('post0'));
    const selected = selectDeveloperLearningPosts(input);
    expect(selected.map((entry) => entry.blog_id)).toEqual(
      Array.from({ length: 12 }, (_, i) => `post${i}`)
    );
    expect(input).toHaveLength(21);
    expect(selectDeveloperLearningPosts([])).toEqual([]);
  });
});
