import { NotificationBody } from '@/services/notification/NotificationBody';
import {
  FRNNotification,
  Notification,
} from '@/services/notification/notificationTypes';
import { twMerge } from 'tailwind-merge';

export const NotificationCard = ({
  notificationData,
  frnNotificationData,
}: {
  notificationData?: Notification;
  frnNotificationData?: FRNNotification;
}) => {
  // Support both legacy (Postgres) and FRN notification shapes
  const title = frnNotificationData?.content?.title ?? 'Notification';
  const legacyBody = notificationData?.message ?? '';
  const category = frnNotificationData?.category;
  const isSeen = notificationData?.seen ?? false;

  return (
    <div
      className={twMerge(
        'px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 border-1 rounded-md',
        !isSeen
          ? 'border-brand-orange'
          : 'border-foreground-light dark:border-foreground-dark'
      )}
    >
      <div className='flex-1 overflow-hidden space-y-1'>
        {category && (
          <span className='text-[10px] font-semibold uppercase tracking-wide opacity-50'>
            {category}
          </span>
        )}

        <h4 className='font-medium text-sm sm:text-base break-words'>
          {title}
        </h4>

        <p className='text-xs sm:text-sm opacity-80 capitalize break-words'>
          {frnNotificationData ? (
            <NotificationBody notif={frnNotificationData} />
          ) : (
            legacyBody
          )}
        </p>
      </div>
    </div>
  );
};
