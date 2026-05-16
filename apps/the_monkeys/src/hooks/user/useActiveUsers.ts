'use client';

import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import { useQuery } from '@tanstack/react-query';

/**
 * Shape of the response returned by `GET /api/v2/user/active-users`.
 * The gateway hits the activity service to find users that have produced
 * activity within `time_range`, then fans out to the user service for their
 * profile details. Only `user_details[].account_id` is required downstream.
 */
export interface ActiveUserDetail {
  account_id?: string;
  accountId?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

interface ActiveUsersResponse {
  active_users?: number;
  user_details?: ActiveUserDetail[];
  status_code?: number;
}

/**
 * Fetches recently-active users for the Featured Authors strip.
 *
 * @param timeRange Activity window honored by the activity service
 *                  (e.g. '3h', '24h', '7d'). Defaults to '24h' so the
 *                  landing strip stays populated even on quiet days.
 */
export const useActiveUsers = (timeRange: string = '24h') => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['active-users', timeRange],
    queryFn: async () => {
      const res = await axiosInstanceV2.get<ActiveUsersResponse>(
        `/user/active-users`,
        { params: { time_range: timeRange } }
      );
      return res.data;
    },
    // Cache for 5 minutes — this is decorative data, not a hot path.
    staleTime: 5 * 60 * 1000,
    // Fail silently; the consumer falls back to a static list.
    retry: 1,
  });

  const details: ActiveUserDetail[] = data?.user_details ?? [];

  const users: Array<{ userID: string }> = details
    .map((u) => ({ userID: u.account_id ?? u.accountId ?? '' }))
    .filter((u) => u.userID !== '');

  return {
    users,
    details,
    activeCount: data?.active_users ?? 0,
    isLoading,
    isError,
  };
};

export default useActiveUsers;
