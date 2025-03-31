import type { Metadata } from 'next';

import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/layout/pageHeading';

export const metadata: Metadata = {
  title: 'Notifications',
};

const NotificationPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Container className='pb-12 min-h-screen space-y-4 md:space-y-6'>
      <PageHeader>
        <PageHeading heading='Notifications' />
        <PageSubheading
          subheading='View all your notifications in one place.'
          className='text-center'
        />
      </PageHeader>

      {children}
    </Container>
  );
};

export default NotificationPageLayout;
