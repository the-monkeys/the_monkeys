'use client';

import React from 'react';

import { useTheme } from 'next-themes';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

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

  const handleChange = (selectedOptions: any) => {
    onChange(selectedOptions as { value: string; label: string }[]);
  };

  return (
    <CreatableSelect
      isMulti
      defaultValue={defaultSelected}
      onChange={handleChange}
      onInputChange={onInputChange}
      options={options}
      placeholder={placeholder}
      classNamePrefix='react-select'
      styles={SelectInputStyles(theme == 'dark' ? true : false)}
    />
  );
};

export default FormSearchSelect;
