'use client';

import { useEffect } from 'react';

import ProfileCard from '@/components/cards/ProfileCard';
import { useSession } from 'next-auth/react';

const ProfileSection = () => {
  const { data, status } = useSession();

  useEffect(() => {
    // console.log(data);
  }, [status]);

  return (
    <div className='px-5 py-4 flex flex-col sm:flex-row lg:flex-col gap-4'>
      <div className='flex flex-col gap-2'>
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
