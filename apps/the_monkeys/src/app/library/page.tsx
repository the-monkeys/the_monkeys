'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { LIBRARY_ROUTE, LOGIN_ROUTE } from '@/constants/routeConstants';
import useAuth from '@/hooks/auth/useAuth';
import { Tabs } from '@the-monkeys/ui/atoms/tabs';
import { TabsList } from '@the-monkeys/ui/atoms/tabs';
import { TabsTrigger } from '@the-monkeys/ui/atoms/tabs';
import { TabsContent } from '@the-monkeys/ui/atoms/tabs';

import { Bookmarks } from './components/Bookmarks';
import { Drafts } from './components/Drafts';

const LibraryPage = () => {
  const router = useRouter();
  const { data: session } = useAuth();
  const searchParams = useSearchParams();

  const source = searchParams.get('source');

  if (!session) {
    return (
      <div className='py-2 flex justify-center items-center gap-1'>
        <Link
          href={LOGIN_ROUTE}
          className='font-medium text-sm text-brand-orange underline'
        >
          Login
        </Link>

        <p className='text-sm opacity-90 text-center'>to view your library.</p>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-4xl min-h-[800px]'>
      <Tabs
        defaultValue={source || 'bookmarks'}
        value={source || 'bookmarks'}
        onValueChange={(val) => {
          router.push(`${LIBRARY_ROUTE}?source=${val}`);
        }}
        className='space-y-8'
      >
        <TabsList className='pb-4 flex justify-start sm:justify-center gap-2'>
          <TabsTrigger value='bookmarks'>
            <p className='px-[10px] font-dm_sans text-sm sm:text-base opacity-80 group-hover:opacity-100 group-data-[state=active]:opacity-100'>
              Bookmarks
            </p>

            <div className='mt-[6px] h-[2px] w-0 bg-brand-orange rounded-full group-data-[state=active]:w-3/5 transition-all' />
          </TabsTrigger>

          <TabsTrigger value='drafts'>
            <p className='px-[10px] font-dm_sans text-sm sm:text-base opacity-80 group-hover:opacity-100 group-data-[state=active]:opacity-100'>
              Drafts
            </p>

            <div className='mt-[6px] h-[2px] w-0 bg-brand-orange rounded-full group-data-[state=active]:w-3/5 transition-all' />
          </TabsTrigger>
        </TabsList>

        <div className='w-full'>
          <TabsContent className='w-full' value='bookmarks'>
            <Bookmarks />
          </TabsContent>

          <TabsContent className='w-full' value='drafts'>
            <Drafts user={session} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default LibraryPage;
