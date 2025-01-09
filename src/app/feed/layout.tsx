import Container from '@/components/layout/Container';
import { SearchInput } from '@/components/search/SearchInput';

const BlogFeedPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Container className='gap-6 lg:gap-8 p-4 pb-12 space-y-6'>
      <div>
        <SearchInput className='flex-1 mx-auto w-full sm:max-w-[500px]' />
      </div>

      <div className='min-h-screen'>{children}</div>
    </Container>
  );
};

export default BlogFeedPageLayout;
