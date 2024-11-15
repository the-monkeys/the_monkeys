import type { Metadata } from 'next';

import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/pageHeading';

export const metadata: Metadata = {
  title: 'Explore Topics',
  description:
    'Discover a range of topics, including Business, Technology, Arts, Travelling, Health, Humor, Entertainment and more. Stay informed and explore diverse categories that cater to your interests and curiosity.',
};

const ExploreTopicsPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Container className='pb-12 min-h-screen space-y-4 md:space-y-6'>
      <PageHeader>
        <PageHeading heading='Explore Topics' className='py-1' />
        <PageSubheading
          subheading='Explore wide variety of topics, from Business, Sports, Technology and much more.'
          className='text-center opacity-75'
        />
      </PageHeader>

      {children}
    </Container>
  );
};

export default ExploreTopicsPageLayout;
