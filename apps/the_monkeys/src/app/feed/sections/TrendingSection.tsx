import { TrendingBlogCardSmall } from '@/components/cards/blog/TrendingBlogCard';
import Container from '@/components/layout/Container';
import { MetaBlog } from '@/services/blog/blogTypes';

const TrendingSection = ({ blogs }: { blogs: MetaBlog[] }) => {
  return (
    <div className='space-y-6'>
      <Container className='px-4 pt-8 md:pt-10'>
        <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
          {blogs.slice(0, 2).map((blog) => {
            return (
              <div className='col-span-2 sm:col-span-1' key={blog?.blog_id}>
                <TrendingBlogCardSmall blog={blog} />
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
};

export default TrendingSection;
