import { SITE_URL } from '@/lib/seo';
import type { MetaBlog } from '@/services/blog/blogTypes';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import LearnPage, { metadata } from './page';

const { catalog } = vi.hoisted(() => ({ catalog: vi.fn() }));
vi.mock('@/lib/seoCatalog', () => ({ fetchPublicPosts: catalog }));

const post: MetaBlog = {
  blog_id: 'public123',
  title: '<b>Python &amp; SQL</b>',
  first_paragraph: 'Compare queries with <b>practical examples</b>.',
  first_image: '',
  owner_account_id: 'test-author',
  published_time: '2026-11-01T00:00:00Z',
  tags: ['Programming'],
  audience: 'public',
};

beforeEach(() => {
  catalog.mockReset();
});

describe('public developer learning page', () => {
  it('declares the collection canonical and matching sharing metadata', () => {
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/learn`);
    expect(metadata.openGraph?.url).toBe(`${SITE_URL}/learn`);
    expect(metadata.description).toMatch(/developer/i);
  });

  it('server-renders guidance and canonical links to real catalog records only', async () => {
    catalog.mockResolvedValue([
      post,
      { ...post, blog_id: 'restricted', audience: 'group_only' },
      { ...post, blog_id: 'unrelated', title: 'A recipe', tags: ['Food'] },
    ]);
    const html = renderToStaticMarkup(await LearnPage());
    const doc = new DOMParser().parseFromString(html, 'text/html');
    expect(doc.querySelector('h1')?.textContent).toMatch(/developer/i);
    expect(doc.body.textContent).toMatch(/reproduce/i);
    expect(
      doc.querySelector('a[href="/blog/python-sql-public123"]')?.textContent
    ).toContain('Python & SQL');
    expect(doc.body.textContent).toMatch(
      /Compare queries with practical examples\s*\./
    );
    expect(doc.querySelectorAll('a[href^="/blog/"]')).toHaveLength(1);
    const schema = JSON.parse(
      doc.querySelector('script[type="application/ld+json"]')?.textContent ||
        '{}'
    );
    expect(schema['@type']).toBe('CollectionPage');
    expect(schema.mainEntity.numberOfItems).toBe(1);
    expect(schema.mainEntity.itemListElement[0].url).toBe(
      `${SITE_URL}/blog/python-sql-public123`
    );
    expect(html).not.toContain('restricted');
    expect(html).not.toContain('test-author');
  });

  it('uses the established shortened canonical for a long title', async () => {
    catalog.mockResolvedValue([
      { ...post, title: 'Python '.repeat(30).trim() },
    ]);
    const doc = new DOMParser().parseFromString(
      renderToStaticMarkup(await LearnPage()),
      'text/html'
    );
    expect(doc.querySelector('a[href^="/blog/"]')?.getAttribute('href')).toBe(
      `/blog/${Array(14).fill('python').join('-')}-public123`
    );
  });

  it('shows an honest empty collection with useful guidance and navigation', async () => {
    catalog.mockResolvedValue([]);
    const doc = new DOMParser().parseFromString(
      renderToStaticMarkup(await LearnPage()),
      'text/html'
    );
    expect(doc.body.textContent).toMatch(/no public developer posts/i);
    expect(doc.body.textContent).toMatch(/reproduce/i);
    expect(doc.querySelectorAll('a[href^="/blog/"]')).toHaveLength(0);
    expect(doc.querySelector('a[href="/topics/explore"]')).not.toBeNull();
  });

  it('preserves catalog failures instead of presenting an empty collection', async () => {
    catalog.mockRejectedValue(new Error('Catalog unavailable'));
    await expect(LearnPage()).rejects.toThrow('Catalog unavailable');
  });
});
