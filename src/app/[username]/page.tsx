import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Blogs from './components/Blogs';
import Collabs from './components/Collabs';
import Drafts from './components/Drafts';

const UserPosts = () => {
  return (
    <Tabs defaultValue='blogs' className='space-y-2'>
      <div className='flex justify-center md:justify-end'>
        <TabsList>
          <TabsTrigger value='blogs'>
            <p className='font-josefin_Sans text-base sm:text-lg'>Blogs</p>

            <div className='h-[2px] w-1 bg-primary-monkeyOrange group-hover:w-full group-data-[state=active]:w-full transition-all rounded-full' />
          </TabsTrigger>

          <TabsTrigger value='collabs'>
            <p className='font-josefin_Sans text-base sm:text-lg'>
              Collaborations
            </p>

            <div className='h-[2px] w-1 bg-primary-monkeyOrange group-hover:w-full group-data-[state=active]:w-full transition-all rounded-full' />
          </TabsTrigger>

          <TabsTrigger value='drafts'>
            <p className='font-josefin_Sans text-base sm:text-lg'>Drafts</p>

            <div className='h-[2px] w-1 bg-primary-monkeyOrange group-hover:w-full group-data-[state=active]:w-full transition-all rounded-full' />
          </TabsTrigger>
        </TabsList>
      </div>

      <div className='w-full'>
        <TabsContent className='w-full' value='blogs'>
          <Blogs />
        </TabsContent>

        <TabsContent className='w-full' value='collabs'>
          <Collabs />
        </TabsContent>

        <TabsContent className='w-full' value='drafts'>
          <Drafts />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default UserPosts;
