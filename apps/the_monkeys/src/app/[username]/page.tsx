'use client';

import { DefaultProfile } from '@/components/profileImage';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import { ProfileSectionSkeleton } from '@/components/skeletons/profileSkeleton';
import useAuth from '@/hooks/auth/useAuth';
import useUser from '@/hooks/user/useUser';
import { Tabs, TabsContent } from '@the-monkeys/ui/atoms/tabs';

import { Blogs } from './components/Blogs';
import { Drafts } from './components/Drafts';
import { NavigationTabs } from './components/NavigationTabs';
import { ProfileSection } from './components/profile/ProfileSection';

const ProfilePage = ({ params }: { params: { username: string } }) => {
  const { data } = useAuth();

  const { user, isLoading, isError } = useUser(params.username);

  if (isError) {
    return (
      <div className='px-4 py-12 flex flex-col gap-1 items-center justify-center'>
        <div className='mb-3 size-[80px] ring-1 ring-border-light/25 dark:ring-border-dark/25 rounded-full overflow-hidden'>
          <DefaultProfile />
        </div>

        <p className='font-dm_sans font-bold text-6xl text-alert-red'>404</p>

        <h2 className='py-1 font-dm_sans font-medium text-lg text-center'>
          The Author you are looking for isn&apos;t available.
        </h2>

        <p className='text-base opacity-90 text-center'>
          They might have moved, changed names, or never existed.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='space-y-12'>
        <ProfileSectionSkeleton />

        <div className='w-full md:w-2/3'>
          <FeedBlogCardListSkeleton />
        </div>
      </div>
    );
  }

  return (
    <>
      <ProfileSection paramsUser={params.username} user={user} />

      <div className='grid grid-cols-3 gap-10'>
        <Tabs
          defaultValue='posts'
          className='col-span-3 md:col-span-2 space-y-3'
        >
          <h6 className='pb-1 font-dm_sans font-medium text-xl'>
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

        {/* TODO: add section to showcase bookmarks and notificatoins for logged in users */}
        <div className='col-span-3 md:col-span-1'></div>
      </div>
    </>
  );
};

export default ProfilePage;
