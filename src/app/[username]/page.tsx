import type { Metadata } from 'next';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Blogs } from './components/Blogs';
import { Drafts } from './components/Drafts';
import { NavigationTabs } from './components/NavigationTabs';

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const username = params.username;

  return {
    title: `${username}`,
    description: 'Manage and view your profile on Monkeys.',
  };
}

const ProfilePage = ({ params }: { params: { username: string } }) => {
  return (
    <Tabs defaultValue='blogs' className='space-y-6'>
      <NavigationTabs username={params.username} />

      <div className='w-full'>
        <TabsContent className='w-full' value='blogs'>
          <Blogs />
        </TabsContent>

        <TabsContent className='w-full' value='drafts'>
          <Drafts />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default ProfilePage;
