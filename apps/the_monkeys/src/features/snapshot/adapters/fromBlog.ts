import { getCardContent } from '@/components/blog/getBlogContent';
import { Blog } from '@/services/blog/blogTypes';

import { SnapshotAuthor, SnapshotInput } from '../types';

/**
 * Strip residual HTML tags. `getCardContent` returns sanitized HTML strings
 * (DOMPurify) but they may still contain markup like `<b>` or `<a>`.
 * For our Satori-safe templates we need plain text only.
 */
const stripTags = (html: string | null | undefined): string => {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>(\s*)/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
};

/** Rough reading time estimate at 220 wpm. */
const estimateReadingTime = (blog: Blog): number => {
  const wordCount = (blog.blog?.blocks ?? []).reduce((acc, block) => {
    const txt =
      (block.data?.text as string | undefined) ??
      (Array.isArray(block.data?.items) ? block.data.items.join(' ') : '');
    if (!txt) return acc;
    return acc + txt.split(/\s+/).filter(Boolean).length;
  }, 0);
  return Math.max(1, Math.round(wordCount / 220));
};

/**
 * Returns every image URL referenced by the blog, in document order, with
 * duplicates removed. Used to populate the snapshot background picker.
 */
export const extractBlogImages = (blog: Blog | undefined | null): string[] => {
  if (!blog?.blog?.blocks) return [];
  const urls: string[] = [];
  for (const block of blog.blog.blocks) {
    if (block.type !== 'image') continue;
    const url: unknown = block?.data?.file?.url ?? block?.data?.url;
    if (typeof url === 'string' && url.trim().length > 0) {
      urls.push(url);
    }
  }
  return Array.from(new Set(urls));
};

export interface FromBlogOpts {
  author?: SnapshotAuthor;
  /** Public canonical URL of the blog. */
  sourceUrl?: string;
}

export const fromBlog = (
  blog: Blog,
  opts: FromBlogOpts = {}
): SnapshotInput => {
  const { titleContent, descriptionContent, imageContent } = getCardContent({
    blog,
  });

  return {
    source: 'blog',
    sourceId: blog.blog_id,
    sourceUrl: opts.sourceUrl,
    title: stripTags(titleContent) || 'Untitled',
    description: stripTags(descriptionContent) || undefined,
    heroImageUrl: imageContent ?? undefined,
    tags: Array.isArray(blog.tags) ? blog.tags.slice(0, 6) : undefined,
    author: opts.author,
    publishedAt: blog.published_time,
    readingTimeMin: estimateReadingTime(blog),
  };
};
