import { AI } from './AI';
import { CollaborativeWriting } from './CollaborativeWriting';
import { Snapshot } from './Snapshot';
import { VersionControl } from './VersionControl';

const FeaturesGrid = () => {
  return (
    <div className='grid grid-cols-3 gap-2 mx-auto'>
      <CollaborativeWriting />

      <AI />

      <Snapshot />

      <VersionControl />
    </div>
  );
};

export default FeaturesGrid;
