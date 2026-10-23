import type { Metadata } from 'next';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import {
  MONKEYS_WEBSITE_ID,
  OG_IMAGE,
  absoluteUrl,
  indexRobots,
  noIndexFollowRobots,
  noIndexRobots,
  normalizeSeoText,
  pageMetadata,
  publisherOrg,
} from '@/lib/seo';
import { Block, Blog } from '@/services/blog/blogTypes';
import { GetProfileInfoByIdResponse } from '@/services/profile/userApiTypes';

export function getBlogIdFromSlug(slug: string): string {
  if (!slug || typeof slug !== 'string') return '';
  return slug.split('-').pop() || '';
}

function textFromBlock(block?: Block): string {
  if (!block?.data) return '';
  if (typeof block.data.text === 'string') return block.data.text;
  if (Array.isArray(block.data.items)) return block.data.items.join(', ');
  if (typeof block.data.caption === 'string') return block.data.caption;
  return '';
}

function blogContent(blog: Blog) {
  const blocks = Array.isArray(blog.blog?.blocks) ? blog.blog.blocks : [];
  const titleBlock =
    blocks.find((block) => block.type === 'header' && textFromBlock(block)) ||
    blocks.find((block) => textFromBlock(block));
  const textBlocks = blocks
    .filter((block) =>
      ['paragraph', 'quote', 'list', 'header'].includes(block.type)
    )
    .map((block) => normalizeSeoText(textFromBlock(block), 500))
    .filter(Boolean);
  const meaningfulDescription =
    textBlocks.find(
      (text) =>
        text !== normalizeSeoText(textFromBlock(titleBlock), 500) &&
        text.length >= 40
    ) ||
    textBlocks.find(
      (text) => text !== normalizeSeoText(textFromBlock(titleBlock), 500)
    );
  const imageBlock = blocks.find(
    (block) =>
      block.type === 'image' && typeof block.data?.file?.url === 'string'
  );

  return {
    title: normalizeSeoText(textFromBlock(titleBlock), 100) || 'Published Post',
    description:
      normalizeSeoText(meaningfulDescription || '', 160) ||
      'Read this community post on Monkeys.',
    image:
      typeof imageBlock?.data?.file?.url === 'string'
        ? imageBlock.data.file.url
        : OG_IMAGE,
    articleBody: normalizeSeoText(textBlocks.join(' '), 5000),
  };
}

export function canonicalBlogSlug(blog: Blog): string {
  const titleSlug = generateSlug(blogContent(blog).title);
  return `${titleSlug}-${blog.blog_id}`;
}

export function authorDisplayName(
  profile: GetProfileInfoByIdResponse | null | undefined
): string {
  const user = profile?.user;
  const fullName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(' ');
  return fullName || user?.username || 'Monkeys Author';
}

export function buildBlogMetadata(
  blog: Blog,
  _requestedSlug: string,
  authorName = 'Monkeys Author'
): Metadata {
  if (blog.audience === 'group_only') {
    return {
      title: { absolute: 'Members-only post | Monkeys' },
      robots: noIndexRobots,
    };
  }

  if (blog.is_draft) {
    return {
      title: { absolute: 'Post unavailable | Monkeys' },
      robots: noIndexFollowRobots,
    };
  }

  const content = blogContent(blog);
  const slug = canonicalBlogSlug(blog);
  const title = `${content.title} | Monkeys`;
  const metadata = pageMetadata({
    title,
    description: content.description,
    path: `/blog/${slug}`,
    keywords: blog.tags,
    image: content.image,
    type: 'article',
    rss: '/posts/feed.xml',
  });

  return {
    ...metadata,
    robots: indexRobots,
    openGraph: {
      ...metadata.openGraph,
      type: 'article',
      publishedTime: blog.published_time,
      modifiedTime: blog.published_time,
      authors: [authorName],
      tags: blog.tags,
    },
  };
}

export function buildBlogJsonLd(
  blog: Blog,
  _requestedSlug: string,
  authorName = 'Monkeys Author',
  authorUsername?: string
) {
  if (blog.audience === 'group_only') return null;

  const content = blogContent(blog);
  const slug = canonicalBlogSlug(blog);
  const url = absoluteUrl(`/blog/${slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: content.title,
    description: content.description,
    image: [absoluteUrl(content.image)],
    author: {
      '@type': 'Person',
      name: authorName,
      ...(authorUsername ? { url: absoluteUrl(`/${authorUsername}`) } : {}),
    },
    publisher: publisherOrg(),
    isPartOf: { '@id': MONKEYS_WEBSITE_ID },
    datePublished: blog.published_time,
    dateModified: blog.published_time,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: blog.tags?.join(', '),
    articleBody: content.articleBody,
  };
}
