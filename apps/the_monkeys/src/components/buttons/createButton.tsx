'use client';

import {
  CREATE_EVENT_ROUTE,
  CREATE_GROUP_ROUTE,
  CREATE_ROUTE,
  DISCUSSIONS_ROUTE,
} from '@/constants/routeConstants';
import type { CreateMenuItemId } from '@/lib/createMenuItems';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@the-monkeys/ui/atoms/dropdown-menu';

import { CreateMenuContent } from '../create/CreateMenu';
import Icon from '../icon';

const siteHrefFor = (id: CreateMenuItemId): string | undefined =>
  ({
    discussion: DISCUSSIONS_ROUTE,
    post: CREATE_ROUTE,
    event: CREATE_EVENT_ROUTE,
    group: CREATE_GROUP_ROUTE,
  })[id];

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
        <CreateMenuContent variant='site' hrefFor={siteHrefFor} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
