'use client';

import React from 'react';

import { useParams } from 'next/navigation';

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
        <div className='pt-4'>
          <UpdateDialog />
        </div>
      )}

      <TopicsCard />
    </div>
  );
};
