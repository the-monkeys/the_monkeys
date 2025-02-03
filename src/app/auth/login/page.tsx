import Link from 'next/link';

import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/layout/pageHeading';
import { Button } from '@/components/ui/button';

import LoginForm from '../components/LoginForm';

export default function LoginPage() {
  return (
    <>
      <PageHeader className='mt-8'>
        <PageHeading heading='Account Login' />
        <PageSubheading subheading='Select an option to log in' />
      </PageHeader>
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

        <div className='mt-4 text-center'>
          <span className='font-dm_sans'>New to Monkeys? </span>
          <Link
            href='/auth/register'
            className='font-dm_sans hover:underline opacity-80 text-brand-orange'
          >
            Join Monkeys
          </Link>
        </div>
      </Container>
    </>
  );
}
