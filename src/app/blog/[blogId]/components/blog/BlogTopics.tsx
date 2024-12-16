import Link from 'next/link';

import { TopicBadgeBlog } from '@/components/badges/topicBadge';
import Icon from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const BlogTopics = ({ topics }: { topics: string[] }) => {
  return (
    <div>
      <h4 className='px-1 font-dm_sans text-sm md:text-base'>Published in</h4>

      <Separator className='mt-1 mb-2' />

      <div className='flex items-center gap-1 flex-wrap'>
        {topics.length ? (
          topics?.map((topic, index) => (
            <TopicBadgeBlog key={index} topic={topic} />
          ))
        ) : (
          <div className='py-2 flex-1 flex flex-col items-center gap-4'>
            <p className='font-roboto text-sm opacity-80 text-center'>
              No blogs available.
            </p>

            <Button size='sm' className='rounded-full ' asChild>
              <Link href='/explore-topics'>
                <Icon name='RiCompass' className='mr-1' />
                Explore
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
