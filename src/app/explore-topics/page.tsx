'use client';

import { useState } from 'react';

import { notFound } from 'next/navigation';

import LetterButton from '@/components/buttons/LetterButton';
import Container from '@/components/layout/Container';
import { Loader } from '@/components/loader';
import PageHeading from '@/components/pageHeading';
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
    <Container className='pb-12 min-h-screen space-y-6'>
      <PageHeading
        heading='Topics'
        subHeading='Explore a wide variety of topics, from healthcare and sports to technology, relationships, and much more.'
      />

      <div className='p-2 sm:p-4 flex justify-center flex-wrap gap-1'>
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
        <div className='px-4 py-0 sm:py-4 grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6'>
          {categoryData && filteredCategories.length ? (
            filteredCategories.map((category) => (
              <div
                key={category}
                className='p-0 sm:p-2 col-span-2 sm:col-span-1 space-y-4'
              >
                <h2 className='w-fit p-1 font-josefin_Sans text-lg sm:text-xl border-b-1 border-secondary-lightGrey/25 truncate'>
                  {category}
                </h2>

                <TopicsList topics={categoryData[category].Topics} />
              </div>
            ))
          ) : (
            <p className='col-span-2 sm:col-span-3 font-jost text-center'>
              No topics available at this moment.
            </p>
          )}
        </div>
      )}
    </Container>
  );
};

export default ExploreTopicsPage;
