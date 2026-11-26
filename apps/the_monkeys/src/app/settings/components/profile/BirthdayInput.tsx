import { type InputHTMLAttributes, forwardRef, useState } from 'react';

import { Input } from '@the-monkeys/ui/atoms/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@the-monkeys/ui/atoms/popover';
import { Calendar } from '@the-monkeys/ui/organism/calendar';
import { RiCalendarLine } from 'react-icons/ri';

import { profileBirthdayDate } from './parseDate';

const months = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

export function parseBirthdayInput(value: string): string {
  const text = value.trim().toUpperCase();
  let iso = text;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const parts = text.match(/^(\d{1,2})\s+([A-Z]{3})\s+(\d{4})$/);
    if (!parts) return '';
    const month = months.indexOf(parts[2]);
    if (month < 0) return '';
    iso = `${parts[3]}-${String(month + 1).padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
  }
  return profileBirthdayDate(iso);
}

function displayBirthday(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !profileBirthdayDate(value))
    return value;
  const [year, month, day] = value.split('-');
  return `${day} ${months[Number(month) - 1]} ${year}`;
}

interface BirthdayInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange' | 'type' | 'min' | 'max'
  > {
  value: string;
  onChange: (value: string) => void;
  min: string;
  max: string;
}

export const BirthdayInput = forwardRef<HTMLInputElement, BirthdayInputProps>(
  ({ value, onChange, min, max, onBlur, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    const iso = parseBirthdayInput(value);
    // Calendar dates use local midnight here, so the picker cannot shift a day.
    const localDate = (date: string) => new Date(`${date}T00:00:00`);
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <div className='relative min-w-0'>
          <Input
            {...props}
            ref={ref}
            type='text'
            autoComplete='bday'
            placeholder='DD MMM YYYY'
            value={displayBirthday(value)}
            className='w-full pr-10'
            onBlur={onBlur}
            onChange={(event) => {
              const text = event.target.value;
              onChange(parseBirthdayInput(text) || text);
            }}
          />
          <PopoverTrigger asChild>
            <button
              type='button'
              aria-label='Choose birth date'
              disabled={props.disabled}
              className='absolute right-1 top-1 flex size-8 items-center justify-center rounded-md hover:bg-foreground-light/5 focus-visible:outline focus-visible:outline-2 dark:hover:bg-foreground-dark/10'
            >
              <RiCalendarLine size={16} aria-hidden='true' />
            </button>
          </PopoverTrigger>
        </div>
        <PopoverContent
          align='start'
          collisionPadding={12}
          className='w-auto max-w-[calc(100vw-1.5rem)] border-0 p-0'
        >
          <Calendar
            mode='single'
            selected={iso ? localDate(iso) : undefined}
            defaultMonth={localDate(iso || max)}
            startMonth={localDate(min)}
            endMonth={localDate(max)}
            disabled={{ before: localDate(min), after: localDate(max) }}
            captionLayout='dropdown'
            className='w-[min(20rem,calc(100vw-1.5rem))]'
            classNames={{
              day_button:
                'mx-auto size-8 rounded-md text-sm hover:bg-foreground-light/5 focus-visible:outline focus-visible:outline-2 dark:hover:bg-foreground-dark/10',
            }}
            onSelect={(date) => {
              if (!date) return;
              onChange(
                `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
              );
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    );
  }
);
BirthdayInput.displayName = 'BirthdayInput';
