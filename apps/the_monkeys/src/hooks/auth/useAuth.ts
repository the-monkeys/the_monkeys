import { queryKeys } from '@/lib/queryKeys';
import { validateSession } from '@/services/auth/auth';
import { useQuery } from '@tanstack/react-query';

export default function useAuth() {
  return useQuery({
    queryFn: validateSession,
    queryKey: queryKeys.auth.session,
    retry: false,
  });
}
