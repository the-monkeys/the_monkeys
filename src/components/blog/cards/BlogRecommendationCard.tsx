import Link from 'next/link';

import { UserInfoCardCompact } from '@/components/user/userInfo';
import { Block, Blog } from '@/services/Blogs/BlogTyptes';
import { purifyHTMLString } from '@/utils/purifyHTML';
import moment from 'moment';

import { BlogActionsDropdown } from '../actions/BlogActionsDropdown';
import { BookmarkButton } from '../buttons/BookmarkButton';

const BlogContent = ({
  titleBlock,
  descriptionBlock,
}: {
  titleBlock: Block;
  descriptionBlock?: Block;
}) => {
  const title = titleBlock.data.text;
  const descriptionType = descriptionBlock?.type;
  let descriptionContent;

  switch (descriptionType) {
    case 'list':
      descriptionContent = descriptionBlock?.data?.items[0];
      break;
    case 'paragraph':
      descriptionContent = descriptionBlock?.data?.text;
      break;
    case 'header':
      descriptionContent = descriptionBlock?.data?.text;
      break;
    default:
      descriptionContent = title;
  }

  return (
    <h2
      dangerouslySetInnerHTML={{ __html: purifyHTMLString(title) }}
      className='flex-1 font-roboto text-base sm:text-lg capitalize line-clamp-2 group-hover:underline underline-offset-2 decoration-1'
    ></h2>
  );
};

export const BlogRecommendationCard = ({ blog }: { blog: Blog }) => {
  return (
    <div className='md:p-2 flex flex-col gap-2'>
      <UserInfoCardCompact id={blog?.owner_account_id} />

      <Link href={`/blog/${blog?.blog_id}`} className='group'>
        <BlogContent
          titleBlock={blog?.blog?.blocks[0]}
          descriptionBlock={blog?.blog?.blocks[1]}
        />
      </Link>

      <div className='flex justify-end items-center gap-1'>
        <p className='font-roboto text-xs opacity-80'>
          {moment(blog?.blog?.time).format('MMM DD, YYYY')}
        </p>

        <BlogActionsDropdown blogId={blog?.blog_id} />
      </div>
    </div>
  );
};
