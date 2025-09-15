import Icon from '@/components/icon';

export const AI = () => {
  return (
    <div className='relative p-3 col-span-1 flex flex-col items-center justify-center gap-3 bg-brand-orange/10 border-1 border-brand-orange/40 rounded-sm overflow-hidden'>
      <Icon
        name='RiSparkling'
        size={32}
        type='Fill'
        className='text-brand-orange'
      />

      <h2 className='pb-2 font-dm_sans font-semibold text-xl smtext-2xl text-center drop-shadow-sm'>
        Monkeys AI
      </h2>
    </div>
  );
};
