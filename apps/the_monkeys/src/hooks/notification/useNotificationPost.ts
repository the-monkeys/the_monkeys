import { generateSlug } from '@/app/blog/utils/generateSlug';
import { getCardContent } from '@/components/blog/getBlogContent';
import { BLOG_ROUTE } from '@/constants/routeConstants';
import useGetPublishedBlogDetailByBlogId from '@/hooks/blog/useGetPublishedBlogDetailByBlogId';
import { postTitle } from '@/lib/notificationPresentation';

export function useNotificationPost(data?: Record<string, unknown>) {
  const stored = postTitle(data);
  const blogId = typeof data?.blog_id === 'string' ? data.blog_id.trim() : '';
  const needsFetch = !!blogId && !stored;
  const { blog } = useGetPublishedBlogDetailByBlogId(
    needsFetch ? blogId : undefined
  );

  const fetched = blog ? getCardContent({ blog }).titleContent?.trim() : '';
  const title = stored || (fetched && fetched !== blogId ? fetched : undefined);

  const href = blogId
    ? title
      ? `${BLOG_ROUTE}/${generateSlug(title)}-${blogId}`
      : `${BLOG_ROUTE}/${blogId}`
    : undefined;

  return { title, href };
}
