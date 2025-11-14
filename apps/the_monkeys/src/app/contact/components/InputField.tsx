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
  defaultValue?: string;
  value?: string;
  onChange?: InputChangeHandler;
}

const InputField = ({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  children,
  readOnly = false,
  defaultValue = '',
  value,
  onChange,
}: inputFieldProps) => {
  const inputId = name;
  const readOnlyStyle = readOnly ? 'pointer-events-none' : '';

  const inputProps = {
    id: inputId,
    name: name,
    type: type,
    placeholder: placeholder,
    required: required,
    readOnly: readOnly,
    className: `bg-foreground-light/40 dark:bg-foreground-dark/40 ${readOnlyStyle}`,
    ...(value !== undefined ? { value, onChange } : { defaultValue }),
  };

  return (
    <div className='w-full flex flex-col'>
      <label htmlFor={inputId} className='w-full flex'>
        {label}{' '}
        {required && <span className='text-brand-orange'>&nbsp; *</span>}
      </label>
      {children ? (
        React.cloneElement(children as React.ReactElement, { id: inputId })
      ) : (
        <Input {...inputProps} />
      )}
    </div>
  );
};

export default InputField;
