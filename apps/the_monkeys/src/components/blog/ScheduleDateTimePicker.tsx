import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';
import { Label } from '@the-monkeys/ui/atoms/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@the-monkeys/ui/atoms/popover';
import { Calendar } from '@the-monkeys/ui/organism/calendar';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

import FormSearchSelect from '../FormSearchSelect';

export interface ScheduleDateTimePickerProps {
  scheduleDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  scheduleTime: string;
  onTimeChange: (time: string) => void;
  selectedTimezone: string;
  onTimezoneChange: (timezone: string) => void;
}

const timezoneOptions = Intl.supportedValuesOf('timeZone').map((tz) => ({
  value: tz,
  label: tz,
}));

const ScheduleDateTimePicker = ({
  scheduleDate,
  onDateChange,
  scheduleTime,
  onTimeChange,
  selectedTimezone,
  onTimezoneChange,
}: ScheduleDateTimePickerProps) => {
  const handleTimezoneChange = (selected: { value: string; label: string }) => {
    if (selected) {
      onTimezoneChange(selected.value);
    }
  };

  return (
    <div className='space-y-4 animate-in fade-in slide-in-from-top-2 duration-200'>
      <div className='grid grid-cols-2 gap-4'>
        {/* Date picker */}
        <div className='space-y-2 flex flex-col'>
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={twMerge(
                  'w-full justify-start text-left font-normal px-3',
                  !scheduleDate && 'text-muted-foreground'
                )}
              >
                {scheduleDate ? (
                  format(scheduleDate, 'PPP')
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={scheduleDate}
                onSelect={onDateChange}
                fromDate={new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time picker */}
        <div className='space-y-2 -mt-2'>
          <Label>Time</Label>
          <Input
            type='time'
            value={scheduleTime}
            onChange={(e) => onTimeChange(e.target.value)}
            className='w-30'
          />
        </div>
      </div>

      {/* Timezone selector */}
      <div className='space-y-2'>
        <Label>Timezone</Label>
        <FormSearchSelect
          isMulti={false}
          defaultSelected={[
            { value: selectedTimezone, label: selectedTimezone },
          ]}
          onChange={handleTimezoneChange}
          options={timezoneOptions}
          placeholder='Select Timezone'
        />
      </div>
    </div>
  );
};

export default ScheduleDateTimePicker;
