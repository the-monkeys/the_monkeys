import Link from 'next/link';

import { LOGIN_ROUTE } from '@/constants/routeConstants';
import { Button } from '@the-monkeys/ui/atoms/button';

import Icon from '../icon';

const LoginButton = () => {
  return (
    <Button className='px-2 rounded-full md:rounded-md' asChild>
      <Link href={`${LOGIN_ROUTE}`} title='Login to Monkeys'>
        <Icon name='RiLoginBox' className='block md:hidden lg:block' />

        <p className='hidden md:block px-1 font-dm_sans'>Login</p>
      </Link>
    </Button>
  );
};

export default LoginButton;
