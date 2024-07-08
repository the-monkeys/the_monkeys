import CollaborativeWriting from './CollaborativeWriting';
import DiscoverDiversity from './DiscoverDiversity';
import VersionControl from './VersionControl';

const FeaturesGrid = () => {
  return (
    <div className='mt-20 grid grid-cols-5 gap-4 md:gap-2'>
      <div className='row-span-2 col-span-5 md:col-span-3 flex flex-col'>
        <h4 className='px-1 font-playfair_Display font-semibold text-xl sm:text-2xl'>
          Collaborative Writing
        </h4>

        <CollaborativeWriting />
      </div>

      <div className='row-span-4 col-span-5 md:col-span-2 flex flex-col'>
        <h4 className='px-1 font-playfair_Display font-semibold text-xl sm:text-2xl text-left md:text-right'>
          Version Control
        </h4>

        <VersionControl />
      </div>

      <div className='row-span-2 col-span-5 md:col-span-3 flex flex-col'>
        <h4 className='px-1 font-playfair_Display font-semibold text-xl sm:text-2xl'>
          Discover Diversity
        </h4>

        <DiscoverDiversity />
      </div>
    </div>
  );
};

export default FeaturesGrid;
