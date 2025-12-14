import type { Metadata } from 'next';

import { getCardContent } from '@/components/blog/getBlogContent';
import { BLOG_DETAIL_QUERY_KEY } from '@/hooks/blog/useGetPublishedBlogDetailByBlogId';
import { USER_PROFILE_QUERY_KEY } from '@/hooks/user/useGetProfileInfoByUserId';
import { Blog } from '@/services/blog/blogTypes';
import { authFetcher, authFetcherV2 } from '@/services/fetcher';
import { GetProfileInfoByIdResponse } from '@/services/profile/userApiTypes';
import { getQueryClient } from '@/utils/get-query-client';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import BlogPageClient from './BlogPageClient';
import { generateBlogSchema } from './utils';

interface Props {
  params: { slug: string };
}

const getBlogIdFromSlug = (slug: string) => {
  return typeof slug === 'string' ? slug.split('-').pop() : '';
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const fullSlug = params.slug;
  const blogId = getBlogIdFromSlug(fullSlug);

  try {
    const blog = (await authFetcherV2(`/blog/${blogId}`)) as Blog;
    if (!blog) return { title: 'Blog Not Found' };

    const { titleContent, descriptionContent, imageContent } = getCardContent({
      blog,
    });

    return {
      title: titleContent,
      description: descriptionContent,
      openGraph: {
        images: [imageContent],
        title: titleContent,
        description: descriptionContent,
        type: 'article',
        publishedTime: blog.published_time,
        authors: [blog.owner_account_id || 'Monkeys Author'],
        tags: blog.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: titleContent,
        description: descriptionContent,
        images: [imageContent],
      },
    };
  } catch (error) {
    return {
      title: 'Monkeys - Blog',
    };
  }
}

export default async function BlogPage({ params }: Props) {
  const queryClient = getQueryClient();
  const fullSlug = params.slug;
  const blogId = getBlogIdFromSlug(fullSlug);

  if (!blogId) return null;

  // Prefetch Blog
  await queryClient.prefetchQuery({
    queryKey: [BLOG_DETAIL_QUERY_KEY, blogId],
    queryFn: () => authFetcherV2(`/blog/${blogId}`),
  });

  const blog = queryClient.getQueryData<Blog>([BLOG_DETAIL_QUERY_KEY, blogId]);

  if (blog?.owner_account_id) {
    await queryClient.prefetchQuery({
      queryKey: [USER_PROFILE_QUERY_KEY, blog.owner_account_id],
      queryFn: () =>
        authFetcher(`/user/public/account/${blog.owner_account_id}`),
    });
  }

  // Prepare JSON-LD
  let jsonLd = null;
  if (blog) {
    const { titleContent, descriptionContent, imageContent } = getCardContent({
      blog,
    });
    const authorId = blog.owner_account_id;

    const authorData = queryClient.getQueryData<GetProfileInfoByIdResponse>([
      USER_PROFILE_QUERY_KEY,
      authorId,
    ]);
    const authorName = authorData?.user?.username || 'Monkeys Author';

    jsonLd = generateBlogSchema(
      titleContent,
      descriptionContent,
      imageContent,
      blog?.published_time,
      fullSlug,
      blog?.tags,
      authorName,
      blog
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {jsonLd && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <BlogPageClient urlBlogId={blogId} fullSlug={fullSlug} />
    </HydrationBoundary>
  );
}
