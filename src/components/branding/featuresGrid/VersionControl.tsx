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

      <div className='flex-1 mt-4 overflow-hidden'>
        <div className='relative w-fit flex flex-col items-center'>
          <div className='mx-8 h-4 w-1 bg-secondary-lightGrey' />
          <div className='absolute -bottom-1 size-2 ring-4 ring-secondary-lightGrey/25 bg-secondary-lightGrey rounded-full' />
        </div>

        <div className='p-2 pt-3 flex flex-col'>
          <p className='font-jost text-secondary-darkGrey dark:text-secondary-white'>
            Guarding Your Data - v1.2
          </p>
          <p className='font-jost text-sm opacity-50'>Published 2 months ago</p>
        </div>

        <div className='relative w-fit flex flex-col items-center'>
          <div className='mx-8 h-8 w-1 bg-primary-monkeyOrange' />
          <div className='absolute -bottom-1 size-2 ring-4 ring-primary-monkeyOrange/25 bg-primary-monkeyOrange rounded-full' />
        </div>

        <div className='-mb-2 w-full h-full p-4 pb-0 flex flex-col rounded-md border-2 border-primary-monkeyOrange/25 overflow-hidden'>
          <div className='self-end w-fit px-3 py-1 rounded-md bg-primary-monkeyOrange font-jost text-sm text-secondary-white cursor-default'>
            Publish v1.8
          </div>

          <p className='mb-4 font-josefin_Sans text-base sm:text-lg cursor-default'>
            Guarding Your Data
            <span className='font-jost block text-xs sm:text-sm opacity-75'>
              John, Megan +1 editing...
            </span>
          </p>

          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-alert-red/25' />
          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-alert-green/25' />
          <div className='mb-1 h-2 sm:h-3 w-full rounded-full bg-secondary-darkGrey/10 dark:bg-secondary-white/10' />
        </div>
      </div>
    </GridContainer>
  );
};

export default VersionControl;
