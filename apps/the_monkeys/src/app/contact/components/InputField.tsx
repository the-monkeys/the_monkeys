import React, { ReactNode } from 'react';

import { Input } from '@the-monkeys/ui/atoms/input';

type InputChangeHandler = React.ChangeEventHandler<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

interface inputFieldProps {
  label?: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  children?: ReactNode;
  readOnly?: boolean;
  className?: string;
  defaultValue?: string;
  value?: string;
  onChange?: InputChangeHandler;
  error?: string;
  onValueChange?: () => void;
}

const InputField = ({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  children,
  readOnly = false,
  className = '',
  defaultValue = '',
  value,
  onChange,
  error,
  onValueChange,
}: inputFieldProps) => {
  const inputId = name;
  const readOnlyStyle = readOnly ? 'pointer-events-none text-center' : '';

  const handleChange: InputChangeHandler = (e) => {
    onValueChange?.();
    onChange?.(e);
  };

  const inputProps = {
    id: inputId,
    name: name,
    type: type,
    placeholder: placeholder,
    required: required,
    readOnly: readOnly,
    className: `bg-foreground-light/40 dark:bg-foreground-dark/40 ${className} ${readOnlyStyle}`,
    ...(value !== undefined
      ? { value, onChange: handleChange }
      : { defaultValue, onChange: handleChange }),
  };

  return (
    <div className='w-full flex flex-col'>
      <label htmlFor={inputId} className='w-full flex whitespace-nowrap'>
        {label}{' '}
        {label?.trim() && required && (
          <span className='text-brand-orange'>&nbsp; *</span>
        )}
      </label>
      {children ? (
        React.cloneElement(children as React.ReactElement, { id: inputId })
      ) : (
        <Input {...inputProps} />
      )}
      {error && <span className='text-red-500 text-xs mt-1'>{error}</span>}
    </div>
  );
};

export default InputField;
