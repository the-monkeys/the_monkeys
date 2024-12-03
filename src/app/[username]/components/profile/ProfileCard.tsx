'use client';

import React from 'react';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';

import Icon from '@/components/icon';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import { ProfileCardSkeleton } from '@/components/skeletons/profileSkeleton';
import useUser from '@/hooks/user/useUser';
import { useGetConnectionCount } from '@/hooks/user/useUserConnections';
import moment from 'moment';
import { Session } from 'next-auth';

import { ConnectionsDialog } from './ConnectionsDialog';

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
      <ProfileFrame className='size-28 sm:size-32'>
        {user?.username && (
          <ProfileImage firstName={user.first_name} username={user.username} />
        )}
      </ProfileFrame>

      <div>
        <h2 className='w-full font-roboto font-medium text-xl md:text-2xl capitalize'>
          {`${user?.first_name} ${user?.last_name}`}
        </h2>

        <p className='font-roboto text-sm opacity-80 truncate'>{`@${user?.username}`}</p>
      </div>

      <div className='flex items-center flex-wrap gap-x-2'>
        <p className='font-roboto font-medium'>
          {connectionsError ? 'NA' : connections?.followers || 0}{' '}
          {isAuthenticated ? (
            <ConnectionsDialog label='Followers' />
          ) : (
            <p className='inline font-roboto text-sm font-light opacity-80'>
              Followers
            </p>
          )}
        </p>

        <p className='font-roboto font-medium'>
          {connectionsError ? 'NA' : connections?.following || 0}{' '}
          {isAuthenticated ? (
            <ConnectionsDialog label='Following' />
          ) : (
            <p className='inline font-roboto text-sm font-light opacity-80'>
              Following
            </p>
          )}
        </p>
      </div>

      {user?.bio && (
        <p className='py-1 font-roboto leading-tight break-words'>{user.bio}</p>
      )}

      <div>
        <div className='flex items-center gap-1'>
          <Icon name='RiCalendar' size={18} className='opacity-75' />

          <p className='font-roboto text-sm cursor-default opacity-80'>
            Joined {joinedDate}
          </p>
        </div>

        {user?.address && (
          <div className='flex items-center gap-1'>
            <div className='flex items-center gap-1'>
              <Icon name='RiMapPin' size={18} className='opacity-75' />

              <p className='font-roboto text-sm cursor-default opacity-80'>
                {user.address}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className='flex items-center flex-wrap gap-x-3 gap-y-1'>
        {user?.twitter && (
          <Link
            target='_blank'
            title='Twitter'
            href={`https://x.com/${user.twitter}`}
            className='flex items-center gap-1'
          >
            <Icon name='RiTwitterX' type='Fill' size={18} />

            <p className='font-roboto opacity-80 hover:opacity-100'>
              {user.twitter}
            </p>
          </Link>
        )}

        {user?.github && (
          <Link
            target='_blank'
            title='Twitter'
            href={`https://github.com/${user.github}/`}
            className='flex items-center gap-1'
          >
            <Icon name='RiGithub' type='Fill' size={18} />

            <p className='font-roboto opacity-80 hover:opacity-100'>
              {user.github}
            </p>
          </Link>
        )}

        {user?.linkedin && (
          <Link
            target='_blank'
            title='Twitter'
            href={`https://www.linkedin.com/in/${user.linkedin}`}
            className='flex items-center gap-1'
          >
            <Icon name='RiLinkedin' type='Fill' size={18} />

            <p className='font-roboto opacity-80 hover:opacity-100'>
              {user.linkedin}
            </p>
          </Link>
        )}

        {user?.instagram && (
          <Link
            target='_blank'
            title='Twitter'
            href={`https://www.instagram.com/${user.instagram}/`}
            className='flex items-center gap-1'
          >
            <Icon name='RiInstagram' type='Fill' size={18} />

            <p className='font-roboto opacity-80 hover:opacity-100'>
              {user.instagram}
            </p>
          </Link>
        )}
      </div>
    </div>
  );
};
