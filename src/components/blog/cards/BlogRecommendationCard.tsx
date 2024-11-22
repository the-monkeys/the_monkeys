import Link from 'next/link';

import { UserInfoCardCompact } from '@/components/user/userInfo';
import { Block, Blog } from '@/services/Blogs/BlogTyptes';
import { purifyHTMLString } from '@/utils/purifyHTML';
import moment from 'moment';

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
      className='flex-1 font-jost font-medium text-base md:text-lg capitalize line-clamp-2 group-hover:opacity-75'
    ></h2>
  );
};

export const BlogRecommendationCard = ({ blog }: { blog: Blog }) => {
  return (
    <div className='group md:p-2 space-y-2'>
      <UserInfoCardCompact id={blog?.owner_account_id} />

      <Link href={`/blog/${blog?.blog_id}`}>
        <BlogContent
          titleBlock={blog?.blog?.blocks[0]}
          descriptionBlock={blog?.blog?.blocks[1]}
        />
      </Link>

      <p className='font-jost text-xs opacity-75 text-right'>
        {moment(blog?.blog?.time).format('MMM DD, YYYY')}
      </p>
    </div>
  );
};
