import { LIVE_URL } from '@/constants/api';
import { Blog } from '@/services/blog/blogTypes';

export const generateBlogSchema = (
  blogTitle: string,
  blogDescritption: string,
  blogImg: string,
  publishedDate: string,
  fullSlug: string | string[],
  tags: string[],
  userInfo: string,
  blog: Blog
) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blogTitle,
    description: blogDescritption,
    image: `${LIVE_URL}/${blogImg}`,
    author: {
      '@type': 'Person',
      name: userInfo || 'Monkeys Writer',
      url: `${LIVE_URL}/${userInfo}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Monkeys Blog',
      logo: {
        '@type': 'ImageObject',
        url: `${LIVE_URL}/logo.png`,
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
