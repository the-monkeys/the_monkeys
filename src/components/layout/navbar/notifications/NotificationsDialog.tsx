import React, { FC, SetStateAction } from 'react';

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
      className='pt-4 absolute top-full right-0 w-96'
      onMouseLeave={() => setNotifications(false)}
    >
      <div className='flex flex-col overflow-hidden rounded-lg border-1 border-secondary-lightGrey/25 bg-primary-monkeyWhite dark:bg-primary-monkeyBlack drop-shadow-lg'>
        <h1 className='p-4 font-josefin_Sans text-xl'>Notifications</h1>

        <NotificationTabs />

        <NotificationContent />

        <LinksRedirectArrow
          target='/notifications'
          title='See all notifications'
          className='self-center py-2'
        />
      </div>
    </div>
  );
};

export default NotificationsDialog;
