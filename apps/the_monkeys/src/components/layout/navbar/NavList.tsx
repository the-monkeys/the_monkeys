'use client';

import Link from 'next/link';

import Icon from '@/components/icon';
import { NAV_STYLES } from '@/constants/navListStyle';
import { LOGIN_ROUTE, NavItem } from '@/constants/routeConstants';
import { useActiveRoute } from '@/hooks/route/useActiveRoute';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  item: NavItem;
  /** Render as compact icon-only on small viewports (desktop sidebar behaviour) */
  compact?: boolean;
  locked?: boolean;
  onClick?: () => void;
}

export function NavLink({ item, compact, locked, onClick }: NavLinkProps) {
  const isActive = useActiveRoute()(item.href);

  const inner = (
    <>
      <Icon
        name={item.icon as any}
        size={18}
        className={cn('shrink-0', locked && 'opacity-45')}
      />
      <span
        className={cn(
          compact ? 'hidden md:inline' : undefined,
          locked && 'opacity-45'
        )}
      >
        {item.label}
      </span>
      {compact && <span className='sr-only md:hidden'>{item.label}</span>}
    </>
  );

  if (locked) {
    return (
      <div
        className={cn(
          NAV_STYLES.navLink(false, compact),
          NAV_STYLES.lockedLink
        )}
        aria-hidden='true'
      >
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={NAV_STYLES.navLink(isActive, compact)}
      onClick={onClick}
      aria-label={item.label}
    >
      {inner}
    </Link>
  );
}

// ─── Locked overlay row ──────────────────────────────────────────────────────

interface LockedSectionProps {
  items: NavItem[];
  compact?: boolean;
  /** Mobile variant: renders a CTA button instead of an overlay */
  mobileCta?: boolean;
  onNavigate?: () => void;
}

export function LockedSection({
  items,
  compact,
  mobileCta,
  onNavigate,
}: LockedSectionProps) {
  if (!items.length) return null;

  return (
    <div className='relative border-gray-100 dark:border-border-dark'>
      {items.map((item) => (
        <NavLink key={item.href} item={item} compact={compact} locked />
      ))}

      <Link
        href={LOGIN_ROUTE}
        title='Login to unlock'
        aria-label='Login to unlock'
        className='absolute inset-0 z-10 flex items-center justify-center rounded-md px-2 text-gray-500 transition-colors hover:text-brand-orange dark:text-gray-400'
      >
        <span className='flex h-8 items-center justify-center gap-1.5 px-2.5 border border-border-light/70 shadow-sm backdrop-blur dark:border-border-dark/80 dark:bg-background-dark/95 rounded-sm'>
          <Icon name='RiLock' size={13} className='shrink-0' />
          <span className='font-inter text-[11px] font-semibold'>
            <span className=' md:inline'>Login to unlock</span>
          </span>
        </span>
      </Link>
    </div>
  );
}

interface NavListProps {
  items: NavItem[];
  /** Items the user must be logged-in to access */
  lockedItems?: NavItem[];
  compact?: boolean;
  mobileCta?: boolean;
  onNavigate?: () => void;
}

export function NavList({
  items,
  lockedItems = [],
  compact,
  mobileCta,
  onNavigate,
}: NavListProps) {
  return (
    <nav className='flex flex-col gap-0.5' aria-label='Navigation'>
      {items.map((item) => (
        <NavLink
          key={item.href}
          item={item}
          compact={compact}
          onClick={onNavigate}
        />
      ))}
      <LockedSection
        items={lockedItems}
        compact={compact}
        mobileCta={mobileCta}
        onNavigate={onNavigate}
      />
    </nav>
  );
}
