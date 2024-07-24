import type { Metadata } from 'next';

import Container from '@/components/layout/Container';
import PageHeading from '@/components/pageHeading';

export const metadata: Metadata = {
  title: 'Activity',
};

export default function ActivityPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Container className='pb-12 min-h-screen space-y-6'>
      <PageHeading
        heading='Activity'
        subHeading={
          <p className='mt-4 font-jost text-base sm:text-lg text-center'>
            You became part of{' '}
            <span className='font-medium text-primary-monkeyOrange'>
              Monkeys
            </span>{' '}
            and have since then...
          </p>
        }
      />
      {children}
    </Container>
  );
}
