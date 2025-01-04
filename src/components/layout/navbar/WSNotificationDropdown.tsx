import { useCallback, useEffect, useState } from 'react';

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
import { WSS_URL } from '@/constants/api';
import {
  Notification,
  WSNotification,
} from '@/services/notification/notificationTypes';

const WSNotificationDropdown = () => {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<
    Map<number, Notification & { time: Date }>
  >(new Map());

  const createWebSocket = useCallback((token: string) => {
    const ws = new WebSocket(
      `${WSS_URL}/notification/ws-notification?token=${token}`
    );

    ws.onopen = () => {
      console.log('I feel a connection here 🤔');
    };

    ws.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data) as WSNotification;
        const notificationData = notification.notification[0];

        setNotifications((prev) =>
          new Map(prev).set(notificationData.id, {
            time: new Date(),
            ...notificationData,
          })
        );
      } catch (error) {
        console.error('Error parsing notification:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WS Error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    let cleanup: (() => void) | null = null;

    // const handleVisibilityChange = () => {
    //   if (document.visibilityState === 'hidden') {
    //     if (cleanup) {
    //       cleanup();
    //       // console.log('WS Disconnected');
    //     }
    //   } else if (
    //     document.visibilityState === 'visible' &&
    //     session?.user?.token
    //   ) {
    //     cleanup = createWebSocket(session.user.token);
    //     // console.log('WS Reconnected');
    //   }
    // };

    if (session?.user?.token) {
      cleanup = createWebSocket(session.user.token);

      // document.addEventListener('visibilitychange', handleVisibilityChange);

      const handleBeforeUnload = () => {
        if (cleanup) cleanup();
      };
      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        if (cleanup) cleanup();
        // document.removeEventListener(
        //   'visibilitychange',
        //   handleVisibilityChange
        // );
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [session?.user?.token, createWebSocket]);

  // Logic to remove notifications
  // Periodically check every 5 seconds to remove all notifications older than 8 seconds

  useEffect(() => {
    const updateInterval = setInterval(() => {
      setNotifications((prevNotifications) => {
        const updatedNotifications = new Map(prevNotifications);
        updatedNotifications.forEach((notification, id) => {
          if (new Date().getTime() - notification.time.getTime() > 8000) {
            updatedNotifications.delete(id);
          }
        });
        return updatedNotifications;
      });
    }, 5000);

    return () => {
      clearInterval(updateInterval);
    };
  }, []);

  const notificationArray = Array.from(notifications.values());

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger>
        <div className='relative hover:opacity-80 cursor-pointer'>
          <Icon name='RiNotification3' size={22} />
          {notificationArray.length ? (
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
              {notifications.size || '0'}
            </span>
          </h3>

          <Separator className='mt-1 mb-2' />

          <div className='mb-2 space-y-1'>
            {notificationArray.length ? (
              notificationArray.slice(0, 5).map((notificationItem) => (
                <div
                  key={notificationItem.id}
                  className='px-3 py-2 bg-foreground-light/25 dark:bg-foreground-dark/25 rounded-md'
                >
                  <p className='flex-1 text-xs sm:text-sm capitalize break-words line-clamp-2'>
                    {notificationItem.message}
                  </p>
                </div>
              ))
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

export default WSNotificationDropdown;
