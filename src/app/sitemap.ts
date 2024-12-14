import { baseUrl } from '@/constants/baseUrl';
import useGetLatest100Blogs from '@/hooks/blog/useGetLatest100Blogs';

export default async function sitemap() {
  const { blogs } = useGetLatest100Blogs();

  const staticUrls = [
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
      priority: 0.8,
    },
  ];

  const blogUrls =
    blogs?.the_blogs?.map((post) => ({
      url: `${baseUrl}/blog/${post.blog_id}`,
      changeFrequency: 'weekly',
      priority: 1,
    })) || [];

  return [...staticUrls, ...blogUrls];
}
