import { UserInfoCard } from '@/components/user/userInfo';
import { Blog } from '@/services/blog/blogTypes';

import { BlogReactions } from './BlogReactions';

export const BlogInfoSection = ({ blog }: { blog?: Blog }) => {
  return (
    <div className='space-y-3'>
      <UserInfoCard id={blog?.owner_account_id} date={blog?.blog?.time} />

      <BlogReactions blogId={blog?.blog_id} />
    </div>
  );
};
