import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { generateSlug } from '@/app/blog/utils/generateSlug';
import { BlogShareDialog } from '@/components/blog/actions/BlogShareDialog';
import { DeleteBlogDialog } from '@/components/blog/actions/DeleteBlogDialog';
import { EditBlogDialog } from '@/components/blog/actions/EditBlogDialog';
import {
  BlogDescription,
  BlogImage,
  BlogPlaceholderImage,
  BlogTitle,
} from '@/components/blog/getBlogContent';
import Icon from '@/components/icon';
import { UserInfoCardShowcase } from '@/components/user/userInfo';
import { LIVE_URL } from '@/constants/api';
import { BLOG_ROUTE, TOPIC_ROUTE } from '@/constants/routeConstants';
import { MetaBlog } from '@/services/blog/blogTypes';
import { isNonValidBannerImage } from '@/utils/imageUtils';
import { purifyHTMLString } from '@/utils/purifyHTML';

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

  const titleContent = purifyHTMLString(blog?.title);
  const descriptionContent = purifyHTMLString(blog?.first_paragraph);
  const imageContent = blog?.first_image;

  const blogSlug = generateSlug(titleContent);
  const blogURL = `${BLOG_ROUTE}/${blogSlug}-${blogId}`;

  const showModificationOptions = isAuthenticated && modificationEnable;

  const handleEdit = (blogId: string) => {
    router.push(`/edit/${blogId}`);
  };

  return (
    <div className='pb-4 border-b-1 border-border-light/60 dark:border-border-dark/60'>
      <article className='flex flex-col sm:flex-row gap-3 sm:gap-4'>
        <div className='shrink-0 aspect-[3/2] h-[200px] sm:h-fit w-full sm:w-[200px] bg-foreground-light/60 dark:bg-foreground-dark/60 rounded-sm shadow-sm overflow-hidden'>
          <Link href={blogURL} className='group'>
            {isNonValidBannerImage(imageContent) ? (
              <BlogPlaceholderImage
                title={titleContent}
                className='group-hover:scale-105 transition-transform duration-200'
              />
            ) : (
              <BlogImage
                title={titleContent}
                image={imageContent}
                className='group-hover:scale-105 transition-transform duration-200'
              />
            )}
          </Link>
        </div>

        <div className='w-full flex flex-col justify-between gap-[10px]'>
          <div>
            <UserInfoCardShowcase
              authorID={authorId}
              date={date}
              isDraft={isDraft}
            />

            {isDraft ? (
              <div className='w-full'>
                <BlogTitle
                  className='pt-2 font-semibold text-[1.12rem] leading-[1.4] line-clamp-2'
                  title={titleContent || 'Untitled Post'}
                />
              </div>
            ) : (
              <Link href={blogURL} className='w-full'>
                <BlogTitle
                  className='pt-2 font-semibold text-[1.12rem] leading-[1.4] hover:underline underline-offset-2 line-clamp-2'
                  title={titleContent || 'Untitled Post'}
                />
              </Link>
            )}

            {descriptionContent !== '' && (
              <BlogDescription
                description={descriptionContent}
                className='pt-[6px] text-[0.9rem] line-clamp-2 sm:line-clamp-1 opacity-90'
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

              {!isDraft && (
                <>
                  <p className='font-medium text-sm opacity-80'>{' · '}</p>

                  <BlogShareDialog
                    blogURL={`${LIVE_URL}${blogURL}`}
                    size={16}
                  />
                </>
              )}
            </div>

            <div className='flex items-center gap-2'>
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
      </article>
    </div>
  );
};
