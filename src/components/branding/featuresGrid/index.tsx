import CollaborativeWriting from './CollaborativeWriting';
import DiscoverDiversity from './DiscoverDiversity';
import VersionControl from './VersionControl';

const FeaturesGrid = () => {
  return (
    <div className='mt-12 sm:mt-16 grid grid-cols-5 gap-4 md:gap-2'>
      <div className='row-span-2 col-span-5 md:col-span-3 flex flex-col'>
        <CollaborativeWriting />
      </div>

      <div className='row-span-4 col-span-5 md:col-span-2 flex flex-col'>
        <VersionControl />
      </div>

      <div className='row-span-2 col-span-5 md:col-span-3 flex flex-col'>
        <DiscoverDiversity />
      </div>
    </div>
  );
};

export default FeaturesGrid;
