import Icon from '@/components/icon';

import { GridContainer, GridHeading, GridSubHeading } from './gridLayout';

const VersionControl = () => {
  return (
    <GridContainer className='flex flex-col hover:border-primary-monkeyOrange/25'>
      <Icon
        name='RiArchiveStack'
        className='mb-2 self-end text-secondary-darkGrey dark:text-secondary-white group-hover:text-primary-monkeyOrange'
        size={24}
      />

      <GridHeading className='text-right'>
        Tailor your content, your way
      </GridHeading>

      <GridSubHeading className='text-right'>
        Make your blog uniquely yours with multiple personalized versions.
      </GridSubHeading>

      <div className='mt-8 flex-1 flex flex-col items-center justify-end overflow-hidden'>
        <div className='flex-1 w-full p-2 border-t-2 border-secondary-lightGrey/75 rounded-t-2xl transition-all'>
          <p className='px-2 font-josefin_Sans text-lg sm:text-xl text-primary-monkeyOrange cursor-default'>
            Blog Title: v2.0.2
          </p>

          <p className='px-2 font-jost text-xs sm:text-sm opacity-75 cursor-default'>
            by Ashley, Phil & Rahul
          </p>

          <p className='mt-4 px-1 py-2 font-jost text-xs sm:text-sm text-right cursor-default'>
            Blocks changed: 15
          </p>

          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey dark:bg-secondary-white opacity-10' />
          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey dark:bg-secondary-white opacity-50 group-hover:opacity-0 transition-all' />
          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey dark:bg-secondary-white opacity-50 group-hover:opacity-10 transition-all' />
          <div className='mb-3 h-2 sm:h-3 w-4/5 rounded-full bg-secondary-darkGrey dark:bg-secondary-white opacity-50 group-hover:opacity-10 transition-all' />

          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey dark:bg-secondary-white opacity-10' />
          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey dark:bg-secondary-white opacity-50 group-hover:opacity-10 transition-all' />
          <div className='mb-3 h-2 sm:h-3 w-3/5 rounded-full bg-secondary-darkGrey dark:bg-secondary-white opacity-50 group-hover:opacity-0 transition-all' />

          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey dark:bg-secondary-white opacity-10 hidden sm:block' />
          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey dark:bg-secondary-white opacity-50 group-hover:opacity-10 transition-all hidden sm:block' />
          <div className='mb-3 h-2 sm:h-3 w-4/5 rounded-full bg-secondary-darkGrey dark:bg-secondary-white opacity-50 group-hover:opacity-0 transition-all hidden sm:block' />
        </div>

        <div className='w-full px-4 py-2 hover:pb-4 border-t-2 border-secondary-lightGrey/25 hover:border-secondary-lightGrey/75 rounded-t-2xl transition-all'>
          <p className='font-josefin_Sans text-sm sm:text-base cursor-default'>
            Blog Title: v2.0
          </p>

          <div className='flex justify-between gap-1 flex-wrap text-secondary-darkGrey/75 dark:text-secondary-white/75 cursor-default'>
            <p className='font-jost text-xs sm:text-sm'>by Ashley, Phil</p>
            <p className='font-jost text-xs sm:text-sm'>12 days ago</p>
          </div>
        </div>

        <div className='w-full px-4 py-2 hover:pb-4 border-t-2 border-secondary-lightGrey/25 hover:border-secondary-lightGrey/75 rounded-t-2xl transition-all'>
          <p className='font-josefin_Sans text-sm sm:text-base cursor-default'>
            Blog Title: v1.8
          </p>

          <div className='flex justify-between gap-1 flex-wrap text-secondary-darkGrey/75 dark:text-secondary-white/75 cursor-default'>
            <p className='font-jost text-xs sm:text-sm'>by Rahul, Phil</p>
            <p className='font-jost text-xs sm:text-sm'>42 days ago</p>
          </div>
        </div>

        <div className='w-full px-4 py-2 hover:pb-4 border-t-2 border-secondary-lightGrey/25 hover:border-secondary-lightGrey/75 rounded-t-2xl transition-all hidden sm:block'>
          <p className='font-josefin_Sans text-sm sm:text-base cursor-default'>
            Blog Title: v1.6
          </p>

          <div className='flex justify-between gap-1 flex-wrap text-secondary-darkGrey/75 dark:text-secondary-white/75 cursor-default'>
            <p className='font-jost text-xs sm:text-sm'>by Ashley</p>
            <p className='font-jost text-xs sm:text-sm'>3 months ago</p>
          </div>
        </div>

        <div className='w-full px-4 py-2 hover:pb-4 border-t-2 border-secondary-lightGrey/25 hover:border-secondary-lightGrey/75 rounded-t-2xl transition-all hidden sm:block'>
          <p className='font-josefin_Sans text-sm sm:text-base cursor-default'>
            Blog Title: v1.2
          </p>

          <div className='flex justify-between gap-1 flex-wrap text-secondary-darkGrey/75 dark:text-secondary-white/75 cursor-default'>
            <p className='font-jost text-xs sm:text-sm'>by Phil</p>
            <p className='font-jost text-xs sm:text-sm'>6 months ago</p>
          </div>
        </div>
      </div>
    </GridContainer>
  );
};

export default VersionControl;
