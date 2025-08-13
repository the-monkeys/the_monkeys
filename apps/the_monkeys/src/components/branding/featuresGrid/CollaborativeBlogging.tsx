import Icon from '@/components/icon';

export const CollaborativeBlogging = () => {
  return (
    <div className='group px-4 md:px-6 pt-4 md:pt-6 col-span-3 md:col-span-2 bg-background-light dark:bg-background-dark border-1 border-border-light/40 dark:border-border-dark/40 rounded-xl overflow-hidden'>
      <div className='space-y-1'>
        <h2 className='font-dm_sans font-medium text-base sm:text-lg md:text-xl'>
          Collaborative Writing
        </h2>

        <p className='text-xs sm:text-sm md:text-base opacity-90'>
          {`Invite co-authors to work on blogs together and create impactful
          stories. Writing is better when it's shared!`}
        </p>
      </div>

      <div className='mt-4 -mb-1'>
        <div className='w-full space-y-1'>
          <div className='mb-1 h-3 w-full bg-foreground-light dark:bg-foreground-dark' />
          <div className='relative mb-1 h-3 w-3/5 group-hover:w-[55%] bg-brand-orange/80 rounded-r-full transition-all'>
            <Icon
              name='RiNavigation'
              type='Fill'
              className='absolute top-full left-full'
            />

            <p className='absolute left-full bottom-0 ml-2 px-2 font-dm_sans text-xs sm:text-sm drop-shadow-md'>
              Rahul
            </p>
          </div>
          <div className='mb-1 h-3 w-full bg-foreground-light dark:bg-foreground-dark' />
          <div className='relative mb-1 h-3 w-[20%] group-hover:w-[25%] bg-brand-orange/80 rounded-r-full transition-all'>
            <Icon
              name='RiNavigation'
              type='Fill'
              className='absolute top-full left-full'
            />

            <p className='absolute left-full bottom-0 ml-2 px-2 font-dm_sans text-xs sm:text-sm drop-shadow-md'>
              Piyush
            </p>
          </div>
          <div className='mb-1 h-3 w-full bg-foreground-light dark:bg-foreground-dark' />
          <div className='mb-1 h-3 w-full bg-foreground-light dark:bg-foreground-dark' />
        </div>
      </div>
    </div>
  );
};
