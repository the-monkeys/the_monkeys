import { NotificationRow } from '@/components/layout/navbar/NotificationRow';
import { FRNNotification } from '@/services/notification/notificationTypes';

export const NotificationCard = ({
  frnNotificationData,
}: {
  frnNotificationData: FRNNotification;
}) => {
  return (
    <div className='rounded-xl border border-border-light dark:border-border-dark/60'>
      <NotificationRow notif={frnNotificationData} />
    </div>
  );
};
