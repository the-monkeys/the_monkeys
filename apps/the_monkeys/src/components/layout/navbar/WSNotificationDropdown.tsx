'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import Icon from '@/components/icon';
import { FRN_URL } from '@/constants/api';
import { NOTIFICATIONS_ROUTE } from '@/constants/routeConstants';
import {
  isUnreadStatus,
  notificationRowsAfterPanelChange,
} from '@/lib/notificationPresentation';
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
    void axiosInstance.post('/notification/frn/read-all').catch(() => {
      // next fetch restores unread if FRN failed
    });
  }, []);

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    setNotifications((prev) => notificationRowsAfterPanelChange(prev, next));
  }, []);

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
    const close = () => handleOpenChange(false);
    window.addEventListener('scroll', close, true);
    return () => window.removeEventListener('scroll', close, true);
  }, [open, handleOpenChange]);

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
          className='relative cursor-pointer rounded-full transition-colors hover:bg-foreground-light/40 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 dark:hover:bg-foreground-dark/40'
          title='View Notifications'
          aria-label={
            unreadCount > 0
              ? `View notifications, ${unreadCount} unread`
              : 'View notifications'
          }
        >
          {unreadCount > 0 ? (
            <Icon name='RiNotification3' type='Fill' />
          ) : (
            <Icon name='RiNotification3' />
          )}
          {unreadCount > 0 && (
            <span className='absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d63f2d] px-1 text-[10px] font-bold leading-none text-white ring-2 ring-background-light dark:bg-brand-orange dark:ring-background-dark'>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        sideOffset={8}
        collisionPadding={8}
        aria-label='Notifications'
        className='flex max-h-[min(38rem,calc(100dvh-var(--app-header-h,5rem)-0.75rem))] w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-2xl border border-border-light/80 bg-background-light p-0 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.38)] sm:mr-1 sm:w-[22rem] md:w-96 dark:border-border-dark/70 dark:bg-background-dark dark:shadow-[0_24px_70px_-26px_rgba(0,0,0,0.78)]'
      >
        <div className='flex shrink-0 items-center justify-between border-b border-border-light/70 bg-background-light/95 px-4 py-3 backdrop-blur-md dark:border-border-dark/60 dark:bg-background-dark/95'>
          <h3 className='font-dm_sans text-base font-semibold'>
            Notifications
          </h3>
          {notifications.length > 0 ? (
            <span
              className='inline-flex min-w-6 items-center justify-center rounded-full bg-foreground-light/50 px-2 py-0.5 font-inter text-xs font-semibold text-gray-600 dark:bg-foreground-dark/60 dark:text-gray-300'
              aria-label={`${notifications.length} notifications`}
            >
              {notifications.length}
            </span>
          ) : null}
        </div>

        <div className='min-h-0 flex-1 overscroll-contain overflow-y-auto px-2 py-2'>
          {notifications.length ? (
            notifications.map((item) => (
              <NotificationRow
                key={item.notification_id}
                notif={item}
                onNavigate={() => handleOpenChange(false)}
              />
            ))
          ) : (
            <div className='flex flex-col items-center px-4 py-10 text-center'>
              <span className='mb-3 flex size-11 items-center justify-center rounded-full bg-foreground-light/40 text-gray-500 dark:bg-foreground-dark/40 dark:text-gray-400'>
                <Icon name='RiNotification3' size={20} />
              </span>
              <p className='font-dm_sans text-sm font-medium'>
                You&apos;re all caught up
              </p>
              <p className='mt-1 font-inter text-xs leading-5 text-gray-500 dark:text-gray-400'>
                New activity will appear here.
              </p>
            </div>
          )}
        </div>

        <Link
          href={NOTIFICATIONS_ROUTE}
          onClick={() => handleOpenChange(false)}
          className='group/footer flex shrink-0 items-center justify-center gap-1.5 border-t border-border-light/70 bg-background-light/95 px-4 py-3 font-inter text-sm font-semibold text-[#c93422] transition-colors hover:bg-brand-orange/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-orange dark:border-border-dark/60 dark:bg-background-dark/95 dark:text-brand-orange dark:hover:bg-brand-orange/[0.1]'
        >
          View all notifications
          <Icon
            name='RiArrowRight'
            size={16}
            className='transition-transform duration-150 group-hover/footer:translate-x-0.5'
          />
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WSNotificationDropdown;
