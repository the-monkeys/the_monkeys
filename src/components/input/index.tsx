import { ChangeEvent, InputHTMLAttributes, forwardRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import Icon from '../icon';
import { inputVariantStyles } from '../variantStyles';

type InputVariants = 'border' | 'ghost' | 'area';

export type InputVariantStyles = {
  base: string;
  border: string;
  ghost: string;
};

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  placeholderText: string;
  variant: InputVariants;
  clearIcon?: boolean;
  setInputText: React.Dispatch<React.SetStateAction<string>>;
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      type,
      disabled,
      label,
      placeholderText,
      variant,
      className,
      clearIcon,
      setInputText,
    },
    ref
  ) => {
    const [localInput, setLocalInput] = useState<string>('');

    const getStyles = () => {
      switch (variant) {
        case 'border':
          return `${inputVariantStyles['base']} ${inputVariantStyles['border']}`;
        case 'ghost':
          return `${inputVariantStyles['base']} ${inputVariantStyles['ghost']}`;
        case 'area':
          return `${inputVariantStyles['base']} ${inputVariantStyles['border']}`;
      }
    };

    const handleInputChange = (
      e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
    ) => {
      const newText = e.target.value;
      setLocalInput(newText);
      setInputText(newText);
    };

    const handleClearInput = () => {
      setLocalInput('');
      setInputText('');
    };

    return (
      <div className='flex flex-col items-start'>
        {label && (
          <p className='pl-1 font-josefin_Sans text-sm sm:text-base md:text-lg'>
            {label}
          </p>
        )}
        {variant === 'area' ? (
          <textarea
            placeholder={!disabled ? placeholderText : 'Input disabled'}
            value={localInput}
            className={twMerge(
              className,
              getStyles(),
              'resize-none',
              disabled && 'cursor-not-allowed'
            )}
            rows={5}
            disabled={disabled}
            onChange={handleInputChange}
            ref={ref as React.RefObject<HTMLTextAreaElement>}
          />
        ) : (
          <div className='flex items-center justify-center gap-2'>
            <input
              type={type}
              placeholder={!disabled ? placeholderText : 'Input disabled'}
              value={localInput}
              className={twMerge(
                className,
                getStyles(),
                disabled && 'cursor-not-allowed'
              )}
              disabled={disabled}
              onChange={handleInputChange}
              ref={ref as React.RefObject<HTMLInputElement>}
            />
            {localInput && clearIcon && (
              <Icon name='RiCloseLine' size={16} onClick={handleClearInput} />
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
