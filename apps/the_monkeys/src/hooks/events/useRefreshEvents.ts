import { invalidateAfterEventWrite } from '@/lib/queryFreshness';
import { useQueryClient } from '@tanstack/react-query';

export function useRefreshEvents(slug?: string) {
  const qc = useQueryClient();

  return () => invalidateAfterEventWrite(qc, slug);
}
