import { authFetcher } from '@/services/fetcher';
import { allNotificationsResponse } from '@/services/notification/notificationTypes';
import useSWR from 'swr';

export const useGetAllNotifications = () => {
  const { data, error, isLoading } = useSWR<allNotificationsResponse>(
    `/notification/notifications`,
    authFetcher
  );

  return {
    notifications: data,
    isLoading,
    isError: error,
  };
};
