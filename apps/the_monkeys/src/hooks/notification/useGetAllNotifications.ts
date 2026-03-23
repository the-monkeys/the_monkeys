import {
  FRNNotification,
  FRNNotificationListResponse,
} from '@/services/notification/notificationTypes';
import axiosInstance from '@/services/api/axiosInstance';
import { FRN_URL } from '@/constants/api';
import { useQuery } from '@tanstack/react-query';

export const ALL_NOTIFICATIONS_QUERY_KEY = 'notifications';

const fetchFRNNotifications = async (): Promise<FRNNotification[]> => {
  // Use the gateway's proxy path which adds the API key server-side.
  // Falls back gracefully when FRN is offline.
  const { data } = await axiosInstance.get<FRNNotificationListResponse>(
    '/notification/notifications'
  );
  return data?.notifications ?? [];
};

export const useGetAllNotifications = () => {
  const { data, error, isLoading, isError } = useQuery<
    FRNNotification[],
    Error
  >({
    queryKey: [ALL_NOTIFICATIONS_QUERY_KEY],
    queryFn: fetchFRNNotifications,
    staleTime: 5 * 60 * 1000,
  });

  return {
    notifications: data ?? [],
    isLoading,
    isError: isError || !!error,
  };
};
