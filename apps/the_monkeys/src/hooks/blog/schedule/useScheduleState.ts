import { useState } from 'react';

import { toast } from '@the-monkeys/ui/hooks/use-toast';
import { format } from 'date-fns';

export const useScheduleState = () => {
  const [scheduleDate, setScheduleDate] = useState<Date | undefined>(undefined);
  const [scheduleTime, setScheduleTime] = useState<string>('');
  const [selectedTimezone, setSelectedTimezone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const validateAndSubmit = (
    onSubmit: (scheduleTime: string, timezone: string) => void
  ) => {
    if (!scheduleDate || !scheduleTime) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please select both a date and time to schedule.',
      });
      return;
    }

    const dateStr = format(scheduleDate, 'yyyy-MM-dd');
    const dateTime = new Date(`${dateStr}T${scheduleTime}`);

    if (isNaN(dateTime.getTime())) {
      toast({
        variant: 'destructive',
        title: 'Invalid Schedule',
        description: 'The selected date or time is invalid. Please try again.',
      });
      return;
    }

    onSubmit(dateTime.toISOString(), selectedTimezone);
  };

  return {
    scheduleDate,
    setScheduleDate,
    scheduleTime,
    setScheduleTime,
    selectedTimezone,
    setSelectedTimezone,
    validateAndSubmit,
  };
};
