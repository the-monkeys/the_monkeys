import CrawlerArticle from '@/app/blog/[slug]/CrawlerArticle';
import {
  buildBlogJsonLd,
  buildBlogMetadata,
  canonicalBlogSlug,
} from '@/app/blog/[slug]/blogSeo';
import { Blog } from '@/services/blog/blogTypes';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

const post = {
  blog_id: 'restricted',
  owner_account_id: 'author',
  is_draft: false,
  audience: 'public',
  published_time: '2026-01-01T00:00:00Z',
  tags: [],
  LikeCount: 0,
  like_count: 0,
  BookmarkCount: 0,
  bookmark_count: 0,
  is_nsfw: true,
  seo_indexable: true,
  seo_crawler: true,
  canonical_slug: 'original-title-restricted',
  blog: {
    time: 1,
    blocks: [
      {
        id: 'h',
        type: 'header',
        data: { text: 'Original explicit title' },
        author: [],
        time: 1,
      },
      {
        id: 'p',
        type: 'paragraph',
        data: {
          text:
            'Original protected body ' +
            'long text '.repeat(700) +
            ' END_OF_ARTICLE',
        },
        author: [],
        time: 1,
      },
      {
        id: 'c',
        type: 'code',
        data: { code: 'sum(rate(http_requests_total[5m]))' },
        author: [],
        time: 1,
      },
    ],
  },
} as Blog;
describe('restricted article search projection', () => {
  afterEach(() => vi.unstubAllEnvs());
  it('does not enable indexing from a client-supplied capability alone', () => {
    expect(buildBlogMetadata(post, 'alias-restricted').robots).toMatchObject({
      index: false,
    });
    expect(buildBlogJsonLd(post, 'alias-restricted')).toBeNull();
  });
  it('allows indexing only with rollout capability and retains the same canonical', () => {
    const ordinary = buildBlogMetadata(post, 'alias-restricted', 'Author', {
      indexRestricted: true,
    });
    expect(ordinary.robots).toMatchObject({
      index: true,
      nosnippet: true,
      noimageindex: true,
    });
    expect(JSON.stringify(ordinary)).not.toContain('Original explicit title');
    expect(ordinary.alternates?.canonical).toBe(
      'https://monkeys.com.co/blog/original-title-restricted'
    );
    const crawler = buildBlogMetadata(post, 'alias-restricted', 'Author', {
      indexRestricted: true,
      crawler: true,
    });
    expect(crawler.title).toEqual({
      absolute: 'Original explicit title | Monkeys',
    });
    expect(crawler.robots).not.toMatchObject({ nosnippet: true });
    expect(crawler.description).toContain('Original protected body');
    expect(crawler.alternates?.canonical).toBe(ordinary.alternates?.canonical);
    expect(canonicalBlogSlug(post)).toBe('original-title-restricted');
  });
  it.each([
    { ...post, seo_indexable: undefined },
    { ...post, audience: 'group_only' },
    { ...post, is_draft: true },
    { ...post, content_unavailable: true },
  ])('does not opt private/draft/old-backend content into search', (value) => {
    expect(
      buildBlogMetadata(value as Blog, 'alias-restricted', 'Author', {
        indexRestricted: true,
      }).robots
    ).toMatchObject({ index: false });
  });
  it('uses registration schema without leaking protected body through JSON-LD', () => {
    const schema = buildBlogJsonLd(
      post,
      'alias-restricted',
      'Author',
      'author',
      { crawler: true, indexRestricted: true }
    );
    expect(schema).toMatchObject({
      isAccessibleForFree: false,
      contentRating: '18+',
      hasPart: {
        cssSelector: '.registration-content',
        isAccessibleForFree: false,
      },
    });
    expect(JSON.stringify(schema)).not.toContain('Original protected body');
  });
  it('renders the full original text and code without media or client hydration', () => {
    const html = renderToStaticMarkup(<CrawlerArticle blog={post} />);
    expect(html).toContain('Original explicit title');
    expect(html).toContain('END_OF_ARTICLE');
    expect(html).toContain('sum(rate(http_requests_total[5m]))');
    expect(html).not.toContain('data-nosnippet');
    expect(html).not.toContain('dehydratedState');
    expect(html).not.toContain('<img');
  });
  it('renders hostile author markup as inert text', () => {
    const value = {
      ...post,
      blog: {
        time: 1,
        blocks: [
          {
            id: 'x',
            type: 'paragraph',
            data: {
              text: '<script>alert(1)</script><img src=x onerror=alert(2)>Visible',
            },
            author: [],
            time: 1,
          },
        ],
      },
    };
    const html = renderToStaticMarkup(<CrawlerArticle blog={value} />);
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img');
    expect(html).toContain('Visible');
  });
});

it('retains supported research, Markdown and attribution text without rewriting punctuation', () => {
  const data = [
    { type: 'paragraph', data: { text: 'A — B &amp; C' } },
    {
      type: 'markdown',
      data: { markdown: '# Markdown body\n\nOriginal Markdown conclusion' },
    },
    {
      type: 'methodology',
      data: {
        studyDesign: 'Original study design',
        dataCollection: 'Original collection',
        analysisMethod: 'Original analysis',
        assumptions: 'Original assumption',
        limitations: 'Original limitation',
      },
    },
    {
      type: 'quote',
      data: { text: 'Original quotation', caption: 'Original attribution' },
    },
    {
      type: 'formula',
      data: {
        expression: 'E = mc^2',
        description: 'Original formula explanation',
      },
    },
    {
      type: 'citation',
      data: {
        citationText: 'Original citation',
        authors: 'Author One',
        year: '2026',
        source: 'Original journal',
        identifier: 'doi:example',
      },
    },
    {
      type: 'dataset',
      data: {
        title: 'Original dataset',
        sampleSize: '123',
        variables: 'Original variables',
        notes: 'Original notes',
      },
    },
    {
      type: 'checklist',
      data: { items: [{ text: 'Original checklist item', checked: true }] },
    },
    {
      type: 'chart',
      data: {
        title: 'Original chart',
        labels: ['Original label'],
        series: [{ name: 'Original series', values: [12, 34] }],
      },
    },
  ].map((block, index) => ({
    ...block,
    id: String(index),
    author: [],
    time: 1,
  }));
  const html = renderToStaticMarkup(
    <CrawlerArticle blog={{ ...post, blog: { time: 1, blocks: data } }} />
  );
  for (const text of [
    'A — B &amp; C',
    'Original Markdown conclusion',
    'Original study design',
    'Original collection',
    'Original analysis',
    'Original assumption',
    'Original limitation',
    'Original attribution',
    'Original formula explanation',
    'Original citation',
    'Author One',
    'Original journal',
    'Original dataset',
    '123',
    'Original variables',
    'Original notes',
    'Original checklist item',
    'Original chart',
    'Original label',
    'Original series',
    '34',
  ])
    expect(html, text).toContain(text);
});
