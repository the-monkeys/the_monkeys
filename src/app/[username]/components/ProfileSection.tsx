'use client';

import { useEffect } from 'react';

import { useParams, useRouter } from 'next/navigation';

import Icon from '@/components/icon';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

import ProfileCard from './ProfileCard';

const ProfileSection = () => {
  const params = useParams<{ username: string }>();
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
          <Button size='icon'>
            <Icon name='RiShare' />
          </Button>
          {data?.user.user_name === params.username &&
          status === 'authenticated' ? (
            <Button size='icon'>
              <Icon name='RiEdit' />
            </Button>
          ) : (
            ''
          )}
        </div>

        <ProfileCard />
      </div>

      <div>
        <p className='font-josefin_Sans text-lg'>My topics</p>
        <p className='font-josefin_Sans text-lg'>Explore more topics</p>
      </div>
    </div>
  );
};

export default ProfileSection;
