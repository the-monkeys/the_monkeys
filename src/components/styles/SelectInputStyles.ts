import { StylesConfig } from 'react-select';

export const SelectInputStyles = (isDarkTheme: boolean): StylesConfig => ({
  control: (provided: any, state: any) => ({
    ...provided,
    outline: 'none',
    borderWidth: '2px',
    borderColor: state.isFocused
      ? isDarkTheme
        ? '#d4d4d4' // Light gray border for dark theme
        : '#cccccc' // Light gray border for light theme
      : isDarkTheme
        ? '#2b2b2b' // Dark gray border for dark theme
        : '#e5e5e5', // Light gray border for light theme
    boxShadow: state.isFocused
      ? isDarkTheme
        ? '0 0 0 2px #d4d4d4'
        : '0 0 0 2px #cccccc'
      : 'none', // Subtle glow on focus
    borderRadius: '0.375rem',
    backgroundColor: isDarkTheme ? '#1f1f1f' : '', // Black for dark, white for light
    color: isDarkTheme ? '#f5f5f5' : '#333333',
    minHeight: '2.5rem', // Match input height of shadcn/ui
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: isDarkTheme ? '#1f1f1f' : '#ffffff', // Black for dark, white for light
    border: `1px solid ${isDarkTheme ? '#2b2b2b' : '#e5e5e5'}`, // Dark gray for dark, light gray for light
    borderRadius: '0.375rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
    zIndex: 50,
    maxHeight: '13rem',
    overflowY: 'hidden', // Scroll when content exceeds
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? isDarkTheme
        ? '#2e2e2e' // Dark gray on hover for dark
        : '#f9f9f9' // Light gray on hover for light
      : state.isSelected
        ? isDarkTheme
          ? '#3f3f3f' // Slightly lighter gray for selected (dark)
          : '#f3f3f3' // Light gray for selected (light)
        : isDarkTheme
          ? '#1f1f1f' // Default black background for dark
          : '#ffffff', // Default white background for light
    color:
      state.isSelected || state.isFocused
        ? isDarkTheme
          ? '#f5f5f5' // White text on hover/selected (dark)
          : '#333333' // Dark gray text on hover/selected (light)
        : isDarkTheme
          ? '#d4d4d4' // Light gray text otherwise (dark)
          : '#6b6b6b', // Medium gray text otherwise (light)
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    ':active': {
      backgroundColor: isDarkTheme ? '#3f3f3f' : '#f3f3f3', // Active state matches selected
    },
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: isDarkTheme ? '#a3a3a3' : '#6b6b6b', // Lighter gray for placeholder
    fontSize: '0.875rem',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: isDarkTheme ? '#f5f5f5' : '#333333', // White for dark, black for light
    fontSize: '0.875rem',
  }),
  input: (provided: any) => ({
    ...provided,
    color: isDarkTheme ? '#f5f5f5' : '#333333', // White text for dark, black for light
  }),
  dropdownIndicator: (provided: any, state: any) => ({
    ...provided,
    color: state.isFocused
      ? isDarkTheme
        ? '#a3a3a3' // Gray dropdown indicator for dark
        : '#6b6b6b' // Gray dropdown indicator for light
      : isDarkTheme
        ? '#6b6b6b'
        : '#cccccc', // Subtle gray when not focused
    ':hover': { color: isDarkTheme ? '#a3a3a3' : '#6b6b6b' }, // Lighter gray on hover
  }),
  clearIndicator: (provided: any) => ({
    ...provided,
    display: 'none', // Hide the clear (cross) button
  }),
  menuList: (provided: any) => ({
    ...provided,
    padding: 0, // Remove extra padding around options
  }),
});
