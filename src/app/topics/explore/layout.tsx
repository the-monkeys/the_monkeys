import type { Metadata } from 'next';

import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/layout/pageHeading';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Explore Topics',
    description:
      'Unleash your curiosity, explore content that matters to you, and add your favorite topics to your profile for a personalized experience.',
  };
}

const ExploreTopicsPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Container className='pb-12 min-h-screen space-y-8'>
      <PageHeader>
        <PageHeading heading='Explore Topics' />
        <PageSubheading
          subheading='Explore wide variety of topics, from Business, Sports, Technology and much more.'
          className='text-center'
        />
      </PageHeader>

      {children}
    </Container>
  );
};

export default ExploreTopicsPageLayout;
