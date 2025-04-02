import Icon from '@/components/icon';

export const AI = () => {
  return (
    <div className='group p-4 md:p-6 col-span-3 sm:col-span-1 flex flex-col justify-between gap-4 bg-background-light dark:bg-background-dark border-1 border-foreground-light dark:border-foreground-dark rounded-xl overflow-hidden'>
      <div className='h-full flex flex-col items-center gap-2'>
        <Icon
          name='RiSparkling'
          size={24}
          type='Fill'
          className='text-brand-orange opacity-80'
        />

        <h2 className='font-dm_sans font-semibold text-lg sm:text-xl md:text-2xl text-center'>
          Monkeys AI
        </h2>

        <p className='text-sm sm:text-base text-center opacity-80'>
          Personalized experience with AI-driven content suggestions.
        </p>
      </div>
    </div>
  );
};
