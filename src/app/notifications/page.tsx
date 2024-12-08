'use client';

import { Loader } from '@/components/loader';
import { useGetAllNotifications } from '@/hooks/notification/useGetAllNotifications';

import { NotificationCard } from './components/NotificationCard';

const NotificationsPage = () => {
  const { notifications, isLoading, isError } = useGetAllNotifications();

  if (isLoading) {
    return (
      <div className='flex flex-col items-center space-y-2'>
        <Loader />
        <p className='font-roboto opacity-80'>Fetching notifications</p>
      </div>
    );
  }

  if (isError) {
    return (
      <p className='mb-4 font-roboto text-sm text-center opacity-80'>
        Notifications info not available.
      </p>
    );
  }

  return (
    <div className='mx-auto w-full sm:w-4/5 md:w-3/5 px-4 space-y-2'>
      {notifications?.notifications.notification.length ? (
        notifications?.notifications.notification.map((notificationItem) => {
          return (
            <NotificationCard
              key={notificationItem.id}
              notificationData={notificationItem}
            />
          );
        })
      ) : (
        <p className='col-span-2 sm:col-span-3 font-roboto text-center opacity-80'>
          No notifications yet.
        </p>
      )}
    </div>
  );
};

export default NotificationsPage;
