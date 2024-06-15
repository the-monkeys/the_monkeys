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
    <div className='space-y-2'>
      <div className='flex space-x-2 justify-end'>
        <Button variant='secondary' size='icon'>
          <Icon name='RiShare' />
        </Button>

        {data?.user.user_name === params.username &&
        status === 'authenticated' ? (
          <Button variant='destructive' size='icon'>
            <Icon name='RiEdit' />
          </Button>
        ) : (
          ''
        )}
      </div>

      <ProfileCard
        firstName={data?.user.first_name}
        lastName={data?.user.last_name}
        username={data?.user.user_name}
      />
    </div>
  );
};

export default ProfileSection;
