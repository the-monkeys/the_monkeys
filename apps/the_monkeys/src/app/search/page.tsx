'use client';

import { ChangeEvent, useEffect, useState } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import Icon from '@/components/icon';
import { LOGIN_ROUTE } from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';

import { SearchPosts } from './components/SearchPosts';
import { SearchUsers } from './components/SearchUsers';

const SearchPage = () => {
  const { isSuccess } = useAuth();

  const searchParams = useSearchParams();
  const searchQueryParam = searchParams.get('query') || '';

  const [searchQuery, setSearchQuery] = useState<string>(searchQueryParam);
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

  useEffect(() => {
    setDebouncedQuery(searchQueryParam);
  }, [searchQueryParam]);

  return (
    <div className='space-y-12'>
      <div className='relative mx-auto max-w-3xl flex items-center gap-2'>
        <div className='p-1 flex justify-center sm:hidden'>
          <Icon name='RiSearch' />
        </div>

        <h3 className='w-full hidden sm:flex sm:justify-center sm:text-xl'>
          Showing results for {searchQueryParam} :
        </h3>

        <input
          value={searchQuery}
          placeholder='e.g. Layoffs'
          className='py-2 px-1 w-full block sm:hidden bg-transparent focus:outline-none border-b-2 border-border-light dark:border-border-dark border-opacity-40 focus:border-opacity-100'
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
        <div className='grid grid-cols-3 gap-10 lg:gap-12'>
          <div className='col-span-3 lg:col-span-1 space-y-6'>
            <h6 className='font-dm_sans font-medium text-lg'>Authors</h6>

            {isSuccess ? (
              <SearchUsers query={debouncedQuery} />
            ) : (
              <div className='py-2 flex justify-center items-center gap-1'>
                <Link
                  href={LOGIN_ROUTE}
                  className='font-medium text-sm text-brand-orange underline'
                >
                  Login
                </Link>

                <p className='text-sm opacity-90 text-center'>
                  to find authors.
                </p>
              </div>
            )}
          </div>

          <div className='col-span-3 lg:col-span-2 space-y-6'>
            <h6 className='font-dm_sans font-medium text-lg'>Posts</h6>

            <SearchPosts query={debouncedQuery} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
