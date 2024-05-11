import { FC } from 'react';

import Icon from '../icon';
import Input from '../input';

type SearchBoxProps = {
  className?: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  disabledPlaceholder?: string;
  showIcon?: boolean;
  disabled?: boolean;
};

const SearchBox: FC<SearchBoxProps> = ({
  className,
  setSearchInput,
  placeholder,
  disabledPlaceholder,
  showIcon = true,
  disabled,
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
        disabled={disabled}
        disabledPlaceholderText={disabledPlaceholder}
      />
    </div>
  );
};

export default SearchBox;
