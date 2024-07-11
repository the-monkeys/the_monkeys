import { Metadata } from 'next';

import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import PageHeading from '@/components/pageHeading';
import { Badge } from '@/components/ui/badge';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Activity',
    description: 'Track your recent activities on Monkeys.',
  };
}

const ActivityPage = () => {
  return (
    <Container className='pb-12 min-h-screen'>
      <PageHeading
        heading='Activity'
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

export default ActivityPage;
