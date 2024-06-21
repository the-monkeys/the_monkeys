import CollaborativeWriting from './CollaborativeWriting';
import DiscoverDiversity from './DiscoverDiversity';
import VersionControl from './VersionControl';

const FeaturesGrid = () => {
  return (
    <div className='mt-20 sm:px-5 grid grid-cols-5 gap-3'>
      <div className='group row-span-2 col-span-5 md:col-span-3 flex flex-col gap-1'>
        <h4 className='px-1 font-playfair_Display font-semibold text-xl sm:text-2xl text-primary-monkeyOrange text-left group-hover:px-3 transition-all'>
          Collaborative Writing
        </h4>

        <CollaborativeWriting />
      </div>

      <div className='group row-span-4 col-span-5 md:col-span-2 flex flex-col gap-1'>
        <h4 className='px-1 font-playfair_Display font-semibold text-xl sm:text-2xl text-primary-monkeyOrange text-right group-hover:px-3 transition-all'>
          Version Control
        </h4>

        <VersionControl />
      </div>

      <div className='group row-span-2 col-span-5 md:col-span-3 flex flex-col gap-1'>
        <h4 className='px-1 font-playfair_Display font-semibold text-xl sm:text-2xl text-primary-monkeyOrange group-hover:px-3 transition-all'>
          Discover Diversity
        </h4>

        <DiscoverDiversity />
      </div>
    </div>
  );
};

export default FeaturesGrid;
