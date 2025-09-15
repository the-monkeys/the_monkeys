import Image from 'next/image';

import { Blog } from '@/services/blog/blogTypes';

import { SocialSnapshotDialog } from './SocialSnapshotDialog';

export const SocialSnapshotCard = ({ blog }: { blog: Blog }) => {
  return (
    <div className='relative border-1 border-brand-orange/40 bg-brand-orange/10 rounded-2xl overflow-hidden'>
      <div className='w-full p-4 sm:p-6 flex items-center justify-between gap-6 flex-wrap'>
        <div className='space-y-[6px]'>
          <h4 className='font-dm_sans font-semibold text-3xl sm:text-4xl leading-tight tracking-tight drop-shadow-sm'>
            Social
            <span className='font-bold text-brand-orange'>.</span>
            <br />
            Snapshot
            <span className='font-bold text-brand-orange'>.</span>
          </h4>

          <p className='text-sm'>
            Instantly create a share-worthy social post for this post.
          </p>
        </div>

        <div className='py-2'>
          <SocialSnapshotDialog blog={blog} />
        </div>
      </div>

      <div className='absolute top-0 right-[10px] sm:right-[32px] h-full w-fit -z-20'>
        <Image
          src={'/social-snapshot-background.svg'}
          alt='Social Snapshot'
          width={100}
          height={100}
          className='w-full h-full opacity-20 object-cover scale-110 sm:scale-150'
          unoptimized
        />
      </div>
    </div>
  );
};
