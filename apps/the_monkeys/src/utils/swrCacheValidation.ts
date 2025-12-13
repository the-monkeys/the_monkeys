import { Blog, GetMetaFeedBlogs, MetaBlog } from '@/services/blog/blogTypes';

export const updateSwrCache = (currentData: any, blogId: string) => {
  if (!currentData?.blogs) return currentData;

  const updatedBlogs: MetaBlog = currentData.blogs.filter(
    (blog: Blog) => blog.blog_id !== blogId
  );

  return {
    ...currentData,
    blogs: updatedBlogs,
    total_blogs: Math.max((currentData.total_blogs || 0) - 1, 0),
  } as GetMetaFeedBlogs;
};
