import Image from 'next/image';

import Icon from '@/components/icon';

import { GridContainer, GridHeading, GridSubHeading } from './gridLayout';

const DiscoverDiversity = () => {
  return (
    <GridContainer className='group flex flex-col hover:border-primary-monkeyOrange/25'>
      <GridHeading>Discover Diversity</GridHeading>

      <GridSubHeading>
        Navigate through a diverse array of categories tailored to your
        interests.
      </GridSubHeading>

      <div
        className='mt-6 flex justify-center gap-1 h-36 sm:h-44 overflow-hidden animate-appear-up'
        aria-disabled='true'
      >
        <div className='-mt-12 group-hover:mt-0 w-fit space-y-2 transition-all hidden sm:block'>
          <div className='w-32 sm:w-36 h-10 flex items-center justify-center font-jost text-sm sm:text-base text-secondary-white dark:text-secondary-darkGrey bg-primary-monkeyBlack dark:bg-primary-monkeyWhite rounded-full cursor-default'>
            Technology
          </div>
          <div className='w-32 sm:w-36 h-10 bg-secondary-darkGrey/10 dark:bg-secondary-white/10 rounded-full' />
          <div className='w-32 sm:w-36 h-10 flex items-center justify-center font-jost text-sm sm:text-base text-secondary-white dark:text-secondary-darkGrey bg-primary-monkeyBlack dark:bg-primary-monkeyWhite rounded-full cursor-default'>
            Marketing
          </div>
          <div className='w-32 sm:w-36 h-10 bg-secondary-darkGrey/10 dark:bg-secondary-white/10 rounded-full' />
          <div className='w-32 sm:w-36 h-10 flex items-center justify-center font-jost text-sm sm:text-base text-secondary-white dark:text-secondary-darkGrey bg-primary-monkeyBlack dark:bg-primary-monkeyWhite rounded-full cursor-default'>
            Business
          </div>
          <div className='w-32 sm:w-36 h-10 bg-secondary-darkGrey/10 dark:bg-secondary-white/10 rounded-full' />
          <div className='w-32 sm:w-36 h-10 bg-secondary-darkGrey/10 dark:bg-secondary-white/10 rounded-full' />
        </div>

        <div className='group-hover:-mt-12 mr-4 w-fit space-y-2 transition-all hidden sm:block'>
          <div className='w-32 sm:w-36 h-10 flex items-center justify-center font-jost text-sm sm:text-base text-secondary-white dark:text-secondary-darkGrey bg-primary-monkeyBlack dark:bg-primary-monkeyWhite rounded-full cursor-default'>
            Crypto
          </div>
          <div className='w-32 sm:w-36 h-10 bg-secondary-darkGrey/10 dark:bg-secondary-white/10 rounded-full' />
          <div className='w-32 sm:w-36 h-10 flex items-center justify-center font-jost text-sm sm:text-base text-secondary-white dark:text-secondary-darkGrey bg-primary-monkeyBlack dark:bg-primary-monkeyWhite rounded-full cursor-default'>
            Relationship
          </div>
          <div className='w-32 sm:w-36 h-10 bg-secondary-darkGrey/10 dark:bg-secondary-white/10 rounded-full' />
          <div className='w-32 sm:w-36 h-10 flex items-center justify-center font-jost text-sm sm:text-base text-secondary-white dark:text-secondary-darkGrey bg-primary-monkeyBlack dark:bg-primary-monkeyWhite rounded-full cursor-default'>
            Business
          </div>
          <div className='w-32 sm:w-36 h-10 bg-secondary-darkGrey/10 dark:bg-secondary-white/10 rounded-full' />
        </div>

        <div className='flex-1 block md:hidden lg:block'>
          <Image
            src='./topics.svg'
            width='300'
            height='300'
            alt='Monkeys Blog Topics'
            title='Monkeys Blog Topics'
            className='mx-auto object-fill'
          />
        </div>
      </div>
    </GridContainer>
  );
};

export default DiscoverDiversity;
