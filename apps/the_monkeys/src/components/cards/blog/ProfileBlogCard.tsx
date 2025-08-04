import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import { BlogShareDialog } from '@/components/blog/actions/BlogShareDialog';
import { DeleteBlogDialog } from '@/components/blog/actions/DeleteBlogDialog';
import { EditBlogDialog } from '@/components/blog/actions/EditBlogDialog';
import {
  BlogImage,
  BlogPlaceholderImage,
  BlogTitle,
} from '@/components/blog/getBlogContent';
import Icon from '@/components/icon';
import { UserInfoCardShowcase } from '@/components/user/userInfo';
import { LIVE_URL } from '@/constants/api';
import { BLOG_ROUTE, TOPIC_ROUTE } from '@/constants/routeConstants';
import { MetaBlog } from '@/services/blog/blogTypes';

export const ProfileBlogCard = ({
  blog,
  isAuthenticated,
  modificationEnable = false,
  isDraft = false,
}: {
  blog: MetaBlog;
  isAuthenticated: boolean;
  modificationEnable: boolean;
  isDraft?: boolean;
}) => {
  const router = useRouter();

  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.published_time;

  const titleContent = blog?.title;
  const imageContent = blog?.first_image;

  const blogSlug = generateSlug(titleContent);
  const blogURL = `${BLOG_ROUTE}/${blogSlug}-${blogId}`;

  const showModificationOptions = isAuthenticated && modificationEnable;

  const handleEdit = (blogId: string) => {
    router.push(`/edit/${blogId}`);
  };

  return (
    <div className='group flex flex-col sm:flex-row gap-[10px] sm:gap-4'>
      <div className='shrink-0 h-[230px] sm:h-[130px] w-full sm:w-[200px] bg-foreground-light dark:bg-foreground-dark rounded-sm shadow-sm overflow-hidden'>
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
              className='pt-[6px] font-semibold text-lg leading-normal hover:underline underline-offset-2 line-clamp-2'
              title={titleContent || 'Untitled Post'}
            />
          </Link>
        </div>

        <div className='pt-2 w-full flex justify-between items-center gap-2'>
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

          <div className='flex items-center gap-2'>
            {!isDraft && <BlogShareDialog blogURL={`${LIVE_URL}${blogURL}`} />}

            {showModificationOptions && !isDraft && (
              <EditBlogDialog blogId={blogId} />
            )}

            {showModificationOptions && isDraft && (
              <button
                onClick={() => handleEdit(blogId)}
                className='p-1 flex items-center justify-center cursor-pointer opacity-80 hover:opacity-100'
                title='Edit Draft'
              >
                <Icon name='RiEdit2' size={18} />
              </button>
            )}

            {showModificationOptions && (
              <DeleteBlogDialog blogId={blogId} isDraft={isDraft} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
