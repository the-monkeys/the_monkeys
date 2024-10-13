import { FC } from 'react';

import Select, { MenuPlacement } from 'react-select';

type FormSearchSelectProps = {
  onChange: (e: {
    value: string;
    label: string;
    code?: string;
    ltp?: string;
  }) => void;
  options: any;
  onMultiChange?: (e: { value: string; label: string }[]) => void;
  onInputChange?: (e: string) => void;
  defaultSelected?:
    | { value: string; label: string }
    | { value: string; label: string }[]
    | null;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  isMulti?: boolean;
  direction?: MenuPlacement | undefined;
};

const FormSearchSelect: FC<FormSearchSelectProps> = ({
  onChange,
  options,
  defaultSelected,
  placeholder = 'Select an option',
  className,
  onInputChange,
  onMultiChange,
  disabled,
  isMulti = false,
  direction,
}) => {
  return (
    <Select
      defaultValue={defaultSelected}
      value={defaultSelected}
      options={options}
      isDisabled={disabled}
      onChange={(e) => {
        if (!isMulti) {
          if (typeof e === 'object') {
            // @ts-ignore
            if (e) onChange(e);
          }
        } else {
          // @ts-ignore
          if (e) {
            console.log(e);

            // @ts-ignore
            onMultiChange && onMultiChange(e);
          }
        }
      }}
      onInputChange={(e) => {
        // setSearchText(e);
        onInputChange && onInputChange(e);
      }}
      className={className ? className : 'mt-5 p-0'}
      placeholder={placeholder}
      menuPosition='absolute'
      menuPlacement={direction ? direction : 'bottom'}
      isMulti={isMulti ? true : false}
      menuShouldScrollIntoView={true}
      styles={{
        control: (provided, state) => ({
          ...provided,
          borderColor: state.isFocused ? '#ff462e' : '#d1d5db',
          boxShadow: state.isFocused ? '0 0 0 1px #ff462e' : 'none', // monkeyOrange for focus
          '&:hover': {
            borderColor: state.isFocused ? '#ff462e' : '#d1d5db', // monkeyOrange for hover
          },
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected
            ? '#ff462e' // monkeyOrange for selected
            : state.isFocused
              ? '#FFF4ed' // monkeyWhite for focused
              : 'white',
          color: state.isSelected ? 'white' : 'black',
          '&:hover': {
            backgroundColor: state.isSelected ? '#ff462e' : '#FFF4ed', // monkeyOrange for selected, monkeyWhite for hover
          },
        }),
        menu: (provided) => ({
          ...provided,
          zIndex: 9999,
        }),
      }}
    />
  );
};

export default FormSearchSelect;
