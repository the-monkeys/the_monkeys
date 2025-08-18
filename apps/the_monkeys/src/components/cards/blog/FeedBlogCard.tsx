import Link from 'next/link';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import { BlogShareDialog } from '@/components/blog/actions/BlogShareDialog';
import { BookmarkButton } from '@/components/blog/buttons/BookmarkButton';
import {
  BlogDescription,
  BlogImage,
  BlogPlaceholderImage,
  BlogTitle,
} from '@/components/blog/getBlogContent';
import { UserInfoCardShowcase } from '@/components/user/userInfo';
import { LIVE_URL } from '@/constants/api';
import { BLOG_ROUTE, TOPIC_ROUTE } from '@/constants/routeConstants';
import { MetaBlog } from '@/services/blog/blogTypes';
import { purifyHTMLString } from '@/utils/purifyHTML';

export const FeedBlogCard = ({
  blog,
  showBookmarkOption = false,
}: {
  blog: MetaBlog;
  showBookmarkOption?: boolean;
}) => {
  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.published_time;

  const titleContent = purifyHTMLString(blog?.title);
  const descriptionContent = purifyHTMLString(blog?.first_paragraph);
  const imageContent = blog?.first_image;

  const blogSlug = generateSlug(titleContent);
  const blogURL = `${BLOG_ROUTE}/${blogSlug}-${blogId}`;

  return (
    <div className='group flex flex-col sm:flex-row gap-[10px] sm:gap-4'>
      <div className='shrink-0 h-[200px] sm:h-[140px] w-full sm:w-[210px] bg-foreground-light dark:bg-foreground-dark rounded-sm shadow-sm overflow-hidden'>
        {!imageContent ? (
          <BlogPlaceholderImage title={titleContent} />
        ) : (
          <BlogImage title={titleContent} image={imageContent} />
        )}
      </div>

      <div className='w-full flex flex-col justify-between gap-[10px]'>
        <div>
          <UserInfoCardShowcase authorID={authorId} date={date} />

          <Link href={blogURL} className='w-full'>
            <BlogTitle
              className='pt-2 font-semibold text-lg leading-[1.4] hover:underline underline-offset-2 line-clamp-2'
              title={titleContent || 'Untitled Post'}
            />
          </Link>

          {descriptionContent !== '' && (
            <BlogDescription
              description={descriptionContent}
              className='pt-[6px] text-sm line-clamp-1 opacity-90'
            />
          )}
        </div>

        <div className='pt-3 w-full flex justify-between items-center gap-2'>
          <div className='flex items-center gap-[6px]'>
            {blog?.tags.length ? (
              <div className='w-fit flex items-center gap-1'>
                <Link
                  href={`${TOPIC_ROUTE}/${blog?.tags[0]}`}
                  target='_blank'
                  className='shrink-0 font-medium text-sm text-brand-orange capitalize hover:underline'
                >
                  {blog?.tags[0]}
                </Link>
              </div>
            ) : (
              <p className='shrink-0 text-sm opacity-90 italic'>Untagged</p>
            )}

            <p className='font-medium text-sm opacity-80'>{' · '}</p>

            <BlogShareDialog blogURL={`${LIVE_URL}${blogURL}`} size={16} />
          </div>

          {showBookmarkOption && (
            <BookmarkButton blogId={blog?.blog_id} size={16} />
          )}
        </div>
      </div>
    </div>
  );
};
