import type { Metadata } from 'next';

import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/layout/pageHeading';

export const metadata: Metadata = {
  title: 'Library',
};

const LibraryPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Container className='pb-12 px-4 min-h-screen space-y-10'>
      <PageHeader>
        <PageHeading heading='Library' />
        <PageSubheading
          subheading='Explore and manage your bookmarks effortlessly.'
          className='text-center'
        />
      </PageHeader>

      {children}
    </Container>
  );
};

export default LibraryPageLayout;
