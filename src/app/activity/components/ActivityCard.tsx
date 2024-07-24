import Icon from '@/components/icon';
import { activityIcon } from '@/constants/activity';
import { Activity } from '@/services/activity/activityApiTypes';
import { activityDateFormatter } from '@/utils/dateFormatter';

const ActivityCard = ({ activity }: { activity: Activity }) => {
  const firstWord = activity.description.toLowerCase().split(' ')[0];
  const iconName =
    activityIcon[firstWord as keyof typeof activityIcon] || 'RiUser';

  return (
    <div className='group flex items-center gap-2 sm:gap-4'>
      <div className='px-2 flex flex-col items-center space-y-2'>
        <div className='h-3 md:h-4 w-[2px] bg-secondary-lightGrey/25' />
        <Icon
          name={iconName}
          size={24}
          type='Fill'
          className='group-hover:opacity-75'
        />
        <div className='h-3 md:h-4 w-[2px] bg-secondary-lightGrey/25' />
      </div>

      <div className='w-full flex justify-between items-center gap-2 overflow-hidden'>
        <p className='px-1 flex-1 font-jost text-sm sm:text-base capitalize truncate'>
          {activity.description}
        </p>

        <p className='font-jost text-xs sm:text-sm opacity-75'>
          {activityDateFormatter(activity.timestamp.toString())}
        </p>
      </div>
    </div>
  );
};

export default ActivityCard;
