import Icon from '@/components/icon';

export const Snapshot = () => {
  return (
    <div className='group p-4 md:p-6 col-span-3 md:col-span-1 flex flex-col justify-end gap-6 bg-background-light dark:bg-background-dark border-1 border-border-light dark:border-border-dark rounded-xl overflow-hidden'>
      <Icon name='RiDownload2' size={24} className='opacity-80' />

      <div className='space-y-1'>
        <h2 className='font-dm_sans font-medium text-base sm:text-lg md:text-xl'>
          Social Snapshot
        </h2>

        <p className='text-xs sm:text-sm md:text-base opacity-80'>
          Create, download and share media cards to share on socials.
        </p>
      </div>
    </div>
  );
};
