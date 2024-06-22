import Image from 'next/image';

import Icon from '@/components/icon';

import { GridContainer, GridHeading, GridSubHeading } from './gridLayout';

const CollaborativeWriting = () => {
  return (
    <GridContainer className='group'>
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
        <div className='pb-0 h-8 sm:h-10 self-start'>
          <Image
            src='./users.svg'
            width='80'
            height='30'
            className='w-full h-full'
            alt='Users'
          />
        </div>

        <div className='px-2 sm:px-6 -mb-2'>
          <div className='relative mb-1 h-2 sm:h-3 w-3/4 group-hover:w-4/5 rounded-full rounded-r-none bg-secondary-darkGrey/10 dark:bg-secondary-white/10 transition-all'>
            <Icon
              name='RiNavigation'
              type='Fill'
              className='absolute top-full left-full text-primary-monkeyOrange'
            />
          </div>
          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />
          <div className='relative mb-3 h-2 sm:h-3 w-1/4 group-hover:w-1/3 rounded-full rounded-r-none bg-secondary-darkGrey/10 dark:bg-secondary-white/10 transition-all'>
            <Icon
              name='RiNavigation'
              type='Fill'
              className='absolute top-full left-full text-primary-monkeyOrange'
            />
          </div>

          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />
          <div className='relative mb-3 h-2 sm:h-3 w-2/3 group-hover:w-3/5 rounded-full rounded-r-none bg-secondary-darkGrey/10 dark:bg-secondary-white/10 transition-all'>
            <Icon
              name='RiNavigation'
              type='Fill'
              className='absolute top-full left-full text-primary-monkeyOrange'
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
