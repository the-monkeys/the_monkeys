'use client';

import React from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import Icon from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FollowButton } from '@/components/user/buttons/followButton';
import { useSession } from 'next-auth/react';

import { ProfileActionsDropdown } from './ProfileActionsDropdown';
import { ProfileCard } from './ProfileCard';
import { TopicsCard } from './TopicsCard';
import { UpdateDialog } from './UpdateDialog';

export const ProfileSection = () => {
  const params = useParams<{ username: string }>();

  const { data, status } = useSession();

  const isAuthenticated =
    data?.user.username === params.username && status === 'authenticated';

  return (
    <div>
      <div className='flex gap-1 items-center justify-end'>
        <ProfileActionsDropdown username={params.username} />

        <FollowButton username={params.username} />
      </div>

      <ProfileCard isAuthenticated={isAuthenticated} />

      {isAuthenticated && (
        <div className='pt-4 flex gap-1'>
          <UpdateDialog />

          <Button variant='outline' className='flex-1 rounded-full' asChild>
            <Link href={`/activity?user=${params.username}`}>
              Activity
              <Icon name='RiArrowRightUp' className='ml-1' />
            </Link>
          </Button>
        </div>
      )}

      <Separator className='mt-2 mb-3' />

      <TopicsCard />
    </div>
  );
};
