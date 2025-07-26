'use client';

import { ChangeEvent, useEffect, useState } from 'react';

import Link from 'next/link';

import useAuth from '@/hooks/auth/useAuth';
import { Button } from '@the-monkeys/ui/atoms/button';
import { twMerge } from 'tailwind-merge';

import Icon from '../icon';
import { SearchPosts } from './SearchPosts';

export const SearchInput = ({ className }: { className?: string }) => {
  const { isSuccess } = useAuth();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [focused, setFocused] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (
      !e.relatedTarget ||
      !e.relatedTarget.closest('.search-results-container')
    ) {
      setFocused(false);
    }
  };

  return (
    <div className={twMerge(className)}>
      <div className='relative px-3 py-[6px] flex items-center gap-[6px] bg-foreground-light/40 dark:bg-foreground-dark/40 rounded-full'>
        <div className='p-1 flex justify-center'>
          <Icon name='RiSearch' />
        </div>

        <input
          value={searchQuery}
          placeholder='Search...'
          className='w-full bg-transparent focus:outline-none'
          onChange={handleInputChange}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
        />

        {searchQuery.trim() && (
          <button
            className='absolute top-[50%] -translate-y-[50%] right-[10px] opacity-80 hover:opacity-100'
            onClick={() => setSearchQuery('')}
          >
            <Icon name='RiClose' size={16} />
          </button>
        )}

        {debouncedQuery.trim() && focused && (
          <div className='absolute top-full left-0 max-w-[520px] w-screen pr-2 pt-4 z-20 search-results-container'>
            <div className='p-4 bg-background-light dark:bg-background-dark rounded-md border-1 border-border-light/40 dark:border-border-dark/40 shadow-lg'>
              <SearchPosts query={debouncedQuery} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const SearchInputLink = () => {
  return (
    <Button
      variant='ghost'
      size='icon'
      className='group rounded-full hover:opacity-80 cursor-pointer'
      title='Search on Monkeys'
      asChild
    >
      <Link href='/search'>
        <Icon name='RiSearch' className='rotate-90' />
      </Link>
    </Button>
  );
};
