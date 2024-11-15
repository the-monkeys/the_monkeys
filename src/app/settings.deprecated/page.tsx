import { Metadata } from 'next';

import Container from '@/components/layout/Container';
import { PageHeader, PageHeading } from '@/components/pageHeading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Account from './components/Account';
import Profile from './components/Profile';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Settings',
    description: 'Adjust your preferences and settings on Monkeys.',
  };
}

const SettingsPage = () => {
  return (
    <Container className='pb-12 space-y-6'>
      <PageHeader>
        <PageHeading heading='Settings' className='py-1' />
      </PageHeader>

      <Tabs defaultValue='profile'>
        <div className='flex flex-col justify-center items-center'>
          <TabsList className='font-josefin_Sans flex items-start'>
            <TabsTrigger value='profile'>
              <p className='font-josefin_Sans text-base sm:text-lg'>Profile</p>

              <div className='h-[2px] w-1 bg-primary-monkeyOrange group-data-[state=active]:w-4/5 transition-all rounded-full' />
            </TabsTrigger>

            <TabsTrigger value='account'>
              <p className='font-josefin_Sans text-base sm:text-lg'>Account</p>

              <div className='h-[2px] w-1 bg-primary-monkeyOrange group-data-[state=active]:w-4/5 transition-all rounded-full' />
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
        </div>
      </Tabs>
    </Container>
  );
};

export default SettingsPage;
