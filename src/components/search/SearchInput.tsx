'use client';

import { ChangeEvent, useEffect, useState } from 'react';

import { useGetSearchUser } from '@/hooks/user/useGetSearchUser';
import { useSession } from 'next-auth/react';
import { twMerge } from 'tailwind-merge';

import Icon from '../icon';
import { SearchResultSkeleton } from '../skeletons/searchSkeleton';
import { Input } from '../ui/input';
import { SearchUsers } from './SearchUsers';

export const SearchInput = ({ className }: { className?: string }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const { status } = useSession();

  const { searchUsers, searchUsersLoading, searchUsersError } =
    useGetSearchUser(debouncedQuery.trim() ? debouncedQuery : undefined);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  return (
    <>
      <div
        className={twMerge(
          className,
          'group relative px-4 py-2 flex items-center gap-2 border-1 border-foreground-light dark:border-foreground-dark focus-within:border-border-light dark:focus-within:border-border-light rounded-full'
        )}
      >
        <Icon
          name='RiSearch'
          size={18}
          className='opacity-80 group-focus-within:opacity-100'
        />

        <Input
          value={searchQuery}
          variant='ghost'
          placeholder={
            status === 'authenticated'
              ? 'Search authors'
              : 'You are not logged in'
          }
          className='h-fit px-0 rounded-none focus-visible:shadow-none'
          onChange={handleInputChange}
          disabled={status === 'unauthenticated'}
        />

        {searchQuery.trim() && (
          <button
            className='absolute top-[50%] -translate-y-[50%] right-[16px] opacity-80 hover:opacity-100'
            onClick={() => setSearchQuery('')}
          >
            <Icon name='RiClose' size={16} />
          </button>
        )}
      </div>

      {debouncedQuery.trim() && (
        <div className='mt-2 p-4 border-1 border-foreground-light dark:border-foreground-dark shadow-md  rounded-xl'>
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
      )}
    </>
  );
};
