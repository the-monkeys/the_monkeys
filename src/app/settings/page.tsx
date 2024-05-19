import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Account from './components/Account';
import Notifications from './components/Notifications';
import UpdateProfile from './components/UpdateProfile';

const page = () => {
  return (
    <div className='mx-auto pb-[60px]'>
      <Tabs defaultValue='profile' className=' mt-[60px] '>
        <div className='flex flex-col justify-center items-center'>
          {' '}
          <h2 className='mt-[21px] mb-[60px] font-playfair_Display text-4xl font-normal'>
            Settings
          </h2>
          <TabsList className='font-josefin_Sans '>
            <TabsTrigger className='text-xl ' value='profile'>
              Profile
            </TabsTrigger>
            <TabsTrigger className='text-xl ' value='account'>
              Account
            </TabsTrigger>
            <TabsTrigger className='text-xl ' value='notifications'>
              Notifications
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent className='min-w-full' value='profile'>
          <UpdateProfile />
        </TabsContent>
        <TabsContent value='account'>
          <Account />
        </TabsContent>
        <TabsContent value='notifications'>
          <Notifications />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
