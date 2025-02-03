'use client';

import { ChangeEvent, useEffect, useState } from 'react';

import Link from 'next/link';

import { useSession } from '@/app/session-store-provider';
import { useGetSearchUser } from '@/hooks/user/useGetSearchUser';
import { twMerge } from 'tailwind-merge';

import Icon from '../icon';
import { SearchResultSkeleton } from '../skeletons/searchSkeleton';
import { Input } from '../ui/input';
import { SearchUsers } from './SearchUsers';

export const SearchInput = ({ className }: { className?: string }) => {
  const { status } = useSession();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [focused, setFocused] = useState<boolean>(false);

  const { searchUsers, searchUsersLoading, searchUsersError } =
    useGetSearchUser(debouncedQuery.trim() ? debouncedQuery : undefined);

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
      <div className='relative px-5 flex items-center gap-2 border-1 border-border-light/50 dark:border-border-dark/50 focus-within:border-border-light dark:focus-within:border-border-light rounded-full'>
        <Icon name='RiSearch' size={18} />

        <Input
          value={searchQuery}
          variant='ghost'
          placeholder={
            status === 'authenticated'
              ? 'Search for authors'
              : 'Login to search'
          }
          className='px-1 rounded-none focus-visible:shadow-none'
          onChange={handleInputChange}
          disabled={status === 'unauthenticated'}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
        />

        {searchQuery.trim() && (
          <button
            className='absolute top-[50%] -translate-y-[50%] right-[16px] opacity-80 hover:opacity-100'
            onClick={() => setSearchQuery('')}
          >
            <Icon name='RiClose' size={16} />
          </button>
        )}

        {debouncedQuery.trim() && focused && (
          <div className='absolute top-full left-0 w-full px-[6px] pt-1 z-20 search-results-container'>
            <div className='bg-background-light dark:bg-background-dark border-1 border-border-light/50 dark:border-border-dark/50 rounded-lg shadow-sm'>
              {searchUsersLoading ? (
                <SearchResultSkeleton />
              ) : (
                <SearchUsers users={searchUsers?.users} />
              )}

              {searchUsersError && (
                <p className='text-sm opacity-80 text-center'>
                  Failed to load search results.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className='px-1 pt-2 flex items-center gap-2'>
        <p className='text-sm opacity-80'>Quick links:</p>

        <Link
          href='/topics/explore'
          className='font-dm_sans text-sm underline underline-offset-2 decoration-1 hover:opacity-80'
        >
          Explore topics
        </Link>
      </div>
    </div>
  );
};
