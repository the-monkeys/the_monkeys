import Link from 'next/link';

import { Button } from '@/components/ui/button';

const Password = () => {
  return (
    <div className='flex flex-col items-start'>
      <h4 className='font-josefin_Sans text-lg'>Reset Password</h4>

      <p className='font-jost text-sm opacity-75'>
        Update your password to restore access and protect your account.
      </p>

      <Button size='lg' variant='secondary' className='mt-4' asChild>
        <Link href='/auth/reset-password'>Reset Password</Link>
      </Button>
    </div>
  );
};

export default Password;
