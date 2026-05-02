'use client';

import Link from 'next/link';

import Icon from '@/components/icon';
import { NavList } from '@/components/layout/navbar/NavList';
import Logo from '@/components/logo';
import { NAV_STYLES } from '@/constants/navListStyle';
import { DISCOVER_ITEMS, HOME_ROUTE } from '@/constants/routeConstants';
import { IUser } from '@/services/models/user';

interface MobileNavDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: IUser | null | undefined;
}

export function MobileNavDrawer({
  open,
  onOpenChange,
  session,
}: MobileNavDrawerProps) {
  if (!open) return null;

  const close = () => onOpenChange(false);

  const publicItems = DISCOVER_ITEMS.filter((item) => !item.requiresAuth);
  const lockedItems = DISCOVER_ITEMS.filter((item) => item.requiresAuth);

  return (
    <>
      {/* Backdrop */}
      <div
        className='fixed inset-0 z-30 bg-black/50 lg:hidden'
        onClick={close}
        aria-hidden='true'
      />

      {/* Drawer */}
      <div className='fixed left-0 top-0 z-40 h-screen w-64 overflow-y-auto bg-background-light dark:bg-background-dark border-r border-gray-100 dark:border-border-dark lg:hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-gray-100 dark:border-border-dark'>
          <Link
            href={HOME_ROUTE}
            className='group flex items-center gap-2.5'
            onClick={close}
          >
            <div className='w-8 h-8 flex justify-center items-center rounded-lg group-hover:scale-105 transition-transform'>
              <Logo />
            </div>
            <p className='font-dm_sans font-medium text-xl text-text-light dark:text-text-dark'>
              Monkeys
            </p>
          </Link>

          <button
            onClick={close}
            className={NAV_STYLES.iconButton}
            aria-label='Close menu'
          >
            <Icon name='RiCloseLarge' size={20} />
          </button>
        </div>

        {/* Nav */}
        <div className='p-4'>
          <NavList
            items={session ? DISCOVER_ITEMS : publicItems}
            lockedItems={session ? [] : lockedItems}
            mobileCta
            onNavigate={close}
          />
        </div>
      </div>
    </>
  );
}
