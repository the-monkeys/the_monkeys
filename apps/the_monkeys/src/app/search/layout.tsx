import type { Metadata } from 'next';

import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/layout/pageHeading';

export const metadata: Metadata = {
  title: 'Search',
};

const SearchPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Container className='pb-12 px-4 max-w-6xl min-h-[800px] space-y-6'>
      <PageHeader>
        <PageHeading heading='Search' />
        <PageSubheading
          subheading='Explore posts, people and topics.'
          className='text-center'
        />
      </PageHeader>

      {children}
    </Container>
  );
};

export default SearchPageLayout;
