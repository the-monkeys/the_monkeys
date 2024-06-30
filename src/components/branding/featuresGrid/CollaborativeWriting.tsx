import Image from 'next/image';

import Icon from '@/components/icon';

import { GridContainer, GridHeading, GridSubHeading } from './gridLayout';

const CollaborativeWriting = () => {
  return (
    <GridContainer className='group hover:border-primary-monkeyOrange/25'>
      <Icon
        name='RiGroup'
        className='mb-2 text-secondary-darkGrey dark:text-secondary-white group-hover:text-primary-monkeyOrange'
        size={24}
      />

      <GridHeading>Write together for impact</GridHeading>

      <GridSubHeading>
        Enrich your content by inviting co-authors to add diverse perspectives
        and engage your audience.
      </GridSubHeading>

      <div className='mt-4 flex flex-col gap-4 sm:gap-6 overflow-hidden'>
        <div>
          <div className='w-fit h-8 sm:h-10 self-start'>
            <Image
              src='./users.svg'
              width='80'
              height='30'
              className='w-full h-full'
              alt='Users'
            />
          </div>

          <p className='py-1 font-jost text-secondary-darkGrey dark:text-secondary-white text-sm cursor-default'>
            Ashley, Phil, & Rahul are writing...
          </p>
        </div>

        <div className='px-2 sm:px-6 -mb-2'>
          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />
          <div className='relative mb-1 h-2 sm:h-3 w-1/6 group-hover:w-2/5 rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10 transition-all'>
            <Icon
              name='RiQuillPen'
              type='Fill'
              size={16}
              className='absolute left-full'
            />

            <p className='absolute mb-1 left-full bottom-full px-2 sm:px-3 font-jost text-xs sm:text-sm bg-primary-monkeyOrange text-secondary-white rounded-full'>
              Ashley
            </p>
          </div>
          <div className='mb-3 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />

          <div className='relative mb-1 h-2 sm:h-3 w-3/4 group-hover:w-4/5 rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10 transition-all'>
            <Icon
              name='RiQuillPen'
              type='Fill'
              size={16}
              className='absolute left-full'
            />

            <p className='absolute mb-1 left-full bottom-full px-2 sm:px-3 font-jost text-xs sm:text-sm bg-primary-monkeyOrange text-secondary-white rounded-full'>
              Rahul
            </p>
          </div>
          <div className='mb-3 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />

          <div className='relative mb-1 h-2 sm:h-3 w-2/5 group-hover:w-1/4 rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10 transition-all'>
            <Icon
              name='RiQuillPen'
              type='Fill'
              size={16}
              className='absolute left-full'
            />

            <p className='absolute mb-1 left-full bottom-full px-2 sm:px-3 font-jost text-xs sm:text-sm bg-primary-monkeyOrange text-secondary-white rounded-full'>
              Phil
            </p>
          </div>
          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />
          <div className='h-2 sm:h-3 w-full opacity-0' />
        </div>
      </div>
    </GridContainer>
  );
};

export default CollaborativeWriting;
