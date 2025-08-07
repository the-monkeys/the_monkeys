import Image from 'next/image';

import { Blog } from '@/services/blog/blogTypes';

import { SocialSnapshotDialog } from './SocialSnapshotDialog';

export const SocialSnapshotCard = ({ blog }: { blog: Blog }) => {
  return (
    <div className='relative border-2 border-brand-orange bg-gradient-to-l from-brand-orange/30 via-brand-orange/5 to-transparent overflow-hidden'>
      <div className='flex-1 p-6 space-y-4'>
        <div className='space-y-1'>
          <h4 className='font-dm_sans font-semibold text-3xl sm:text-4xl leading-tight drop-shadow-sm'>
            Social
            <span className='font-bold text-brand-orange'> .</span>
            <br />
            Snapshot
            <span className='font-bold text-brand-orange'> .</span>
          </h4>

          <p className='text-sm sm:text-base'>
            Make this post social-ready in one click.
          </p>
        </div>

        <div className='py-2'>
          <SocialSnapshotDialog blog={blog} />
        </div>
      </div>

      <div className='absolute top-0 right-0 h-full -z-20'>
        <Image
          src={'/social-snapshot-background.svg'}
          alt='Social Snapshot'
          width={100}
          height={100}
          className='w-full h-full opacity-30 sm:opacity-90'
        />
      </div>
    </div>
  );
};
