import { authFetcherV2 } from '@/services/fetcher';
import { useQuery } from '@tanstack/react-query';

export const BLOG_STATS_QUERY_KEY = 'blog-stats';

export type TimeRange = '24h' | '48h' | '7d' | '30d' | '90d' | '1y' | '';

export interface BlogAnalytics {
  avg_read_time_ms: number;
  bounces: number;
  cities: Record<string, number>;
  countries: Record<string, number>;
  daily_activity: Record<string, number>;
  engagement_rate: number;
  hourly_activity: Record<string, number>;
  monthly_activity: Record<string, number>;
  platforms: Record<string, number>;
  read_time_distribution: Record<string, number>;
  realtime_views: Record<string, number>;
  referrers: Record<string, number>;
  total_likes: number;
  unique_readers: number;
  valid_views: number;
}

export interface BlogStatsResponse {
  blog_id: string;
  read_count: number;
  analytics: BlogAnalytics | null;
}

const useGetBlogStats = (
  blogId: string | undefined,
  timeRange: TimeRange = ''
) => {
  const params = timeRange ? `?time_range=${timeRange}` : '';
  const { data, isLoading, isError } = useQuery<BlogStatsResponse, Error>({
    queryKey: [BLOG_STATS_QUERY_KEY, blogId, timeRange],
    queryFn: () => authFetcherV2(`/blog/${blogId}/stats${params}`),
    enabled: !!blogId,
    staleTime: 60 * 1000,
  });

  return {
    stats: data,
    statsLoading: isLoading,
    statsError: isError,
  };
};

export default useGetBlogStats;
