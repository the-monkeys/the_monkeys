import { MetadataRoute } from 'next';

import { baseUrl } from '@/constants/baseUrl';

const AI_BOTS = [
  'GPTBot',
  'ChatGPT-User',
  'ClaudeBot',
  'PerplexityBot',
  'Google-Extended',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/auth/',
          '/settings',
          '/notifications',
          '/library',
          '/edit/',
          '/create',
          '/events/new',
          '/groups/new',
          '/*/edit',
          '/*/manage',
          '/groups/invite/',
          '/cards/',
        ],
      },
      ...AI_BOTS.map((userAgent) => ({
        userAgent,
        allow: '/',
      })),
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/topics/sitemap.xml`,
      `${baseUrl}/events/sitemap.xml`,
      `${baseUrl}/groups/sitemap.xml`,
    ],
  };
}
