import { generateSlug } from '@/app/blog/utils/generateSlug';
import { getPostSeoContent } from '@/lib/postSeoContent';
import { normalizeSeoText } from '@/lib/seo';

/** Match published page canonicals without shortening the visible headline. */
export function canonicalPostTitleSlug(title: string): string {
  return generateSlug(normalizeSeoText(title, 100) || 'Published Post');
}

export function canonicalPostDocumentTitleSlug(document: unknown): string {
  return generateSlug(getPostSeoContent(document).title);
}
