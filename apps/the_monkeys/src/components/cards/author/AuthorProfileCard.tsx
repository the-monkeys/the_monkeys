'use client';

import React from 'react';

import Link from 'next/link';

import Icon from '@/components/icon';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import { ConnectionsDialog } from '@/components/user/dialogs/ConnectionsDialog';
import { UpdateUsernameDialog } from '@/components/user/dialogs/UpdateUsernameDialog';
import { ShowcaseProfileDialog } from '@/components/user/dialogs/showcaseProfileDialog';
import {
  GITHUB_URL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  X_URL,
} from '@/constants/social';
import { useGetConnectionCount } from '@/hooks/user/useUserConnections';
import { GetPublicUserProfileApiResponse } from '@/services/profile/userApiTypes';
import { Button } from '@the-monkeys/ui/atoms/button';
import moment from 'moment';

const SocialLinkButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <Button
      variant='outline'
      size='icon'
      className='mt-3 !border-1 rounded-full'
      asChild
    >
      {children}
    </Button>
  );
};

export const AuthorProfileCard = ({
  isAuthenticated,
  user,
}: {
  isAuthenticated: boolean;
  user?: GetPublicUserProfileApiResponse;
}) => {
  const { connections, connectionsLoading, connectionsError } =
    useGetConnectionCount(user?.username);

  const joinedDate = user?.created_at
    ? moment.unix(user?.created_at.seconds).format('MMM, YYYY')
    : 'Not available';

  return (
    <div className='flex flex-col gap-[10px]'>
      <div className='flex items-end gap-3 flex-wrap'>
        <ProfileFrame className='group relative size-[80px] md:size-[100px] ring-2 ring-border-light/40 dark:ring-border-dark/40'>
          <ProfileImage username={user?.username} />
          <div className='hidden absolute inset-0 w-full h-full group-hover:flex justify-center items-center bg-black/20 backdrop-blur-sm'>
            <ShowcaseProfileDialog username={user?.username} />
          </div>
        </ProfileFrame>

        <div className='space-y-1'>
          <div className='flex item-center gap-[2px] md:gap-[6px]'>
            <p className='px-[2px] truncate'>{`@${user?.username}`}</p>

            {isAuthenticated && <UpdateUsernameDialog user={user} />}
          </div>

          <h2 className='w-fit font-dm_sans font-medium text-[26px] md:text-3xl tracking-tight capitalize'>
            {user?.first_name} {user?.last_name ? user?.last_name : ''}
          </h2>
        </div>
      </div>

      <div className='flex items-center gap-3'>
        <div className='flex items-center gap-1'>
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

        <div className='flex items-center gap-1'>
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

      {user?.bio && <p className='py-1 break-words'>{user.bio}</p>}

      <div className='flex items-center gap-x-3 gap-y-2 flex-wrap'>
        <div className='flex items-center gap-[6px]'>
          <Icon name='RiCalendar' type='Fill' className='opacity-90' />

          <p className='text-sm'>Joined {joinedDate}</p>
        </div>

        {user?.address && (
          <div className='flex items-center gap-[6px]'>
            <Icon name='RiMapPinUser' type='Fill' className='opacity-90' />

            <p className='text-sm'>{user.address}</p>
          </div>
        )}
      </div>

      <div className='flex items-center flex-wrap gap-2'>
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
