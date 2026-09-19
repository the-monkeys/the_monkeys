import type { Metadata } from 'next';

import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/layout/pageHeading';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: 'Explore Topics, Posts and Communities | Monkeys',
    description:
      'Browse topics and discover public posts, authors, events, and communities built around your interests on Monkeys.',
    path: '/topics/explore',
  });
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
