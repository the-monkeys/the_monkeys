import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';

import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <>
      <div className='space-y-4 mt-8'>
        <h2 className='font-arvo text-3xl text-center'>Account Login</h2>
        <p className='font-dm_sans text-sm sm:text-base opacity-80 text-center'>
          Select an option to log in
        </p>
      </div>
      <Container className='max-w-screen-sm my-8 px-3 flex flex-col gap-8'>
        <Button variant='outline' disabled className='w-full flex'>
          <Icon name='RiGoogle' type='Fill' />
          <p className='flex-1'>Coming Soon</p>
        </Button>

        <div className='flex items-center gap-2 w-full'>
          <div className='border border-foreground-light dark:border-foreground-dark w-full' />
          <p>OR</p>
          <div className='border border-foreground-light dark:border-foreground-dark w-full' />
        </div>

        <LoginForm />
      </Container>
    </>
  );
}
