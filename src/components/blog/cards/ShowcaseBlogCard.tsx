import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { UserInfoCardCompact } from '@/components/user/userInfo';
import { Blog } from '@/services/blog/blogTypes';

import { getCardContent } from '../getBlogContent';

export const ShowcaseBlogCard = ({ blog }: { blog: Blog }) => {
  const authorId = blog?.owner_account_id;
  const blogId = blog?.blog_id;
  const date = blog?.published_time || blog?.blog?.time;

  const { titleDiv, descriptionDiv, imageDiv } = getCardContent({ blog });

  if (!imageDiv) return null;

  const tagColorCode = ['#5A9BD5', '#70AD47', '#FF5733', '#4472C4', '#8E44AD'];

  return (
    <div className='col-span-2 sm:col-span-1 flex flex-col gap-2'>
      <UserInfoCardCompact id={authorId} date={date} />

      <div className='flex-1 flex flex-col justify-between gap-5'>
        <Link href={`/blog?id=${blogId}`} className='group flex flex-col gap-2'>
          <div className='h-[185px] w-full overflow-hidden rounded-md'>
            {imageDiv}
          </div>

          <div className='space-y-1'>
            {titleDiv}
            {descriptionDiv}
          </div>
        </Link>

        <div className='relative flex gap-2 overflow-hidden'>
          {blog?.tags.map((tag, index) => {
            return (
              <p
                key={index}
                style={{ color: tagColorCode[index] }}
                className='text-sm whitespace-nowrap'
              >
                <span>#</span>
                {tag}
              </p>
            );
          })}

          <div className='w-[20px] h-full absolute top-0 right-0 bg-gradient-to-l from-background-light dark:from-background-dark from-[10%] z-10' />
        </div>
      </div>
    </div>
  );
};
