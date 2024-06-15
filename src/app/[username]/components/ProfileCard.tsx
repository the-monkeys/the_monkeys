'use client';

import { FC } from 'react';

import Icon from '@/components/icon';
import { twMerge } from 'tailwind-merge';

import { useToast } from '../../../components/ui/use-toast';

type ProfileCardProps = {
  imageUrl?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  joinedOn?: string;
};

const ProfileCard: FC<ProfileCardProps> = ({
  imageUrl,
  firstName,
  lastName,
  username,
  bio,
  joinedOn,
}) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => {
          toast({
            variant: 'default',
            title: 'Username Copied',
            description: 'Your username has been copied to the clipboard.',
          });
        },
        (err) => {
          toast({
            variant: 'error',
            title: 'Copy Failed',
            description: 'Unable to copy the username.',
          });
        }
      );
    }
  };

  return (
    <div className='group space-y-2 cursor-default'>
      <div className='flex items-end gap-2 flex-wrap'>
        <div className='rounded-lg h-32 w-32 flex border-1 border-secondary-lightGrey/25 bg-secondary-lightGrey/15 items-center justify-center'></div>

        <div className='space-y-2'>
          <p className='font-playfair_Display font-medium text-2xl sm:text-3xl capitalize'>{`${firstName} ${lastName}`}</p>

          <div
            className='hover:text-primary-monkeyOrange cursor-pointer'
            onClick={() => copyToClipboard(username || '')}
          >
            <p className='font-jost text-sm sm:text-base'>{`@${username}`}</p>
          </div>
        </div>
      </div>

      <p
        className={twMerge(
          'py-2 font-jost text-secondary-darkGrey dark:text-secondary-white',
          !bio && 'italic'
        )}
      >
        {!bio
          ? 'Your bio is empty. Write a short description to tell the world about yourself.'
          : bio}
      </p>

      <div className='flex items-center'>
        <Icon name='RiMapPin' className='mr-2' />

        <p className='font-jost text-base text-secondary-darkGrey/75 dark:text-secondary-white/75'>
          Delhi, India
        </p>
      </div>

      <div className='flex items-center'>
        <Icon name='RiCake2' className='mr-2' />

        <p className='font-jost text-secondary-darkGrey/75 dark:text-secondary-white/75'>
          May 13, 2024
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;
