import { AI } from './AI';
import { CollaborativeBlogging } from './CollaborativeBlogging';
import { DiverseTopics } from './DiscoverDiversity';
import { Showcase } from './Showcase';
import { VersionControl } from './VersionControl';

const FeaturesGrid = () => {
  return (
    <div className='grid grid-cols-3 gap-2 sm:gap-4 mx-auto max-w-5xl'>
      <CollaborativeBlogging />

      <DiverseTopics />

      <AI />

      <VersionControl />

      <Showcase />
    </div>
  );
};

export default FeaturesGrid;
