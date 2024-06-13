'use client';

import { FC } from 'react';

import Icon from '@/components/icon';

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
            description: 'Username copied to clipboard.',
          });
        },
        (err) => {
          toast({
            variant: 'error',
            title: 'Error',
            description: 'Failed to copy username.',
          });
        }
      );
    }
  };

  return (
    <div className='group flex flex-col cursor-default'>
      <div className='flex items-end gap-2 justify-between flex-wrap'>
        <div className='rounded-lg h-32 w-32 flex border-1 border-secondary-lightGrey/25 items-center justify-center'>
          {!imageUrl ? (
            <p className='text-center font-jost'>
              Not
              <br />
              Available
            </p>
          ) : (
            ''
          )}
        </div>

        <div className='flex items-center'>
          <Icon name='RiCalendar2' size={16} className='mx-1' />
          <p className='font-josefin_Sans text-sm sm:text-base'>
            Joined July, 2023
          </p>
        </div>
      </div>

      <div className='my-4 gap-2'>
        <p className='font-playfair_Display font-bold text-3xl capitalize'>{`${firstName} ${lastName}`}</p>

        <div className='flex items-center gap-2'>
          <p className='font-jost text-primary-monkeyOrange'>{`@${username}`}</p>
          <div onClick={() => copyToClipboard(username || '')}>
            <Icon name='RiFileCopy' size={16} />
          </div>
        </div>
      </div>

      {!bio ? (
        <p className='font-jost opacity-75 italic'>
          Your bio is empty. Write a short description to tell the world about
          yourself.
        </p>
      ) : (
        <p className='font-jost text-secondary-darkGrey dark:text-secondary-white'>
          {bio}
        </p>
      )}
    </div>
  );
};

export default ProfileCard;
