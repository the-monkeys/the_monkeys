import { useState } from 'react';

import Icon from '@/components/icon';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/services/api/axiosInstance';
import { mutate } from 'swr';
import { z } from 'zod';

const markReadSchema = z.object({
  user_id: z.string().min(1, 'Username is required'),
  notification: z.array(
    z.object({
      id: z.string().min(1, 'Notification Id is required'),
    })
  ),
});

export const MarkReadButton = ({
  notificationIds,
  userId,
}: {
  notificationIds?: { id: number }[];
  userId?: string;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const onMarkRead = async () => {
    const payload = {
      user_id: userId,
      notification: notificationIds,
    };

    setLoading(true);

    try {
      markReadSchema.parse(payload);

      await axiosInstance.put(`/notification/notifications`, payload);

      toast({
        variant: 'success',
        title: 'Success',
        description: 'Notification marked as read.',
      });

      mutate(`/notification/notifications`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message || 'Failed to mark read.',
        });
      } else {
        toast({
          variant: 'error',
          title: 'Error',
          description: 'An unknown error occured.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size='sm'
      disabled={loading}
      onClick={onMarkRead}
      className='rounded-full'
    >
      <Icon name='RiCheck' size={18} className='mr-1' /> Mark all as read
    </Button>
  );
};
