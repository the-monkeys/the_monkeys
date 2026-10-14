'use client';

import { useState } from 'react';

import { Loader } from '@/components/loader';
import { CATEGORY_INITIAL_LETTERS } from '@/constants/topics';
import useAuth from '@/hooks/auth/useAuth';
import useUser from '@/hooks/user/useUser';
import useGetAllCategories from '@/hooks/user/usetGetAllCategories';
import { GetAllCategoriesAPIResponse } from '@/services/category/categoryTypes';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Separator } from '@the-monkeys/ui/atoms/separator';

import { AddTopicForm } from './components/AddTopicDialog';
import { TopicsList } from './components/TopicsList';

export default function TopicsExplorerClient({
  initialCategories,
}: {
  initialCategories: GetAllCategoriesAPIResponse;
}) {
  const { data: session, isSuccess } = useAuth();
  const { user } = useUser(session?.username);
  const { categories, isLoading } = useGetAllCategories();
  const [selectedLetter, setSelectedLetter] = useState('');
  const categoryData = categories?.category || initialCategories.category;
  const categoryNames = Object.keys(categoryData);
  const filteredCategories =
    selectedLetter === '#' || !selectedLetter
      ? categoryNames
      : categoryNames.filter((category) => category.startsWith(selectedLetter));

  return (
    <div className='space-y-8'>
      <div className='mx-auto max-w-4xl flex justify-center items-center flex-wrap gap-2'>
        {CATEGORY_INITIAL_LETTERS.map((letter) => (
          <Button
            key={letter}
            variant='outline'
            size='icon'
            onClick={() => setSelectedLetter(letter)}
            className='rounded-full'
            title={
              letter === '#' ? 'All Categories' : `Categories from ${letter}`
            }
          >
            <span className='text-sm sm:text-base'>{letter}</span>
          </Button>
        ))}

        {isSuccess && (
          <AddTopicForm
            categories={categories || initialCategories}
            categoriesLoading={isLoading}
          />
        )}
      </div>

      {isLoading && !categoryNames.length ? (
        <div className='flex flex-col items-center space-y-2'>
          <Loader />
          <p className='opacity-80'>Almost there, loading topics</p>
        </div>
      ) : (
        <div className='px-4 py-0 sm:py-4 grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8'>
          {filteredCategories.length ? (
            filteredCategories.map((category) => (
              <section key={category} className='col-span-2 sm:col-span-1'>
                <h2 className='px-1 font-dm_sans text-lg text-text-light dark:text-text-dark truncate'>
                  {category}
                </h2>
                <Separator className='mt-1 mb-2' />
                <TopicsList
                  topics={categoryData[category].Topics}
                  followedTopics={user?.topics}
                  user={user}
                />
              </section>
            ))
          ) : (
            <p className='col-span-2 sm:col-span-3 text-center opacity-80'>
              No topics available at this moment.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
