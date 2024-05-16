'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import CircularButton from '@/components/button/CircularButton';
import { useSession } from 'next-auth/react';

import ProfileCard from './ProfileCard';

const ProfileSection = () => {
  const router = useRouter();
  const { data, status } = useSession();
  // if (status === 'unauthenticated') {
  //   router.push('/login');
  // }
  useEffect(() => {
    // console.log(data);
  }, [status]);

  return (
    <div className='px-5 py-4 flex flex-col sm:flex-row lg:flex-col gap-4'>
      <div className='flex flex-col gap-2'>
        <div className='flex gap-2 items-center justify-center'>
          <CircularButton title='Share Profile' iconName='RiShareLine' />
          <CircularButton title='Edit Profile' iconName='RiEditLine' />
        </div>

        <ProfileCard
          firstName={data?.user.first_name}
          lastName={data?.user.last_name}
          username={data?.user.user_name}
        />
      </div>

      <div>
        <p className='font-josefin_Sans text-lg'>My topics</p>
        <p className='font-josefin_Sans text-lg'>Explore more topics</p>
      </div>
    </div>
  );
};

export default ProfileSection;
