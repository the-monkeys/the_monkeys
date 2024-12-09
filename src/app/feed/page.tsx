'use client';

import Link from 'next/link';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from 'next-auth/react';

import { LatestBlogs } from './components/LatestBlogs';
import { SelectedBlogs } from './components/SelectedBlogs';

const BlogFeedPage = ({
  searchParams,
}: {
  searchParams: { topic: string };
}) => {
  const { status } = useSession();

  return (
    <div>
      <Tabs
        defaultValue={searchParams.topic ? searchParams.topic : 'Latest'}
        className='space-y-6'
      >
        <TabsList className='px-0 sm:px-2 md:px-6 flex justify-start gap-2 bg-background-light dark:bg-background-dark z-30'>
          <TabsTrigger value='Latest'>
            <Link href={`/feed`}>
              <p className='px-2 font-dm_sans opacity-80 group-hover:opacity-100 group-data-[state=active]:opacity-100'>
                Latest
              </p>

              <div className='mt-1 h-[1px] w-0 bg-brand-orange group-data-[state=active]:w-full transition-all' />
            </Link>
          </TabsTrigger>

          {searchParams.topic && (
            <TabsTrigger value={searchParams.topic} asChild>
              <Link href={`/feed?topic=${searchParams.topic}`}>
                <p className='px-2 font-dm_sans opacity-80 group-hover:opacity-100 group-data-[state=active]:opacity-100 capitalize'>
                  {searchParams.topic}
                </p>

                <div className='mt-1 h-[1px] w-0 bg-brand-orange group-data-[state=active]:w-full transition-all' />
              </Link>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent
          className='divide-y-1 divide-foreground-light dark:divide-foreground-dark'
          value='Latest'
        >
          <LatestBlogs status={status} />
        </TabsContent>

        <TabsContent
          className='divide-y-1 divide-foreground-light dark:divide-foreground-dark'
          value={searchParams.topic}
        >
          <SelectedBlogs topic={searchParams.topic} status={status} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogFeedPage;
