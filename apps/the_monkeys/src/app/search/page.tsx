'use client';

import { ChangeEvent, useEffect, useState } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import Icon from '@/components/icon';
import { LOGIN_ROUTE } from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@the-monkeys/ui/atoms/tabs';

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

        <h3 className='hidden sm:block sm:text-xl mx-auto'>
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
        <div className='mx-auto max-w-4xl min-h-[800px]'>
          <Tabs defaultValue='posts' className='space-y-8'>
            <TabsList className='pb-4 flex justify-start sm:justify-center gap-2'>
              <TabsTrigger value='posts'>
                <p className='px-[10px] font-dm_sans text-sm sm:text-base opacity-80 group-hover:opacity-100 group-data-[state=active]:opacity-100'>
                  Posts
                </p>
                <div className='mt-[6px] h-[2px] w-0 bg-brand-orange rounded-full group-data-[state=active]:w-3/5 transition-all' />
              </TabsTrigger>

              <TabsTrigger value='authors'>
                <p className='px-[10px] font-dm_sans text-sm sm:text-base opacity-80 group-hover:opacity-100 group-data-[state=active]:opacity-100'>
                  Authors
                </p>
                <div className='mt-[6px] h-[2px] w-0 bg-brand-orange rounded-full group-data-[state=active]:w-3/5 transition-all' />
              </TabsTrigger>
            </TabsList>

            <div className='w-full'>
              <TabsContent className='w-full' value='posts'>
                <SearchPosts query={debouncedQuery} />
              </TabsContent>

              <TabsContent className='w-full' value='authors'>
                {isSuccess ? (
                  <SearchUsers query={debouncedQuery} />
                ) : (
                  <div className='flex justify-center items-center gap-1'>
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
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
