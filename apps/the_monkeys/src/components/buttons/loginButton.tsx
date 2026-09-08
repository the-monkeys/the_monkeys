'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { loginHref } from '@/lib/authRedirect';

const LoginButton = () => {
  const pathname = usePathname();

  return (
    <Link
      href={loginHref(pathname)}
      title='Login to Monkeys'
      className='h-9 flex items-center px-4 py-1 text-text-dark dark:text-text-light bg-background-dark dark:bg-background-light rounded-full hover:bg-background-dark/80 dark:hover:bg-background-light/80'
    >
      <p className='font-dm_sans font-medium'>Log in</p>
    </Link>
  );
};

export default LoginButton;
