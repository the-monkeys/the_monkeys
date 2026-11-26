import type { MetadataRoute } from 'next';

import { loadPublicDiscussionIds } from '@/lib/discussionPageData';
import { discussionsSitemap } from '@/lib/discussionSeo';
import { SITE_URL } from '@/lib/seo';

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const ids = await loadPublicDiscussionIds(200);
    return discussionsSitemap(ids, SITE_URL);
  } catch {
    return [];
  }
}
