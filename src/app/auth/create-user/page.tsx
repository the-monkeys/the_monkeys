import Container from '@/components/layout/Container';

import CreateUser from '../components/CreateUserForm';

export default function Create() {
  return (
    <>
      <div className='space-y-4 mt-8'>
        <h2 className='font-arvo text-3xl text-center'>Join Monkeys</h2>
        <p className='font-dm_sans text-sm sm:text-base opacity-80 text-center'>
          Select an option to log in
        </p>
      </div>
      <Container className='max-w-screen-sm my-8 px-3 flex flex-col gap-8'>
        <CreateUser />
      </Container>
    </>
  );
}
