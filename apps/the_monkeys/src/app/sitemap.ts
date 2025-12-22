import { MetadataRoute } from 'next';
import { unstable_noStore as noStore } from 'next/cache';

import { baseUrl } from '@/constants/baseUrl';
import {
  ABOUT_ROUTE,
  EXPLORE_TOPICS_ROUTE,
  FEED_ROUTE,
  TOPIC_SITEMAP_ROUTE,
} from '@/constants/routeConstants';
import { GetMetaFeedBlogs, MetaBlog } from '@/services/blog/blogTypes';

import { generateSlug } from './blog/utils/generateSlug';

// Fetch posts from the API using fetch
async function fetchBlogPosts(): Promise<MetaBlog[]> {
  try {
    const response = await fetch(
      'https://monkeys.support/api/v2/blog/meta-feed',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch posts: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const data: GetMetaFeedBlogs = await response.json();
    return data?.blogs || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  noStore();

  const blogPosts = await fetchBlogPosts();

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}${FEED_ROUTE}`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}${ABOUT_ROUTE}`,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}${EXPLORE_TOPICS_ROUTE}`,
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}${TOPIC_SITEMAP_ROUTE}`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  const blogUrls: MetadataRoute.Sitemap = blogPosts.map((post: MetaBlog) => {
    const title = post?.title || 'Untitled Post';
    const slug = generateSlug(title);

    return {
      url: `${baseUrl}/blog/${slug}-${post?.blog_id ?? 'unknown'}`,
      changeFrequency: 'monthly',
      priority: 0.9,
      lastModified: post?.published_time,
    };
  });

  return [...staticUrls, ...blogUrls];
}
