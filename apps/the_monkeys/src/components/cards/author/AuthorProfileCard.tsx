'use client';

import React from 'react';

import Link from 'next/link';

import { UpdateDialog } from '@/app/[username]/components/profile/UpdateDialog';
import Icon from '@/components/icon';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import { FollowButton } from '@/components/user/buttons/followButton';
import { ConnectionsDialog } from '@/components/user/dialogs/ConnectionsDialog';
import { ShareProfileDialog } from '@/components/user/dialogs/ShareProfileDialog';
import { UpdateUsernameDialog } from '@/components/user/dialogs/UpdateUsernameDialog';
import { ShowcaseProfileDialog } from '@/components/user/dialogs/showcaseProfileDialog';
import {
  GITHUB_URL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  X_URL,
} from '@/constants/social';
import useAuth from '@/hooks/auth/useAuth';
import { useGetConnectionCount } from '@/hooks/user/useUserConnections';
import { GetPublicUserProfileApiResponse } from '@/services/profile/userApiTypes';
import { Button } from '@the-monkeys/ui/atoms/button';
import moment from 'moment';

const SocialLinkButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <Button
      variant='outline'
      size='icon'
      className='!border-1 rounded-full'
      asChild
    >
      {children}
    </Button>
  );
};

export const AuthorProfileCard = ({
  paramsUser,
  user,
}: {
  paramsUser: string;
  user?: GetPublicUserProfileApiResponse;
}) => {
  const { data: session, isSuccess } = useAuth();

  const isAuthenticated = session?.username === paramsUser && isSuccess;

  const { connections, connectionsLoading, connectionsError } =
    useGetConnectionCount(user?.username);

  const joinedDate = user?.created_at
    ? moment.unix(user?.created_at.seconds).format('MMM, YYYY')
    : 'Not available';

  return (
    <div className='flex min-w-0 flex-col gap-4'>
      <div className='flex min-w-0 flex-col gap-4'>
        <div className='flex min-w-0 flex-col  gap-3  sm:text-left'>
          <div className='flex flex-row items-end gap-4'>
            <ProfileFrame className='group relative size-[88px] shrink-0 ring-2 ring-border-light/40 dark:ring-border-dark/40 sm:size-[80px]'>
              <ProfileImage username={user?.username} />
              <div className='hidden absolute inset-0 w-full h-full group-hover:flex justify-center items-center bg-black/20 backdrop-blur-sm'>
                <ShowcaseProfileDialog username={user?.username} />
              </div>
            </ProfileFrame>

            {isAuthenticated && <UpdateDialog data={session} />}
          </div>

          <div className='min-w-0 flex-1 space-y-1'>
            <div className='flex min-w-0 flex-wrap  gap-x-2 gap-y-1 '>
              <p className='max-w-full truncate px-[2px] text-sm opacity-80 sm:text-base'>
                {user?.username ? `@${user.username}` : '@user'}
              </p>

              {isAuthenticated && <UpdateUsernameDialog user={user} />}
            </div>

            <h2 className='max-w-full break-words font-dm_sans text-[1.6rem] font-medium capitalize leading-tight tracking-tight sm:text-[1.8rem]'>
              {user?.first_name} {user?.last_name ? user.last_name : ''}
            </h2>
          </div>
        </div>

        <div className='flex flex-wrap  gap-2 '>
          {!isAuthenticated && (
            <FollowButton username={user?.username} className='h-9 px-4' />
          )}

          {user?.username && (
            <ShareProfileDialog username={user.username} size={20} />
          )}
        </div>
      </div>

      <div className='flex flex-wrap  gap-x-4 gap-y-2 '>
        <div className='flex items-center gap-1 text-sm sm:text-base'>
          <p className='font-medium'>
            {connectionsLoading || connectionsError
              ? '-'
              : connections?.followers || 0}
          </p>

          {isAuthenticated ? (
            <ConnectionsDialog label='followers' />
          ) : (
            <p className='opacity-80'>Followers</p>
          )}
        </div>

        <div className='flex items-center gap-1 text-sm sm:text-base'>
          <p className='font-medium'>
            {connectionsLoading || connectionsError
              ? '-'
              : connections?.following || 0}
          </p>

          {isAuthenticated ? (
            <ConnectionsDialog label='following' />
          ) : (
            <p className='opacity-80'>Following</p>
          )}
        </div>
      </div>

      {user?.bio && (
        <p className='max-w-full break-words py-1  text-sm leading-relaxed sm:text-left'>
          {user.bio}
        </p>
      )}

      <div className='flex flex-wrap  gap-x-3 gap-y-2 sm:justify-start'>
        <div className='flex min-w-0 items-center gap-[6px]'>
          <Icon name='RiCalendar' type='Fill' className='shrink-0 opacity-90' />

          <p className='text-sm'>Joined {joinedDate}</p>
        </div>

        {user?.address && (
          <div className='flex min-w-0 items-center gap-[6px]'>
            <Icon
              name='RiMapPinUser'
              type='Fill'
              className='shrink-0 opacity-90'
            />

            <p className='min-w-0 truncate text-sm'>{user.address}</p>
          </div>
        )}
      </div>

      <div className='flex flex-wrap items-center justify-center gap-2 pt-1 sm:justify-start'>
        {user?.twitter && (
          <SocialLinkButton>
            <Link
              target='_blank'
              title='Twitter'
              href={`${X_URL}/${user.twitter}`}
              className='flex items-center gap-1'
            >
              <Icon name='RiTwitterX' type='Fill' size={18} />
            </Link>
          </SocialLinkButton>
        )}

        {user?.github && (
          <SocialLinkButton>
            <Link
              target='_blank'
              title='Github'
              href={`${GITHUB_URL}/${user.github}/`}
              className='flex items-center gap-1'
            >
              <Icon name='RiGithub' type='Fill' size={18} />
            </Link>
          </SocialLinkButton>
        )}

        {user?.linkedin && (
          <SocialLinkButton>
            <Link
              target='_blank'
              title='LinkedIn'
              href={`${LINKEDIN_URL}/${user.linkedin}`}
              className='flex items-center gap-1'
            >
              <Icon name='RiLinkedin' type='Fill' size={18} />
            </Link>
          </SocialLinkButton>
        )}

        {user?.instagram && (
          <SocialLinkButton>
            <Link
              target='_blank'
              title='Instagram'
              href={`${INSTAGRAM_URL}/${user.instagram}/`}
              className='flex items-center gap-1'
            >
              <Icon name='RiInstagram' type='Fill' size={18} />
            </Link>
          </SocialLinkButton>
        )}
      </div>
    </div>
  );
};
