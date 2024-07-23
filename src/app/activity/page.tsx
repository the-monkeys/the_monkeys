'use client';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { activityIcon } from '@/constants/activity';
import useGetActivities from '@/hooks/useGetActivities';
import { activityDateFormatter } from '@/utils/dateFormatter';

const ActivityPage = ({ searchParams }: { searchParams: { user: string } }) => {
  const { activities, isError, isLoading } = useGetActivities(
    searchParams.user
  );

  if (isLoading)
    return (
      <div className='flex flex-col items-center space-y-2'>
        <Loader />
        <p className='font-jost'>Fetching all activity</p>
      </div>
    );

  return (
    <>
      <div className='mx-auto w-full sm:w-1/2 px-4'>
        {activities?.response.length ? (
          activities?.response.slice(0, 15).map((activity) => {
            const firstWord = activity.description.toLowerCase().split(' ')[0];
            const iconName =
              activityIcon[firstWord as keyof typeof activityIcon] || 'RiUser';

            return (
              <div
                key={activity.timestamp.toString()}
                className='flex items-center gap-4 sm:gap-6'
              >
                <div className='px-2 flex flex-col items-center space-y-2'>
                  <div className='h-4 sm:h-6 w-[2px] bg-secondary-lightGrey/25' />
                  <Icon name={iconName} size={24} type='Fill' />
                  <div className='h-4 w-[2px] bg-secondary-lightGrey/25' />
                </div>

                <div className='space-y-1'>
                  <p className='font-jost capitalize'>{activity.description}</p>

                  <p className='font-jost text-xs sm:text-sm opacity-75'>
                    on {activityDateFormatter(activity.timestamp.toString())}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className='col-span-2 sm:col-span-3 font-jost text-center opacity-75'>
            No activity available at this moment.
          </p>
        )}
      </div>
    </>
  );
};

export default ActivityPage;
