'use client';

import React from 'react';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';

import Icon from '@/components/icon';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import { ProfileCardSkeleton } from '@/components/skeletons/profileSkeleton';
import {
  GITHUB_URL,
  INSTAGRAM_URL,
  LINKEDIN_URL,
  X_URL,
} from '@/constants/social';
import useUser from '@/hooks/user/useUser';
import { useGetConnectionCount } from '@/hooks/user/useUserConnections';
import moment from 'moment';

import { ConnectionsDialog } from './ConnectionsDialog';
import { UpdateUsernameDialog } from './UpdateUsernameDialog';

export const ProfileCard = ({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) => {
  const params = useParams<{ username: string }>();

  const { user, isLoading, isError } = useUser(params.username);
  const { connections, connectionsLoading, connectionsError } =
    useGetConnectionCount(params.username);

  if (isError) {
    notFound();
  }

  if (isLoading) {
    return <ProfileCardSkeleton />;
  }

  const joinedDate = user?.created_at
    ? moment.unix(user?.created_at.seconds).format('MMM, YYYY')
    : 'Not available';

  return (
    <div className='space-y-2'>
      <ProfileFrame className='size-[100px] md:size-[120px]'>
        {user?.username && (
          <ProfileImage firstName={user.first_name} username={user.username} />
        )}
      </ProfileFrame>

      <div>
        <h2 className='w-full font-roboto text-xl md:text-2xl capitalize'>
          {`${user?.first_name} ${user?.last_name}`}
        </h2>

        <div className='flex item-center gap-1'>
          <p className='font-roboto text-sm opacity-80 truncate'>
            {`@${user?.username}`}
          </p>

          {isAuthenticated && <UpdateUsernameDialog />}
        </div>
      </div>

      {user?.bio && (
        <p className='py-2 font-roboto leading-tight break-words'>{user.bio}</p>
      )}

      <div className='flex items-center flex-wrap gap-x-2'>
        <Icon name='RiGroup' size={18} className='opacity-80' />

        <p className='font-roboto text-sm md:text-base'>
          {connectionsLoading || connectionsError
            ? '-'
            : connections?.followers || 0}{' '}
          {isAuthenticated ? (
            <ConnectionsDialog label='followers' />
          ) : (
            <span className='inline opacity-80'>followers</span>
          )}
        </p>

        <p className='font-roboto text-sm md:text-base'>
          {connectionsLoading || connectionsError
            ? '-'
            : connections?.following || 0}{' '}
          {isAuthenticated ? (
            <ConnectionsDialog label='following' />
          ) : (
            <span className='inline opacity-80'>following</span>
          )}
        </p>
      </div>

      <div>
        <div className='flex items-center gap-1'>
          <Icon name='RiCalendar' size={18} className='opacity-80' />

          <p className='font-roboto text-sm opacity-80'>Joined {joinedDate}</p>
        </div>

        {user?.address && (
          <div className='flex items-center gap-1'>
            <div className='flex items-center gap-1'>
              <Icon name='RiMapPin' size={18} className='opacity-80' />

              <p className='font-roboto text-sm opacity-80'>{user.address}</p>
            </div>
          </div>
        )}
      </div>

      <div className='flex items-center flex-wrap gap-x-3 gap-y-1'>
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

            <p className='font-roboto text-sm opacity-80 hover:opacity-100 hover:underline'>
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

            <p className='font-roboto text-sm opacity-80 hover:opacity-100 hover:underline'>
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

            <p className='font-roboto text-sm opacity-80 hover:opacity-100 hover:underline'>
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

            <p className='font-roboto text-sm opacity-80 hover:opacity-100 hover:underline'>
              {user.instagram}
            </p>
          </Link>
        )}
      </div>
    </div>
  );
};
