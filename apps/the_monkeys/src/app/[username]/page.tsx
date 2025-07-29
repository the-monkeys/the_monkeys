'use client';

import useAuth from '@/hooks/auth/useAuth';
import { Tabs, TabsContent } from '@the-monkeys/ui/atoms/tabs';

import { Blogs } from './components/Blogs';
import { Drafts } from './components/Drafts';
import { NavigationTabs } from './components/NavigationTabs';
import { TopicsCard } from './components/profile/TopicsCard';

const ProfilePage = ({ params }: { params: { username: string } }) => {
  const { data } = useAuth();

  return (
    <div className='grid grid-cols-3 gap-10'>
      <div className='col-span-3 md:col-span-1'>
        <TopicsCard />
      </div>

      <Tabs defaultValue='posts' className='col-span-3 md:col-span-2 space-y-3'>
        <h6 className='pb-2 font-dm_sans font-medium text-2xl'>
          Latest from Author
        </h6>

        {data?.username === params.username ? (
          <NavigationTabs username={params.username} user={data} />
        ) : null}

        <div className='pt-4 w-full'>
          <TabsContent className='w-full' value='posts'>
            <Blogs username={params.username} user={data} />
          </TabsContent>

          <TabsContent className='w-full' value='drafts'>
            <Drafts username={params.username} user={data} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
