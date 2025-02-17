'use client';

import React from 'react';

import { useParams } from 'next/navigation';

import { ProfileCardSkeleton } from '@/components/skeletons/profileSkeleton';
import { FollowButton } from '@/components/user/buttons/followButton';
import { ProfileCard } from '@/components/user/cards/ProfileCard';
import { ShareProfileDialog } from '@/components/user/dialogs/ShareProfileDialog';
import useAuth from '@/hooks/auth/useAuth';
import useUser from '@/hooks/user/useUser';

import UserNotFound from '../../UserNotFound';
import { ProfileActionsDropdown } from './ProfileActionsDropdown';
import { TopicsCard } from './TopicsCard';
import { UpdateDialog } from './UpdateDialog';

export const ProfileSection = () => {
  const params = useParams<{ username: string }>();
  const { data: session, isSuccess } = useAuth();

  const { user, isLoading, isError } = useUser(params.username);

  if (isError) {
    return <UserNotFound />;
  }

  if (isLoading) {
    return <ProfileCardSkeleton />;
  }

  const isAuthenticated = session?.username === params.username && isSuccess;

  return (
    <>
      <div className='mb-3 flex gap-2 items-center justify-end'>
        {params.username !== session?.username && isSuccess && (
          <FollowButton username={params.username} />
        )}

        {isAuthenticated && <UpdateDialog data={session} />}

        <ShareProfileDialog username={params.username} size={20} />

        {/* <ProfileActionsDropdown username={params.username} /> */}
      </div>

      <ProfileCard isAuthenticated={isAuthenticated} user={user} />

      <TopicsCard />
    </>
  );
};
