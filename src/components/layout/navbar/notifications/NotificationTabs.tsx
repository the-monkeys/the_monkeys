import { useState } from 'react';

type NavTabVariants = 'all' | 'comments' | 'activity';

const NotificationTabs = () => {
  const [tab, setTab] = useState<NavTabVariants>('all');

  return (
    <div className='flex gap-2 px-4'>
      <div
        className='flex cursor-pointer flex-col'
        onClick={() => setTab('all')}
      >
        <p className='px-2 font-josefin_Sans text-base'>All</p>

        {tab === 'all' && (
          <span className='w-full border-b-2 border-primary-monkeyOrange'></span>
        )}
      </div>

      <div
        className='flex cursor-pointer flex-col'
        onClick={() => setTab('comments')}
      >
        <p className='px-2 font-josefin_Sans text-base'>Comments</p>

        {tab === 'comments' && (
          <span className='w-full border-b-2 border-primary-monkeyOrange'></span>
        )}
      </div>

      <div
        className='flex cursor-pointer flex-col'
        onClick={() => setTab('activity')}
      >
        <p className='px-2 font-josefin_Sans text-base'>Post Activity</p>

        {tab === 'activity' && (
          <span className='w-full border-b-2 border-primary-monkeyOrange'></span>
        )}
      </div>
    </div>
  );
};

export default NotificationTabs;
