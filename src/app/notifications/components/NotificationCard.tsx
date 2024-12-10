import { Notification } from '@/services/notification/notificationTypes';

import { MarkReadButton } from './MarkReadButton';

export const NotificationCard = ({
  notificationData,
}: {
  notificationData?: Notification;
}) => {
  return (
    <div className='px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-2 border-1 border-foreground-light dark:border-foreground-dark rounded-md'>
      <div className='flex-1 overflow-hidden space-y-1'>
        <h4 className='w-fit font-roboto text-xs sm:text-sm opacity-80'>
          Message Description
        </h4>

        <p className='font-roboto text-sm sm:text-base capitalize break-words'>
          {notificationData?.message}
        </p>
      </div>

      {!notificationData?.seen && (
        <MarkReadButton
          notificationId={notificationData?.id}
          userId={notificationData?.user_id}
        />
      )}
    </div>
  );
};
