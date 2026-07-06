'use client';

import Link from 'next/link';

import { LikesCount } from '@/components/blog/LikesCount';
import { BlogShareDialog } from '@/components/blog/actions/BlogShareDialog';
import { BookmarkButton } from '@/components/blog/buttons/BookmarkButton';
import { LikeButton } from '@/components/blog/buttons/LikeButton';
import {
  BlogDescription,
  BlogImage,
  BlogPlaceholderImage,
  BlogTitle,
} from '@/components/blog/getBlogContent';
import { UserInfoCardShowcase } from '@/components/user/userInfo';
import { LIVE_URL } from '@/constants/api';
import { BLOG_ROUTE, TOPIC_ROUTE } from '@/constants/routeConstants';
import { getRelativeTime } from '@/lib/utils';
import { BlogCardData } from '@/services/blog/blogTypes';
import { isNonValidBannerImage } from '@/utils/imageUtils';
import { topicToSlug } from '@/utils/topicUtils';

interface CardProps {
  blog: BlogCardData;
  showBookmark?: boolean;
}

const BlogCardImage = ({
  title,
  image,
  className,
}: {
  title: string;
  image: string;
  className?: string;
}) =>
  isNonValidBannerImage(image) ? (
    <BlogPlaceholderImage title={title} className={className} />
  ) : (
    <BlogImage title={title} image={image} className={className} />
  );

const ArticleTag = ({
  tag,
  className,
  showFallback = false,
  openInNewTab = false,
}: {
  tag?: string;
  className?: string;
  showFallback?: boolean;
  openInNewTab?: boolean;
}) => {
  if (!tag) {
    return showFallback ? (
      <p className='shrink-0 text-sm opacity-90 italic'>Untagged</p>
    ) : null;
  }
  return (
    <Link
      href={`${TOPIC_ROUTE}/${topicToSlug(tag)}`}
      target={openInNewTab ? '_blank' : undefined}
      className={className}
    >
      {tag}
    </Link>
  );
};

const ArticleActions = ({
  blogId,
  blogURL,
  size = 18,
  showBookmark = false,
  initialIsLiked,
  initialIsBookmarked,
  initialLikeCount,
}: {
  blogId: string;
  blogURL: string;
  size?: number;
  showBookmark?: boolean;
  initialIsLiked?: boolean;
  initialIsBookmarked?: boolean;
  initialLikeCount?: number;
}) => (
  <div className='flex items-center gap-2 text-gray-400 dark:text-gray-500'>
    <div className='flex items-center hover:text-brand-orange transition-colors cursor-pointer group/action'>
      <LikeButton blogId={blogId} size={size} initialIsLiked={initialIsLiked} />
      <LikesCount blogId={blogId} initialCount={initialLikeCount} />
    </div>
    <div className='hover:text-brand-orange transition-colors cursor-pointer'>
      <BlogShareDialog blogURL={blogURL} size={size} />
    </div>
    {showBookmark && (
      <div className='hover:text-brand-orange transition-colors cursor-pointer'>
        <BookmarkButton
          blogId={blogId}
          size={size}
          initialIsBookmarked={initialIsBookmarked}
        />
      </div>
    )}
  </div>
);

const FormattedDate = ({ date }: { date: string }) => (
  <span className='text-[13px] font-inter text-gray-400 dark:text-gray-500'>
    {new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}
  </span>
);

// ─── Card variants ────────────────────────────────────────────────────────────

const HorizontalCard = ({ blog, showBookmark = false }: CardProps) => {
  const {
    blogId,
    authorId,
    date,
    slug,
    tags,
    title,
    description,
    image,
    initialIsLiked,
    initialIsBookmarked,
    initialLikeCount,
  } = blog;
  const blogURL = `${BLOG_ROUTE}/${slug}-${blogId}`;

  return (
    <div className='pb-10 w-full'>
      <article className='flex flex-col md:flex-row transition-all duration-500 group overflow-hidden'>
        <div className='md:w-[40%] aspect-[3/2] md:aspect-auto relative bg-gray-50 dark:bg-gray-800 overflow-hidden'>
          <Link href={blogURL} className='block h-full w-full'>
            <BlogCardImage
              title={title}
              image={image}
              className='group-hover:scale-105 transition-transform duration-1000 ease-out h-full w-full object-cover'
            />
          </Link>
        </div>

        <div className='md:w-[60%] py-4 md:py-8 md:px-10 flex flex-col justify-between gap-8'>
          <div className='space-y-4'>
            <ArticleTag
              tag={tags[0]}
              className='inline-block font-inter font-bold text-[12px] text-brand-orange uppercase tracking-[0.2em] hover:opacity-80 transition-opacity'
            />
            <Link href={blogURL} className='block group/title'>
              <BlogTitle
                className='font-newsreader font-bold text-[32px] md:text-[40px] leading-[1.1] text-gray-900 dark:text-gray-100 group-hover/title:text-brand-orange transition-colors line-clamp-3'
                title={title || 'Untitled Post'}
              />
            </Link>
            {description && (
              <BlogDescription
                description={description}
                className='text-[16px] md:text-[18px] font-inter text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed mt-2'
              />
            )}
          </div>

          <div className='md:pt-6 flex flex-wrap justify-between items-center gap-4'>
            <div className='flex items-center gap-4'>
              <UserInfoCardShowcase authorID={authorId} date={date} hideDate />
              <FormattedDate date={date} />
            </div>
            <ArticleActions
              blogId={blogId}
              blogURL={`${LIVE_URL}${blogURL}`}
              size={20}
              showBookmark={showBookmark}
              initialIsLiked={initialIsLiked}
              initialIsBookmarked={initialIsBookmarked}
              initialLikeCount={initialLikeCount}
            />
          </div>
        </div>
      </article>
    </div>
  );
};

const ListCard = ({ blog, showBookmark = false }: CardProps) => {
  const {
    blogId,
    authorId,
    date,
    slug,
    tags,
    title,
    description,
    image,
    initialIsLiked,
    initialIsBookmarked,
    initialLikeCount,
  } = blog;
  const blogURL = `${BLOG_ROUTE}/${slug}-${blogId}`;

  return (
    <div className='pb-4'>
      <article className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
        <div className='shrink-0 aspect-[3/2] h-[200px] sm:h-fit w-full sm:w-[210px] bg-foreground-light/60 dark:bg-foreground-dark/60 rounded-sm shadow-sm overflow-hidden'>
          <Link href={blogURL} className='group block h-full w-full'>
            <BlogCardImage
              title={title || 'Untitled Post'}
              image={image}
              className='group-hover:scale-105 transition-transform duration-200'
            />
          </Link>
        </div>

        <div className='w-full flex flex-col justify-between gap-[10px]'>
          <div>
            <UserInfoCardShowcase
              authorID={authorId}
              date={date ? getRelativeTime(date) : undefined}
            />
            <Link href={blogURL} className='w-full'>
              <BlogTitle
                className='pt-2 font-semibold text-[1.12rem] leading-[1.4] hover:underline underline-offset-2 line-clamp-2'
                title={title || 'Untitled Post'}
              />
            </Link>
            {description && (
              <BlogDescription
                description={description}
                className='pt-[6px] text-[0.9rem] line-clamp-2 sm:line-clamp-1 opacity-90'
              />
            )}
          </div>

          <div className='w-full flex justify-between items-center gap-2'>
            <div className='min-w-0 flex items-center gap-[6px]'>
              <ArticleTag
                tag={tags?.[0]}
                className='shrink min-w-0 font-medium text-sm text-brand-orange capitalize hover:underline truncate'
                showFallback
                openInNewTab
              />
            </div>
            <ArticleActions
              blogId={blogId}
              blogURL={`${LIVE_URL}${blogURL}`}
              size={16}
              showBookmark={showBookmark}
              initialIsLiked={initialIsLiked}
              initialIsBookmarked={initialIsBookmarked}
              initialLikeCount={initialLikeCount}
            />
          </div>
        </div>
      </article>
    </div>
  );
};

const VerticalCard = ({ blog, showBookmark = false }: CardProps) => {
  const {
    blogId,
    authorId,
    date,
    slug,
    tags,
    title,
    description,
    image,
    initialIsLiked,
    initialIsBookmarked,
    initialLikeCount,
  } = blog;
  const blogURL = `${BLOG_ROUTE}/${slug}-${blogId}`;

  return (
    <div className='pb-8'>
      <article className='flex flex-col transition-all duration-300 group'>
        <div className='aspect-[16/9] w-full bg-gray-50 dark:bg-gray-800 overflow-hidden relative'>
          <Link href={blogURL}>
            <BlogCardImage
              title={title}
              image={image}
              className='group-hover:scale-105 transition-transform duration-700 ease-out'
            />
          </Link>
        </div>

        <div className='md:mt-6 mt-4 flex flex-col gap-3'>
          <div className='flex items-center gap-2'>
            <ArticleTag
              tag={tags[0]}
              className='font-inter font-medium text-xs text-gray-500 uppercase tracking-widest hover:text-brand-orange transition-colors'
              showFallback
            />
          </div>
          <Link href={blogURL} className='group/title'>
            <BlogTitle
              className='font-dm_sans font-bold text-[24px] leading-[1.2] text-gray-900 dark:text-gray-100 group-hover/title:text-brand-orange transition-colors line-clamp-2'
              title={title || 'Untitled Post'}
            />
          </Link>
          {description && (
            <BlogDescription
              description={description}
              className='text-[15px] font-inter text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed'
            />
          )}
        </div>

        <div className=' mt-4 md:pt-4 flex justify-between items-center'>
          <div className='flex items-center gap-4'>
            <UserInfoCardShowcase authorID={authorId} date={date} hideDate />
            <FormattedDate date={date} />
          </div>
          <ArticleActions
            blogId={blogId}
            blogURL={`${LIVE_URL}${blogURL}`}
            size={18}
            showBookmark={showBookmark}
            initialIsLiked={initialIsLiked}
            initialIsBookmarked={initialIsBookmarked}
            initialLikeCount={initialLikeCount}
          />
        </div>
      </article>
    </div>
  );
};

// ─── Variants map — eliminates the if/else chain ──────────────────────────────

const CARD_VARIANTS = {
  horizontal: HorizontalCard,
  list: ListCard,
  vertical: VerticalCard,
} as const;

// ─── Public export ────────────────────────────────────────────────────────────

export const FeedBlogCard = ({
  blog,
  showBookmark = false,
  variant = 'vertical',
}: CardProps & { variant?: keyof typeof CARD_VARIANTS }) => {
  const Card = CARD_VARIANTS[variant];
  return <Card blog={blog} showBookmark={showBookmark} />;
};
