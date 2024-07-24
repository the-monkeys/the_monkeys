import Image from 'next/image';

import Icon from '@/components/icon';

import { GridContainer, GridHeading, GridSubHeading } from './gridLayout';

const CollaborativeWriting = () => {
  return (
    <GridContainer className='group flex flex-col hover:border-primary-monkeyOrange/25'>
      <GridHeading>Collaborative Writing</GridHeading>

      <GridSubHeading>
        Enrich your content by inviting co-authors to add diverse perspectives
        and engage your audience.
      </GridSubHeading>

      <div
        className='mt-6 flex-1 flex flex-col gap-4 sm:gap-6 overflow-hidden animate-appear-up'
        aria-disabled='true'
      >
        <div>
          <div className='w-fit h-8 sm:h-10 self-start'>
            <Image
              src='./users.svg'
              width='80'
              height='30'
              className='w-full h-full'
              alt='Monkeys Users'
              title='Monkeys Users'
            />
          </div>

          <p className='py-1 font-jost text-secondary-darkGrey dark:text-secondary-white text-sm cursor-default'>
            Ashley, Rahul, and Phil are writing...
          </p>
        </div>

        <div className='px-2 sm:px-6 -mb-2'>
          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />
          <div className='relative mb-1 h-2 sm:h-3 w-1/2 group-hover:w-1/5 rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10 transition-all'>
            <Icon
              name='RiCursor'
              type='Fill'
              size={16}
              className='absolute left-full'
            />

            <p className='absolute mb-1 left-full bottom-full px-2 sm:px-3 font-jost text-xs sm:text-sm bg-primary-monkeyOrange text-secondary-white rounded-full'>
              Ashley
            </p>
          </div>
          <div className='mb-3 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />

          <div className='relative mb-1 h-2 sm:h-3 w-4/5 group-hover:w-1/2 rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10 transition-all'>
            <Icon
              name='RiCursor'
              type='Fill'
              size={16}
              className='absolute left-full'
            />

            <p className='absolute mb-1 left-full bottom-full px-2 sm:px-3 font-jost text-xs sm:text-sm bg-primary-monkeyOrange text-secondary-white rounded-full'>
              Rahul
            </p>
          </div>
          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />
          <div className='relative mb-1 h-2 sm:h-3 w-1/5 group-hover:w-4/5 rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10 transition-all'>
            <Icon
              name='RiCursor'
              type='Fill'
              size={16}
              className='absolute left-full'
            />

            <p className='absolute mb-1 left-full bottom-full px-2 sm:px-3 font-jost text-xs sm:text-sm bg-primary-monkeyOrange text-secondary-white rounded-full'>
              Phil
            </p>
          </div>
          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />
        </div>
      </div>
    </GridContainer>
  );
};

export default CollaborativeWriting;
