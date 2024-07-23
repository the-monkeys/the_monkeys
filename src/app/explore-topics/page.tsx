'use client';

import { useState } from 'react';

import { notFound } from 'next/navigation';

import LetterButton from '@/components/buttons/LetterButton';
import { Loader } from '@/components/loader';
import { Separator } from '@/components/ui/separator';
import { letters } from '@/constants/topics';
import useGetAllCategories from '@/hooks/usetGetAllCategories';

import TopicsList from './components/TopicsList';

const ExploreTopicsPage = () => {
  const { categories, isError, isLoading } = useGetAllCategories();
  const [selectedLetter, setSelectedLetter] = useState<string>('');

  if (isError) return notFound();

  const categoryData = categories?.category ?? {};

  const filteredCategories =
    selectedLetter === '#'
      ? Object.keys(categoryData)
      : Object.keys(categoryData).filter((category) =>
          category.startsWith(selectedLetter)
        );

  return (
    <>
      <div className='w-full md:w-4/5 mx-auto px-4 flex justify-center flex-wrap gap-1'>
        {letters.map((letter) => (
          <LetterButton
            key={letter}
            letter={letter}
            onClick={() => setSelectedLetter(letter)}
          />
        ))}
      </div>

      {isLoading ? (
        <div className='flex flex-col items-center space-y-2'>
          <Loader />
          <p className='font-jost'>Fetching all topics</p>
        </div>
      ) : (
        <div className='px-4 py-0 sm:py-4 grid grid-cols-2 md:grid-cols-3 gap-6'>
          {categoryData && filteredCategories.length ? (
            filteredCategories.map((category) => (
              <div
                key={category}
                className='p-0 sm:p-2 col-span-2 sm:col-span-1 space-y-2'
              >
                <h2 className='p-1 font-josefin_Sans text-lg sm:text-xl truncate'>
                  {category}
                </h2>

                <Separator />

                <TopicsList topics={categoryData[category].Topics} />
              </div>
            ))
          ) : (
            <p className='col-span-2 sm:col-span-3 font-jost text-center opacity-75'>
              No topics available at this moment.
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default ExploreTopicsPage;
