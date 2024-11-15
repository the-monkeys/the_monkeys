import { Badge } from '@/components/ui/badge';
import { Blog } from '@/services/Blogs/BlogTyptes';

import { BlogOwnerCard } from './BlogOwnerCard';
import { BlogReactions } from './BlogReactions';

export const BlogInfoSection = ({ blog }: { blog?: Blog }) => {
  return (
    <div className='py-4 mx-auto w-full sm:w-4/5 space-y-4 sm:space-y-6'>
      <BlogOwnerCard owner_id={blog?.owner_account_id} time={blog?.blog.time} />

      <div className='flex items-center gap-1 flex-wrap'>
        <p className='pr-1 font-jost text-sm opacity-75'>Published in:</p>

        {blog?.tags && blog?.tags.length ? (
          blog?.tags?.map((tag) => (
            <Badge
              variant='outline'
              key={tag}
              className='font-josefin_Sans text-xs'
            >
              {tag}
            </Badge>
          ))
        ) : (
          <p className='font-jost opacity-75'>- -</p>
        )}
      </div>

      <BlogReactions blog_id={blog?.blog_id} />
    </div>
  );
};
