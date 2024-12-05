import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/layout/pageHeading';

const BlogFeed = () => {
  return (
    <Container className='pb-12 min-h-screen'>
      <PageHeader>
        <PageHeading heading='Feed' className='py-1 self-start' />
        <PageSubheading
          subheading='Feed will be live soon!'
          className='self-start opacity-75'
        />
      </PageHeader>
    </Container>
  );
};

export default BlogFeed;
