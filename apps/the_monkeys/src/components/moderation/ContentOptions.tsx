'use client';

import { useState } from 'react';

import Icon from '@/components/icon';
import { cn } from '@/lib/utils';
import type { ContentTarget } from '@/services/moderation/moderationTypes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@the-monkeys/ui/atoms/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@the-monkeys/ui/atoms/dropdown-menu';

import { ContentLabelToggle } from './ContentLabelToggle';
import { ContentReportDialog } from './ContentReportDialog';
import { contentOptionsTriggerClass } from './menuStyles';

export function ContentOptions({
  target,
  canLabel = false,
  initialMarked = false,
  className,
  ariaLabel = 'Content options',
}: {
  target: ContentTarget;
  canLabel?: boolean;
  initialMarked?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const [reportOpen, setReportOpen] = useState(false);
  const [labelOpen, setLabelOpen] = useState(false);
  return (
    <div
      className={cn('relative z-10 shrink-0', className)}
      onClick={(e) => e.stopPropagation()}
    >
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type='button'
            aria-label={ariaLabel}
            className={contentOptionsTriggerClass}
          >
            <Icon name='RiMore' size={20} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          sideOffset={8}
          collisionPadding={12}
          className='mr-1 w-72 max-w-[calc(100vw_-_1.5rem)] rounded-2xl p-2'
        >
          <DropdownMenuItem
            onSelect={() => setReportOpen(true)}
            className='flex min-h-11 w-full items-center gap-3 rounded-lg px-3 font-dm_sans text-sm sm:text-base'
          >
            <Icon name='RiErrorWarning' size={18} className='shrink-0' />
            <span className='flex-1 text-left'>Report</span>
            <Icon
              name='RiArrowRightS'
              size={16}
              className='shrink-0 opacity-50'
            />
          </DropdownMenuItem>
          {canLabel ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setLabelOpen(true)}
                className='flex min-h-11 w-full items-center gap-3 rounded-lg px-3 font-dm_sans text-sm sm:text-base'
              >
                <Icon name='RiErrorWarning' size={18} className='shrink-0' />
                <span className='flex-1 text-left'>Content rating</span>
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
      <ContentReportDialog
        target={target}
        open={reportOpen}
        onOpenChange={setReportOpen}
      />
      <Dialog open={labelOpen} onOpenChange={setLabelOpen}>
        <DialogContent className='w-[calc(100vw-2rem)] max-w-lg rounded-2xl'>
          <DialogHeader>
            <DialogTitle>Content rating</DialogTitle>
            <DialogDescription>
              Set the rating for content you own.
            </DialogDescription>
          </DialogHeader>
          {labelOpen ? (
            <ContentLabelToggle target={target} initialMarked={initialMarked} />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
