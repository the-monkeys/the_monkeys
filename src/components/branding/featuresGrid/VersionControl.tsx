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
          <p className='font-josefin_Sans text-xl text-primary-monkeyOrange'>
            Blog Published: v2.8
          </p>
          <p className='mb-2 font-jost opacity-75'>
            by Rick Astley, Jake Peralta +1
          </p>
          <p className='mb-4 font-jost text-sm opacity-75 text-right'>
            2 days ago
          </p>

          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />
          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-alert-red/25' />
          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-alert-green/25' />
          <div className='mb-3 h-2 sm:h-3 w-3/4 rounded-full bg-alert-green/25 group-hover:w-full transition-all' />

          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />
          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-alert-red/25' />
          <div className='mb-1 h-2 sm:h-3 w-1/2 rounded-full bg-alert-red/25 group-hover:w-full transition-all' />
          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-alert-green/25' />
          <div className='mb-1 h-2 sm:h-3 w-1/4 rounded-full bg-alert-green/25 group-hover:w-full transition-all' />
        </div>

        <div className='w-full px-4 py-3 hover:pb-6 border-t-2 border-secondary-lightGrey/25 hover:border-secondary-lightGrey/75 rounded-t-2xl transition-all'>
          <p className='font-josefin_Sans cursor-default'>v2.5</p>
          <p className='font-jost text-sm opacity-75 cursor-default'>
            updated 19 days ago
          </p>
        </div>

        <div className='w-full px-4 py-3 hover:pb-6 border-t-2 border-secondary-lightGrey/25 hover:border-secondary-lightGrey/75 rounded-t-2xl transition-all'>
          <p className='font-josefin_Sans cursor-default'>v2.2</p>
          <p className='font-jost text-sm opacity-75 cursor-default'>
            updated 27 days ago
          </p>
        </div>

        <div className='w-full px-4 py-3 hover:pb-6 border-t-2 border-secondary-lightGrey/25 hover:border-secondary-lightGrey/75 rounded-t-2xl transition-all hidden md:block'>
          <p className='font-josefin_Sans cursor-default'>v1.4</p>
          <p className='font-jost text-sm opacity-75 cursor-default'>
            updated 2 months ago
          </p>
        </div>
      </div>
    </GridContainer>
  );
};

export default VersionControl;
