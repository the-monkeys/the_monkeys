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
          borderColor: state.isFocused ? '#ff462e' : '#d1d5db', // monkeyOrange for focus
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
