import React, { FC, SetStateAction } from 'react';

import Link from 'next/link';

import Button from '@/components/button';
import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';

import NotificationContent from './NotificationContent';
import NotificationTabs from './NotificationTabs';

type NotificationsDialogProps = {
  setNotifications: React.Dispatch<SetStateAction<boolean>>;
};

const NotificationsDialog: FC<NotificationsDialogProps> = ({
  setNotifications,
}) => {
  return (
    <div
      className='absolute right-0 top-8 flex w-96 flex-col overflow-hidden rounded-lg border-1 border-secondary-lightGrey/25 bg-primary-monkeyWhite dark:bg-primary-monkeyBlack'
      onMouseEnter={() => setNotifications(true)}
      onMouseLeave={() => setNotifications(false)}
    >
      <h1 className='p-4 font-josefin_Sans text-xl'>Notifications</h1>

      <NotificationTabs />

      <NotificationContent />

      <LinksRedirectArrow
        target='/notifications'
        title='See all notifications'
        className='self-center py-2'
      />
    </div>
  );
};

export default NotificationsDialog;
