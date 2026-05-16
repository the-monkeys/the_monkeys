import { generateSlug } from '@/app/blog/utils/generateSlug';
import { Block, FollowingFeed, MetaBlog } from '@/services/blog/blogTypes';
import { BlogCardData } from '@/services/blog/blogTypes';
import { purifyHTMLString } from '@/utils/purifyHTML';

export const fromMetaBlog = (blog: MetaBlog): BlogCardData => ({
  blogId: blog.blog_id,
  authorId: blog.owner_account_id,
  date: blog.published_time,
  slug: generateSlug(purifyHTMLString(blog.title)),
  tags: blog.tags ?? [],
  title: purifyHTMLString(blog.title),
  description: purifyHTMLString(blog.first_paragraph),
  image: blog.first_image,
});

export const fromFollowingFeed = (blog: FollowingFeed): BlogCardData => {
  const blocks: Block[] = blog.blog?.blocks || [];
  const titleBlock = blocks.find((b: Block) => b.type === 'header');
  const descriptionBlock = blocks.find((b: Block) => b.type === 'paragraph');
  const imageBlock = blocks.find((b: Block) => b.type === 'image');

  const title = purifyHTMLString(
    titleBlock?.data?.text || descriptionBlock?.data?.text || ''
  );

  return {
    blogId: blog.blog_id,
    authorId: blog.owner_account_id,
    date: blog.published_time,
    slug: blog.slug || generateSlug(title),
    tags: blog.tags ?? [],
    title,
    description: purifyHTMLString(descriptionBlock?.data?.text || ''),
    image: imageBlock?.data?.file?.url || imageBlock?.data?.content?.[0] || '',
    initialIsLiked: blog.IsLikedByMe,
    initialIsBookmarked: blog.IsBookmarkedByMe,
    initialLikeCount: blog.LikeCount,
  };
};
