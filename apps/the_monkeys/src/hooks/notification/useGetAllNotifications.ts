import useAuth from '@/hooks/auth/useAuth';
import { queryKeys } from '@/lib/queryKeys';
import axiosInstance from '@/services/api/axiosInstance';
import {
  FRNNotification,
  FRNNotificationListResponse,
} from '@/services/notification/notificationTypes';
import { useQuery } from '@tanstack/react-query';

export const ALL_NOTIFICATIONS_QUERY_KEY = 'notifications';

const fetchFRNNotifications = async (): Promise<FRNNotification[]> => {
  // Use the gateway's proxy path which adds the API key server-side.
  // Falls back gracefully when FRN is offline.
  const { data } = await axiosInstance.get<FRNNotificationListResponse>(
    '/notification/frn?page_size=50&channel=in_app'
  );
  return data?.notifications ?? [];
};

export const useGetAllNotifications = () => {
  const { data: session } = useAuth();
  const viewer = session?.account_id || session?.username || null;
  const { data, error, isLoading, isError } = useQuery<
    FRNNotification[],
    Error
  >({
    queryKey: queryKeys.notifications.list(viewer),
    enabled: !!viewer,
    queryFn: fetchFRNNotifications,
    staleTime: 5 * 60 * 1000,
  });

  return {
    notifications: data ?? [],
    isLoading,
    isError: isError || !!error,
  };
};
