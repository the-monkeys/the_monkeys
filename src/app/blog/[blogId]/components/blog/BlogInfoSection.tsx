import { UserInfoCard } from '@/components/user/userInfo';
import { Blog } from '@/services/Blogs/BlogTyptes';

import { BlogReactions } from './BlogReactions';
import { BlogTopics } from './BlogTopics';

export const BlogInfoSection = ({ blog }: { blog?: Blog }) => {
  return (
    <div>
      <UserInfoCard id={blog?.owner_account_id} date={blog?.blog?.time} />

      <BlogTopics topics={blog?.tags || []} className='mt-3  mb-4' />

      <BlogReactions
        blogId={blog?.blog_id}
        accountId={blog?.owner_account_id}
      />
    </div>
  );
};
