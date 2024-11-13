import { Metadata } from 'next';

import Container from '@/components/layout/Container';
import {
  PageHeader,
  PageHeading,
  PageSubheading,
} from '@/components/pageHeading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Account from './components/Account';
import Profile from './components/Profile';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Settings',
  };
}

const SettingsPage = () => {
  return (
    <Container className='pb-12 space-y-4 md:space-y-6'>
      <PageHeader>
        <PageHeading heading='Settings' className='py-1 self-start' />
        <PageSubheading
          subheading='Customize your experience and manage your account settings.'
          className='self-start opacity-75'
        />
      </PageHeader>

      <Tabs
        defaultValue='profile'
        className='px-4 grid grid-cols-4 gap-4 md:gap-6'
      >
        <div className='col-span-4 md:col-span-1 flex flex-col  '>
          <TabsList className='p-1 font-josefin_Sans flex flex-col items-start gap-2 md:gap-3'>
            <TabsTrigger
              value='profile'
              className='w-full flex flex-row justify-start gap-2 opacity-75 data-[state=active]:opacity-100 hover:opacity-100'
            >
              <p className='font-josefin_Sans'>Profile</p>

              <div className='size-2 rounded-full bg-primary-monkeyOrange hidden group-data-[state=active]:block'></div>
            </TabsTrigger>

            <TabsTrigger
              value='account'
              className='w-full flex flex-row justify-start gap-2 opacity-75 data-[state=active]:opacity-100 hover:opacity-100'
            >
              <p className='font-josefin_Sans'>Account</p>

              <div className='size-2 rounded-full bg-primary-monkeyOrange hidden group-data-[state=active]:block'></div>
            </TabsTrigger>

            <TabsTrigger
              value='security'
              className='w-full flex flex-row justify-start gap-2 opacity-75 data-[state=active]:opacity-100 hover:opacity-100'
            >
              <p className='font-josefin_Sans'>Security</p>

              <div className='size-2 rounded-full bg-primary-monkeyOrange hidden group-data-[state=active]:block'></div>
            </TabsTrigger>

            <TabsTrigger
              value='notifications'
              className='w-full flex flex-row justify-start gap-2 opacity-75 data-[state=active]:opacity-100 hover:opacity-100'
            >
              <p className='font-josefin_Sans'>Notifications</p>

              <div className='size-2 rounded-full bg-primary-monkeyOrange hidden group-data-[state=active]:block'></div>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className='col-span-4 md:col-span-3'>
          <TabsContent className='min-h-screen' value='profile'>
            <Profile />
          </TabsContent>

          <TabsContent className='min-h-screen w-full' value='account'>
            <Account />
          </TabsContent>

          <TabsContent className='min-h-screen w-full' value='security'>
            <p className='font-jost text-center opacity-75'>
              Security settings will be available soon.
            </p>
          </TabsContent>

          <TabsContent className='min-h-screen w-full' value='notifications'>
            <p className='font-jost text-center opacity-75'>
              Notification settings will be available soon.
            </p>
          </TabsContent>
        </div>
      </Tabs>
    </Container>
  );
};

export default SettingsPage;
