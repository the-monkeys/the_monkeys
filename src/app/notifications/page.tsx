import { Metadata } from 'next';

import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import PageHeading from '@/components/pageHeading';
import { Badge } from '@/components/ui/badge';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Notifications',
    description: 'Stay updated with the latest notifications on Monkeys.',
  };
}

const NotificationsPage = () => {
  return (
    <Container className='pb-12 min-h-screen'>
      <PageHeading
        heading='Notifications'
        badge={
          <Badge variant='secondary'>
            <Icon name='RiCodeSSlash' size={18} className='mr-2' />
            Feature in Development
          </Badge>
        }
      />
    </Container>
  );
};

export default NotificationsPage;
