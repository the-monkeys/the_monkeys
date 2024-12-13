import Icon from '@/components/icon';

export const RespectfulEnv = () => {
  return (
    <div className='group p-4 md:p-6 col-span-3 md:col-span-1 flex flex-col justify-between gap-4 bg-background-light dark:bg-background-dark border-1 border-foreground-light dark:border-foreground-dark rounded-xl overflow-hidden'>
      <Icon name='RiHeart3' size={24} className='opacity-80' />

      <div className='space-y-1'>
        <h2 className='font-dm_sans font-medium text-base sm:text-lg md:text-xl'>
          Respectful Environment
        </h2>

        <p className='font-roboto text-xs sm:text-sm md:text-base opacity-80'>
          Share your thoughts freely while adhering to a no-hate policy that
          fosters inclusivity and positivity.
        </p>
      </div>
    </div>
  );
};
