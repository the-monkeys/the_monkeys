import type { Metadata } from 'next';

import { type BlogSeoOptions } from '@/lib/nsfwSeoPolicy';
import { postModificationTime } from '@/lib/postModificationTime';
import { getPostSeoContent } from '@/lib/postSeoContent';
import { absoluteUrl, pageMetadata } from '@/lib/seo';
import type { Blog } from '@/services/blog/blogTypes';

export { canIndexRestricted, type BlogSeoOptions } from '@/lib/nsfwSeoPolicy';
export function restrictedMetadata(
  blog: Blog,
  slug: string,
  options?: BlogSeoOptions
): Metadata {
  const crawler = options?.crawler === true && blog.seo_crawler === true;
  const content = getPostSeoContent(blog.blog);
  const description =
    'Log in and confirm you are 18 or older to read this article on Monkeys.';
  const generic = pageMetadata({
    title: 'Sensitive post | Monkeys',
    description,
    path: '/blog/' + slug,
    type: 'article',
  });
  return {
    ...generic,
    title: {
      absolute: crawler
        ? content.title + ' | Monkeys'
        : 'Sensitive post | Monkeys',
    },
    description: crawler ? content.description : description,
    robots: {
      index: true,
      follow: true,
      nosnippet: !crawler,
      noimageindex: true,
      googleBot: {
        index: true,
        follow: true,
        nosnippet: !crawler,
        noimageindex: true,
        'max-image-preview': 'none',
        'max-video-preview': 0,
      },
    },
  };
}
export function restrictedJsonLd(
  blog: Blog,
  slug: string,
  authorName: string,
  authorUsername?: string
) {
  const url = absoluteUrl('/blog/' + slug);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': url + '#article',
    headline: getPostSeoContent(blog.blog).title,
    author: {
      '@type': 'Person',
      name: authorName,
      ...(authorUsername ? { url: absoluteUrl('/' + authorUsername) } : {}),
    },
    datePublished: blog.published_time,
    dateModified: postModificationTime(blog),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    isAccessibleForFree: false,
    contentRating: '18+',
    hasPart: {
      '@type': 'WebPageElement',
      isAccessibleForFree: false,
      cssSelector: '.registration-content',
    },
    image: undefined,
    articleBody: undefined,
  };
}
