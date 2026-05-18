import { MetaBlog } from '@/services/blog/blogTypes';

import { SnapshotAuthor, SnapshotInput } from '../types';

const stripTags = (html: string | null | undefined): string => {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
};

export interface FromMetaBlogOpts {
  author?: SnapshotAuthor;
  sourceUrl?: string;
}

export const fromMetaBlog = (
  meta: MetaBlog,
  opts: FromMetaBlogOpts = {}
): SnapshotInput => ({
  source: 'meta-blog',
  sourceId: meta.blog_id,
  sourceUrl: opts.sourceUrl,
  title: stripTags(meta.title) || 'Untitled',
  description: stripTags(meta.first_paragraph) || undefined,
  heroImageUrl: meta.first_image || undefined,
  tags: Array.isArray(meta.tags) ? meta.tags.slice(0, 6) : undefined,
  author: opts.author,
  publishedAt: meta.published_time,
});
