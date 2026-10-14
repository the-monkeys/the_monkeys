import { MetadataRoute } from 'next';

import { baseUrl } from '@/constants/baseUrl';

const AI_BOTS = [
  'OAI-SearchBot',
  'GPTBot',
  'ChatGPT-User',
  'ClaudeBot',
  'PerplexityBot',
  'Google-Extended',
];

const PRIVATE_PATHS = [
  '/auth/',
  '/settings',
  '/notifications',
  '/library',
  '/activity',
  '/edit/',
  '/create',
  '/events/new',
  '/groups/new',
  '/*/edit',
  '/*/manage',
  '/groups/*/members',
  '/groups/*/requests',
  '/groups/invite/',
  '/cards/',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: PRIVATE_PATHS,
      },
      ...AI_BOTS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: PRIVATE_PATHS,
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
