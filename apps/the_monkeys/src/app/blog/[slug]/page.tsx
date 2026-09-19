import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { BLOG_DETAIL_QUERY_KEY } from '@/hooks/blog/useGetPublishedBlogDetailByBlogId';
import { USER_PROFILE_QUERY_KEY } from '@/hooks/user/useGetProfileInfoByUserId';
import { noIndexFollowRobots } from '@/lib/seo';
import { Blog } from '@/services/blog/blogTypes';
import { GetProfileInfoByIdResponse } from '@/services/profile/userApiTypes';
import { getQueryClient } from '@/utils/get-query-client';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import BlogPageClient from './BlogPageClient';
import { loadPublicAuthorForSeo, loadPublicBlogForSeo } from './blogData';
import {
  authorDisplayName,
  buildBlogJsonLd,
  buildBlogMetadata,
  getBlogIdFromSlug,
} from './blogSeo';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blogId = getBlogIdFromSlug(params.slug);
  const blog = await loadPublicBlogForSeo(blogId);
  if (blog === undefined) {
    return {
      title: { absolute: 'Post temporarily unavailable | Monkeys' },
      robots: noIndexFollowRobots,
    };
  }
  if (blog === null || blog.is_draft) {
    return {
      title: { absolute: 'Post not found | Monkeys' },
      robots: noIndexFollowRobots,
    };
  }

  const author = await loadPublicAuthorForSeo(blog.owner_account_id);
  return buildBlogMetadata(blog, params.slug, authorDisplayName(author));
}

export default async function BlogPage({ params }: Props) {
  const queryClient = getQueryClient();
  const fullSlug = params.slug;
  const blogId = getBlogIdFromSlug(fullSlug);

  if (!blogId) return null;

  const blog = await loadPublicBlogForSeo(blogId);
  if (blog === null || blog?.is_draft) notFound();
  if (blog) queryClient.setQueryData([BLOG_DETAIL_QUERY_KEY, blogId], blog);

  let authorData: GetProfileInfoByIdResponse | null | undefined = null;
  if (blog?.owner_account_id) {
    authorData = await loadPublicAuthorForSeo(blog.owner_account_id);
    if (authorData) {
      queryClient.setQueryData(
        [USER_PROFILE_QUERY_KEY, blog.owner_account_id],
        authorData
      );
    }
  }

  // Prepare JSON-LD
  let jsonLd = null;
  if (blog && !blog.is_draft) {
    jsonLd = buildBlogJsonLd(
      blog,
      fullSlug,
      authorDisplayName(authorData),
      authorData?.user?.username
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {jsonLd && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
          }}
        />
      )}
      <BlogPageClient urlBlogId={blogId} fullSlug={fullSlug} />
    </HydrationBoundary>
  );
}
