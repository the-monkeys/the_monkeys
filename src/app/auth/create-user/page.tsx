import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/layout/pageHeading';

import CreateUser from '../components/CreateUserForm';

export default function Create() {
  return (
    <>
      <PageHeader>
        <PageHeading heading='Join Monkeys' />
        <PageSubheading subheading='Create your Monkeys account' />
      </PageHeader>
      <Container className='max-w-screen-sm my-8 px-3 flex flex-col gap-8'>
        <CreateUser />
      </Container>
    </>
  );
}
