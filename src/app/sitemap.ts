import { MetadataRoute } from 'next';

import { baseUrl } from '@/constants/baseUrl';
import { FEED_ROUTE } from '@/constants/routeConstants';
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

    return data?.the_blogs || [];
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
      priority: 0.8,
    },
    {
      url: `${baseUrl}${FEED_ROUTE}`,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  const blogUrls: MetadataRoute.Sitemap = blogPosts.map((post: Blog) => {
    // Extract the title from the blog's content
    const title = post?.blog?.blocks[0]?.data?.text || 'untitled';

    // Generate a slug from the title
    const slug = title
      .toLowerCase() // Convert to lowercase
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
      .replace(/^-+|-+$/g, ''); // Trim leading and trailing hyphens

    return {
      url: `${baseUrl}/blog/${slug || 'untitled'}-${post?.blog_id}`, // Fallback to 'untitled' if slug is empty
      changeFrequency: 'daily', // Updated for regular additions
      priority: 1,
    };
  });

  return [...staticUrls, ...blogUrls];
}
