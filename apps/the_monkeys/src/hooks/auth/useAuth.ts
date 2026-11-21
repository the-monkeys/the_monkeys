import { accountIdentity, clearAccountQueries } from '@/lib/authQuerySession';
import { queryKeys } from '@/lib/queryKeys';
import { validateSession } from '@/services/auth/auth';
import type { IUser } from '@/services/models/user';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export default function useAuth() {
  const client = useQueryClient();
  const query = useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: async ({ signal }) => {
      let session: IUser | null;
      try {
        session = await validateSession();
      } catch (error) {
        if (
          !axios.isAxiosError(error) ||
          ![401, 403].includes(error.response?.status ?? 0)
        )
          throw error;
        session = null;
      }
      const previous = client.getQueryData<IUser | null>(
        queryKeys.auth.session()
      );
      if (
        !signal.aborted &&
        previous !== undefined &&
        accountIdentity(previous) !== accountIdentity(session)
      ) {
        await clearAccountQueries(client);
      }
      return session;
    },
    retry: false,
  });
  // Existing consumers use isSuccess as an authentication gate.
  return {
    ...query,
    data: query.data ?? undefined,
    isSuccess: query.isSuccess && !!query.data,
    isError: query.isError || (query.isSuccess && !query.data),
  };
}
