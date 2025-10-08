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
  const [activeTab, setActiveTab] = useState<'posts' | 'authors'>('posts');

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
    if (searchQueryParam.trim()) {
      setDebouncedQuery(searchQueryParam);
    }
  }, [searchQueryParam]);

  return (
    <div className='space-y-12'>
      <div className='relative mx-auto max-w-3xl flex items-center gap-2'>
        <div className='p-1 flex justify-center sm:hidden'>
          <Icon name='RiSearch' />
        </div>

        <h3 className='hidden sm:block sm:text-2xl mx-auto'>
          <span className='opacity-80'>Showing results for&nbsp;</span>
          {searchQueryParam}
        </h3>

        <input
          value={searchQuery}
          placeholder='e.g. Layoffs'
          className='py-2 px-1 w-full block sm:hidden bg-transparent focus:outline-none border-b-2 border-border-light dark:border-border-dark border-opacity-40 focus:border-opacity-100'
          onChange={handleInputChange}
        />

        {searchQuery.trim() && (
          <button
            className='absolute top-[50%] -translate-y-[50%] right-[10px] sm:hidden'
            onClick={() => setSearchQuery('')}
          >
            <Icon name='RiClose' size={16} className='text-alert-red' />
          </button>
        )}
      </div>

      {/* need to add pagination to search results */}
      {debouncedQuery.trim() && (
        <div className='space-y-8'>
          <div className='flex gap-4 border-b border-border-light dark:border-border-dark'>
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-3 px-1 font-dm_sans font-medium text-lg transition-colors relative 
                ${activeTab === 'posts' ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
            >
              Posts
              {activeTab === 'posts' && (
                <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-brand-orange'></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('authors')}
              className={`pb-3 px-1 font-dm_sans font-medium text-lg transition-colors relative 
                ${activeTab === 'authors' ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
            >
              Authors
              {activeTab === 'authors' && (
                <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-brand-orange'></span>
              )}
            </button>
          </div>

          {activeTab === 'posts' ? (
            <>
              <SearchPosts query={debouncedQuery} />
            </>
          ) : (
            <div>
              {isSuccess ? (
                <SearchUsers query={debouncedQuery} />
              ) : (
                <div className='py-8 flex justify-center items-center gap-1'>
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
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
