import { baseUrl } from '@/constants/baseUrl';

export default async function sitemap() {
  return [
    {
      url: `${baseUrl}`,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
