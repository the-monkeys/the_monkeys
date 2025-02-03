'use client';

import { useState } from 'react';
import React from 'react';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { useSession } from '@/app/session-store-provider';
import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CATEGORY_INITIAL_LETTERS } from '@/constants/topics';
import useGetAllCategories from '@/hooks/user/usetGetAllCategories';

import { AddTopicForm } from './components/AddTopicDialog';
import { TopicsList } from './components/TopicsList';

const ExploreTopicsPage = () => {
  const { status } = useSession();
  const { categories, isError, isLoading } = useGetAllCategories();
  const [selectedLetter, setSelectedLetter] = useState<string>('');

  if (isError) return notFound();

  const categoryData = categories?.category ?? {};

  const categoryValues = Object.keys(categoryData);

  const filteredCategories =
    selectedLetter === '#'
      ? Object.keys(categoryData)
      : Object.keys(categoryData).filter((category) =>
          category.startsWith(selectedLetter)
        );

  return (
    <div className='space-y-8'>
      <div className='mx-auto max-w-4xl flex justify-center items-center flex-wrap gap-2'>
        {CATEGORY_INITIAL_LETTERS.map((letter, index) => (
          <Button
            key={index}
            variant='outline'
            size='icon'
            onClick={() => setSelectedLetter(letter)}
            className='rounded-full'
            title={
              letter === '#' ? 'All Categories' : `Categories from ${letter}`
            }
          >
            <p className='text-sm sm:text-base'>{letter}</p>
          </Button>
        ))}

        {status === 'authenticated' && (
          <AddTopicForm
            categories={categories || {}}
            categoriesLoading={isLoading}
          />
        )}
      </div>

      {isLoading ? (
        <div className='flex flex-col items-center space-y-2'>
          <Loader />
          <p className='opacity-80'>Almost there, loading topics</p>
        </div>
      ) : (
        <div className='px-4 py-0 sm:py-4 grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8'>
          {categoryData && filteredCategories.length ? (
            filteredCategories.map((category) => {
              const topics = categoryData[category].Topics;
              const uniqueTopics = Array.from(new Set(topics));

              return (
                <div key={category} className='col-span-2 sm:col-span-1'>
                  <div className='group flex justify-between items-start'>
                    <h2 className='px-1 flex-1 font-dm_sans text-lg text-text-light dark:text-text-dark truncate'>
                      {category}
                    </h2>

                    {/* <CategoryButton topics={uniqueTopics} /> */}
                  </div>

                  <Separator className='mt-1 mb-2' />

                  <TopicsList topics={uniqueTopics} />
                </div>
              );
            })
          ) : (
            <p className='col-span-2 sm:col-span-3 text-center opacity-80'>
              No topics available at this moment.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExploreTopicsPage;
