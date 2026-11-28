'use client';

import { CreateMenuContent } from '@/components/create/CreateMenu';
import Icon from '@/components/icon';
import { CREATE_ROUTE, GROUPS_ROUTE } from '@/constants/routeConstants';
import type { CreateMenuItemId } from '@/lib/createMenuItems';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@the-monkeys/ui/atoms/dropdown-menu';

export function GroupCreateMenu({
  slug,
  includeEvent = true,
  onCreateDiscussion,
}: {
  slug: string;
  includeEvent?: boolean;
  onCreateDiscussion: () => void;
}) {
  const hrefFor = (id: CreateMenuItemId): string | undefined => {
    if (id === 'post') {
      return `${CREATE_ROUTE}?group=${encodeURIComponent(slug)}`;
    }
    if (id === 'event') return `${GROUPS_ROUTE}/${slug}/events/new`;
    return undefined;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='gap-1' type='button' variant='outline'>
          Create
          <Icon name='RiArrowDownS' size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        aria-label='Create for this group'
        className='w-52 rounded-xl border-brand-orange/20 bg-white py-1 shadow-lg dark:bg-black'
        sideOffset={8}
      >
        <CreateMenuContent
          hrefFor={hrefFor}
          includeEvent={includeEvent}
          onSelect={(id) => {
            if (id === 'discussion') onCreateDiscussion();
          }}
          variant='group'
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
