'use client';

import { Loader } from '@/components/loader';
import useGetProfileInfoById from '@/hooks/useGetProfileInfoByUserId';

export const BlogOwnerCard = ({ owner_id }: { owner_id?: string }) => {
  const { user, isLoading, isError } = useGetProfileInfoById(owner_id);

  if (isLoading) return <Loader />;

  return (
    <h1>
      {user?.first_name} {user?.last_name}
    </h1>
  );
};
