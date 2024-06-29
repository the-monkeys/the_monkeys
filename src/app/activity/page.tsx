import { Metadata, ResolvingMetadata } from 'next';

import Container from '@/components/layout/Container';
import PageHeading from '@/components/pageHeading';

export async function generateMetadata(
  { params }: { params: { username: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const username = params.username;

  return {
    title: `Monkeys - Activity`,
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
