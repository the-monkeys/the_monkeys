import { ReactNode } from 'react';

import { Input } from '@the-monkeys/ui/atoms/input';

interface inputFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  children?: ReactNode;
}

const InputField = ({
  label,
  name,
  type = 'text',
  placeholder,
  required = false,
  children,
}: inputFieldProps) => {
  return (
    <div className='w-full flex flex-col'>
      <label className='w-full flex'>
        {label}{' '}
        {required && <span className='text-brand-orange'>&nbsp; *</span>}
      </label>
      {children ? (
        children
      ) : (
        <Input
          className='bg-foreground-light/40 dark:bg-foreground-dark/40'
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
};

export default InputField;
