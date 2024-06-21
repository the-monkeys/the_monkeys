import Icon from '@/components/icon';

import { GridContainer, GridHeading, GridSubHeading } from './gridLayout';

const DiscoverDiversity = () => {
  return (
    <GridContainer className='flex flex-col'>
      <Icon
        name='RiCompass3'
        className='mb-2 text-secondary-darkGrey dark:text-secondary-white'
        size={24}
      />

      <GridHeading>Discover your interests with confidence</GridHeading>

      <GridSubHeading>
        Navigate through a diverse array of categories tailored to your
        interests.
      </GridSubHeading>
    </GridContainer>
  );
};

export default DiscoverDiversity;
