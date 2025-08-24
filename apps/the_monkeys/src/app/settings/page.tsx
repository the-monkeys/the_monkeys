'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { Loader } from '@/components/loader';
import useAuth from '@/hooks/auth/useAuth';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@the-monkeys/ui/atoms/tabs';

import { Account } from './components/Account';
import { Notifications } from './components/Notifications';
import { Profile } from './components/Profile';
import { Security } from './components/Security';

const SettingsPage = () => {
  const { data, isError, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!data || isError)) {
      router.replace('/feed');
    }
  }, [data, isError, isLoading, router]);

  if (!data || isLoading) {
    return (
      <div className='p-8 flex items-center justify-center'>
        <Loader size={42} />
      </div>
    );
  }

  return (
    <Tabs
      defaultValue='profile'
      className='px-4 grid grid-cols-4 gap-10 sm:gap-8'
    >
      <div className='col-span-4 md:col-span-1 flex flex-col'>
        <TabsList className='font-dm_sans flex md:flex-col justify-evenly flex-wrap items-start gap-[6px]'>
          <TabsTrigger
            value='profile'
            className='w-full group px-3 py-[6px] data-[state=active]:bg-foreground-light/40 dark:data-[state=active]:bg-foreground-dark/40 items-start rounded-md hover:bg-foreground-light/40 dark:hover:bg-foreground-dark/40'
          >
            <p className='font-dm_sans group-data-[state=active]:font-medium opacity-90 group-data-[state=active]:opacity-100'>
              Profile
            </p>
          </TabsTrigger>

          <TabsTrigger
            value='account'
            className='w-full group px-3 py-[6px] data-[state=active]:bg-foreground-light/40 dark:data-[state=active]:bg-foreground-dark/40 items-start rounded-md hover:bg-foreground-light/40 dark:hover:bg-foreground-dark/40'
          >
            <p className='font-dm_sans group-data-[state=active]:font-medium opacity-90 group-data-[state=active]:opacity-100'>
              Account
            </p>
          </TabsTrigger>

          <TabsTrigger
            value='security'
            className='w-full group px-3 py-[6px] data-[state=active]:bg-foreground-light/40 dark:data-[state=active]:bg-foreground-dark/40 items-start rounded-md hover:bg-foreground-light/40 dark:hover:bg-foreground-dark/40'
          >
            <p className='font-dm_sans group-data-[state=active]:font-medium opacity-90 group-data-[state=active]:opacity-100'>
              Security
            </p>
          </TabsTrigger>

          <TabsTrigger
            value='notifications'
            className='w-full group px-3 py-[6px] data-[state=active]:bg-foreground-light/40 dark:data-[state=active]:bg-foreground-dark/40 items-start rounded-md hover:bg-foreground-light/40 dark:hover:bg-foreground-dark/40'
          >
            <p className='font-dm_sans group-data-[state=active]:font-medium opacity-90 group-data-[state=active]:opacity-100'>
              Notifications
            </p>
          </TabsTrigger>
        </TabsList>
      </div>

      <div className='col-span-4 md:col-span-3'>
        <TabsContent value='profile'>
          <Profile data={data} />
        </TabsContent>
        <TabsContent value='account'>
          <Account data={data} />
        </TabsContent>
        <TabsContent value='security'>
          <Security data={data} />
        </TabsContent>
        <TabsContent value='notifications'>
          <Notifications />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default SettingsPage;
