'use client';

import Link from 'next/link';

import {
  CREATE_EVENT_ROUTE,
  CREATE_GROUP_ROUTE,
  CREATE_ROUTE,
} from '@/constants/routeConstants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@the-monkeys/ui/atoms/dropdown-menu';

import Icon from '../icon';

export const CreateButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          className='group h-9 flex items-center gap-1 px-[6px] py-[6px] sm:px-4 border-2 border-brand-orange bg-brand-orange text-white rounded-full transition-all hover:bg-brand-orange/20 hover:text-brand-orange active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2'
        >
          <Icon name='RiAdd' />
          <span className='hidden font-dm_sans font-bold sm:block'>Create</span>
          <Icon
            name='RiArrowDownS'
            size={18}
            className='transition-transform group-data-[state=open]:rotate-180'
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        sideOffset={8}
        aria-label='Create new content'
        className='w-52 rounded-xl border-brand-orange/20 bg-white py-1 shadow-lg dark:bg-black'
      >
        <DropdownMenuItem asChild>
          <Link
            href={CREATE_ROUTE}
            prefetch
            className='flex items-center gap-3 px-4 py-2 font-dm_sans text-sm font-medium text-black transition-colors hover:bg-brand-orange/10 focus:bg-brand-orange/10 dark:text-white'
          >
            <Icon name='RiDraft' size={18} />
            Create Post
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className='my-1 bg-brand-orange/15' />
        <DropdownMenuItem asChild>
          <Link
            href={CREATE_EVENT_ROUTE}
            prefetch
            className='flex items-center gap-3 px-4 py-2 font-dm_sans text-sm font-medium text-black transition-colors hover:bg-brand-orange/10 focus:bg-brand-orange/10 dark:text-white'
          >
            <Icon name='RiCalendar' size={18} />
            Create Event
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={CREATE_GROUP_ROUTE}
            prefetch
            className='flex items-center gap-3 px-4 py-2 font-dm_sans text-sm font-medium text-black transition-colors hover:bg-brand-orange/10 focus:bg-brand-orange/10 dark:text-white'
          >
            <Icon name='RiGroup' size={18} />
            Create Group
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
