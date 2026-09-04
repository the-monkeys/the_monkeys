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
  const [activeMenuItem, setActiveMenuItem] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const closeMenuAndRestoreFocus = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const focusMenuItem = (index: number) => {
    setActiveMenuItem(index);
    menuItemRefs.current[index]?.focus();
  };

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', closeMenu);

    return () => {
      document.removeEventListener('mousedown', closeMenu);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      focusMenuItem(0);
    }
  }, [isOpen]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault();
      closeMenuAndRestoreFocus();
      return;
    }

    if (event.key === 'Tab' && isOpen) {
      window.setTimeout(() => setIsOpen(false), 0);
      return;
    }

    if (
      !isOpen ||
      !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)
    ) {
      return;
    }

    const currentIndex = menuItemRefs.current.findIndex(
      (menuItem) => menuItem === event.target
    );
    const lastIndex = menuItemRefs.current.length - 1;
    let nextIndex = currentIndex;

    if (event.key === 'ArrowDown') {
      nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
    } else if (event.key === 'ArrowUp') {
      nextIndex = currentIndex <= 0 ? lastIndex : currentIndex - 1;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = lastIndex;
    }

    event.preventDefault();
    focusMenuItem(nextIndex);
  };

  return (
    <div
      ref={menuRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsOpen(false);
        }
      }}
      onKeyDown={handleKeyDown}
      className='relative'
    >
      <button
        ref={triggerRef}
        type='button'
        aria-haspopup='menu'
        aria-expanded={isOpen}
        aria-controls='create-menu'
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
          } else {
            setActiveMenuItem(0);
            setIsOpen(true);
          }
        }}
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
            ref={(element) => {
              menuItemRefs.current[0] = element;
            }}
            role='menuitem'
            tabIndex={activeMenuItem === 0 ? 0 : -1}
            href={CREATE_ROUTE}
            prefetch
            onFocus={() => setActiveMenuItem(0)}
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
            ref={(element) => {
              menuItemRefs.current[1] = element;
            }}
            role='menuitem'
            tabIndex={activeMenuItem === 1 ? 0 : -1}
            href={CREATE_EVENT_ROUTE}
            prefetch
            onFocus={() => setActiveMenuItem(1)}
            onClick={() => setIsOpen(false)}
            className='flex items-center gap-3 px-4 py-2 font-dm_sans text-sm font-medium text-black transition-colors hover:bg-brand-orange/10 focus-visible:bg-brand-orange/10 focus-visible:outline-none dark:text-white'
          >
            <Icon name='RiCalendar' size={18} />
            Create Event
          </Link>
          <Link
            ref={(element) => {
              menuItemRefs.current[2] = element;
            }}
            role='menuitem'
            tabIndex={activeMenuItem === 2 ? 0 : -1}
            href={CREATE_GROUP_ROUTE}
            prefetch
            onFocus={() => setActiveMenuItem(2)}
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
