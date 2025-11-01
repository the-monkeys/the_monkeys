import { MetadataRoute } from 'next';

import { baseUrl } from '@/constants/baseUrl';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/topics/sitemap.xml`],
  };
}
