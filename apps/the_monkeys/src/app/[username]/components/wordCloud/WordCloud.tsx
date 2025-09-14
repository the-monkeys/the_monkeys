import useGetUserTags from '@/hooks/blog/useGetUserTags';
import { Skeleton } from '@the-monkeys/ui/atoms/skeleton';

import { WordCloudDialog } from './WordCloudDialog';

export const WordCloudCard = ({ username }: { username: string }) => {
  const { tags, isLoading, isError } = useGetUserTags({ username: username });

  const isEligible = Object.keys(tags?.tags!).length > 40;

  return (
    <div className='relative border-1 border-brand-orange/40 bg-brand-orange/10 rounded-2xl overflow-hidden'>
      <div className='w-full p-4 sm:p-6 flex items-center justify-between gap-6 flex-wrap'>
        <div className='space-y-[6px]'>
          <h4 className='font-dm_sans font-semibold text-[26px] sm:text-3xl leading-tight tracking-tight drop-shadow-sm'>
            Word
            <span className='font-bold text-brand-orange'>.</span>
            {'  '}
            Cloud
            <span className='font-bold text-brand-orange'>.</span>
          </h4>

          <p className='text-sm'>
            Recurring topics in the Author&apos;s writing.
          </p>
        </div>

        <div>
          {isLoading ? (
            <Skeleton className='rounded-lg h-9 w-40 !bg-brand-orange/40' />
          ) : isError ? (
            <p className='text-sm text-alert-red'>
              Error fetching Author&apos;s topics. Try again later.
            </p>
          ) : (
            <WordCloudDialog
              tags={tags?.tags || {}}
              username={username}
              isEligible={isEligible}
            />
          )}
        </div>
      </div>
    </div>
  );
};
