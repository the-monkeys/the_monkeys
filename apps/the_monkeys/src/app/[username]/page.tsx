'use client';

import { BackButton } from '@/components/buttons/backButton';
import { DefaultProfile } from '@/components/profileImage';
import { FeedBlogCardListSkeleton } from '@/components/skeletons/blogSkeleton';
import { AuthorProfileCardSkeleton } from '@/components/skeletons/profileSkeleton';
import useAuth from '@/hooks/auth/useAuth';
import useUser from '@/hooks/user/useUser';

import { Blogs } from './components/Blogs';
import { ProfileSection } from './components/profile/ProfileSection';

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
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-16'>
        <aside className='order-first lg:order-last lg:col-span-1'>
          <div className='p-4 rounded-md'>
            <AuthorProfileCardSkeleton />
          </div>
        </aside>

        <div className='order-last w-full lg:order-first lg:col-span-2'>
          <FeedBlogCardListSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-16'>
      <aside className='order-first lg:order-last lg:col-span-1'>
        <ProfileSection paramsUser={params.username} user={user} />
      </aside>

      <section className='order-last max-w-4xl space-y-4 font-extrabold lg:order-first lg:col-span-2'>
        <BackButton />
        <h6 className='font-dm_sans  text-3xl'>
          Latest from{' '}
          <span className='font-dm_sans text-3xl'>{user?.first_name}</span>
        </h6>

        <Blogs username={params.username} user={data} />
      </section>
    </div>
  );
};

export default ProfilePage;
