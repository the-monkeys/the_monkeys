'use client';

import { Loader } from '@/components/loader';
import useAuth from '@/hooks/auth/useAuth';
import { useGetAllNotifications } from '@/hooks/notification/useGetAllNotifications';

import { MarkReadButton } from './components/MarkReadButton';
import { NotificationCard } from './components/NotificationCard';

const NotificationsPage = () => {
  const { notifications, isLoading, isError } = useGetAllNotifications();
  const { data: session } = useAuth();

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
    <div className='mx-auto w-full sm:w-4/5 md:w-3/5 px-4 flex flex-col items-center sm:items-end space-y-4'>
      <MarkReadButton
        notificationIds={notifications.map((n) => ({
          id: n.notification_id,
        }))}
        userId={session?.username}
      />

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
