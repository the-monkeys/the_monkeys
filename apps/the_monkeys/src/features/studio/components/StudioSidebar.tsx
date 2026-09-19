'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  RiAddLine,
  RiArrowLeftLine,
  RiCalendarLine,
  RiCameraLensLine,
  RiDashboardLine,
  RiHistoryLine,
  RiIdCardLine,
  RiImageLine,
  RiPencilLine,
  RiSettings3Line,
  RiSparklingFill,
  RiTimeLine,
} from '@remixicon/react';

export interface NavGroup {
  label: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string; size?: number }>;
    badge?: string;
  }[];
}

export const STUDIO_NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        label: 'Dashboard',
        href: '/studio',
        icon: RiDashboardLine,
      },
    ],
  },
  {
    label: 'Publishing',
    items: [
      {
        label: 'Composer',
        href: '/studio/compose',
        icon: RiPencilLine,
      },
      {
        label: 'Queue',
        href: '/studio/queue',
        icon: RiTimeLine,
      },
      {
        label: 'Calendar',
        href: '/studio/calendar',
        icon: RiCalendarLine,
      },
      {
        label: 'History',
        href: '/studio/history',
        icon: RiHistoryLine,
      },
      {
        label: 'Media Library',
        href: '/studio/media',
        icon: RiImageLine,
      },
    ],
  },
  {
    label: 'Creative Tools',
    items: [
      {
        label: 'Snapshots',
        href: '/studio/snapshot',
        icon: RiCameraLensLine,
      },
      {
        label: 'Business Cards',
        href: '/studio/cards',
        icon: RiIdCardLine,
      },
    ],
  },
  {
    label: 'Configuration',
    items: [
      {
        label: 'Connected Accounts',
        href: '/studio/accounts',
        icon: RiSettings3Line,
      },
    ],
  },
];

interface StudioSidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export default function StudioSidebar({
  onNavigate,
  className = '',
}: StudioSidebarProps) {
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === '/studio') {
      return pathname === '/studio';
    }
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <div
      className={`flex h-full flex-col justify-between overflow-y-auto border-r border-border-light bg-background-light p-4 dark:border-border-dark/60 dark:bg-background-dark ${className}`}
    >
      <div className='space-y-6'>
        {/* Workspace Brand Header */}
        <div className='flex items-center justify-between px-2 pt-1'>
          <div className='flex items-center gap-2.5'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-brand-orange text-white shadow-sm shadow-brand-orange/30'>
              <RiSparklingFill size={18} />
            </div>
            <div>
              <div className='flex items-center gap-1.5'>
                <span className='font-dm_sans text-sm font-bold tracking-tight'>
                  Monkeys Studio
                </span>
                <span className='rounded bg-brand-orange/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand-orange'>
                  v2.0
                </span>
              </div>
              <p className='text-[11px] text-foreground/50'>Social Workspace</p>
            </div>
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className='px-1'>
          <Link
            href='/studio/compose'
            onClick={onNavigate}
            className='group flex w-full items-center justify-center gap-2 rounded-lg bg-brand-orange px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-brand-orange/20 transition-all duration-150 hover:bg-brand-orange/95 hover:shadow-md hover:shadow-brand-orange/30 active:scale-[0.98]'
          >
            <RiAddLine
              size={18}
              className='transition-transform group-hover:rotate-90'
            />
            <span>New Post</span>
          </Link>
        </div>

        {/* Navigation Sections */}
        <nav aria-label='Studio Navigation' className='space-y-5 px-1'>
          {STUDIO_NAV_GROUPS.map((group) => (
            <div key={group.label} className='space-y-1'>
              <p className='px-2.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-foreground/45'>
                {group.label}
              </p>
              <div className='space-y-0.5'>
                {group.items.map((item) => {
                  const active = isLinkActive(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={`group flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150 ${
                        active
                          ? 'bg-brand-orange/10 text-brand-orange dark:bg-brand-orange/15 font-semibold'
                          : 'text-foreground/70 hover:bg-foreground-light/40 hover:text-foreground dark:hover:bg-foreground-dark/40 dark:hover:text-text-dark'
                      }`}
                    >
                      <div className='flex items-center gap-2.5'>
                        <Icon
                          size={18}
                          className={`transition-colors ${
                            active
                              ? 'text-brand-orange'
                              : 'text-foreground/50 group-hover:text-foreground'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge ? (
                        <span className='rounded-full bg-foreground-light/60 px-1.5 py-0.5 text-[10px] font-medium text-foreground/70 dark:bg-foreground-dark/60'>
                          {item.badge}
                        </span>
                      ) : active ? (
                        <span className='h-1.5 w-1.5 rounded-full bg-brand-orange' />
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Back Link */}
      <div className='pt-6'>
        <div className='rounded-xl border border-border-light/70 bg-foreground-light/20 p-3 dark:border-border-dark/50 dark:bg-foreground-dark/20'>
          <Link
            href='/feed'
            onClick={onNavigate}
            className='flex items-center gap-2 text-xs font-medium text-foreground/65 transition-colors hover:text-brand-orange'
          >
            <RiArrowLeftLine size={16} />
            <span>Back to Monkeys Feed</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
