import { queryKeys } from '@/lib/queryKeys';
import { useQueryClient } from '@tanstack/react-query';

export function useRefreshEvents(slug?: string) {
  const qc = useQueryClient();

  return () => {
    qc.invalidateQueries({ queryKey: queryKeys.events.all });
    if (slug) {
      qc.invalidateQueries({ queryKey: queryKeys.events.detail(slug) });
      qc.invalidateQueries({ queryKey: queryKeys.events.comments(slug) });
      qc.invalidateQueries({ queryKey: queryKeys.events.attendees(slug) });
      qc.invalidateQueries({ queryKey: queryKeys.events.coupons(slug) });
    }
  };
}
