import { Blog } from '@/services/Blogs/BlogTyptes';

import { BlogOwnerCard } from './BlogOwnerCard';
import { BlogReactions } from './BlogReactions';
import { BlogTopics } from './BlogTopics';

export const BlogInfoSection = ({ blog }: { blog?: Blog }) => {
  return (
    <div className='space-y-6'>
      <BlogOwnerCard owner_id={blog?.owner_account_id} time={blog?.blog.time} />

      <BlogTopics topics={blog?.tags || []} />

      <BlogReactions blog_id={blog?.blog_id} />
    </div>
  );
};
