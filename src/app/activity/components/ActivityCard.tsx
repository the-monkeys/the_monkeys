import { Activity } from '@/services/activity/activityApiTypes';
import moment from 'moment';

export const ActivityCard = ({ activity }: { activity: Activity }) => {
  return (
    <div className='pb-2 flex items-start gap-2 sm:gap-4'>
      <div>
        <p className='font-dm_sans text-xs sm:text-sm group-hover:text-brand-orange'>
          {moment(activity.timestamp.toString()).format('MMM DD, YYYY')}
        </p>

        <p className='font-roboto text-xs opacity-80'>
          {moment(activity.timestamp.toString()).format('h:mm A')}
        </p>
      </div>

      <h4 className='flex-1 font-roboto text-sm sm:text-base capitalize cursor-default'>
        {activity.description}
      </h4>
    </div>
  );
};
