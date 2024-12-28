'use client';

import { Loader } from '@/components/loader';
import useGetActivities from '@/hooks/user/useGetActivities';

import { ActivityCard } from './components/ActivityCard';

const ActivityPage = ({ searchParams }: { searchParams: { user: string } }) => {
  const { activities, isError, isLoading } = useGetActivities(
    searchParams.user
  );

  if (isLoading) {
    return (
      <div className='flex flex-col items-center space-y-2'>
        <Loader />
        <p className='text-sm text-center opacity-80'>
          Retrieving your activities...
        </p>
      </div>
    );
  }

  if (isError) {
    return <p className='text-sm text-center opacity-80'>No activities yet.</p>;
  }

  return (
    <div className='px-4'>
      {activities?.response.length ? (
        activities?.response.slice(0, 15).map((activity) => {
          return (
            <div key={activity?.timestamp.toString()} className='w-fit group'>
              <ActivityCard activity={activity} />

              <div className='mx-6 h-6 sm:h-8 w-fit border-l-2 border-border-light dark:border-border-dark group-hover:border-brand-orange dark:group-hover:border-brand-orange border-dashed' />
            </div>
          );
        })
      ) : (
        <p className='col-span-2 sm:col-span-3 text-center opacity-80'>
          No activity available at this moment.
        </p>
      )}
    </div>
  );
};

export default ActivityPage;
