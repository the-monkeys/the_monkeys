import Icon from '@/components/icon';
import { Notification } from '@/services/notification/notificationTypes';

import { MarkReadButton } from './MarkReadButton';

export const NotificationCard = ({
  notificationData,
}: {
  notificationData?: Notification;
}) => {
  return (
    <div className='px-4 py-3 flex flex-col border-1 border-foreground-light dark:border-foreground-dark rounded-md space-y-2'>
      <div className='flex items-center gap-4 '>
        {notificationData?.seen ? (
          <Icon
            name='RiMailOpen'
            type='Fill'
            size={18}
            className='opacity-80'
          />
        ) : (
          <Icon
            name='RiMail'
            type='Fill'
            size={18}
            className='text-brand-orange'
          />
        )}

        <div className='flex-1 space-y-1 overflow-hidden'>
          <p className='font-roboto text-xs sm:text-sm opacity-80'>
            Message Description
          </p>

          <h4 className='font-roboto text-sm sm:text-base capitalize break-words'>
            {notificationData?.message}
          </h4>
        </div>
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
