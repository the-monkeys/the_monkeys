import axiosInstance from '@/services/api/axiosInstance';
import axiosInstanceNoAuthV2 from '@/services/api/axiosInstanceNoAuthV2';
import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import { BlogPublicationScope } from '@/services/blog/blogPublication';
import { Blog } from '@/services/blog/blogTypes';

export type PublishBlogBody = BlogPublicationScope & {
  tags: string[];
  slug?: string;
};

export type ScheduleBlogBody = PublishBlogBody & {
  schedule_time: string;
  timezone: string;
};

export const publishBlog = (blogId: string, body: PublishBlogBody) =>
  axiosInstance
    .post(`/blog/publish/${encodeURIComponent(blogId)}`, body)
    .then((response) => response.data);

export const scheduleBlog = (blogId: string, body: ScheduleBlogBody) =>
  axiosInstanceV2
    .post(`/blog/${encodeURIComponent(blogId)}/schedule_blog`, body)
    .then((response) => response.data);

export const getPublishedBlog = (blogId: string) =>
  axiosInstanceNoAuthV2
    .get<Blog>(`/blog/${encodeURIComponent(blogId)}`)
    .then((response) => response.data);
