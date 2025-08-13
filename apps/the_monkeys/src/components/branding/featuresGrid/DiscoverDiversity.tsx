import Icon from '@/components/icon';

export const DiverseTopics = () => {
  return (
    <div className='group p-4 md:p-6 col-span-3 sm:col-span-2 md:col-span-1 flex flex-col justify-end gap-6 bg-background-light dark:bg-background-dark border-1 border-border-light/40 dark:border-border-dark/40 rounded-xl overflow-hidden'>
      <Icon name='RiCompass' size={24} />

      <div className='space-y-1'>
        <h2 className='font-dm_sans font-medium text-base sm:text-lg md:text-xl'>
          Diverse Topics
        </h2>

        <p className='text-xs sm:text-sm md:text-base opacity-90'>
          Explore categories from tech to travel—something for everyone.
        </p>
      </div>
    </div>
  );
};
