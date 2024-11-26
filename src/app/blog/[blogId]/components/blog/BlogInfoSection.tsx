import { UserInfoCard } from '@/components/user/userInfo';
import { Blog } from '@/services/Blogs/BlogTyptes';

import { BlogReactions } from './BlogReactions';
import { BlogTopics } from './BlogTopics';

export const BlogInfoSection = ({ blog }: { blog?: Blog }) => {
  return (
    <div>
      <UserInfoCard id={blog?.owner_account_id} />

      <BlogTopics topics={blog?.tags || []} className='my-4' />

      <BlogReactions
        blogId={blog?.blog_id}
        accountId={blog?.owner_account_id}
      />
    </div>
  );
};
