'use client';

import useAuth from '@/hooks/auth/useAuth';
import { Tabs, TabsContent } from '@the-monkeys/ui/atoms/tabs';

import { Blogs } from './components/Blogs';
import { Drafts } from './components/Drafts';
import { NavigationTabs } from './components/NavigationTabs';

const ProfilePage = ({ params }: { params: { username: string } }) => {
  const { data } = useAuth();

  return (
    <div>
      <Tabs defaultValue='blogs' className='space-y-6 md:space-y-8'>
        <NavigationTabs username={params.username} user={data} />

        <div className='w-full'>
          <TabsContent className='w-full' value='blogs'>
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
