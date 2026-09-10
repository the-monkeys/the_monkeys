import { useState } from 'react';

import Icon from '@/components/icon';
import { ALL_NOTIFICATIONS_QUERY_KEY } from '@/hooks/notification/useGetAllNotifications';
import axiosInstance from '@/services/api/axiosInstance';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

export const MarkReadButton = () => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const onMarkRead = async () => {
    setLoading(true);
    try {
      await axiosInstance.post('/notification/frn/read-all');
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Notifications marked as read.',
      });
      queryClient.invalidateQueries({
        queryKey: [ALL_NOTIFICATIONS_QUERY_KEY],
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Error',
        description: 'Could not mark notifications as read.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size='sm'
      variant='outline'
      disabled={loading}
      onClick={onMarkRead}
      className='rounded-full'
    >
      <Icon name='RiCheck' size={18} className='mr-1' /> Mark all as read
    </Button>
  );
};
