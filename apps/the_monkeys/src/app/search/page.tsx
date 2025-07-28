'use client';

import { ChangeEvent, useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import Icon from '@/components/icon';

import { SearchPosts } from './components/SearchPosts';

// TODO: change the layout to incorporate results for both posts and users

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
    <div className='space-y-10'>
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

      {debouncedQuery.trim() && (
        <div className='max-w-4xl mx-auto'>
          <SearchPosts query={debouncedQuery} />
        </div>
      )}
    </div>
  );
};

export default SearchPage;
