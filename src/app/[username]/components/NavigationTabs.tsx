'use client';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from 'next-auth/react';

export const NavigationTabs = ({ username }: { username: string }) => {
  const { data } = useSession();

  return (
    <TabsList className='flex justify-center'>
      <TabsTrigger value='blogs'>
        <p className='font-josefin_Sans text-lg'>Blogs</p>

        <div className='h-[2px] w-1 bg-primary-monkeyOrange group-data-[state=active]:w-4/5 transition-all' />
      </TabsTrigger>

      {data?.user.username === username && (
        <TabsTrigger value='drafts'>
          <p className='font-josefin_Sans text-lg'>Drafts</p>

          <div className='h-[2px] w-1 bg-primary-monkeyOrange group-data-[state=active]:w-4/5 transition-all' />
        </TabsTrigger>
      )}
    </TabsList>
  );
};
