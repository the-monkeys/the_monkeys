import type { Metadata } from 'next';

import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/pageHeading';

export const metadata: Metadata = {
  title: 'Activity',
};

export default function ActivityPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Container className='pb-12 min-h-screen space-y-4 md:space-y-6'>
      <PageHeader>
        <PageHeading heading='Activity' className='py-1' />
        <PageSubheading
          subheading='You became part of Monkeys and have since then...'
          className='opacity-75'
        />
      </PageHeader>

      {children}
    </Container>
  );
}
