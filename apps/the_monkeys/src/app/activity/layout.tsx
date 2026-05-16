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
    <Container className='pb-12 min-h-[800px] space-y-6 md:space-y-10 '>
      <PageHeader className='flex flex-col justify-center items-center w-full text-center'>
        <PageHeading heading='Activity' className='py-1' />
        <PageSubheading subheading='You became part of Monkeys and have since then...' />
      </PageHeader>

      {children}
    </Container>
  );
};

export default ActivityPageLayout;
