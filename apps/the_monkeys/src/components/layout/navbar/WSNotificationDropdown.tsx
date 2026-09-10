'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import Icon from '@/components/icon';
import { FRN_URL } from '@/constants/api';
import { NOTIFICATIONS_ROUTE } from '@/constants/routeConstants';
import { isUnreadStatus } from '@/lib/notificationPresentation';
import axiosInstance from '@/services/api/axiosInstance';
import { FRNNotification } from '@/services/notification/notificationTypes';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@the-monkeys/ui/atoms/dropdown-menu';

import { NotificationRow } from './NotificationRow';

type Props = {
  username: string;
};

const WSNotificationDropdown = ({ username }: Props) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<FRNNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const esRef = useRef<EventSource | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>();
  const generation = useRef(0);

  const disconnect = useCallback(() => {
    esRef.current?.close();
    esRef.current = null;
    clearTimeout(reconnectTimer.current);
    reconnectTimer.current = undefined;
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!username) return;
    try {
      const { data } = await axiosInstance.get<{
        notifications: FRNNotification[] | null;
        total: number;
      }>('/notification/frn?page_size=20&channel=in_app');

      const list = (data.notifications ?? []).filter(
        (n) => n.status !== 'failed'
      );
      setNotifications(list);
      setUnreadCount(list.filter((n) => isUnreadStatus(n.status)).length);
    } catch {
      // Gateway or FRN unreachable
    }
  }, [username]);

  const markAllRead = useCallback(() => {
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, status: 'read' })));
    void axiosInstance.post('/notification/frn/read-all').catch(() => {
      // next fetch restores unread if FRN failed
    });
  }, []);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) markAllRead();
  };

  const connect = useCallback(async () => {
    if (!username) return;
    const gen = generation.current;

    try {
      const { data } = await axiosInstance.get<{
        sse_token: string;
        user_id: string;
        expires_in: number;
        sse_public_url?: string;
      }>('/notification/sse-token');

      if (gen !== generation.current) return;
      if (!data?.sse_token) {
        reconnectTimer.current = setTimeout(connect, 10_000);
        return;
      }

      const base = (data.sse_public_url || FRN_URL || '').replace(/\/$/, '');
      if (!base) {
        reconnectTimer.current = setTimeout(connect, 10_000);
        return;
      }

      esRef.current?.close();

      const url = `${base}/sse?sse_token=${encodeURIComponent(data.sse_token)}`;
      const es = new EventSource(url);
      esRef.current = es;

      es.addEventListener('notification', () => {
        if (gen !== generation.current) return;
        // FRN SSE rows are a different channel than the in-app list. Refetch
        // so the dropdown stays on in_app copy (template_id, title, body).
        fetchNotifications();
      });

      es.addEventListener('unread_count', (event) => {
        if (gen !== generation.current) return;
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
        if (gen !== generation.current) return;
        es.close();
        if (esRef.current === es) esRef.current = null;
        reconnectTimer.current = setTimeout(connect, 5000);
      };

      const refreshMs = Math.max((data.expires_in - 60) * 1000, 60_000);
      reconnectTimer.current = setTimeout(() => {
        if (gen !== generation.current) return;
        es.close();
        connect();
      }, refreshMs);
    } catch {
      if (gen !== generation.current) return;
      reconnectTimer.current = setTimeout(connect, 10_000);
    }
  }, [username, fetchNotifications]);

  useEffect(() => {
    generation.current += 1;
    disconnect();
    setNotifications([]);
    setUnreadCount(0);
    fetchNotifications();
    connect();

    return () => {
      generation.current += 1;
      disconnect();
    };
  }, [username, connect, fetchNotifications, disconnect]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('scroll', close, true);
    return () => window.removeEventListener('scroll', close, true);
  }, [open]);

  useEffect(() => {
    if (!open || unreadCount === 0) return;
    markAllRead();
  }, [open, unreadCount, markAllRead]);

  return (
    <DropdownMenu modal={false} open={open} onOpenChange={handleOpenChange}>
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

      <DropdownMenuContent
        align='end'
        sideOffset={8}
        className='mr-1 flex w-[min(24rem,calc(100vw-1.5rem))] max-h-[min(32rem,calc(100dvh-5rem))] flex-col overflow-hidden rounded-2xl p-0'
      >
        <div className='flex items-center px-4 py-3'>
          <h3 className='font-dm_sans text-base font-semibold'>
            Notifications
          </h3>
        </div>

        <div className='min-h-0 flex-1 overflow-y-auto px-2 pb-1'>
          {notifications.length ? (
            notifications.map((item) => (
              <NotificationRow
                key={item.notification_id}
                notif={item}
                onNavigate={() => setOpen(false)}
              />
            ))
          ) : (
            <p className='px-2 py-8 text-center font-inter text-sm text-gray-500'>
              No notifications yet.
            </p>
          )}
        </div>

        <Link
          href={NOTIFICATIONS_ROUTE}
          onClick={() => setOpen(false)}
          className='flex items-center justify-center gap-1 border-t border-border-light px-4 py-3 font-inter text-sm font-medium text-brand-orange hover:underline dark:border-border-dark/60'
        >
          View all notifications
          <Icon name='RiArrowRight' size={16} />
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WSNotificationDropdown;
