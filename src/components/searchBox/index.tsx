import { FC } from 'react';

import Icon from '../icon';
import Input from '../input';

type SearchBoxProps = {
  className?: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
};

const SearchBox: FC<SearchBoxProps> = ({ className, setSearchInput }) => {
  return (
    <div className='flex items-center'>
      <Icon name='RiSearchLine' />

      <Input
        className={className}
        type='text'
        placeholderText='Search here'
        setInputText={setSearchInput}
        variant='ghost'
        clearIcon
      />
    </div>
  );
};

export default SearchBox;
