import { AI } from './AI';
import { CollaborativeBlogging } from './CollaborativeBlogging';
import { DiverseTopics } from './DiscoverDiversity';
import { News } from './News';
import { VersionControl } from './VersionControl';

const FeaturesGrid = () => {
  return (
    <div className='grid grid-cols-3 gap-2 sm:gap-4 mx-auto max-w-5xl'>
      <CollaborativeBlogging />

      <DiverseTopics />

      <AI />

      <VersionControl />

      <News />
    </div>
  );
};

export default FeaturesGrid;
