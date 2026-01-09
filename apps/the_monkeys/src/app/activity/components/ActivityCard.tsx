import { Activity } from '@/services/activity/activityApiTypes';
import { format } from 'date-fns';

export const ActivityCard = ({ activity }: { activity: Activity }) => {
  return (
    <div className='pb-2 flex items-start gap-2 sm:gap-4'>
      <div>
        <p className='font-dm_sans text-xs sm:text-sm group-hover:text-brand-orange'>
          {format(new Date(activity.timestamp.toString()), 'MMM dd, yyyy')}
        </p>

        <p className='text-xs opacity-80'>
          {format(new Date(activity.timestamp.toString()), 'h:mm a')}
        </p>
      </div>

      <h4 className='flex-1 text-sm sm:text-base capitalize cursor-default'>
        {activity.description}
      </h4>
    </div>
  );
};
