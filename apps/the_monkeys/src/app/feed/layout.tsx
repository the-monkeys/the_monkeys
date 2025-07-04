import Container from '@/components/layout/Container';

const BlogFeedPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Container className='gap-6 lg:gap-8 p-4 pb-12 space-y-6'>
      <div className='min-h-screen'>{children}</div>
    </Container>
  );
};

export default BlogFeedPageLayout;
