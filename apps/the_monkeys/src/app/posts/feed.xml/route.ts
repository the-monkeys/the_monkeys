import { canonicalPostTitleSlug, postRssGuid } from '@/lib/postUrl';
import { SITE_URL, normalizeSeoText } from '@/lib/seo';
import { fetchRecentPublicPosts } from '@/lib/seoCatalog';
import {
  buildRssXml,
  rssResponse,
  rssUnavailableResponse,
} from '@/lib/seoFeed';

// Fetch at request time: an unavailable API must not prevent deployment.
export const dynamic = 'force-dynamic';

function publicationDate(value: string): Date | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET() {
  const posts = await fetchRecentPublicPosts().catch(() => null);
  if (!posts) return rssUnavailableResponse();
  const xml = buildRssXml({
    title: 'Latest Posts on Monkeys',
    description:
      'Recent public posts from authors and communities across Monkeys.',
    path: '/',
    items: posts.map((post) => {
      const link = `${SITE_URL}/blog/${canonicalPostTitleSlug(post.title, post.canonical_slug, post.blog_id)}-${post.blog_id}`;
      return {
        title: post.title,
        link,
        guid: postRssGuid(post),
        pubDate: publicationDate(post.published_time),
        description: normalizeSeoText(post.first_paragraph, 280),
      };
    }),
  });
  return rssResponse(xml);
}
