'use client';

import React from 'react';

import Select from 'react-select';

interface FormSearchSelectProps {
  defaultSelected?: { value: string; label: string }[];
  onChange: (selected: { value: string; label: string }[]) => void;
  onInputChange?: (inputValue: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

const FormSearchSelect: React.FC<FormSearchSelectProps> = ({
  defaultSelected,
  onChange,
  onInputChange,
  options,
  placeholder,
}) => {
  return (
    <Select
      isMulti
      defaultValue={defaultSelected}
      onChange={(selectedOptions) =>
        onChange(selectedOptions as { value: string; label: string }[])
      }
      onInputChange={onInputChange}
      options={options}
      placeholder={placeholder}
      classNamePrefix='react-select'
      styles={{
        control: (provided, state) => ({
          ...provided,
          borderRadius: '10px',
          borderColor: '#4f4f4f',
          borderOpacity: state.isFocused ? '50%' : '25%',
          background: 'transparent',
        }),
        option: (provided, state) => ({
          ...provided,
          // backgroundColor: state.isSelected
          //   ? '#ff462e' // monkeyOrange for selected
          //   : state.isFocused
          //     ? '#FFF4ed' // monkeyWhite for focused
          //     : 'white',
          // color: state.isSelected ? 'white' : 'black',
          // '&:hover': {
          //   backgroundColor: state.isSelected ? '#ff462e' : '#FFF4ed', // monkeyOrange for selected, monkeyWhite for hover
          // },
        }),
        menu: (provided) => ({
          ...provided,
          height: '200px',
          overflow: 'hidden',
          zIndex: 9999,
        }),
      }}
    />
  );
};

export default FormSearchSelect;
