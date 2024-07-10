import { Metadata, ResolvingMetadata } from 'next';

import Container from '@/components/layout/Container';
import PageHeading from '@/components/pageHeading';

export async function generateMetadata(
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: 'Activity',
    description: 'Track your recent activities on Monkeys.',
  };
}

const ActivityPage = () => {
  return (
    <Container className='pb-12 min-h-screen'>
      <PageHeading heading='Activity' />
    </Container>
  );
};

export default ActivityPage;
