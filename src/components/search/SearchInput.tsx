'use client';

import { ChangeEvent, useEffect, useState } from 'react';

import { useGetSearchUser } from '@/hooks/user/useGetSearchUser';
import { twMerge } from 'tailwind-merge';

import Icon from '../icon';
import { SearchResultSkeleton } from '../skeletons/searchSkeleton';
import { Input } from '../ui/input';
import { SearchUsers } from './SearchUsers';

export const SearchInput = ({ className }: { className?: string }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { searchUsers, searchUsersLoading, searchUsersError } =
    useGetSearchUser(searchQuery.trim() ? searchQuery : undefined);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const getSuggestions = setTimeout(() => {
      if (searchQuery) {
      }
    }, 500);

    return () => clearTimeout(getSuggestions);
  }, [searchQuery, searchUsers]);

  return (
    <>
      <div
        className={twMerge(
          className,
          'group px-4 py-2 flex items-center gap-2 border-1 border-foreground-light dark:border-foreground-dark focus-within:border-transparent dark:focus-within:border-transparent rounded-full'
        )}
      >
        <Icon
          name='RiSearch'
          className='opacity-80 group-focus-within:opacity-100'
        />

        <Input
          variant='ghost'
          placeholder='Search'
          className='h-fit px-0 rounded-none'
          onChange={(e) => handleInputChange(e)}
        />
      </div>

      {searchQuery.trim() && (
        <div className='mt-2 p-4 border-1 border-foreground-light dark:border-foreground-dark shadow-md  rounded-lg sm:rounded-xl'>
          {searchUsersLoading ? (
            <SearchResultSkeleton />
          ) : (
            <SearchUsers users={searchUsers?.users} />
          )}
        </div>
      )}
    </>
  );
};
