import CollaborativeWriting from './CollaborativeWriting';
import DiscoverDiversity from './DiscoverDiversity';
import VersionControl from './VersionControl';

const FeaturesGrid = () => {
  return (
    <div className='grid grid-cols-5 gap-4 md:gap-2'>
      <div className='row-span-2 col-span-5 md:col-span-3 flex flex-col'>
        <h2 className='px-1 font-playfair_Display font-semibold text-xl sm:text-2xl'>
          Collaborative Writing
        </h2>

        <CollaborativeWriting />
      </div>

      <div className='row-span-4 col-span-5 md:col-span-2 flex flex-col'>
        <h3 className='mb-1 px-1 font-playfair_Display font-semibold text-xl sm:text-2xl text-left md:text-right'>
          Version Control
        </h3>

        <VersionControl />
      </div>

      <div className='row-span-2 col-span-5 md:col-span-3 flex flex-col'>
        <h3 className='mb-1 px-1 font-playfair_Display font-semibold text-xl sm:text-2xl'>
          Discover Diversity
        </h3>

        <DiscoverDiversity />
      </div>
    </div>
  );
};

export default FeaturesGrid;
