'use client';

import { useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import {
  CREATE_EVENT_ROUTE,
  CREATE_GROUP_ROUTE,
  CREATE_ROUTE,
} from '@/constants/routeConstants';

import Icon from '../icon';

export const CreateButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', closeMenu);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('mousedown', closeMenu);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  return (
    <div ref={menuRef} className='relative'>
      <button
        type='button'
        aria-haspopup='menu'
        aria-expanded={isOpen}
        aria-controls='create-menu'
        onClick={() => setIsOpen((open) => !open)}
        className='group h-9 flex items-center gap-1 px-[6px] py-[6px] sm:px-4 border-2 border-brand-orange bg-brand-orange text-white rounded-full transition-all hover:bg-brand-orange/20 hover:text-brand-orange active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2'
      >
        <Icon name='RiAdd' />
        <span className='hidden font-dm_sans font-bold sm:block'>Create</span>
      </button>

      {isOpen && (
        <div
          id='create-menu'
          role='menu'
          aria-label='Create new content'
          className='absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-xl border border-brand-orange/20 bg-white py-1 shadow-lg dark:bg-black'
        >
          <Link
            href={CREATE_ROUTE}
            prefetch
            onClick={() => setIsOpen(false)}
            className='flex items-center gap-3 px-4 py-2 font-dm_sans text-sm font-medium text-black transition-colors hover:bg-brand-orange/10 focus-visible:bg-brand-orange/10 focus-visible:outline-none dark:text-white'
          >
            <Icon name='RiDraft' size={18} />
            Create Post
          </Link>
          <div
            role='separator'
            className='my-1 border-t border-brand-orange/15'
          />
          <Link
            href={CREATE_EVENT_ROUTE}
            prefetch
            onClick={() => setIsOpen(false)}
            className='flex items-center gap-3 px-4 py-2 font-dm_sans text-sm font-medium text-black transition-colors hover:bg-brand-orange/10 focus-visible:bg-brand-orange/10 focus-visible:outline-none dark:text-white'
          >
            <Icon name='RiCalendar' size={18} />
            Create Event
          </Link>
          <Link
            href={CREATE_GROUP_ROUTE}
            prefetch
            onClick={() => setIsOpen(false)}
            className='flex items-center gap-3 px-4 py-2 font-dm_sans text-sm font-medium text-black transition-colors hover:bg-brand-orange/10 focus-visible:bg-brand-orange/10 focus-visible:outline-none dark:text-white'
          >
            <Icon name='RiGroup' size={18} />
            Create Group
          </Link>
        </div>
      )}
    </div>
  );
};
