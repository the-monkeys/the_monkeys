'use client';

import { useState } from 'react';
import React from 'react';

import { notFound } from 'next/navigation';

import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { letters } from '@/constants/topics';
import useGetAllCategories from '@/hooks/user/usetGetAllCategories';
import { useSession } from 'next-auth/react';

import { AddTopicForm } from './components/AddTopicDialog';
import { CategoryButton } from './components/CategoryButton';
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
    <div className='space-y-4'>
      {status === 'authenticated' && (
        <div className='px-4 pb-2 flex justify-center'>
          <AddTopicForm
            categories={categories || {}}
            categoriesLoading={isLoading}
          />
        </div>
      )}

      <div className='w-full md:w-4/5 mx-auto px-2 flex justify-center flex-wrap gap-1'>
        {letters.map((letter, index) => (
          <Button
            key={index}
            variant='ghost'
            onClick={() => setSelectedLetter(letter)}
            className='size-8 sm:size-10 rounded-full'
          >
            <p className='font-roboto text-sm sm:text-base font-medium'>
              {letter}
            </p>
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className='flex flex-col items-center space-y-2'>
          <Loader />
          <p className='font-roboto opacity-80'>Almost there, loading topics</p>
        </div>
      ) : (
        <div className='px-4 py-0 sm:py-4 grid grid-cols-2 md:grid-cols-3 gap-6'>
          {categoryData && filteredCategories.length ? (
            filteredCategories.map((category) => {
              const topics = categoryData[category].Topics;
              const uniqueTopics = Array.from(new Set(topics));

              return (
                <div
                  key={category}
                  className='p-0 sm:p-2 col-span-2 sm:col-span-1'
                >
                  <div className='p-1 group flex justify-between items-start'>
                    <h2 className='py-1 flex-1 font-dm_sans text-lg sm:text-xl text-text-light dark:text-text-dark truncate'>
                      {category}
                    </h2>

                    <CategoryButton
                      topics={uniqueTopics} // Use unique topics here
                    />
                  </div>

                  <Separator />

                  <TopicsList topics={uniqueTopics} />
                </div>
              );
            })
          ) : (
            <p className='col-span-2 sm:col-span-3 font-roboto text-center opacity-80'>
              No topics available at this moment.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExploreTopicsPage;
