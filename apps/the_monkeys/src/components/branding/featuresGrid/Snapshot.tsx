import Icon from '@/components/icon';

export const Snapshot = () => {
  return (
    <div className='group min-h-[150px] p-3 col-span-3 sm:col-span-2 md:col-span-1 flex flex-col items-center justify-center gap-3 bg-brand-orange/10 border-1 border-brand-orange/20 rounded-sm overflow-hidden'>
      <Icon
        name='RiCameraLens'
        size={40}
        type='Fill'
        className='text-brand-orange group-hover:animate-icon-shake'
      />

      <div className='space-y-1'>
        <h2 className='font-dm_sans font-semibold text-xl sm:text-2xl text-center drop-shadow-sm'>
          Social Snapshots
        </h2>

        <p className='text-sm text-center'>
          Instantly create a share-worthy social post for this post.
        </p>
      </div>
    </div>
  );
};
