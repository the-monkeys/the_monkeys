'use client';

import { useEffect, useState } from 'react';

import { Loader } from '@/components/loader';
import axiosInstance from '@/services/api/axiosInstance';
import { Label } from '@the-monkeys/ui/atoms/label';
import { Switch } from '@the-monkeys/ui/atoms/switch';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

const LOCAL_STORAGE_KEY = 'monkeys_email_notifications';

export const EmailUpdates = () => {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchPreference = async () => {
      try {
        const res = await axiosInstance.get<{ email_notifications: boolean }>(
          '/notification/preferences'
        );
        setEnabled(!!res.data?.email_notifications);
      } catch (error) {
        const localPref = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localPref !== null) {
          setEnabled(localPref === 'true');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPreference();
  }, []);

  const handleToggle = async (checked: boolean) => {
    setUpdating(true);
    try {
      await axiosInstance.put('/notification/preferences', {
        email_notifications: checked,
      });
      setEnabled(checked);
      localStorage.setItem(LOCAL_STORAGE_KEY, String(checked));
      toast({
        variant: 'success',
        title: 'Preference Updated',
        description: `Email notifications turned ${checked ? 'on' : 'off'}.`,
      });
    } catch (error) {
      setEnabled(checked);
      localStorage.setItem(LOCAL_STORAGE_KEY, String(checked));
      toast({
        variant: 'success',
        title: 'Preference Updated (Saved Locally)',
        description: `Email notifications turned ${checked ? 'on' : 'off'}.`,
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className='p-1 flex items-center space-x-2'>
        <Loader />
        <span className='text-sm opacity-80'>Loading preferences...</span>
      </div>
    );
  }

  return (
    <div className='p-1 space-y-2'>
      <p className='text-sm opacity-80'>
        Receive latest updates and promotional messages from Monkeys.
      </p>

      <div className='mt-4 flex items-center space-x-2'>
        <Switch
          id='emailUpdates'
          checked={enabled}
          onCheckedChange={handleToggle}
          disabled={updating}
        />
        <Label
          htmlFor='emailUpdates'
          className='text-sm flex items-center gap-2'
        >
          Receive Updates
          {updating && <Loader className='h-3 w-3' />}
        </Label>
      </div>
    </div>
  );
};
