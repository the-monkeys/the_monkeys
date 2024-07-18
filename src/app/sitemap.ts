import { baseUrl } from '@/constants/baseUrl';

export default async function sitemap() {
  return [
    {
      url: `${baseUrl}`,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/news`,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
