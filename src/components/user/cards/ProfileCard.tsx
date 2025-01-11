'use client';

import React from 'react';

import Link from 'next/link';

import Icon from '@/components/icon';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import {
  GITHUB_URL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  X_URL,
} from '@/constants/social';
import { useGetConnectionCount } from '@/hooks/user/useUserConnections';
import { GetPublicUserProfileApiResponse } from '@/services/profile/userApiTypes';
import moment from 'moment';

import { ConnectionsDialog } from '../dialogs/ConnectionsDialog';
import { UpdateUsernameDialog } from '../dialogs/UpdateUsernameDialog';

export const ProfileCard = ({
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
    <div className='mt-2 space-y-2'>
      <ProfileFrame className='size-[80px] md:size-[100px]'>
        <ProfileImage username={user?.username} />
      </ProfileFrame>

      <div>
        <h2 className='w-full font-dm_sans font-medium text-xl md:text-2xl capitalize'>
          {`${user?.first_name} ${user?.last_name}`}
        </h2>

        <div className='flex item-center gap-1'>
          <p className='font-dm_sans text-xs sm:text-sm opacity-80 truncate'>
            {`@${user?.username}`}
          </p>

          {isAuthenticated && <UpdateUsernameDialog />}
        </div>
      </div>

      {user?.bio && (
        <p className='py-1 text-base leading-tight break-words'>{user.bio}</p>
      )}

      <div className='mb-4 flex items-center flex-wrap gap-x-2'>
        <p>
          {connectionsLoading || connectionsError
            ? '-'
            : connections?.followers || 0}{' '}
          {isAuthenticated ? (
            <ConnectionsDialog label='followers' />
          ) : (
            <span className='text-sm opacity-80'>Followers</span>
          )}
        </p>

        <p>
          {connectionsLoading || connectionsError
            ? '-'
            : connections?.following || 0}{' '}
          {isAuthenticated ? (
            <ConnectionsDialog label='following' />
          ) : (
            <span className='text-sm opacity-80'>Following</span>
          )}
        </p>
      </div>

      <div className='flex items-center flex-wrap gap-x-2 gap-y-1'>
        <div className='flex items-center gap-1'>
          <Icon name='RiCalendar' size={16} className='opacity-80' />

          <p className='text-sm opacity-80'>Joined {joinedDate}</p>
        </div>

        {user?.address && (
          <div className='flex items-center gap-1'>
            <div className='flex items-center gap-1'>
              <Icon name='RiMapPinUser' size={16} className='opacity-80' />

              <p className='text-sm opacity-80'>{user.address}</p>
            </div>
          </div>
        )}
      </div>

      <div className='flex items-center flex-wrap gap-x-2 gap-y-1'>
        {user?.twitter && (
          <Link
            target='_blank'
            title='Twitter'
            href={`${X_URL}/${user.twitter}`}
            className='flex items-center gap-1'
          >
            <Icon
              name='RiTwitterX'
              type='Fill'
              size={18}
              className='opacity-80'
            />

            <p className='text-sm opacity-80 hover:opacity-100 hover:underline'>
              {user.twitter}
            </p>
          </Link>
        )}

        {user?.github && (
          <Link
            target='_blank'
            title='Twitter'
            href={`${GITHUB_URL}/${user.github}/`}
            className='flex items-center gap-1'
          >
            <Icon
              name='RiGithub'
              type='Fill'
              size={18}
              className='opacity-80'
            />

            <p className='text-sm opacity-80 hover:opacity-100 hover:underline'>
              {user.github}
            </p>
          </Link>
        )}

        {user?.linkedin && (
          <Link
            target='_blank'
            title='Twitter'
            href={`${LINKEDIN_URL}/${user.linkedin}`}
            className='flex items-center gap-1'
          >
            <Icon
              name='RiLinkedin'
              type='Fill'
              size={18}
              className='opacity-80'
            />

            <p className='text-sm opacity-80 hover:opacity-100 hover:underline'>
              {user.linkedin}
            </p>
          </Link>
        )}

        {user?.instagram && (
          <Link
            target='_blank'
            title='Twitter'
            href={`${INSTAGRAM_URL}/${user.instagram}/`}
            className='flex items-center gap-1'
          >
            <Icon
              name='RiInstagram'
              type='Fill'
              size={18}
              className='opacity-80'
            />

            <p className='text-sm opacity-80 hover:opacity-100 hover:underline'>
              {user.instagram}
            </p>
          </Link>
        )}
      </div>
    </div>
  );
};
