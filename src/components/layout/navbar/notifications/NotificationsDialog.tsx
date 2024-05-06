import LinksRedirectArrow from '@/components/links/LinksRedirectArrow';

import NotificationContent from './NotificationContent';
import NotificationTabs from './NotificationTabs';

const NotificationsDialog = () => {
  return (
    <div className='pt-4 absolute top-full right-0 w-96'>
      <div className='flex flex-col overflow-hidden rounded-lg border-1 border-secondary-lightGrey/25 bg-primary-monkeyWhite dark:bg-primary-monkeyBlack drop-shadow-lg'>
        <h1 className='p-4 pb-2 font-josefin_Sans text-xl'>Notifications</h1>

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
