'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Icon from '@/components/icon';
import { FRN_URL } from '@/constants/api';
import axiosInstance from '@/services/api/axiosInstance';
import { FRNNotification } from '@/services/notification/notificationTypes';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@the-monkeys/ui/atoms/dropdown-menu';
import { Separator } from '@the-monkeys/ui/atoms/separator';

const WSNotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<FRNNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const esRef = useRef<EventSource | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>();
  const hasFetched = useRef(false);

  // Fetch persisted notifications from gateway (proxied from FRN)
  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get<{
        notifications: FRNNotification[] | null;
        total: number;
      }>('/notification/frn?page_size=20&channel=in_app');

      const list = (data.notifications ?? []).filter(
        (n) => n.status !== 'failed'
      );
      setNotifications(list);
      setUnreadCount(
        list.filter((n) => n.status !== 'read' && n.status !== 'seen').length
      );
      hasFetched.current = true;
    } catch {
      // Gateway or FRN unreachable
    }
  }, []);

  // Mark all as read when dropdown opens
  const markAllRead = useCallback(async () => {
    if (unreadCount === 0) return;
    try {
      await axiosInstance.post('/notification/frn/read-all');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, status: 'read' })));
    } catch {
      // non-blocking
    }
  }, [unreadCount]);

  // Fetch SSE token from gateway, then connect to FRN SSE
  const connect = useCallback(async () => {
    if (!FRN_URL) return;

    try {
      const { data } = await axiosInstance.get<{
        sse_token: string;
        user_id: string;
        expires_in: number;
      }>('/notification/sse-token');

      if (!data?.sse_token) return;

      // Close any existing connection
      esRef.current?.close();

      const url = `${FRN_URL}/sse?sse_token=${encodeURIComponent(data.sse_token)}`;
      const es = new EventSource(url);
      esRef.current = es;

      es.addEventListener('connected', () => {
        console.log('[FRN] SSE connected');
      });

      es.addEventListener('notification', (event) => {
        try {
          const payload = JSON.parse(event.data);
          // SSE wraps notification under a "notification" key
          const notif: FRNNotification = payload.notification ?? payload;
          if (!notif.notification_id) return;
          setNotifications((prev) => {
            // Prepend, deduplicate by id
            if (prev.some((n) => n.notification_id === notif.notification_id))
              return prev;
            return [notif, ...prev];
          });
          setUnreadCount((c) => c + 1);
        } catch {
          // ignore malformed events
        }
      });

      es.addEventListener('unread_count', (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (typeof payload.count === 'number') {
            setUnreadCount(payload.count);
          }
        } catch {
          // ignore
        }
      });

      es.onerror = () => {
        es.close();
        esRef.current = null;
        // Auto-reconnect after 5s
        reconnectTimer.current = setTimeout(connect, 5000);
      };

      // Re-connect before the token expires (refresh 60s early)
      const refreshMs = Math.max((data.expires_in - 60) * 1000, 60_000);
      reconnectTimer.current = setTimeout(() => {
        es.close();
        connect();
      }, refreshMs);
    } catch {
      // Gateway unreachable — retry in 10s
      reconnectTimer.current = setTimeout(connect, 10_000);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    connect();

    return () => {
      esRef.current?.close();
      esRef.current = null;
      clearTimeout(reconnectTimer.current);
    };
  }, [connect, fetchNotifications]);

  // Relative time helper
  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) markAllRead();
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='relative rounded-full hover:opacity-80 cursor-pointer'
          title='View Notifications'
        >
          {unreadCount > 0 ? (
            <Icon name='RiNotification3' type='Fill' />
          ) : (
            <Icon name='RiNotification3' />
          )}
          {unreadCount > 0 && (
            <span className='absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center bg-brand-orange text-white text-[10px] font-bold rounded-full'>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='mt-3 mr-2 w-[260px] sm:w-[360px] p-2 flex flex-col max-h-[420px]'>
        <h3 className='px-1 font-dm_sans font-medium text-base sm:text-lg'>
          Notifications{' '}
          {unreadCount > 0 && (
            <span className='text-sm sm:text-base text-brand-orange'>
              {unreadCount}
            </span>
          )}
        </h3>

        <Separator className='mt-1 mb-2' />

        <div className='space-y-1 overflow-y-auto'>
          {notifications.length ? (
            notifications.map((notif) => (
              <div
                key={notif.notification_id}
                className='px-3 py-2 bg-foreground-light/25 dark:bg-foreground-dark/25 rounded-md'
              >
                <div className='flex items-center justify-between'>
                  <p className='text-[11px] font-medium opacity-60 capitalize'>
                    {notif.category || notif.channel}
                  </p>
                  <p className='text-[10px] opacity-50'>
                    {timeAgo(notif.created_at)}
                  </p>
                </div>
                <p className='font-medium text-xs sm:text-sm break-words line-clamp-2'>
                  {notif.content?.body || notif.content?.title || ''}
                </p>
              </div>
            ))
          ) : (
            <p className='py-4 text-sm sm:text-base text-center opacity-80'>
              No notifications yet.
            </p>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WSNotificationDropdown;
