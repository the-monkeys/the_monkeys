import { MetadataRoute } from 'next';

import { baseUrl } from '@/constants/baseUrl';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/privacy', '/cookies', '/terms'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
