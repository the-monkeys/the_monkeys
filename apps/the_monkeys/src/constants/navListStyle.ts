import { cn } from '@/lib/utils';

export const NAV_STYLES = {
  iconButton:
    'p-2 hover:bg-foreground-light/40 dark:hover:bg-foreground-dark/40 rounded-md transition-colors',
  divider: 'h-8 w-[1px] bg-gray-100 dark:bg-gray-800 mx-1 hidden sm:block',
  navLink: (isActive: boolean, compact?: boolean) =>
    cn(
      'flex items-center rounded-md py-3 font-inter text-sm transition-all duration-200',
      'hover:bg-foreground-light/40 dark:hover:bg-foreground-dark/40',
      isActive
        ? 'bg-foreground-light dark:bg-foreground-dark/40 font-medium opacity-90'
        : 'hover:text-text-light dark:text-text-dark',
      compact
        ? 'px-0 justify-center md:px-3 md:justify-start md:gap-3'
        : 'gap-3 px-3'
    ),
  lockedLink:
    'pointer-events-none text-gray-400 dark:text-gray-500 opacity-50 cursor-not-allowed',
} as const;
