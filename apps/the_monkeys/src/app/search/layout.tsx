import type { Metadata } from 'next';

import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/layout/pageHeading';
import { absoluteUrl, noIndexFollowRobots } from '@/lib/seo';

export const metadata: Metadata = {
  title: { absolute: 'Search Posts and Authors | Monkeys' },
  description:
    'Search public posts and authors on Monkeys, then explore their topics, events, and communities.',
  alternates: { canonical: absoluteUrl('/search') },
  robots: noIndexFollowRobots,
};

const SearchPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Container className='pb-12 px-4 min-h-[800px] space-y-6'>
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
