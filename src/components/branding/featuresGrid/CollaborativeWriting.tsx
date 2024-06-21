import Icon from '@/components/icon';

import { GridContainer, GridHeading, GridSubHeading } from './gridLayout';

const CollaborativeWriting = () => {
  return (
    <GridContainer className='flex flex-col'>
      <Icon
        name='RiShakeHands'
        className='mb-2 text-secondary-darkGrey dark:text-secondary-white'
        size={24}
      />

      <GridHeading>Write together for impact</GridHeading>

      <GridSubHeading>
        Enrich your content by inviting co-authors to add diverse perspectives
        and engage your audience.
      </GridSubHeading>
    </GridContainer>
  );
};

export default CollaborativeWriting;
