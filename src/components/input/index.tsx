import { ChangeEvent, InputHTMLAttributes, forwardRef, useState } from 'react';

import { twMerge } from 'tailwind-merge';

import IconContainer from '../icon';
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
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    { type, disabled, label, placeholderText, variant, className, clearIcon },
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
    };

    const handleClearInput = () => {
      setLocalInput('');
    };

    return (
      <div className='flex flex-col items-start'>
        {label && (
          <p className='pl-1 font-josefin_Sans text-xs sm:text-sm'>{label}</p>
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
          <div className='flex w-full flex-1 items-center justify-center'>
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
              <IconContainer
                name='RiCloseLine'
                size={16}
                onClick={handleClearInput}
              />
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
