'use client';

import { GroupGridCard } from '@/components/groups/GroupGridCard';
import { Loader } from '@/components/loader';
import { useUserGroups } from '@/hooks/groups/useGroupQueries';

export function ProfileGroups({ username }: { username: string }) {
  const { data, isLoading, isError } = useUserGroups(username, {
    limit: 12,
    public_only: true,
  });
  const groups = data?.groups || [];

  if (isLoading) {
    return (
      <div className='flex justify-center py-8'>
        <Loader />
      </div>
    );
  }

  if (isError || groups.length === 0) {
    return (
      <p className='rounded-xl border border-dashed border-border-light py-12 text-center font-inter text-sm text-gray-500 dark:border-border-dark/40'>
        No public groups yet.
      </p>
    );
  }

  return (
    <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
      {groups.map((group) => (
        <GroupGridCard key={group.slug} group={group} />
      ))}
    </div>
  );
}
