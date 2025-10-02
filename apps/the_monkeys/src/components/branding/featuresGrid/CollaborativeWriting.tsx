import Icon from '@/components/icon';

export const CollaborativeWriting = () => {
  return (
    <div className='p-5 col-span-3 md:col-span-2 border-1 border-brand-orange/40 space-y-4 rounded-sm overflow-hidden'>
      <h2 className='font-medium text-lg'>Collaborative Writing</h2>

      <div>
        <div className='w-full space-y-1'>
          <div className='mb-1 h-[10px] w-full bg-foreground-light/60 dark:bg-foreground-dark/60 rounded-full' />
          <div className='relative mb-1 h-[10px] w-3/5 bg-brand-orange rounded-full'>
            <Icon
              name='RiNavigation'
              type='Fill'
              className='absolute top-full left-full'
              size={18}
            />

            <p className='absolute left-full bottom-0 ml-2 px-2 text-xs drop-shadow-md'>
              Rahul
            </p>
          </div>
          <div className='mb-1 h-[10px] w-full bg-foreground-light/60 dark:bg-foreground-dark/60 rounded-full' />
          <div className='mb-1 h-[10px] w-full bg-foreground-light/60 dark:bg-foreground-dark/60 rounded-full' />
          <div className='relative mb-1 h-[10px] w-1/4 bg-brand-orange rounded-full'>
            <Icon
              name='RiNavigation'
              type='Fill'
              className='absolute top-full left-full'
              size={18}
            />

            <p className='absolute left-full bottom-0 ml-2 px-2 text-xs drop-shadow-md'>
              Piyush
            </p>
          </div>
          <div className='mb-1 h-[10px] w-full bg-foreground-light/60 dark:bg-foreground-dark/60 rounded-full' />
          <div className='h-[10px] w-full bg-foreground-light/60 dark:bg-foreground-dark/60 rounded-full' />
        </div>
      </div>
    </div>
  );
};
