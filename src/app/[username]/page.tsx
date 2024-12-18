import type { Metadata } from 'next';

import { Tabs, TabsContent } from '@/components/ui/tabs';

import { Blogs } from './components/Blogs';
import { Drafts } from './components/Drafts';
import { NavigationTabs } from './components/NavigationTabs';
import { Saved } from './components/Saved';

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const username = params.username;

  return {
    title: `@${username}`,
  };
}

const ProfilePage = ({ params }: { params: { username: string } }) => {
  return (
    <div className=''>
      <Tabs defaultValue='blogs' className='space-y-6'>
        <NavigationTabs username={params.username} />

        <div className='w-full'>
          <TabsContent className='w-full' value='blogs'>
            <Blogs />
          </TabsContent>

          <TabsContent className='w-full' value='drafts'>
            <Drafts />
          </TabsContent>

          <TabsContent className='w-full' value='saved'>
            <Saved />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
