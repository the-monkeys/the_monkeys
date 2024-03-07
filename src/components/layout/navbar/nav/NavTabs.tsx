import React from 'react';

type NavTabVariants = 'all' | 'comments' | 'reactions';

const NavTabs = () => {
  const [tab, setTab] = React.useState<NavTabVariants>('all');

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
        onClick={() => setTab('reactions')}
      >
        <p className='px-2 font-josefin_Sans text-base'>Reactions</p>
        {tab === 'reactions' && (
          <span className='w-full border-b-2 border-primary-monkeyOrange'></span>
        )}
      </div>
    </div>
  );
};

export default NavTabs;
