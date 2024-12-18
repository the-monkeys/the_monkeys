'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

import { FollowingBlogs } from './components/FollowingBlogs';
import { LatestBlogs } from './components/LatestBlogs';
import { SelectedBlogs } from './components/SelectedBlogs';

const BlogFeedPage = ({
  searchParams,
}: {
  searchParams: { source: string; topic: string };
}) => {
  const { data: session, status } = useSession();

  const [activeTab, setActiveTab] = useState(
    searchParams.topic ||
      (searchParams.source === 'following' ? 'following' : 'all')
  );

  return (
    <div className='mx-auto max-w-3xl'>
      <div className='px-0 lg:px-6 flex items-center gap-2'>
        <Button
          variant={activeTab === 'all' ? 'default' : 'secondary'}
          size='sm'
          onClick={() => setActiveTab('all')}
          asChild
        >
          <Link href='/feed?source=all'>All</Link>
        </Button>

        <Button
          variant={activeTab === 'following' ? 'default' : 'secondary'}
          size='sm'
          onClick={() => setActiveTab('following')}
          asChild
        >
          <Link href='/feed?source=following'>Following</Link>
        </Button>

        {searchParams.topic && (
          <Button
            variant={activeTab === searchParams.topic ? 'default' : 'secondary'}
            size='sm'
            onClick={() => setActiveTab(searchParams.topic)}
            asChild
          >
            <Link href={`/feed?topic=${searchParams.topic}`}>
              {searchParams.topic}
            </Link>
          </Button>
        )}
      </div>

      <div className='mt-6 md:mt-8 divide-y divide-foreground-light dark:divide-foreground-dark'>
        {activeTab === 'all' && <LatestBlogs status={status} />}
        {activeTab === 'following' && (
          <FollowingBlogs username={session?.user.username} status={status} />
        )}
        {activeTab === searchParams.topic && (
          <SelectedBlogs topic={searchParams.topic} status={status} />
        )}
      </div>
    </div>
  );
};

export default BlogFeedPage;
