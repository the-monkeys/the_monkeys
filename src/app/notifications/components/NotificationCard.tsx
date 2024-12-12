import { Notification } from '@/services/notification/notificationTypes';
import { twMerge } from 'tailwind-merge';

export const NotificationCard = ({
  notificationData,
}: {
  notificationData?: Notification;
}) => {
  return (
    <div
      className={twMerge(
        'px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 border-1 rounded-md',
        !notificationData?.seen
          ? 'border-brand-orange'
          : 'border-foreground-light dark:border-foreground-dark'
      )}
    >
      <div className='flex-1 overflow-hidden space-y-1'>
        <h4 className='w-fit font-roboto text-xs sm:text-sm opacity-80'>
          Message Description
        </h4>

        <p className='font-roboto text-sm sm:text-base capitalize break-words'>
          {notificationData?.message}
        </p>
      </div>
    </div>
  );
};
