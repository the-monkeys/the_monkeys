'use client';

import { FC } from 'react';
import React from 'react';

import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';

import Icon from '@/components/icon';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import { ProfileCardSkeleton } from '@/components/skeletons/profileSkeleton';
import useUser from '@/hooks/useUser';
import moment from 'moment';
import { useSession } from 'next-auth/react';

const ProfileCard: FC = () => {
  const params = useParams<{ username: string }>();

  const { data, status } = useSession();

  const { user, isLoading, isError } = useUser(params.username);

  if (isError) {
    notFound();
  }

  if (isLoading) {
    return <ProfileCardSkeleton />;
  }

  const joinedDate = user?.created_at
    ? moment.unix(user?.created_at.seconds).format('MMM, YYYY')
    : 'Date not available';

  return (
    <div className='space-y-3'>
      <ProfileFrame>
        {user?.username && (
          <ProfileImage firstName={user.first_name} username={user.username} />
        )}
      </ProfileFrame>

      <div>
        <h1 className='w-full font-josefin_Sans text-2xl capitalize cursor-default'>
          {`${user?.first_name} ${user?.last_name}`}
        </h1>

        <p className='font-jost text-sm opacity-75 truncate'>{`@${user?.username}`}</p>
      </div>

      {user?.bio && (
        <p className='font-jost leading-tight cursor-default break-words'>
          {user.bio}
        </p>
      )}

      <div className='flex items-center flex-wrap gap-x-3 gap-y-1'>
        <p className='font-jost font-medium'>
          27 <span className='font-normal opacity-75'>Followers</span>
        </p>

        <p className='font-jost font-medium'>
          50 <span className='font-normal opacity-75'>Following</span>
        </p>
      </div>

      <div>
        <div className='flex items-center gap-1'>
          <Icon name='RiCalendar' size={18} className='opacity-75' />

          <p className='font-jost cursor-default opacity-75'>
            Joined {joinedDate}
          </p>
        </div>

        {user?.address && (
          <div className='flex items-center gap-1'>
            <div className='flex items-center gap-1'>
              <Icon name='RiMapPin' size={18} className='opacity-75' />

              <p className='font-jost cursor-default opacity-75'>
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

            <p className='font-jost opacity-75 hover:opacity-100'>
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

            <p className='font-jost opacity-75 hover:opacity-100'>
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

            <p className='font-jost opacity-75 hover:opacity-100'>
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

            <p className='font-jost opacity-75 hover:opacity-100'>
              {user.instagram}
            </p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
