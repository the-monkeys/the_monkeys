import type { Metadata } from 'next';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Blogs from './components/Blogs';
import Drafts from './components/Drafts';

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const username = params.username;

  return {
    title: `${username}`,
    description: 'Manage and view your profile on Monkeys.',
  };
}

const ProfilePage = () => {
  return (
    <Tabs defaultValue='blogs' className='space-y-6'>
      <TabsList className='flex justify-center md:justify-end'>
        <TabsTrigger value='blogs'>
          <p className='font-josefin_Sans text-base sm:text-lg'>Blogs</p>

          <div className='h-[2px] w-1 bg-primary-monkeyOrange group-data-[state=active]:w-4/5 transition-all rounded-full' />
        </TabsTrigger>

        <TabsTrigger value='drafts'>
          <p className='font-josefin_Sans text-base sm:text-lg'>Drafts</p>

          <div className='h-[2px] w-1 bg-primary-monkeyOrange group-data-[state=active]:w-4/5 transition-all rounded-full' />
        </TabsTrigger>
      </TabsList>

      <div className='w-full'>
        <TabsContent className='w-full' value='blogs'>
          <Blogs />
        </TabsContent>

        <TabsContent className='w-full' value='drafts'>
          <Drafts />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default ProfilePage;
