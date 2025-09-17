'use client';

import { DefaultProfile } from '@/components/profileImage';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import { ProfileSectionSkeleton } from '@/components/skeletons/profileSkeleton';
import useAuth from '@/hooks/auth/useAuth';
import useUser from '@/hooks/user/useUser';

import { Blogs } from './components/Blogs';
import { ProfileSection } from './components/profile/ProfileSection';
import { WordCloudCard } from './components/wordCloud/WordCloud';

const ProfilePage = ({ params }: { params: { username: string } }) => {
  const { data } = useAuth();

  const { user, isLoading, isError } = useUser(params.username);

  if (isError) {
    return (
      <div className='px-4 py-12 flex flex-col gap-1 items-center justify-center'>
        <div className='mb-3 size-[80px] ring-1 ring-border-light dark:ring-border-dark rounded-full overflow-hidden'>
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

      <div className='grid grid-cols-3 gap-8 mt-4 sm:mt-6 lg:mt-10'>
        <div className='h-fit col-span-3 lg:col-span-1'>
          <WordCloudCard username={params.username} />
        </div>

        <div className='col-span-3 lg:col-span-2 max-w-4xl space-y-6'>
          <h6 className='font-dm_sans font-medium text-lg'>
            Latest from{' '}
            <span className='font-dm_sans text-xl'>{user?.first_name}</span>
          </h6>

          <Blogs username={params.username} user={data} />
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
