import { StylesConfig } from 'react-select';

export const SelectInputStyles = (isDarkTheme: boolean): StylesConfig => ({
  control: (provided: any, state: any) => ({
    ...provided,
    outline: 'none',
    borderWidth: '1px',
    borderColor: state.isFocused
      ? isDarkTheme
        ? '#D9D9D9'
        : '#2C2C2C'
      : isDarkTheme
        ? '#696969'
        : '#878787',
    boxShadow: 'none',
    borderRadius: '0.375rem',
    backgroundColor: isDarkTheme ? '#0F0F0F' : '#F2F2F2',
    color: isDarkTheme ? '#FCFCFC' : '#0D0D0D',
    minHeight: '2.5rem',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    ':hover': {
      borderColor: isDarkTheme ? '#D9D9D9' : '#2C2C2C',
    },
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '6px',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: isDarkTheme ? '#0F0F0F' : '#F2F2F2',
    border: `1px solid ${isDarkTheme ? '#2C2C2C' : '#D9D9D9'}`,
    borderRadius: '0.375rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    zIndex: 50,
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? isDarkTheme
        ? '#3F3F3F'
        : '#E5E5E5'
      : state.isFocused
        ? isDarkTheme
          ? '#2C2C2C'
          : '#D9D9D9'
        : isDarkTheme
          ? '#0F0F0F'
          : '#F2F2F2',
    color:
      state.isSelected || state.isFocused
        ? isDarkTheme
          ? '#FCFCFC'
          : '#0D0D0D'
        : isDarkTheme
          ? '#D9D9D9'
          : '#6B6B6B',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    ':active': {
      backgroundColor: isDarkTheme ? '#3F3F3F' : '#E5E5E5',
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: isDarkTheme ? '#A3A3A3' : '#6B6B6B',
    fontSize: '0.875rem',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: isDarkTheme ? '#FCFCFC' : '#0D0D0D',
    fontSize: '0.875rem',
  }),
  multiValue: (provided: any) => ({
    ...provided,
    overflow: 'hidden',
    padding: '0px 0px 0px 4px',
    color: isDarkTheme ? '#FCFCFC' : '#0D0D0D',
    borderRadius: '4px',
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    padding: '0px 6px',
    color: '#EF4444',
  }),
  input: (provided: any) => ({
    ...provided,
    color: isDarkTheme ? '#FCFCFC' : '#0D0D0D',
  }),
  dropdownIndicator: (provided: any, state: any) => ({
    ...provided,
    color: state.isFocused
      ? isDarkTheme
        ? '#A3A3A3'
        : '#6B6B6B'
      : isDarkTheme
        ? '#6B6B6B'
        : '#CCCCCC',
    ':hover': { color: isDarkTheme ? '#A3A3A3' : '#6B6B6B' },
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    display: 'none',
  }),
  menuList: (provided: any) => ({
    ...provided,
    padding: 0,
    maxHeight: '13rem',
    overflowY: 'auto',
  }),
});
