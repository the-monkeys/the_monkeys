'use client';

import Link from 'next/link';

import {
  type CreateMenuItemId,
  type CreateMenuVariant,
  createMenuItems,
} from '@/lib/createMenuItems';
import { DropdownMenuItem } from '@the-monkeys/ui/atoms/dropdown-menu';

import Icon from '../icon';

const itemClassName =
  'flex items-center gap-3 px-4 py-2 font-dm_sans text-sm font-medium text-black transition-colors hover:bg-brand-orange/10 focus:bg-brand-orange/10 dark:text-white';

export function CreateMenuContent({
  variant,
  includeEvent = true,
  hrefFor,
  onSelect,
}: {
  variant: CreateMenuVariant;
  includeEvent?: boolean;
  hrefFor?: (id: CreateMenuItemId) => string | undefined;
  onSelect?: (id: CreateMenuItemId) => void;
}) {
  return (
    <>
      {createMenuItems(variant, { includeEvent }).map((item) => {
        const href = hrefFor?.(item.id);

        if (href) {
          return (
            <DropdownMenuItem key={item.id} asChild>
              <Link
                href={href}
                prefetch
                className={itemClassName}
                onClick={() => onSelect?.(item.id)}
              >
                <Icon name={item.icon} size={18} />
                {item.label}
              </Link>
            </DropdownMenuItem>
          );
        }

        return (
          <DropdownMenuItem
            key={item.id}
            className={itemClassName}
            onSelect={() => onSelect?.(item.id)}
          >
            <Icon name={item.icon} size={18} />
            {item.label}
          </DropdownMenuItem>
        );
      })}
    </>
  );
}
