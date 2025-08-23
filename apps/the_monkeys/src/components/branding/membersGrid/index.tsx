import { teamInfo } from '@/constants/team';

const MembersGrid = () => {
  return (
    <div className='mx-auto max-w-lg flex justify-center items-center gap-x-[50px] gap-y-10 flex-wrap'>
      {teamInfo.map((info, index) => {
        return (
          <div
            className='shrink-0 group flex flex-col items-center gap-[2px]'
            key={index}
          >
            <div className='size-[90px] mb-[10px] border-1 border-border-light dark:border-border-dark rounded-full overflow-hidden'>
              <img
                src={info.avatar_url || './default-profile.svg'}
                alt={info.name}
                className='h-full w-full group-hover:scale-110 transition-all'
              />
            </div>

            <h6 className='text-sm font-medium'>{info.name}</h6>
            <p className='text-sm font-medium opacity-90'>{info.position}</p>
          </div>
        );
      })}

      <div className='w-full py-4'>
        <p className='text-sm text-center opacity-90'>
          ...And all the contributors who make Monkeys possible
        </p>
      </div>
    </div>
  );
};

export default MembersGrid;
