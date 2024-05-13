import { FC } from 'react';

import Image from 'next/image';

import IconContainer from '../icon';
import Icon from '../icon/Icon';

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
  return (
    <div className='flex flex-col gap-2 cursor-default'>
      <div className='flex items-end gap-2 justify-between mb-2'>
        <div className='rounded-lg h-32 w-32 flex items-center justify-center'>
          <Image
            src={'/profile-picture.svg'}
            alt='Coming Soon!!'
            title='Coming Soon!!'
            height={500}
            width={500}
          />
        </div>

        <div className='flex items-center gap-2'>
          <Icon
            name='RiCalendarLine'
            className='text-primary-monkeyOrange'
            size={20}
            hasHover={false}
          />
          <p className='font-josefin_Sans text-sm sm:text-base opacity-75'>
            Joined July, 2023
          </p>
        </div>
      </div>

      <div className='gap-2'>
        <div className='flex items-center gap-2'>
          <p className='font-josefin_Sans text-2xl capitalize'>{`${firstName} ${lastName}`}</p>
          <IconContainer name='RiShareLine' size={20} />
        </div>

        <p className='font-josefin_Sans opacity-75 text-sm hover:opacity-100'>{`@${username}`}</p>
      </div>

      <p className='font-jost sm:text-lg'>
        Adventure seeker, coffee lover, dreamer
      </p>
    </div>
  );
};

export default ProfileCard;
