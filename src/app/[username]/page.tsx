import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import All from './components/All';
import Collab from './components/Collab';

const UserPosts = () => {
  return (
    <Tabs defaultValue='all' className='space-y-2'>
      <div className='flex justify-start lg:justify-end'>
        <TabsList>
          <TabsTrigger value='all'>
            <p className='font-josefin_Sans'>All</p>

            <div className='h-[2px] w-1 bg-primary-monkeyOrange group-hover:w-full group-data-[state=active]:w-full transition-all rounded-full' />
          </TabsTrigger>

          <TabsTrigger value='collab'>
            <p className='font-josefin_Sans'>Collab</p>

            <div className='h-[2px] w-1 bg-primary-monkeyOrange group-hover:w-full group-data-[state=active]:w-full transition-all rounded-full' />
          </TabsTrigger>
        </TabsList>
      </div>

      <div className='w-full'>
        <TabsContent className='w-full' value='all'>
          <All />
        </TabsContent>

        <TabsContent className='w-full' value='collab'>
          <Collab />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default UserPosts;
