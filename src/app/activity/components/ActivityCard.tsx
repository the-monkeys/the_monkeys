import Icon from '@/components/icon';
import { activityIcon2 } from '@/constants/activity';
import { Activity } from '@/services/activity/activityApiTypes';
import moment from 'moment';

export const ActivityCard = ({ activity }: { activity: Activity }) => {
  const firstWord = activity.description.toLowerCase().split(' ')[0];
  const icon =
    activityIcon2[firstWord as keyof typeof activityIcon2] || 'RiUser';

  return (
    <div className='p-4 sm:p-4 border-1 border-secondary-lightGrey/25 flex items-center gap-2 sm:gap-4 rounded-md'>
      <div>
        <Icon name={icon} type='Fill' />
      </div>

      <div className='flex-1 overflow-hidden'>
        <h4 className='py-1 font-dm_sans text-sm sm:text-base capitalize'>
          {activity.description}
        </h4>

        <div className='flex justify-between flex-wrap'>
          <p className='font-roboto text-xs sm:text-sm opacity-75'>
            {moment(activity.timestamp.toString()).format('MMM DD, YYYY')}
          </p>

          <p className='font-roboto text-xs sm:text-sm opacity-75'>
            {moment(activity.timestamp.toString()).format('h:mm A')}
          </p>
        </div>
      </div>
    </div>
  );
};
