import Link from 'next/link';

import { LOGIN_ROUTE } from '@/constants/routeConstants';

const LoginButton = () => {
  return (
    <Link
      href={`${LOGIN_ROUTE}`}
      title='Login to Monkeys'
      className='px-4 py-1 text-text-dark dark:text-text-light bg-background-dark dark:bg-background-light rounded-full hover:opacity-85 transition-colors'
    >
      <p className='font-dm_sans font-medium'>Login</p>
    </Link>
  );
};

export default LoginButton;
