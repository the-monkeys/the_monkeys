import { LIVE_URL } from '@/constants/api';
import { Blog } from '@/services/blog/blogTypes';

export const generateBlogSchema = (
  blogTitle: string,
  blogDescription: string,
  blogImg: string,
  publishedDate: string,
  fullSlug: string | string[],
  tags: string[],
  authorName: string,
  blog: Blog
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blogTitle,
    description: blogDescription,
    image: `${blogImg}`,
    author: {
      '@type': 'Person',
      name: authorName,
      url: `${LIVE_URL}/${authorName}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Monkeys',
      logo: {
        '@type': 'ImageObject',
        url: `${LIVE_URL}/opengraph-image.png?b7ef6eff2b7766be`,
      },
    },
    datePublished: publishedDate,
    dateModified: publishedDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${LIVE_URL}/${fullSlug}`,
    },
    keywords: tags?.join(', '),
    articleBody: blog?.blog.blocks.map((block) => block.data.text).join(' '),
  };
};
