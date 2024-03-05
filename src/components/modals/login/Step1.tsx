import Button from '@/components/button';
import ModalContent from '../layout/ModalContent';
import Link from 'next/link';

const Step1 = () => {
  return (
    <ModalContent className='flex flex-col justify-center gap-2'>
      <div className='px-4'>
        <Button
          className='w-full'
          title='Login with Google'
          variant='shallow'
          startIcon
          iconName='RiGoogleFill'
        />

        <div className='flex items-center justify-center py-2'>
          <div className='w-12 border-b-1 border-secondary-lightGrey/25'></div>
          <p className='px-2 text-center font-josefin_Sans text-sm'>Or</p>
          <div className='w-12 border-b-1 border-secondary-lightGrey/25'></div>
        </div>

        <Button
          className='w-full'
          title='Login with Email'
          variant='primary'
          startIcon
          iconName='RiMailFill'
        />
      </div>
      <p className='text-center font-jost text-sm'>
        Don't have an account?
        <Link className='text-primary-monkeyOrange' href='#'>
          {' '}
          Join Monkeys
        </Link>
      </p>
    </ModalContent>
  );
};

export default Step1;
