'use client';

import { useMemo, useState } from 'react';

import Icon from '@/components/icon';
import { getCalendarUrls } from '@/lib/calendarLinks';
import { cn } from '@/lib/utils';
import { EventItem } from '@/services/events/eventTypes';
import { downloadCalendar, eventError } from '@/services/events/eventsApi';
import { Button, ButtonProps } from '@the-monkeys/ui/atoms/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@the-monkeys/ui/atoms/dropdown-menu';
import { useToast } from '@the-monkeys/ui/hooks/use-toast';
import { FaYahoo } from 'react-icons/fa6';

export type AddToCalendarMenuProps = {
  event: EventItem;
  className?: string;
  buttonVariant?: ButtonProps['variant'];
  buttonSize?: ButtonProps['size'];
};

export function AddToCalendarMenu({
  event,
  className,
  buttonVariant = 'outline',
  buttonSize = 'sm',
}: AddToCalendarMenuProps) {
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);

  const urls = useMemo(() => getCalendarUrls(event), [event]);

  const onDownloadIcs = async () => {
    try {
      setDownloading(true);
      await downloadCalendar(event.slug);
    } catch (err) {
      toast({
        title: 'Could not download calendar',
        description: eventError(err),
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={buttonVariant}
          size={buttonSize}
          className={cn('group gap-1.5 font-dm_sans', className)}
          aria-label='Add to calendar'
        >
          <Icon name='RiCalendar' size={16} />
          <span>Add to calendar</span>
          <Icon
            name='RiArrowDownS'
            size={16}
            className='transition-transform group-data-[state=open]:rotate-180'
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='start'
        sideOffset={6}
        className='w-48 rounded-xl border border-border-light bg-white p-1.5 shadow-lg dark:border-border-dark dark:bg-neutral-900'
      >
        <DropdownMenuItem asChild>
          <a
            href={urls.google}
            target='_blank'
            rel='noopener noreferrer'
            className='flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 font-dm_sans text-sm font-medium text-black transition-colors hover:bg-brand-orange/10 hover:text-brand-orange focus:bg-brand-orange/10 focus:text-brand-orange dark:text-white'
          >
            <Icon name='RiGoogle' size={16} className='shrink-0' />
            <span>Google</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a
            href={urls.outlook}
            target='_blank'
            rel='noopener noreferrer'
            className='flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 font-dm_sans text-sm font-medium text-black transition-colors hover:bg-brand-orange/10 hover:text-brand-orange focus:bg-brand-orange/10 focus:text-brand-orange dark:text-white'
          >
            <Icon name='RiMicrosoft' size={16} className='shrink-0' />
            <span>Outlook</span>
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={onDownloadIcs}
          onClick={onDownloadIcs}
          disabled={downloading}
          className='flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 font-dm_sans text-sm font-medium text-black transition-colors hover:bg-brand-orange/10 hover:text-brand-orange focus:bg-brand-orange/10 focus:text-brand-orange dark:text-white'
        >
          <Icon name='RiApple' size={16} className='shrink-0' />
          <span>Apple / .ics</span>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a
            href={urls.yahoo}
            target='_blank'
            rel='noopener noreferrer'
            className='flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 font-dm_sans text-sm font-medium text-black transition-colors hover:bg-brand-orange/10 hover:text-brand-orange focus:bg-brand-orange/10 focus:text-brand-orange dark:text-white'
          >
            <FaYahoo size={16} className='shrink-0' />
            <span>Yahoo</span>
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
