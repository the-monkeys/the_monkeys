import { GridContainer, GridHeading, GridSubHeading } from './gridLayout';

const VersionControl = () => {
  return (
    <GridContainer className='h-full group row-span-4 col-span-5 lg:col-span-2 space-y-4'>
      <div className='py-4 px-4'>
        <GridHeading className='text-left lg:text-right'>
          Version Control
        </GridHeading>

        <GridSubHeading className='text-left lg:text-right'>
          Make your blog uniquely yours with multiple personalized versions.
        </GridSubHeading>
      </div>

      <div className='h-full px-4' aria-disabled='true'>
        <div className='relative py-2 flex flex-col items-center gap-2'>
          <div className='absolute top-0 left-1/2 h-full w-1 bg-secondary-lightGrey/15 group-hover:bg-primary-monkeyOrange -z-10 transition-all' />

          <div className='w-4/5 sm:w-1/2 px-4 py-2 bg-primary-monkeyWhite dark:bg-primary-monkeyBlack border-1 border-secondary-lightGrey/25 group-hover:border-primary-monkeyOrange/50 rounded-lg hidden lg:block'>
            <p className='font-josefin_Sans text-sm sm:text-base'>
              Release v0.8
            </p>

            <div className='flex justify-between gap-1 flex-wrap text-secondary-darkGrey/75 dark:text-secondary-white/75'>
              <p className='font-jost text-xs sm:text-sm'>by Ashley</p>
              <p className='font-jost text-xs sm:text-sm'>2 months ago</p>
            </div>
          </div>

          <div className='w-4/5 sm:w-1/2 px-4 py-2 bg-primary-monkeyWhite dark:bg-primary-monkeyBlack border-1 border-secondary-lightGrey/25 group-hover:border-primary-monkeyOrange/50 rounded-lg'>
            <p className='font-josefin_Sans text-sm sm:text-base'>
              Release v1.2
            </p>

            <div className='flex justify-between gap-1 flex-wrap text-secondary-darkGrey/75 dark:text-secondary-white/75'>
              <p className='font-jost text-xs sm:text-sm'>by Phil</p>
              <p className='font-jost text-xs sm:text-sm'>27 days ago</p>
            </div>
          </div>
        </div>

        <div className='mx-auto w-full sm:w-4/5 lg:w-full h-full p-4 pb-0 flex-1 border-1 border-secondary-lightGrey/25 group-hover:border-primary-monkeyOrange rounded-lg transition-all delay-75'>
          <p className='font-josefin_Sans font-medium text-lg sm:text-xl'>
            Release v1.8
          </p>

          <p className='mb-4 font-jost text-xs sm:text-sm opacity-75'>
            by Ashley, Phil & Rahul
          </p>

          <div className='mb-2 flex justify-between flex-wrap gap-2'>
            <p className='font-jost text-xs sm:text-sm'>Blocks changed: 15</p>

            <p className='font-jost text-xs sm:text-sm'>5 mins ago</p>
          </div>

          <div className='mb-1 h-2 w-full rounded-full bg-secondary-darkGrey/25 dark:bg-secondary-white/25' />
          <div className='mb-1 h-2 w-full rounded-full bg-secondary-darkGrey/25 dark:bg-secondary-white/25' />
          <div className='mb-1 h-2 w-full rounded-full bg-primary-monkeyOrange transition-colors' />
          <div className='mb-3 h-2 w-1/4 rounded-full bg-primary-monkeyOrange transition-all' />

          <div className='mb-1 h-2 w-full rounded-full bg-primary-monkeyOrange transition-colors hidden lg:block' />
          <div className='mb-1 h-2 w-full rounded-full bg-primary-monkeyOrange transition-colors hidden lg:block' />
          <div className='mb-3 h-2 w-3/5 rounded-full bg-secondary-darkGrey/25 dark:bg-secondary-white/25 hidden lg:block' />

          <div className='mb-1 h-2 w-full rounded-full bg-secondary-darkGrey/25 dark:bg-secondary-white/25 hidden lg:block' />
          <div className='mb-1 h-2 w-full rounded-full bg-primary-monkeyOrange transition-colors hidden lg:block' />
          <div className='mb-1 h-2 w-1/2 rounded-full bg-primary-monkeyOrange transition-colors hidden lg:block' />
        </div>
      </div>
    </GridContainer>
  );
};

export default VersionControl;
