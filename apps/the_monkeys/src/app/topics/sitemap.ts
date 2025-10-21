import { MetadataRoute } from 'next';
import { unstable_noStore as noStore } from 'next/cache';

import { baseUrl } from '@/constants/baseUrl';
import { topicToSlug } from '@/utils/topicUtils';

// Fetch topics from the API
async function fetchTopics(): Promise<string[]> {
  try {
    const response = await fetch(
      'https://monkeys.support/api/v1/user/category',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch topics: ${response.status} ${response.statusText}`
      );
      return [];
    }

    const data = await response.json();

    // Extract all topics from all categories
    const allTopics: string[] = [];
    if (data?.category) {
      Object.values(data.category).forEach((category: any) => {
        if (category?.Topics && Array.isArray(category.Topics)) {
          allTopics.push(...category.Topics);
        }
      });
    }

    // Remove duplicates and return unique topics
    return Array.from(new Set(allTopics));
  } catch (error) {
    console.error('Error fetching topics:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  noStore();

  const topics = await fetchTopics();

  const topicUrls: MetadataRoute.Sitemap = topics.map((topic: string) => ({
    url: `${baseUrl}/topics/${topicToSlug(topic)}`,
    changeFrequency: 'weekly',
    priority: 0.6,
    lastModified: new Date().toISOString(),
  }));

  return topicUrls;
}
