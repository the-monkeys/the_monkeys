import { MetadataRoute } from 'next';

import { baseUrl } from '@/constants/baseUrl';
import { Blog } from '@/services/blog/blogTypes';

// Fetch blog posts from the API using fetch
async function fetchBlogPosts(): Promise<Blog[]> {
  try {
    const response = await fetch('https://monkeys.support/api/v1/blog/latest', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch blog posts: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data?.blogs || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await fetchBlogPosts();

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/feed`,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/news`,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  const blogUrls: MetadataRoute.Sitemap = blogPosts.map((post: Blog) => ({
    url: `${baseUrl}/blog/${post.blog_id}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticUrls, ...blogUrls];
}
