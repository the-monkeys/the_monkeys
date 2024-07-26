import { Separator } from '@/components/ui/separator';

import { GridContainer, GridHeading, GridSubHeading } from './gridLayout';

const StayUpdated = () => {
  return (
    <GridContainer className='group col-span-2 sm:col-span-1 space-y-4'>
      <div className='py-4 px-4'>
        <GridHeading>Stay Updated</GridHeading>

        <GridSubHeading>
          Explore latest news and global headlines.
        </GridSubHeading>
      </div>

      <div
        className='px-4 h-40 space-y-2 grid grid-cols-3 gap-1 overflow-hidden'
        aria-disabled='true'
      >
        <div className='row-span-1 col-span-2 sm:col-span-3 flex gap-2 group-hover:-mt-10 transition-all'>
          <div className='size-12 bg-secondary-darkGrey/15 dark:bg-secondary-white/15' />

          <div className='pt-1 flex-1 space-y-1'>
            <div className='w-1/2 sm:w-1/4 h-2 bg-primary-monkeyOrange rounded-full' />
            <div className='w-full h-1 bg-secondary-darkGrey/15 dark:bg-secondary-white/15' />
            <div className='w-full h-1 bg-secondary-darkGrey/15 dark:bg-secondary-white/15' />
            <div className='w-3/5 h-1 bg-secondary-darkGrey/15 dark:bg-secondary-white/15' />
          </div>
        </div>

        <div className='row-span-3 col-span-1 flex sm:hidden flex-col gap-1'>
          <div className='mb-1 w-full h-20 bg-secondary-darkGrey/15 dark:bg-secondary-white/15' />

          <div className='w-1/2 h-2 bg-primary-monkeyOrange rounded-full' />
          <div className='w-full h-1 bg-secondary-darkGrey/15 dark:bg-secondary-white/15' />
          <div className='w-4/5 group-hover:w-full h-1 bg-secondary-darkGrey/15 dark:bg-secondary-white/15 transition-all' />
          <div className='w-4/5 group-hover:w-full h-1 bg-secondary-darkGrey/15 dark:bg-secondary-white/15 transition-all' />
        </div>

        <div className='row-span-1 col-span-2 sm:col-span-3 flex gap-2'>
          <div className='size-12 bg-secondary-darkGrey/15 dark:bg-secondary-white/15' />

          <div className='pt-1 flex-1 space-y-1'>
            <div className='w-1/2 sm:w-1/4 h-2 bg-primary-monkeyOrange rounded-full' />
            <div className='w-full h-1 bg-secondary-darkGrey/15 dark:bg-secondary-white/15' />
            <div className='w-full h-1 bg-secondary-darkGrey/15 dark:bg-secondary-white/15' />
            <div className='w-full h-1 bg-secondary-darkGrey/15 dark:bg-secondary-white/15' />
          </div>
        </div>

        <div className='row-span-1 col-span-2 sm:col-span-3 flex gap-2'>
          <div className='size-12 bg-secondary-darkGrey/15 dark:bg-secondary-white/15' />

          <div className='pt-1 flex-1 space-y-1'>
            <div className='w-1/2 sm:w-1/4 h-2 bg-primary-monkeyOrange rounded-full' />
            <div className='w-full h-1 bg-secondary-darkGrey/15 dark:bg-secondary-white/15' />
            <div className='w-full h-1 bg-secondary-darkGrey/15 dark:bg-secondary-white/15' />
            <div className='w-1/4 h-1 bg-secondary-darkGrey/15 dark:bg-secondary-white/15' />
          </div>
        </div>

        <div className='row-span-1 col-span-2 sm:col-span-3 flex gap-2'>
          <div className='size-12 bg-secondary-darkGrey/15 dark:bg-secondary-white/15' />

          <div className='pt-1 flex-1 space-y-1'>
            <div className='w-1/2 sm:w-1/4 h-2 bg-primary-monkeyOrange rounded-full' />
            <div className='w-full h-1 bg-secondary-darkGrey/15 dark:bg-secondary-white/15' />
            <div className='w-full h-1 bg-secondary-darkGrey/15 dark:bg-secondary-white/15' />
            <div className='w-1/4 h-1 bg-secondary-darkGrey/15 dark:bg-secondary-white/15' />
          </div>
        </div>
      </div>
    </GridContainer>
  );
};

export default StayUpdated;
