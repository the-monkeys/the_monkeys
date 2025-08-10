import Image from 'next/image';

import { Blog } from '@/services/blog/blogTypes';

import { SocialSnapshotDialog } from './SocialSnapshotDialog';

export const SocialSnapshotCard = ({ blog }: { blog: Blog }) => {
  return (
    <div className='relative border-l-2 border-brand-orange bg-gradient-to-l from-brand-orange/40 via-brand-orange/5 to-transparent overflow-hidden'>
      <div className='w-full p-6 space-y-4'>
        <div className='space-y-1'>
          <h4 className='font-dm_sans font-semibold text-3xl sm:text-4xl leading-tight drop-shadow-sm'>
            Social
            <span className='font-bold text-brand-orange'> .</span>
            <br />
            Snapshot
            <span className='font-bold text-brand-orange'> .</span>
          </h4>

          <p className='text-sm sm:text-base'>
            Make post social-ready in few clicks.
          </p>
        </div>

        <div className='py-2'>
          <SocialSnapshotDialog blog={blog} />
        </div>
      </div>

      <div className='absolute top-0 right-0 h-full w-fit -z-20'>
        <Image
          src={'/social-snapshot-background.svg'}
          alt='Social Snapshot'
          width={100}
          height={100}
          className='w-full h-full opacity-30 sm:opacity-70 object-cover'
        />
      </div>
    </div>
  );
};

export const SocialSnapshotCardCompact = ({ blog }: { blog: Blog }) => {
  return (
    <div className='relative border-l-2 border-brand-orange bg-gradient-to-l from-brand-orange/20 via-brand-orange/5 to-transparent px-4 py-3 overflow-hidden'>
      <div className='flex flex-col sm:flex-row justify-between sm:items-center gap-4'>
        <div className='space-y-1'>
          <h5 className='font-dm_sans font-semibold text-2xl leading-tight'>
            Social<span className='font-bold text-brand-orange'>.</span>{' '}
            Snapshot
            <span className='font-bold text-brand-orange'>.</span>
          </h5>

          <p className='text-sm'>Make post social-ready in few clicks.</p>
        </div>

        <div className='flex-shrink-0'>
          <SocialSnapshotDialog blog={blog} />
        </div>
      </div>

      <div className='absolute top-0 right-0 h-full w-32 -z-10 pointer-events-none'>
        <Image
          src='/social-snapshot-background.svg'
          alt='Social Snapshot'
          width={100}
          height={100}
          className='w-full h-full opacity-20 sm:opacity-50 object-cover scale-110'
        />
      </div>
    </div>
  );
};
