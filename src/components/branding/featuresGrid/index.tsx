import CollaborativeWriting from './CollaborativeWriting';
import DiscoverDiversity from './DiscoverDiversity';
import StayUpdated from './StayUpdated';
import VersionControl from './VersionControl';

const FeaturesGrid = () => {
  return (
    <div className='grid grid-cols-5 gap-4'>
      <CollaborativeWriting />

      <VersionControl />

      <div className='row-span-2 col-span-5 lg:col-span-3 grid grid-cols-2 gap-2 md:gap-4'>
        <DiscoverDiversity />

        <StayUpdated />
      </div>
    </div>
  );
};

export default FeaturesGrid;
