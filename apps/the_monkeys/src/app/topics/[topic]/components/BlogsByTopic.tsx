import { FeedBlogCard } from '@/components/cards/blog/FeedBlogCard';
import { MetaBlog } from '@/services/blog/blogTypes';
import { fromMetaBlog } from '@/utils/blogCardAdapters';

export const BlogsByTopic = ({ blogs }: { blogs: MetaBlog[] }) => {
  if (blogs.length === 0) {
    return (
      <div className='p-2 flex items-center justify-center'>
        <p className='opacity-90'>No results found.</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      {blogs.map((blog) => {
        return (
          <FeedBlogCard
            variant='list'
            blog={fromMetaBlog(blog)}
            key={blog?.blog_id}
          />
        );
      })}
    </div>
  );
};
