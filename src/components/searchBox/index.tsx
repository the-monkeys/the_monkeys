import { FC } from 'react';

import Icon from '../icon';
import Input from '../input';

type SearchBoxProps = {
  className?: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
};

const SearchBox: FC<SearchBoxProps> = ({ className, setSearchInput }) => {
  return (
    <div className='flex items-center gap-2'>
      <Icon name='RiSearchLine' />
      <div className='flex items-center justify-center'>
        <Input
          className={className}
          type='text'
          placeholderText='Search here'
          setInputText={setSearchInput}
          variant='ghost'
          clearIcon
        />
      </div>
    </div>
  );
};

export default SearchBox;
