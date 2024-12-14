export const VersionControl = () => {
  return (
    <div className='group px-4 md:px-6 pt-4 md:pt-6 col-span-3 md:col-span-2 row-span-2 bg-background-light dark:bg-background-dark border-1 border-foreground-light dark:border-foreground-dark rounded-xl overflow-hidden'>
      <div className='space-y-1'>
        <h2 className='font-dm_sans font-medium text-base sm:text-lg md:text-xl'>
          Version Control*
        </h2>

        <p className='font-roboto text-xs sm:text-sm md:text-base opacity-80'>
          With our intuitive versioning system, update your blogs seamlessly to
          keep them fresh and relevant.
        </p>
      </div>

      <div className='mt-4 -mb-1 h-full flex flex-col items-center'>
        <div className='h-4 border-l-4 border-border-light/50 dark:border-border-dark/50 border-dotted group-hover:border-brand-orange/50' />

        <div className='w-4/5 sm:w-1/2 px-3 py-2 border-1 border-border-light/50 dark:border-border-dark/50 group-hover:border-brand-orange/50 rounded-md'>
          <p className='font-dm_sans font-medium text-sm sm:text-base'>
            Release v0.8
          </p>

          <p className='py-1 font-dm_sans text-xs sm:text-sm opacity-80'>
            Blog published 2 months ago
          </p>
        </div>

        <div className='h-4 border-l-4 border-border-light/50 dark:border-border-dark/50 border-dotted group-hover:border-brand-orange/50 delay-75' />

        <div className='mx-auto w-full sm:w-4/5 lg:w-full h-full p-4 pb-0 flex-1 border-1 border-border-light/50 dark:border-border-dark/50 group-hover:border-brand-orange rounded-md transition-all delay-75'>
          <p className='font-dm_sans font-medium text-lg sm:text-xl'>
            Release v1.8
          </p>

          <p className='mb-4 font-dm_sans text-xs sm:text-sm opacity-80'>
            Blog published 5 mins ago
          </p>

          <div className='mb-1 h-2 w-full bg-foreground-light dark:bg-foreground-dark' />
          <div className='mb-1 h-2 w-full bg-foreground-light dark:bg-foreground-dark' />
          <div className='mb-1 h-2 w-full bg-brand-orange/80 transition-colors' />
          <div className='mb-3 h-2 w-3/5 bg-brand-orange/80 transition-all' />

          <div className='mb-1 h-2 w-full bg-brand-orange/80 transition-colors hidden lg:block' />
          <div className='mb-1 h-2 w-full bg-brand-orange/80 transition-colors hidden lg:block' />
          <div className='mb-3 h-2 w-1/5 bg-foreground-light dark:bg-foreground-dark hidden lg:block' />
        </div>
      </div>
    </div>
  );
};
