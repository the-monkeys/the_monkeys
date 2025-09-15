import Image from 'next/image';

export const Snapshot = () => {
  return (
    <div className='relative p-3 col-span-2 md:col-span-1 flex items-center justify-center bg-brand-orange/10 border-1 border-brand-orange/40 rounded-sm overflow-hidden'>
      <h2 className='pb-2 font-dm_sans font-semibold text-xl sm:text-2xl text-center drop-shadow-sm'>
        Social Snapshots
      </h2>

      <div className='absolute top-0 right-[12px] h-full w-fit -z-20'>
        <Image
          src={'/social-snapshot-background.svg'}
          alt='Social Snapshot'
          width={100}
          height={100}
          className='w-full h-full opacity-20 object-cover scale-150 md:scale-110'
          unoptimized
        />
      </div>
    </div>
  );
};
