'use client';

import React from 'react';

import { useTheme } from 'next-themes';
import Select from 'react-select';

import { SelectInputStyles } from './styles/SelectInputStyles';

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
  const { theme } = useTheme();

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
      styles={SelectInputStyles(theme == 'dark' ? true : false)}
      // styles={{
      //   control: (provided, state) => ({
      //     ...provided,
      //     borderRadius: '10px',
      //     borderColor: '#4f4f4f',
      //     borderOpacity: state.isFocused ? '50%' : '25%',
      //     background: 'transparent',
      //   }),
      //   option: (provided, state) => ({
      //     ...provided,
      //     // backgroundColor: state.isSelected
      //     //   ? '#FF5542' // monkeyOrange for selected
      //     //   : state.isFocused
      //     //     ? '#F2F2F2' // monkeyWhite for focused
      //     //     : 'white',
      //     // color: state.isSelected ? 'white' : 'black',
      //     // '&:hover': {
      //     //   backgroundColor: state.isSelected ? '#FF5542' : '#F2F2F2', // monkeyOrange for selected, monkeyWhite for hover
      //     // },
      //   }),
      //   menu: (provided) => ({
      //     ...provided,
      //     height: '200px',
      //     overflow: 'hidden',
      //     zIndex: 9999,
      //   }),
      // }}
    />
  );
};

export default FormSearchSelect;
