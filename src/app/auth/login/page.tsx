import Icon from '@/components/icon';
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
      <div className='max-w-screen-sm mx-auto my-8'>
        <div className='mx-3 flex flex-col items-center gap-8'>
          <Button variant='outline' disabled className='w-full flex'>
            <Icon name='RiGoogle' type='Fill' />
            <p className='flex-1'>Coming Soon</p>
          </Button>

          <div className='flex items-center gap-2 w-full'>
            <div className='border border-foreground-light dark:border-foreground-dark w-full' />
            <p>OR</p>
            <div className='border border-foreground-light dark:border-foreground-dark w-full' />
          </div>

          <div className='w-full'>
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
}
