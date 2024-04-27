import { FC } from 'react';

import Icon from '../icon';
import Input from '../input';

type SearchBoxProps = {
  className?: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  showIcon?: boolean;
};

const SearchBox: FC<SearchBoxProps> = ({
  className,
  setSearchInput,
  placeholder,
  showIcon = true,
}) => {
  return (
    <div className='flex items-center'>
      {showIcon && <Icon name='RiSearchLine' />}

      <Input
        className={className}
        type='text'
        placeholderText={placeholder ? placeholder : 'Search here'}
        setInputText={setSearchInput}
        variant='ghost'
        clearIcon
      />
    </div>
  );
};

export default SearchBox;
