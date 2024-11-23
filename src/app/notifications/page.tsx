import { Metadata } from 'next';

import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/layout/pageHeading';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Notifications',
  };
}

const NotificationsPage = () => {
  return (
    <Container className='pb-12 min-h-screen'>
      <PageHeader>
        <PageHeading heading='Notifications' className='py-1 self-start' />
        <PageSubheading
          subheading='View all your notifications in one place.'
          className='self-start opacity-75'
        />
      </PageHeader>
    </Container>
  );
};

export default NotificationsPage;
