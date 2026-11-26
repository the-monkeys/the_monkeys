import {
  buildBlogJsonLd,
  buildBlogMetadata,
  canonicalBlogSlug,
} from '@/app/blog/[slug]/blogSeo';
import { buildMainSitemap } from '@/app/sitemap';
import { canonicalPostDocumentTitleSlug } from '@/lib/postUrl';
import { normalizePublicPosts } from '@/lib/publicPostMetadata';
import type { Blog, MetaBlog } from '@/services/blog/blogTypes';
import { fromBlog, fromMetaBlog } from '@/utils/blogCardAdapters';
import { describe, expect, it } from 'vitest';

const slug =
  'the-ultimate-guide-to-grafana-what-it-is-why-it-used-and-how-to-build-a-complete-monitoring-1uvwek';
const title = 'Grafana Tutorial: Monitor Linux with Prometheus and Docker';
const description =
  'Learn how to use Grafana to monitor a Linux server with Prometheus, Node Exporter and Docker Compose, with setup checks and fixes for missing data.';
const post = {
  blog_id: '1uvwek',
  owner_account_id: 'author',
  is_draft: false,
  published_time: '2025-12-08T09:02:28Z',
  tags: ['grafana'],
  LikeCount: 0,
  like_count: 0,
  BookmarkCount: 0,
  bookmark_count: 0,
  canonical_slug: slug,
  seo_description: description,
  content_modified_at: '2026-11-22T06:00:00Z',
  blog: {
    time: 1,
    blocks: [
      {
        id: 'title',
        type: 'header',
        data: { text: title, level: 1 },
        author: [],
        time: 1,
      },
      {
        id: 'intro',
        type: 'paragraph',
        data: {
          text: 'An introduction that should not overwrite the editorial description.',
        },
        author: [],
        time: 1,
      },
    ],
  },
} as Blog;
const meta = {
  ...post,
  title,
  first_image: '',
  first_paragraph: 'Introduction',
} as MetaBlog;
describe('published editorial revision compatibility', () => {
  it('changes the headline without moving the published canonical or identity', () => {
    expect(canonicalBlogSlug(post)).toBe(slug);
    const seo = buildBlogMetadata(post, 'untrusted-requested-alias-1uvwek');
    expect(seo.title).toEqual({ absolute: title + ' | Monkeys' });
    expect(seo.description).toBe(description);
    expect(seo.alternates?.canonical).toBe(
      'https://monkeys.com.co/blog/' + slug
    );
    expect(seo.openGraph).toMatchObject({
      publishedTime: post.published_time,
      modifiedTime: '2026-11-22T06:00:00Z',
    });
    expect(buildBlogJsonLd(post, slug)).toMatchObject({
      headline: title,
      description,
      datePublished: post.published_time,
      dateModified: '2026-11-22T06:00:00Z',
      mainEntityOfPage: { '@id': 'https://monkeys.com.co/blog/' + slug },
    });
  });
  it('retains the canonical in catalog normalization, cards and sitemap', () => {
    const [normalized] = normalizePublicPosts({ blogs: [meta] });
    expect(fromMetaBlog(normalized).slug + '-1uvwek').toBe(slug);
    expect(fromBlog(post).slug + '-1uvwek').toBe(slug);
    expect(
      buildMainSitemap([normalized]).some(
        (x) => x.url === 'https://monkeys.com.co/blog/' + slug
      )
    ).toBe(true);
  });
  it.each([
    'https://evil.test/x-1uvwek',
    '../x-1uvwek',
    'x-wrongid',
    'x%2fy-1uvwek',
    'x?bad-1uvwek',
  ])('rejects an unsafe or different-ID canonical %s', (bad) => {
    expect(canonicalBlogSlug({ ...post, canonical_slug: bad } as Blog)).toBe(
      'grafana-tutorial-monitor-linux-with-prometheus-and-docker-1uvwek'
    );
  });
  it('preserves legacy fallback and never publishes restricted or draft metadata', () => {
    const legacy = {
      ...post,
      canonical_slug: undefined,
      seo_description: undefined,
      content_modified_at: undefined,
    };
    expect(canonicalBlogSlug(legacy)).toBe(
      'grafana-tutorial-monitor-linux-with-prometheus-and-docker-1uvwek'
    );
    expect(buildBlogMetadata(legacy, 'ignored').description).toContain(
      'An introduction'
    );
    expect(
      buildBlogJsonLd({ ...post, audience: 'group_only' }, slug)
    ).toBeNull();
    expect(
      buildBlogMetadata({ ...post, is_draft: true }, slug).robots
    ).toMatchObject({ index: false });
  });
});

it('keeps escaped-HTML legacy titles at their original single normalization boundary', () => {
  expect(
    canonicalPostDocumentTitleSlug({
      blocks: [{ type: 'header', data: { text: 'What is &lt;div&gt;?' } }],
    })
  ).toBe('what-is-div');
});
it('ignores non-string authored SEO descriptions', () => {
  expect(
    buildBlogMetadata(
      { ...post, seo_description: 123 } as unknown as Blog,
      slug
    ).description
  ).toContain('An introduction');
});
it('uses the actual content revision time in the sitemap', () => {
  expect(
    buildMainSitemap([meta]).find((x) => x.url.endsWith(slug))?.lastModified
  ).toEqual(new Date('2026-11-22T06:00:00Z'));
});
