import { useState } from 'react';

import Link from 'next/link';

import { useSession } from '@/app/session-store-provider';
import Icon from '@/components/icon';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useGetAllNotifications } from '@/hooks/notification/useGetAllNotifications';

const NotificationDropdown = () => {
  const { status } = useSession();
  const { notifications, isLoading, isError } = useGetAllNotifications();
  const [open, setOpen] = useState<boolean>(false);

  const unreadNotifications = notifications?.notifications.notification.filter(
    (notificationItem) => !notificationItem.seen
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <div className='relative hover:opacity-80 cursor-pointer'>
          <Icon name='RiNotification3' size={22} />

          {unreadNotifications?.length ? (
            <div className='absolute top-0 right-0 size-[10px] rounded-full bg-brand-orange shadow-sm'></div>
          ) : null}
        </div>
      </DropdownMenuTrigger>

      {status === 'unauthenticated' ? (
        <DropdownMenuContent className='mt-3 mr-2 w-[250px] sm:w-[350px]'>
          <p className='py-4 px-2 text-sm opacity-80 text-center'>
            Login to view notifications.
          </p>
        </DropdownMenuContent>
      ) : (
        <DropdownMenuContent className='mt-3 mr-2 w-[260px] sm:w-[360px] p-2 flex flex-col'>
          <h3 className='px-1 font-dm_sans font-medium text-base sm:text-lg'>
            Notifications{' '}
            <span className='text-sm sm:text-base text-brand-orange'>
              {unreadNotifications?.length || '0'}
            </span>
          </h3>

          <Separator className='mt-1 mb-2' />

          <div className='mb-2 space-y-1'>
            {unreadNotifications?.length ? (
              unreadNotifications.slice(0, 5).map((notificationItem) => {
                return (
                  <div
                    key={notificationItem.id}
                    className='px-3 py-2 bg-foreground-light/25 dark:bg-foreground-dark/25 rounded-md'
                  >
                    <p className='flex-1 text-xs sm:text-sm capitalize break-words line-clamp-2'>
                      {notificationItem?.message}
                    </p>
                  </div>
                );
              })
            ) : (
              <p className='py-4 text-sm sm:text-base text-center opacity-80'>
                No notifications yet.
              </p>
            )}
          </div>

          <Button
            variant='secondary'
            size='sm'
            onClick={() => setOpen(false)}
            asChild
          >
            <Link href='/notifications'>
              See all
              <Icon name='RiArrowRightUp' size={18} className='ml-1' />
            </Link>
          </Button>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default NotificationDropdown;
