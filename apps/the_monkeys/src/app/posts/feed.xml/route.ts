import { generateSlug } from '@/app/blog/utils/generateSlug';
import { SITE_URL, normalizeSeoText } from '@/lib/seo';
import { fetchPublicPosts } from '@/lib/seoCatalog';
import { buildRssXml, rssResponse } from '@/lib/seoFeed';

export const revalidate = 300;

function publicationDate(value: string): Date | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET() {
  const posts = await fetchPublicPosts(100);
  const xml = buildRssXml({
    title: 'Latest Posts on Monkeys',
    description:
      'Recent public posts from authors and communities across Monkeys.',
    path: '/feed',
    items: posts.map((post) => {
      const link = `${SITE_URL}/blog/${generateSlug(post.title)}-${post.blog_id}`;
      return {
        title: post.title,
        link,
        guid: link,
        pubDate: publicationDate(post.published_time),
        description: normalizeSeoText(post.first_paragraph, 280),
      };
    }),
  });
  return rssResponse(xml);
}
