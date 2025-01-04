'use client';

import { useSession } from '@/app/session-store-provider';
import { Loader } from '@/components/loader';
import { useGetAllNotifications } from '@/hooks/notification/useGetAllNotifications';

import { MarkReadButton } from './components/MarkReadButton';
import { NotificationCard } from './components/NotificationCard';

const NotificationsPage = () => {
  const { notifications, isLoading, isError } = useGetAllNotifications();
  const { data: session } = useSession();

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

  let unreadNotifications: { id: number }[] = [];

  if (notifications?.notifications) {
    unreadNotifications = notifications?.notifications.notification.filter(
      (notification) => !notification.seen
    );
  }

  return (
    <div className='mx-auto w-full sm:w-4/5 md:w-3/5 px-4 flex flex-col items-center sm:items-end space-y-4'>
      <MarkReadButton
        notificationIds={unreadNotifications}
        userId={session?.user.username}
      />

      <div className='w-full space-y-2'>
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
          <p className='col-span-2 sm:col-span-3 text-center opacity-80'>
            No notifications yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
