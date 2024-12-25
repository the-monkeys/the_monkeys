import React, { useState } from 'react';

import Icon from '@/components/icon';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type PasswordInputProps = {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

const PasswordInput: React.FC<PasswordInputProps> = ({
  placeholder,
  value,
  onChange,
  className,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className='relative'>
      <Input
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn('peer', className)}
      />
      <button
        type='button'
        onClick={togglePasswordVisibility}
        className='absolute inset-y-0 right-0 pr-3 opacity-25 peer-focus:opacity-100'
      >
        <Icon name={!showPassword ? 'RiEyeClose' : 'RiEye'} size={16} />
      </button>
    </div>
  );
};

export default PasswordInput;
