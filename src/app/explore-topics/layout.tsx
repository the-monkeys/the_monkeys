import type { Metadata } from 'next';

import Container from '@/components/layout/Container';
import PageHeading from '@/components/pageHeading';

export const metadata: Metadata = {
  title: 'Explore Topics',
  description:
    'Discover a range of topics, including Business, Technology, Arts, Travelling, Health, Humor, Entertainment and more. Stay informed and explore diverse categories that cater to your interests and curiosity.',
};

export default function ExplorePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Container className='pb-12 min-h-screen space-y-6'>
      <PageHeading
        heading='Topics'
        subHeading={
          <h3 className='mt-4 font-jost text-base sm:text-lg text-center'>
            Explore a wide variety of topics, from{' '}
            <span className='font-medium text-primary-monkeyOrange'>
              Business
            </span>
            ,{' '}
            <span className='font-medium text-primary-monkeyOrange'>
              Sports
            </span>
            ,{' '}
            <span className='font-medium text-primary-monkeyOrange'>
              Technology
            </span>
            , and much more.
          </h3>
        }
      />
      {children}
    </Container>
  );
}
