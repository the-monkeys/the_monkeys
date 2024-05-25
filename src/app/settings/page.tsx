import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Account from './components/Account';
import Notifications from './components/Notifications';
import Profile from './components/Profile';

const page = () => {
  return (
    <div className='mx-auto pb-16'>
      <Tabs defaultValue='profile' className='mt-4'>
        <h2 className='py-6 font-playfair_Display text-4xl text-center'>
          Settings
        </h2>

        <div className='mt-8 flex flex-col justify-center items-center'>
          <TabsList className='font-josefin_Sans'>
            <TabsTrigger className='text-xl' value='profile'>
              <p className='font-josefin_Sans text-base sm:text-xl'>Profile</p>
              <div className='h-[2px] w-1 bg-primary-monkeyOrange group-hover:w-full group-data-[state=active]:w-full transition-all rounded-full' />
            </TabsTrigger>

            <TabsTrigger className='text-xl' value='account'>
              <p className='font-josefin_Sans text-base sm:text-xl'>Account</p>

              <div className='h-[2px] w-1 bg-primary-monkeyOrange group-hover:w-full group-data-[state=active]:w-full transition-all rounded-full' />
            </TabsTrigger>

            <TabsTrigger className='text-xl' value='notifications'>
              <p className='font-josefin_Sans text-base sm:text-xl'>
                Notifications
              </p>

              <div className='h-[2px] w-1 bg-primary-monkeyOrange group-hover:w-full group-data-[state=active]:w-full transition-all rounded-full' />
            </TabsTrigger>
          </TabsList>
        </div>

        <div className='mx-auto w-full md:w-4/5'>
          <TabsContent className='w-full' value='profile'>
            <Profile />
          </TabsContent>

          <TabsContent className='w-full' value='account'>
            <Account />
          </TabsContent>

          <TabsContent className='w-full' value='notifications'>
            <Notifications />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default page;
