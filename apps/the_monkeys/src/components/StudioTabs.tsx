'use client';

import Link from 'next/link';

export type StudioTab = 'template' | 'x' | 'card';

const TABS: { id: StudioTab; label: string; href: string }[] = [
  {
    id: 'template',
    label: 'Image template',
    href: '/snapshot/new?view=template',
  },
  { id: 'x', label: 'X screenshot', href: '/snapshot/new?view=x' },
  { id: 'card', label: 'Business card', href: '/cards' },
];

export interface StudioTabsProps {
  active: StudioTab;
  /**
   * When provided, the Image template / X screenshot tabs switch in place
   * (no navigation) — used on the snapshot studio page. The Card tab always
   * navigates to its own route so it works from anywhere.
   */
  onSelect?: (tab: 'template' | 'x') => void;
  className?: string;
}

/**
 * Shared studio navigation. Mirrors the Events tab bar (underline style) so
 * Image template, X screenshot, and Card feel like one consistent surface and
 * you can always move between them — including from the Cards pages.
 */
export const StudioTabs = ({
  active,
  onSelect,
  className,
}: StudioTabsProps) => (
  <div
    className={`mb-8 flex gap-1 border-b border-border-light dark:border-border-dark/40 ${
      className ?? ''
    }`}
    role='tablist'
    aria-label='Studio mode'
  >
    {TABS.map(({ id, label, href }) => {
      const cls = `px-3 py-2 font-inter text-sm ${
        active === id
          ? 'border-b-2 border-brand-orange font-medium'
          : 'text-gray-500 hover:text-foreground'
      }`;

      if (onSelect && (id === 'template' || id === 'x')) {
        return (
          <button
            key={id}
            type='button'
            role='tab'
            aria-selected={active === id}
            onClick={() => onSelect(id)}
            className={cls}
          >
            {label}
          </button>
        );
      }

      return (
        <Link
          key={id}
          href={href}
          role='tab'
          aria-selected={active === id}
          className={cls}
        >
          {label}
        </Link>
      );
    })}
  </div>
);
