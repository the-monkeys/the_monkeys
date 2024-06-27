import Container from '@/components/layout/Container';
import PageHeading from '@/components/pageHeading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Account from './components/Account';
import Post from './components/Post';
import Profile from './components/Profile';

const SettingsPage = () => {
  return (
    <Container className='pb-12'>
      <PageHeading heading='Settings' />

      <Tabs defaultValue='profile'>
        <div className='mt-6 flex flex-col justify-center items-center'>
          <TabsList className='font-josefin_Sans'>
            <TabsTrigger value='profile'>
              <p className='font-josefin_Sans text-base sm:text-lg'>Profile</p>
              <div className='h-[2px] w-1 bg-primary-monkeyOrange group-hover:w-full group-data-[state=active]:w-full transition-all rounded-full' />
            </TabsTrigger>

            <TabsTrigger value='account'>
              <p className='font-josefin_Sans text-base sm:text-lg'>Account</p>

              <div className='h-[2px] w-1 bg-primary-monkeyOrange group-hover:w-full group-data-[state=active]:w-full transition-all rounded-full' />
            </TabsTrigger>

            <TabsTrigger value='post'>
              <p className='font-josefin_Sans text-base sm:text-lg'>Post</p>

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

          <TabsContent className='w-full' value='post'>
            <Post />
          </TabsContent>
        </div>
      </Tabs>
    </Container>
  );
};

export default SettingsPage;
