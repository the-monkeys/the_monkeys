'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

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
  const router = useRouter();

  const searchParams = useSearchParams();
  const searchQueryParam = searchParams.get('query') || '';

  const [searchQuery, setSearchQuery] = useState<string>(searchQueryParam);

  useEffect(() => {
    setSearchQuery(searchQueryParam);
  }, [searchQueryParam]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const searchText = formData.get('searchText') as string;

    if (searchText?.trim()) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('query', searchText.trim());
      router.push(`/search?${params.toString()}`);
    }
  };

  return (
    <div className='space-y-4'>
      <form
        onSubmit={handleFormSubmit}
        className='relative mx-auto max-w-3xl flex items-center gap-2 pb-4 sm:hidden'
      >
        <div className='p-1 flex justify-center'>
          <Icon name='RiSearch' />
        </div>

        <input
          name='searchText'
          value={searchQuery}
          placeholder='e.g. Layoffs'
          className='py-2 px-1 w-full bg-transparent focus:outline-none border-b-2 border-border-light dark:border-border-dark border-opacity-40 focus:border-opacity-100'
          onChange={handleInputChange}
          required
        />

        {searchQuery.trim() && (
          <button
            type='button'
            className='absolute top-[50%] -translate-y-[50%] right-[10px]'
            onClick={() => setSearchQuery('')}
          >
            <Icon name='RiClose' size={16} className='text-alert-red' />
          </button>
        )}
      </form>

      {searchQueryParam.trim() && (
        <>
          <h3 className='w-full text-center block sm:text-lg mx-auto pb-2 font-medium'>
            Showing results for&nbsp;
            <span className='text-brand-orange'>{searchQueryParam}</span>
          </h3>

          <div className='mx-auto max-w-4xl min-h-[800px]'>
            <Tabs defaultValue='posts' className='space-y-8'>
              <TabsList className='pb-4 flex justify-center gap-2'>
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
                  <SearchPosts query={searchQueryParam} />
                </TabsContent>

                <TabsContent className='w-full' value='authors'>
                  {isSuccess ? (
                    <SearchUsers query={searchQueryParam} />
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
        </>
      )}
    </div>
  );
};

export default SearchPage;
