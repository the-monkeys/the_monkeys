'use client';

import { useState } from 'react';

import dynamic from 'next/dynamic';

import { CATEGORY_INITIAL_LETTERS } from '@/constants/topics';
import { GetAllCategoriesAPIResponse } from '@/services/category/categoryTypes';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Separator } from '@the-monkeys/ui/atoms/separator';

import { TopicsList } from './TopicsList';

const AddTopicForm = dynamic(() => import('./AddTopicDialog'));

export default function Topics({
  categories,
}: {
  categories: GetAllCategoriesAPIResponse;
}) {
  const [selectedLetter, setSelectedLetter] = useState('');

  const categoryData = categories.category;

  const filteredCategories =
    selectedLetter === '#'
      ? Object.keys(categoryData)
      : Object.keys(categoryData).filter((category) =>
          category.startsWith(selectedLetter)
        );

  return (
    <>
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
      </div>

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

      <AddTopicForm categories={categories || {}} />
    </>
  );
}
