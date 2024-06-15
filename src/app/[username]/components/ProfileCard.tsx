'use client';

import { FC } from 'react';

import { notFound, useParams } from 'next/navigation';

import Icon from '@/components/icon';
import { Skeleton } from '@/components/ui/skeleton';
import useUser from '@/hooks/useUser';
import moment from 'moment';

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
            description: 'Username copied to clipboard.',
          });
        },
        () => {
          toast({
            variant: 'error',
            title: 'Error',
            description: 'Failed to copy username.',
          });
        }
      );
    }
  };

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

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
    <div className='group flex flex-col cursor-default'>
      <div className='flex items-end gap-2 justify-between flex-wrap'>
        <div className='rounded-lg h-32 w-32 flex border-1 border-secondary-lightGrey/25 items-center justify-center'>
          <p className='text-center font-jost'>
            Not
            <br />
            Available
          </p>
        </div>

        <div className='flex items-center'>
          <Icon name='RiCalendar' size={16} className='mx-1' />
          {isLoading ? (
            <Skeleton className='h-4 w-[250px] ' />
          ) : (
            <p className='font-josefin_Sans text-sm sm:text-base'>
              Joined {joinedDate}
            </p>
          )}
        </div>
      </div>

      <div className='my-4 gap-2'>
        {isLoading ? (
          <Skeleton className='h-4 w-[250px] ' />
        ) : (
          <p className='font-playfair_Display font-bold text-3xl capitalize'>{`${user?.first_name} ${user?.last_name}`}</p>
        )}

        <div className='flex items-center gap-2'>
          {isLoading ? (
            <Skeleton className='h-4 w-[250px] mt-2' />
          ) : (
            <p className='font-jost text-primary-monkeyOrange'>{`@${user?.username}`}</p>
          )}
          <div onClick={() => copyToClipboard(user?.username || '')}>
            <Icon name='RiFileCopy' size={16} />
          </div>
        </div>
      </div>

      <p className='font-jost opacity-75 italic'>
        Your bio is empty. Write a short description to tell the world about
        yourself.
      </p>
    </div>
  );
};

export default ProfileCard;
