import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import All from './components/All';
import Collab from './components/Collab';

const UserPosts = () => {
  return (
    <div className='px-5 py-4'>
      {/*Remove this 
        <LinksRedirectArrow target='/activity' title='View Activity' />*/}
      {/*Add tabs to switch between Posts and Drafts */}
      <Tabs >
        <div className='flex justify-end'>
          <TabsList>
            <TabsTrigger className='text-xl' value='all'>
              <p className='font-josefin_Sans text-base sm:text-xl'>All</p>
              <div className='h-[2px] w-1 bg-primary-monkeyOrange group-hover:w-full group-data-[state=active]:w-full transition-all rounded-full' />
            </TabsTrigger>
            <TabsTrigger className='text-xl' value='collab'>
              <p className='font-josefin_Sans text-base sm:text-xl'>Collab</p>
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
