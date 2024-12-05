import Image from 'next/image';

import Icon from '@/components/icon';

import { GridContainer, GridHeading, GridSubHeading } from './gridLayout';

const CollaborativeWriting = () => {
  return (
    <GridContainer className='h-full group row-span-2 col-span-5 lg:col-span-3 space-y-4'>
      <div className='py-4 px-4'>
        <GridHeading>Collaborative Writing</GridHeading>

        <GridSubHeading>
          Invite co-authors to add diverse perspectives and engage your
          audience.
        </GridSubHeading>
      </div>

      <div className='px-4' aria-disabled='true'>
        <Image
          src='./users.svg'
          width='80'
          height='30'
          alt='Write Together'
          className='w-full h-8 sm:h-10'
        />

        <p className='mt-1 font-roboto text-xs sm:text-sm text-center opacity-75'>
          Ashley, Rahul & Phil are writing...
        </p>

        <div className='-mb-2 mt-2 px-0 md:px-4'>
          <div className='mb-1 h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />
          <div className='relative mb-3 h-3 w-1/2 group-hover:w-3/5 rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10 transition-all'>
            <Icon
              name='RiNavigation'
              type='Fill'
              size={16}
              className='absolute top-full left-full text-primary-monkeyOrange'
            />

            <p className='absolute left-full bottom-0 mb-1 px-3 font-roboto text-xs sm:text-sm bg-primary-monkeyOrange text-secondary-white rounded-full drop-shadow-sm'>
              Ashley
            </p>
          </div>

          <div className='mb-1 h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />
          <div className='relative mb-1 h-3 w-1/5 group-hover:w-1/4 rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10 transition-all'>
            <Icon
              name='RiNavigation'
              type='Fill'
              size={16}
              className='absolute top-full left-full text-primary-monkeyOrange'
            />

            <p className='absolute left-full bottom-0 mb-1 px-3 font-roboto text-xs sm:text-sm bg-primary-monkeyOrange text-secondary-white rounded-full drop-shadow-sm'>
              Rahul
            </p>
          </div>
          <div className='mb-1 h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />
          <div className='relative mb-3 h-3 w-3/5 group-hover:w-1/2 rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10 transition-all'>
            <Icon
              name='RiNavigation'
              type='Fill'
              size={16}
              className='absolute top-full left-full text-primary-monkeyOrange'
            />

            <p className='absolute left-full bottom-0 mb-1 px-3 font-roboto text-xs sm:text-sm bg-primary-monkeyOrange text-secondary-white rounded-full drop-shadow-sm'>
              Phil
            </p>
          </div>
          <div className='mb-1 h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />
        </div>
      </div>
    </GridContainer>
  );
};

export default CollaborativeWriting;
