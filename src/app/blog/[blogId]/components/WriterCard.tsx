'use client';

import { Loader } from '@/components/loader';
import useGetProfileInfoById from '@/hooks/useGetProfileInfoByUserId';

export const BlogOwnerCard = ({ owner_id }: { owner_id?: string }) => {
  const { user, isLoading, isError } = useGetProfileInfoById(owner_id);

  if (isLoading) return <Loader />;

  if (isError)
    return (
      <p className='py-4 font-jost text-sm text-alert-red'>
        User not available
      </p>
    );

  return (
    <>
      <h4 className='font-josefin_Sans text-xl sm:text-2xl group-hover:opacity-75'>
        {user?.first_name} {user?.last_name}{' '}
      </h4>

      <p className='font-josefin_Sans text-xs sm:text-sm text-primary-monkeyOrange'>
        @{user?.username}
      </p>
    </>
  );
};
