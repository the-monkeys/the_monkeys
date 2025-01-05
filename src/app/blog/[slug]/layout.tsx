import type { Metadata } from 'next';

import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/layout/pageHeading';

export const metadata: Metadata = {
  title: 'Blog',
};

const BlogPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Container className='px-4 py-5 grid grid-cols-3 gap-6 lg:gap-8'>
      {children}
    </Container>
  );
};

export default BlogPageLayout;
