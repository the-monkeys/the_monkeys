'use client';

import React from 'react';

import { useParams } from 'next/navigation';

import { FollowButton } from '@/components/user/buttons/followButton';
import { ProfileCard } from '@/components/user/cards/ProfileCard';
import { useSession } from 'next-auth/react';

import { ProfileActionsDropdown } from './ProfileActionsDropdown';
import { TopicsCard } from './TopicsCard';
import { UpdateDialog } from './UpdateDialog';

export const ProfileSection = () => {
  const params = useParams<{ username: string }>();

  const { data: session, status } = useSession();

  const isAuthenticated =
    session?.user.username === params.username && status === 'authenticated';

  return (
    <>
      <div className='mb-2 flex gap-1 items-center justify-end'>
        <ProfileActionsDropdown username={params.username} />

        {params.username !== session?.user.username &&
          status === 'authenticated' && (
            <FollowButton username={params.username} />
          )}

        {isAuthenticated && <UpdateDialog />}
      </div>

      <ProfileCard isAuthenticated={isAuthenticated} />

      <TopicsCard />
    </>
  );
};
