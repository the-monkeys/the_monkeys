import { getCardContent } from '@/components/blog/getBlogContent';
import { getPostSeoContent } from '@/lib/postSeoContent';
import {
  canonicalPostDocumentTitleSlug,
  canonicalPostTitleSlug,
  postLinkTitleSlug,
} from '@/lib/postUrl';
import { isPublicContentSafe } from '@/lib/publicContentSafety';
import {
  Block,
  Blog,
  FollowingFeed,
  MetaBlog,
} from '@/services/blog/blogTypes';
import { BlogCardData } from '@/services/blog/blogTypes';
import { purifyHTMLString } from '@/utils/purifyHTML';

export const fromMetaBlog = (blog: MetaBlog): BlogCardData => ({
  is_nsfw: blog.is_nsfw,
  content_rating: blog.content_rating,
  content_unavailable: blog.content_unavailable,
  blogId: blog.blog_id,
  authorId: blog.owner_account_id,
  date: blog.published_time,
  slug: isPublicContentSafe(blog)
    ? canonicalPostTitleSlug(blog.title, blog.canonical_slug, blog.blog_id)
    : postLinkTitleSlug('Post', blog.blog_id, blog.slug, blog.canonical_slug),
  tags: blog.tags ?? [],
  title: purifyHTMLString(blog.title),
  description: purifyHTMLString(blog.first_paragraph),
  image: blog.first_image,
  audience: blog.audience,
  groupSlug: blog.group_slug,
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
    is_nsfw: blog.is_nsfw,
    content_rating: blog.content_rating,
    content_unavailable: blog.content_unavailable,
    blogId: blog.blog_id,
    authorId: blog.owner_account_id,
    date: blog.published_time,
    slug: postLinkTitleSlug(
      isPublicContentSafe(blog) ? getPostSeoContent(blog.blog).title : 'Post',
      blog.blog_id,
      blog.slug,
      blog.canonical_slug
    ),
    tags: blog.tags ?? [],
    title,
    description: purifyHTMLString(descriptionBlock?.data?.text || ''),
    image: imageBlock?.data?.file?.url || imageBlock?.data?.content?.[0] || '',
    initialIsLiked: blog.IsLikedByMe,
    initialIsBookmarked: blog.IsBookmarkedByMe,
    initialLikeCount: blog.LikeCount,
  };
};

export const fromBlog = (post: Blog): BlogCardData => {
  const { titleContent, descriptionContent, imageContent } = getCardContent({
    blog: post,
  });

  return {
    is_nsfw: post.is_nsfw,
    content_rating: post.content_rating,
    content_unavailable: post.content_unavailable,
    blogId: post.blog_id,
    authorId: post.owner_account_id,
    date: post.published_time,
    slug: isPublicContentSafe(post)
      ? canonicalPostDocumentTitleSlug(
          post.blog,
          post.canonical_slug,
          post.blog_id
        )
      : postLinkTitleSlug('Post', post.blog_id, post.slug, post.canonical_slug),
    tags: post.tags ?? [],
    title: titleContent,
    description: descriptionContent,
    image: imageContent ?? '',
    audience: post.audience,
    groupSlug: post.group_slug,
    initialLikeCount: post.like_count ?? post.LikeCount,
  };
};
