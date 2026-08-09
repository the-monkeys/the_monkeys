import { useState } from 'react';

import { toast } from '@the-monkeys/ui/hooks/use-toast';
import { format } from 'date-fns';

export const getZonedDate = (
  scheduleDate: Date | undefined,
  scheduleTime: string,
  timeZone: string
): Date | null => {
  if (!scheduleDate || !scheduleTime) return null;
  try {
    const dateStr = format(scheduleDate, 'yyyy-MM-dd');
    const targetIso = `${dateStr}T${scheduleTime}:00.000`;
    const utcDate = new Date(`${targetIso}Z`);
    if (isNaN(utcDate.getTime())) return null;

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const parts = formatter.formatToParts(utcDate);
    const partMap: Record<string, string> = {};
    parts.forEach((p) => {
      partMap[p.type] = p.value;
    });

    const tzYear = partMap.year;
    const tzMonth = partMap.month;
    const tzDay = partMap.day;
    let tzHour = partMap.hour;
    if (tzHour === '24') tzHour = '00';
    const tzMinute = partMap.minute;

    const tzAsUtc = new Date(
      `${tzYear}-${tzMonth}-${tzDay}T${tzHour}:${tzMinute}:00.000Z`
    );
    const offsetMs = utcDate.getTime() - tzAsUtc.getTime();

    return new Date(utcDate.getTime() + offsetMs);
  } catch {
    return null;
  }
};

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

    const dateTime = getZonedDate(scheduleDate, scheduleTime, selectedTimezone);

    if (!dateTime || isNaN(dateTime.getTime())) {
      toast({
        variant: 'destructive',
        title: 'Invalid Schedule',
        description: 'The selected date or time is invalid. Please try again.',
      });
      return;
    }

    if (dateTime <= new Date()) {
      toast({
        variant: 'destructive',
        title: 'Invalid Schedule',
        description: 'Please choose a date and time in the future.',
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

