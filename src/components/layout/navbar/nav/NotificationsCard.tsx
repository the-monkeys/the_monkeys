import Button from '@/components/button';
import React, { FC, SetStateAction } from 'react';
import NavTabs from './NavTabs';
import NavContent from './NavContent';

type NotificationsCardProps = {
  setNotifications: React.Dispatch<SetStateAction<boolean>>;
};

const NotificationsCard: FC<NotificationsCardProps> = ({
  setNotifications,
}) => {
  return (
    <div
      className='absolute right-0 top-8 flex h-fit max-h-[80vh] w-72 flex-col overflow-hidden rounded-lg border-1 border-secondary-lightGrey/25 bg-primary-monkeyWhite pb-4 dark:bg-primary-monkeyBlack md:w-96'
      onMouseEnter={() => setNotifications(true)}
      onMouseLeave={() => setNotifications(false)}
    >
      <h1 className='mb-2 border-b-1 border-secondary-lightGrey/25 p-4 font-josefin_Sans text-xl'>
        Notifications
      </h1>
      <NavTabs />
      <NavContent />
      <Button
        variant='ghost'
        title='See all notifications'
        endIcon
        iconName='RiArrowRightUpLine'
        className='w-fit self-center'
      />
    </div>
  );
};

export default NotificationsCard;
