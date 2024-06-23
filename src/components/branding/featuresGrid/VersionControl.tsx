import Icon from '@/components/icon';

import { GridContainer, GridHeading, GridSubHeading } from './gridLayout';

const VersionControl = () => {
  return (
    <GridContainer className='flex flex-col'>
      <Icon
        name='RiArchiveStack'
        className='mb-2 self-end text-secondary-darkGrey dark:text-secondary-white'
        size={24}
      />

      <GridHeading className='text-right'>
        Tailor your content, your way
      </GridHeading>

      <GridSubHeading className='text-right'>
        Make your blog uniquely yours with multiple personalized versions.
      </GridSubHeading>

      <div className='mt-4 flex-1 flex flex-col items-center justify-end overflow-hidden'>
        <div className='flex-1 w-full px-4 py-3 border-t-2 border-primary-monkeyOrange rounded-t-2xl transition-all'>
          <p className='font-josefin_Sans text-lg sm:text-xl text-primary-monkeyOrange cursor-default'>
            Blog Update: v2.8
          </p>

          <p className='mb-6 font-jost text-xs sm:text-sm opacity-75 cursor-default'>
            by Rick Astley, Jake Peralta +1
          </p>

          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />
          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-alert-red/25' />
          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-alert-green/25' />
          <div className='mb-3 h-2 sm:h-3 w-1/4 rounded-full bg-alert-green/25 group-hover:w-full transition-all' />

          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />
          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-alert-red/25' />
          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-alert-green/25 group-hover:w-full transition-all' />
          <div className='mb-1 h-2 sm:h-3 w-4/5 rounded-full bg-alert-green/25 group-hover:w-full transition-all' />
        </div>

        <div className='w-full px-4 py-3 hover:pb-6 border-t-2 border-secondary-lightGrey/25 hover:border-secondary-lightGrey/75 rounded-t-2xl transition-all'>
          <p className='font-josefin_Sans text-sm sm:text-base cursor-default'>
            Published v2.5
          </p>

          <div className='flex justify-between gap-1 flex-wrap'>
            <p className='font-jost text-xs sm:text-sm text-secondary-darkGrey dark:text-secondary-white cursor-default'>
              by Jake Peralta, Phil
            </p>
            <p className='font-jost text-xs sm:text-sm text-secondary-darkGrey/75 dark:text-secondary-white/75 cursor-default'>
              12 days ago
            </p>
          </div>
        </div>

        <div className='w-full px-4 py-3 hover:pb-6 border-t-2 border-secondary-lightGrey/25 hover:border-secondary-lightGrey/75 rounded-t-2xl transition-all'>
          <p className='font-josefin_Sans text-sm sm:text-base cursor-default'>
            Published v2.2
          </p>

          <div className='flex justify-between gap-1 flex-wrap'>
            <p className='font-jost text-xs sm:text-sm text-secondary-darkGrey dark:text-secondary-white cursor-default'>
              by Rick Astley, Phil
            </p>
            <p className='font-jost text-xs sm:text-sm text-secondary-darkGrey/75 dark:text-secondary-white/75 cursor-default'>
              27 days ago
            </p>
          </div>
        </div>

        <div className='w-full px-4 py-3 hover:pb-6 border-t-2 border-secondary-lightGrey/25 hover:border-secondary-lightGrey/75 rounded-t-2xl transition-all'>
          <p className='font-josefin_Sans text-sm sm:text-base cursor-default'>
            Published v1.4
          </p>

          <div className='flex justify-between gap-1 flex-wrap'>
            <p className='font-jost text-xs sm:text-sm text-secondary-darkGrey dark:text-secondary-white cursor-default'>
              by Rick Astley
            </p>
            <p className='font-jost text-xs sm:text-sm text-secondary-darkGrey/75 dark:text-secondary-white/75 cursor-default'>
              2 months ago
            </p>
          </div>
        </div>
      </div>
    </GridContainer>
  );
};

export default VersionControl;
