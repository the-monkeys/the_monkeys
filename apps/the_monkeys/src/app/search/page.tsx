'use client';

import { ChangeEvent, useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import Icon from '@/components/icon';

import { SearchPosts } from './components/SearchPosts';
import { SearchUsers } from './components/SearchUsers';

const SearchPage = () => {
  const searchParams = useSearchParams();
  const searchQueryParam = searchParams.get('query');

  const [searchQuery, setSearchQuery] = useState<string>(
    searchQueryParam || ''
  );
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  return (
    <div className='space-y-12'>
      <div className='relative mx-auto max-w-3xl flex items-center gap-2'>
        <div className='p-1 flex justify-center'>
          <Icon name='RiSearch' />
        </div>

        <input
          value={searchQuery}
          placeholder='Search'
          className='py-2 px-1 w-full bg-transparent focus:outline-none border-b-2 border-border-light dark:border-border-dark border-opacity-40 focus:border-opacity-100'
          onChange={handleInputChange}
        />

        {searchQuery.trim() && (
          <button
            className='absolute top-[50%] -translate-y-[50%] right-[10px]'
            onClick={() => setSearchQuery('')}
          >
            <Icon name='RiClose' size={16} className='text-alert-red' />
          </button>
        )}
      </div>

      {/* need to add pagination to search results */}
      {debouncedQuery.trim() && (
        <div className='grid grid-cols-3 gap-8 lg:gap-10 xl:gap-16'>
          <div className='col-span-3 md:col-span-1 space-y-6'>
            <h4 className='px-1 pb-2 font-dm_sans font-medium opacity-90 border-b-1 border-border-light/60 dark:border-border-dark/60'>
              Authors
            </h4>

            <SearchUsers query={debouncedQuery} />
          </div>

          <div className='col-span-3 md:col-span-2 space-y-6'>
            <h4 className='px-1 pb-2 font-dm_sans font-medium opacity-90 border-b-1 border-border-light/60 dark:border-border-dark/60'>
              Posts
            </h4>

            <SearchPosts query={debouncedQuery} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
