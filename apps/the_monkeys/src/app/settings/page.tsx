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
import { Verification } from './components/Verification';

const SettingsPage = () => {
  const { data, isError, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!data || isError)) {
      router.replace('/');
    }
  }, [data, isError, isLoading, router]);

  if (!data || isLoading) {
    return (
      <div className='p-8 flex flex-col items-center justify-center gap-1'>
        <Loader size={42} />

        {!data && !isLoading && (
          <p className='text-sm text-center opacity-90'>
            You are not logged in. Redirecting to feed.
          </p>
        )}
      </div>
    );
  }

  return (
    <Tabs
      defaultValue='profile'
      className='grid min-w-0 grid-cols-4 gap-6 px-4 sm:gap-8'
    >
      <div className='col-span-4 min-w-0 md:col-span-1'>
        <TabsList className='flex w-full flex-wrap justify-start gap-1 pb-2 font-dm_sans md:flex-col md:flex-nowrap md:items-stretch md:pb-0'>
          <TabsTrigger
            value='profile'
            className='group w-auto shrink-0 px-3 py-2 md:w-full data-[state=active]:bg-foreground-light/40 dark:data-[state=active]:bg-foreground-dark/40 items-start rounded-md hover:bg-foreground-light/40 dark:hover:bg-foreground-dark/40'
          >
            <p className='font-dm_sans group-data-[state=active]:font-medium opacity-90 group-data-[state=active]:opacity-100'>
              Profile
            </p>
          </TabsTrigger>

          <TabsTrigger
            value='account'
            className='group w-auto shrink-0 px-3 py-2 md:w-full data-[state=active]:bg-foreground-light/40 dark:data-[state=active]:bg-foreground-dark/40 items-start rounded-md hover:bg-foreground-light/40 dark:hover:bg-foreground-dark/40'
          >
            <p className='font-dm_sans group-data-[state=active]:font-medium opacity-90 group-data-[state=active]:opacity-100'>
              Account
            </p>
          </TabsTrigger>

          <TabsTrigger
            value='security'
            className='group w-auto shrink-0 px-3 py-2 md:w-full data-[state=active]:bg-foreground-light/40 dark:data-[state=active]:bg-foreground-dark/40 items-start rounded-md hover:bg-foreground-light/40 dark:hover:bg-foreground-dark/40'
          >
            <p className='font-dm_sans group-data-[state=active]:font-medium opacity-90 group-data-[state=active]:opacity-100'>
              Security
            </p>
          </TabsTrigger>

          <TabsTrigger
            value='verification'
            className='group w-auto shrink-0 px-3 py-2 md:w-full data-[state=active]:bg-foreground-light/40 dark:data-[state=active]:bg-foreground-dark/40 items-start rounded-md hover:bg-foreground-light/40 dark:hover:bg-foreground-dark/40'
          >
            <p className='font-dm_sans group-data-[state=active]:font-medium opacity-90 group-data-[state=active]:opacity-100'>
              Verification
            </p>
          </TabsTrigger>

          <TabsTrigger
            value='notifications'
            className='group w-auto shrink-0 px-3 py-2 md:w-full data-[state=active]:bg-foreground-light/40 dark:data-[state=active]:bg-foreground-dark/40 items-start rounded-md hover:bg-foreground-light/40 dark:hover:bg-foreground-dark/40'
          >
            <p className='font-dm_sans group-data-[state=active]:font-medium opacity-90 group-data-[state=active]:opacity-100'>
              Notifications
            </p>
          </TabsTrigger>
        </TabsList>
      </div>

      <div className='col-span-4 min-w-0 md:col-span-3'>
        <TabsContent value='profile'>
          <Profile data={data} />
        </TabsContent>
        <TabsContent value='account'>
          <Account data={data} />
        </TabsContent>
        <TabsContent value='security'>
          <Security data={data} />
        </TabsContent>
        <TabsContent value='verification'>
          <Verification />
        </TabsContent>
        <TabsContent value='notifications'>
          <Notifications />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default SettingsPage;
