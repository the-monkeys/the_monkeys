import Link from 'next/link';

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
      <PageHeader className='mt-8'>
        <PageHeading heading='Join Monkeys' />
        <PageSubheading subheading='Create your Monkeys account' />
      </PageHeader>
      <Container className='max-w-screen-sm my-8 px-3 flex flex-col gap-8'>
        <CreateUser />
        <div className='mt-4 text-center'>
          <span className='font-dm_sans'>Already have an account? </span>
          <Link
            href='/auth/login'
            className='font-dm_sans hover:underline opacity-80 text-brand-orange'
          >
            Login instead
          </Link>
        </div>
      </Container>
    </>
  );
}
