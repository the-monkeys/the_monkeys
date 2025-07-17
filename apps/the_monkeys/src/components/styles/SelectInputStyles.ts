import { StylesConfig } from 'react-select';

export const SelectInputStyles = (isDarkTheme: boolean): StylesConfig => ({
  control: (provided: any, state: any) => ({
    ...provided,
    outline: 'none',
    borderWidth: '1px',
    borderColor: state.isFocused
      ? isDarkTheme
        ? '#EDEDED'
        : '#1E1E1E'
      : isDarkTheme
        ? '#3F3F3F'
        : '#CCCCCC',
    boxShadow: 'none',
    borderRadius: '0.375rem',
    backgroundColor: isDarkTheme ? '#121212' : '#FAFAFA',
    color: isDarkTheme ? '#FFFFFF' : '#121212',
    minHeight: '2.5rem',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    ':hover': {
      borderColor: isDarkTheme ? '#EDEDED' : '#1E1E1E',
    },
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '6px',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: isDarkTheme ? '#121212' : '#FAFAFA',
    border: `1px solid ${isDarkTheme ? '#1E1E1E' : '#EDEDED'}`,
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
          ? '#1E1E1E'
          : '#EDEDED'
        : isDarkTheme
          ? '#121212'
          : '#FAFAFA',
    color:
      state.isSelected || state.isFocused
        ? isDarkTheme
          ? '#FFFFFF'
          : '#121212'
        : isDarkTheme
          ? '#EDEDED'
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
    color: isDarkTheme ? '#FFFFFF' : '#121212',
    fontSize: '0.875rem',
  }),
  multiValue: (provided: any) => ({
    ...provided,
    overflow: 'hidden',
    padding: '0px 0px 0px 4px',
    color: isDarkTheme ? '#FFFFFF' : '#121212',
    borderRadius: '4px',
  }),
  multiValueRemove: (provided: any) => ({
    ...provided,
    padding: '0px 6px',
    color: '#DC2626',
  }),
  input: (provided: any) => ({
    ...provided,
    color: isDarkTheme ? '#FFFFFF' : '#121212',
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
