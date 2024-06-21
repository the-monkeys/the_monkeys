import Icon from '@/components/icon';

import { GridContainer, GridHeading, GridSubHeading } from './gridLayout';

const VersionControl = () => {
  return (
    <GridContainer className='flex flex-col'>
      <Icon
        name='RiArchiveStack'
        className='mb-2 self-end text-secondary-darkGrey dark:text-secondary-white'
        size={24}
      />

      <GridHeading className='text-right'>
        Tailor your content, your way
      </GridHeading>

      <GridSubHeading className='text-right'>
        Make your blog uniquely yours with multiple personalized versions.
      </GridSubHeading>
    </GridContainer>
  );
};

export default VersionControl;
