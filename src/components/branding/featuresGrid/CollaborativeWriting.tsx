import Image from 'next/image';

import Icon from '@/components/icon';

import { GridContainer, GridHeading, GridSubHeading } from './gridLayout';

const CollaborativeWriting = () => {
  return (
    <GridContainer className='group flex flex-col'>
      <Icon
        name='RiGroup'
        className='mb-2 text-secondary-darkGrey dark:text-secondary-white'
        size={24}
      />

      <GridHeading>Write together for impact</GridHeading>

      <GridSubHeading>
        Enrich your content by inviting co-authors to add diverse perspectives
        and engage your audience.
      </GridSubHeading>

      <div className='mt-4 flex flex-col gap-4 sm:gap-6 overflow-hidden'>
        <div className='pb-0 h-10 sm:h-12 self-start'>
          <Image
            src='./users.svg'
            width='80'
            height='30'
            className='w-full h-full'
            alt='Users'
          />
        </div>

        <div className='px-4 sm:px-6 -mb-2'>
          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />
          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />
          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />
          <div className='relative mb-1 h-2 sm:h-3 w-4/5 rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10'>
            <Icon
              name='RiNavigation'
              type='Fill'
              className='absolute top-full right-0 text-primary-monkeyOrange scale-x-[-1] group-hover:animate-pulse'
            />
          </div>
          <div className='relative mb-3 h-2 sm:h-3 w-1/4 rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10'>
            <Icon
              name='RiNavigation'
              type='Fill'
              className='absolute top-full left-full text-primary-monkeyOrange group-hover:animate-pulse'
            />
          </div>

          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />
          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />
          <div className='relative mb-3 h-2 sm:h-3 w-3/5 rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10'>
            <Icon
              name='RiNavigation'
              type='Fill'
              className='absolute top-full left-full text-primary-monkeyOrange group-hover:animate-pulse'
            />
          </div>

          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />
          <div className='mb-1 h-2 sm:h-3 w-4/5 rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />
        </div>
      </div>
    </GridContainer>
  );
};

export default CollaborativeWriting;
