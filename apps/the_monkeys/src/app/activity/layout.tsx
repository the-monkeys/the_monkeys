import type { Metadata } from 'next';

import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/layout/pageHeading';

export const metadata: Metadata = {
  title: 'Activity',
};

const ActivityPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Container className='pb-12 min-h-[800px] space-y-6 md:space-y-10'>
      <PageHeader>
        <PageHeading heading='Activity' className='py-1 self-start' />
        <PageSubheading
          subheading='You became part of Monkeys and have since then...'
          className='self-start'
        />
      </PageHeader>

      {children}
    </Container>
  );
};

export default ActivityPageLayout;
