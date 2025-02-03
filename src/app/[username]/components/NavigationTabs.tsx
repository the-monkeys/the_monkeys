'use client';

import { useSession } from '@/app/session-store-provider';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

export const NavigationTabs = ({ username }: { username: string }) => {
  const { data } = useSession();

  return (
    <TabsList className='flex justify-center gap-0'>
      <TabsTrigger value='blogs'>
        <p className='px-3 font-dm_sans opacity-80 group-hover:opacity-100 group-data-[state=active]:opacity-100'>
          Blogs
        </p>

        <div className='mt-1 h-[1px] w-0 bg-brand-orange group-data-[state=active]:w-full transition-all' />
      </TabsTrigger>

      {data?.user.username === username && (
        <TabsTrigger value='drafts'>
          <p className='px-3 font-dm_sans opacity-80 group-hover:opacity-100 group-data-[state=active]:opacity-100'>
            Drafts
          </p>

          <div className='mt-1 h-[1px] w-0 bg-brand-orange group-data-[state=active]:w-full transition-all' />
        </TabsTrigger>
      )}
    </TabsList>
  );
};
