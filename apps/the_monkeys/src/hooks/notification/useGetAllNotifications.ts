import { authFetcher } from '@/services/fetcher';
import { allNotificationsResponse } from '@/services/notification/notificationTypes';
import { useQuery } from '@tanstack/react-query';

export const ALL_NOTIFICATIONS_QUERY_KEY = 'notifications';

export const useGetAllNotifications = () => {
  const { data, error, isLoading, isError } = useQuery<
    allNotificationsResponse,
    Error
  >({
    queryKey: [ALL_NOTIFICATIONS_QUERY_KEY],
    queryFn: () => authFetcher(`/notification/notifications`),
    staleTime: 5 * 60 * 1000,
  });

  return {
    notifications: data,
    isLoading,
    isError: isError || !!error,
  };
};
