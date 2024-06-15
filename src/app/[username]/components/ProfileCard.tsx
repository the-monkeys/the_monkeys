'use client';

import { FC } from 'react';

import { notFound, useParams } from 'next/navigation';

import Icon from '@/components/icon';
import { ProfileCardSkeleton } from '@/components/skeletons/profileSkeleton';
import useUser from '@/hooks/useUser';
import moment from 'moment';
import { twMerge } from 'tailwind-merge';

import { useToast } from '../../../components/ui/use-toast';

const ProfileCard: FC = () => {
  const { toast } = useToast();

  const params = useParams<{ username: string }>();

  const { user, isLoading, isError } = useUser(params.username);

  if (isError) {
    notFound();
  }

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => {
          toast({
            variant: 'default',
            title: 'Username Copied',
            description: 'The username has been copied to the clipboard.',
          });
        },
        () => {
          toast({
            variant: 'error',
            title: 'Copy Failed',
            description: 'Unable to copy the username.',
          });
        }
      );
    }
  };

  if (isLoading) {
    return <ProfileCardSkeleton />;
  }

  // if (isError) {
  //   return <div>Error loading user data</div>;
  // }

  // if (!user) {
  //   return <div>No user data available</div>;
  // }

  // const { first_name, last_name, created_at } = user;

  const joinedDate = user?.created_at
    ? moment.unix(user?.created_at.seconds).format('MMMM, YYYY')
    : 'Date not available';

  return (
    <div className='space-y-2'>
      <div className='flex items-end gap-2 flex-wrap'>
        <div className='rounded-lg size-32 flex border-1 border-secondary-lightGrey/25 bg-secondary-lightGrey/15 items-center justify-center'></div>

        <div>
          <h3 className='pb-2 font-playfair_Display font-semibold text-2xl sm:text-3xl capitalize'>{`${user?.first_name} ${user?.last_name}`}</h3>

          <div
            className='hover:text-primary-monkeyOrange cursor-pointer'
            onClick={() => copyToClipboard(user?.username || '')}
          >
            <p className='font-jost text-sm sm:text-base'>{`@${user?.username}`}</p>
          </div>
        </div>
      </div>

      <p
        className={twMerge(
          'p-1 font-jost text-lg leading-tight',
          !user?.bio && 'italic'
        )}
      >
        {!user?.bio
          ? 'Your bio is empty. Write a short description to tell the world about yourself.'
          : user?.bio}
      </p>

      {user?.address && (
        <p className='flex items-center gap-2 font-jost text-secondary-darkGrey dark:text-secondary-white'>
          <span>
            <Icon name='RiMapPin' />
          </span>
          {user.address}
        </p>
      )}

      <p className='flex items-center gap-2 font-jost text-secondary-darkGrey dark:text-secondary-white'>
        <span>
          <Icon name='RiCalendar' />
        </span>
        Joined {joinedDate}
      </p>
    </div>
  );
};

export default ProfileCard;
