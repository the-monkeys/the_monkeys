import { teamInfo } from '@/constants/team';

const getYearColor = (year: string) => {
  if (year === '2023') return 'from-purple-500 to-purple-700';
  if (year === '2024') return 'from-blue-500 to-blue-700';
  if (year === '2025') return 'from-green-500 to-green-700';
};

const MembersGrid = () => {
  return (
    <div className='mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {teamInfo.map((info, index) => {
        const yearColor = getYearColor(info.joined);

        return (
          <div
            className='relative group p-6 border-1 border-border-light/80 dark:border-border-dark/80 rounded-md cursor-default animate-appear-up'
            key={index}
          >
            <div className='h-full flex flex-col items-center text-center space-y-4'>
              <div className='size-20 ring-[6px] border-2 border-background-light dark:border-background-dark rounded-full overflow-hidden ring-brand-orange/40 group-hover:ring-[4px] group-hover:scale-105 transition-transform'>
                <img
                  src={info.avatar_url || './default-profile.svg'}
                  alt={info.name}
                  className='h-full w-full rounded-full group-hover:scale-105 transition-transform'
                />
              </div>

              <div className='flex-1 space-y-1'>
                <h6 className='text-xl font-dm_sans font-semibold group-hover:text-brand-orange'>
                  {info.name}
                </h6>

                <div className='text-sm'>{info.position}</div>
              </div>

              <div
                className={`px-[10px] py-1 text-xs text-white bg-gradient-to-r ${yearColor} rounded-full`}
              >
                Joined {info.joined}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MembersGrid;
