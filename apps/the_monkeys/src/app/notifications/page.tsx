'use client';

import { Loader } from '@/components/loader';
import { useGetAllNotifications } from '@/hooks/notification/useGetAllNotifications';

import { MarkReadButton } from './components/MarkReadButton';
import { NotificationCard } from './components/NotificationCard';

const NotificationsPage = () => {
  const { notifications, isLoading, isError } = useGetAllNotifications();

  if (isLoading) {
    return (
      <div className='flex flex-col items-center space-y-2'>
        <Loader />
        <p className='text-sm text-center opacity-80'>
          Fetching your notifications...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <p className='text-sm text-center opacity-80'>No notifications yet.</p>
    );
  }

  return (
    <div className='mx-auto w-full max-w-2xl px-4 flex flex-col space-y-4'>
      <div className='flex justify-end'>
        <MarkReadButton />
      </div>

      <div className='w-full space-y-2'>
        {notifications.length ? (
          notifications.map((notif) => (
            <NotificationCard
              key={notif.notification_id}
              frnNotificationData={notif}
            />
          ))
        ) : (
          <p className='col-span-2 sm:col-span-3 text-center opacity-80'>
            No notifications yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
