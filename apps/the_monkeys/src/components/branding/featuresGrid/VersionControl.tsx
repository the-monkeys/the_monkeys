export const VersionControl = () => {
  return (
    <div className='relative p-5 pb-0 col-span-3 md:col-span-2 border-1 border-brand-orange/40 space-y-2 rounded-sm overflow-hidden'>
      <h2 className='font-medium text-lg'>Version Control</h2>

      <div className='h-full flex flex-col items-end'>
        <div className='mr-4 h-3 border-l-2 border-brand-orange border-dotted' />

        <div className='w-1/2 sm:w-1/2 px-3 py-2 border-1 border-brand-orange/80 space-y-1'>
          <p className='font-medium text-sm'>v0.8</p>

          <p className='text-xs opacity-90'>Published 2 months ago</p>
        </div>

        <div className='mr-4 h-3 border-l-2 border-brand-orange border-dotted' />

        <div className='w-full -mb-1 px-3 py-2 border-1 border-brand-orange/80'>
          <p className='font-medium'>v1.0</p>

          <p className='mb-3 text-sm opacity-90'>Published 5 mins ago</p>

          <div className='mb-1 h-2 w-full bg-foreground-light dark:bg-foreground-dark rounded-full' />
          <div className='mb-1 h-2 w-full bg-brand-orange rounded-full' />
          <div className='mb-1 h-2 w-full bg-brand-orange rounded-full' />
          <div className='h-2 w-3/5 bg-foreground-light dark:bg-foreground-dark rounded-full' />
        </div>
      </div>
    </div>
  );
};
