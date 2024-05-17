import Icon from '@/components/icon/Icon';

import GridTag from './GridTag';

const MobileGrid = () => {
  return (
    <div className='px-5 flex flex-col gap-2 cursor-default md:hidden'>
      <div className='relative p-4 flex flex-col rounded-lg overflow-hidden border-1 border-secondary-lightGrey/15'>
        <div className='absolute top-0 left-0 w-full h-full bg-primary-monkeyWhite/5 dark:bg-primary-monkeyBlack/5 backdrop-blur-md -z-10'></div>
        <div className='absolute top-0 left-0 w-full h-full bg-custom-gradient1 -z-20'></div>

        <div className='mb-4 p-2 self-center flex items-center rounded-full border-2 border-primary-monkeyOrange'>
          <Icon
            name='RiTeamLine'
            size={28}
            className='self-center text-secondary-darkGrey dark:text-secondary-white'
          />
        </div>

        <h3 className='font-playfair_Display font-semibold text-3xl sm:text-3xl text-primary-monkeyBlack dark:text-primary-monkeyWhite'>
          Collaborative Writing
        </h3>

        <p className='mt-2 font-jost text-secondary-darkGrey dark:text-secondary-white'>
          Enhance your content with co-authors to add diverse perspectives and
          engage your audience.
        </p>
      </div>

      <div className='relative p-4 flex flex-col rounded-lg overflow-hidden border-1 border-secondary-lightGrey/15'>
        <div className='absolute top-0 left-0 w-full h-full bg-primary-monkeyWhite/5 dark:bg-primary-monkeyBlack/5 backdrop-blur-md -z-10'></div>
        <div className='absolute top-0 left-0 w-full h-full bg-custom-gradient2 -z-20'></div>

        <div className='mb-4 p-2 self-center flex items-center rounded-full border-2 border-primary-monkeyOrange'>
          <Icon
            name='RiStackLine'
            size={28}
            className='self-center text-secondary-darkGrey dark:text-secondary-white'
          />
        </div>

        <h3 className='font-playfair_Display font-semibold text-3xl sm:text-3xl text-primary-monkeyBlack dark:text-primary-monkeyWhite'>
          Version Control
        </h3>

        <p className='mt-2 font-jost text-secondary-darkGrey dark:text-secondary-white'>
          Make your blog uniquely yours with multiple personalized versions.
        </p>
      </div>

      <div className='relative p-4 flex flex-col rounded-lg overflow-hidden border-1 border-secondary-lightGrey/15'>
        <div className='absolute top-0 left-0 w-full h-full bg-primary-monkeyWhite/5 dark:bg-primary-monkeyBlack/5 backdrop-blur-md -z-10'></div>
        <div className='absolute top-0 left-0 w-full h-full bg-custom-gradient3 -z-20'></div>

        <div className='mb-4 p-2 self-center flex items-center rounded-full border-2 border-primary-monkeyOrange'>
          <Icon
            name='RiCompass3Line'
            size={28}
            className='self-center text-secondary-darkGrey dark:text-secondary-white'
          />
        </div>

        <h3 className='font-playfair_Display font-semibold text-3xl sm:text-3xl text-primary-monkeyBlack dark:text-primary-monkeyWhite'>
          Discover Diversity
        </h3>

        <p className='mt-2 font-jost text-secondary-darkGrey dark:text-secondary-white'>
          Navigate through a diverse array of categories tailored to your
          interests.
        </p>
      </div>
    </div>
  );
};

export default MobileGrid;
