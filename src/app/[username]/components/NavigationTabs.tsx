'use client';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from 'next-auth/react';

export const NavigationTabs = ({ username }: { username: string }) => {
  const { data } = useSession();

  return (
    <TabsList className='flex justify-center gap-0'>
      <TabsTrigger value='blogs'>
        <p className='px-4 font-dm_sans text-base sm:text-lg opacity-75 group-data-[state=active]:opacity-100'>
          Blogs
        </p>

        <div className='mt-[2px] h-[1px] w-0 bg-brand-orange group-data-[state=active]:w-full transition-all' />
      </TabsTrigger>

      {data?.user.username === username && (
        <TabsTrigger value='drafts'>
          <p className='px-4 font-dm_sans text-base sm:text-lg opacity-75 group-data-[state=active]:opacity-100'>
            Drafts
          </p>

          <div className='mt-[2px] h-[1px] w-0 bg-brand-orange group-data-[state=active]:w-full transition-all' />
        </TabsTrigger>
      )}
    </TabsList>
  );
};
