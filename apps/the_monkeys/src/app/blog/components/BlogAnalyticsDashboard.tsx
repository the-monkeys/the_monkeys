'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

import Icon from '@/components/icon';
import useGetBlogStats, {
  BlogAnalytics,
  TimeRange,
} from '@/hooks/blog/useGetBlogStats';

// Normalize country names: US, USA, United States → United States
const COUNTRY_ALIASES: Record<string, string> = {
  us: 'United States',
  usa: 'United States',
  'united states': 'United States',
  ca: 'Canada',
  canada: 'Canada',
  in: 'India',
  india: 'India',
  uk: 'United Kingdom',
  gb: 'United Kingdom',
  'united kingdom': 'United Kingdom',
};

function normalizeCountries(
  raw: Record<string, number>
): Record<string, number> {
  const merged: Record<string, number> = {};
  for (const [key, count] of Object.entries(raw)) {
    const trimmed = key.trim();
    if (!trimmed) continue;
    const normalized = COUNTRY_ALIASES[trimmed.toLowerCase()] || trimmed;
    merged[normalized] = (merged[normalized] || 0) + count;
  }
  return merged;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return remaining > 0 ? `${minutes}m ${remaining}s` : `${minutes}m`;
}

const LOCAL_NETWORK_RE =
  /^(localhost|127\.\d+\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|192\.168\.\d+\.\d+|0\.0\.0\.0|\[::1\]|::1)$/i;

function isLocalEntry(key: string): boolean {
  const trimmed = key.trim().toLowerCase();
  if (!trimmed) return true;
  if (LOCAL_NETWORK_RE.test(trimmed)) return true;
  // Catch referrer URLs pointing to local hosts
  try {
    const hostname = new URL(trimmed).hostname;
    return LOCAL_NETWORK_RE.test(hostname);
  } catch {
    return false;
  }
}

function filterLocal(data: Record<string, number>): Record<string, number> {
  const filtered: Record<string, number> = {};
  for (const [key, value] of Object.entries(data)) {
    if (!isLocalEntry(key)) filtered[key] = value;
  }
  return filtered;
}

function formatReferrer(url: string): string {
  if (!url) return 'Direct / Unknown';
  try {
    const parsed = new URL(url);
    return parsed.hostname + (parsed.pathname !== '/' ? parsed.pathname : '');
  } catch {
    return url;
  }
}

// Horizontal bar used across sections
const HBar = ({
  label,
  value,
  maxValue,
}: {
  label: string;
  value: number;
  maxValue: number;
}) => {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div className='space-y-1'>
      <div className='flex justify-between text-sm'>
        <span className='truncate mr-2'>{label}</span>
        <span className='shrink-0 font-medium'>{value}</span>
      </div>
      <div className='h-[6px] w-full rounded-full bg-foreground-light/40 dark:bg-foreground-dark/40'>
        <div
          className='h-full rounded-full bg-brand-orange transition-all'
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

// Sparkline-style daily activity bars
const DailyActivityChart = ({
  dailyActivity,
}: {
  dailyActivity: Record<string, number>;
}) => {
  const entries = useMemo(() => {
    return Object.entries(dailyActivity)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-28); // last 28 days
  }, [dailyActivity]);

  const maxVal = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div className='space-y-2'>
      <div className='flex items-end gap-[3px] h-[80px]'>
        {entries.map(([date, count]) => {
          const height = count > 0 ? Math.max((count / maxVal) * 100, 8) : 3;
          return (
            <div
              key={date}
              className='flex-1 group relative flex flex-col items-center justify-end'
            >
              <div
                className={`w-full rounded-t-sm transition-all ${
                  count > 0
                    ? 'bg-brand-orange/80 hover:bg-brand-orange'
                    : 'bg-foreground-light/30 dark:bg-foreground-dark/30'
                }`}
                style={{ height: `${height}%` }}
                title={`${date}: ${count}`}
              />
            </div>
          );
        })}
      </div>
      <div className='flex justify-between text-[10px] opacity-50'>
        <span>{entries[0]?.[0]?.slice(5)}</span>
        <span>{entries[entries.length - 1]?.[0]?.slice(5)}</span>
      </div>
    </div>
  );
};

// Monthly activity bars (all-time, month granularity)
const MonthlyActivityChart = ({
  monthlyActivity,
}: {
  monthlyActivity: Record<string, number>;
}) => {
  const entries = useMemo(() => {
    return Object.entries(monthlyActivity).sort(([a], [b]) =>
      a.localeCompare(b)
    );
  }, [monthlyActivity]);

  const maxVal = Math.max(...entries.map(([, v]) => v), 1);

  if (entries.length === 0) return null;

  return (
    <div className='space-y-2'>
      <div className='flex items-end gap-[2px] h-[80px]'>
        {entries.map(([month, count]) => {
          const height = count > 0 ? Math.max((count / maxVal) * 100, 6) : 3;
          return (
            <div
              key={month}
              className='flex-1 group relative flex flex-col items-center justify-end'
            >
              <div
                className={`w-full rounded-t-sm transition-all ${
                  count > 0
                    ? 'bg-brand-orange/60 hover:bg-brand-orange'
                    : 'bg-foreground-light/20 dark:bg-foreground-dark/20'
                }`}
                style={{ height: `${height}%` }}
                title={`${month}: ${count}`}
              />
            </div>
          );
        })}
      </div>
      <div className='flex justify-between text-[10px] opacity-50'>
        <span>{entries[0]?.[0]}</span>
        <span>{entries[entries.length - 1]?.[0]}</span>
      </div>
    </div>
  );
};

const TIME_RANGE_OPTIONS: { label: string; value: TimeRange }[] = [
  { label: 'Default', value: '' },
  { label: '24h', value: '24h' },
  { label: '48h', value: '48h' },
  { label: '7d', value: '7d' },
  { label: '30d', value: '30d' },
  { label: '90d', value: '90d' },
  { label: '1y', value: '1y' },
];

// Section wrapper
const StatSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className='space-y-3'>
    <h6 className='font-dm_sans font-medium text-sm opacity-70 uppercase tracking-wide'>
      {title}
    </h6>
    {children}
  </div>
);

// Top-level stat card
const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className='p-3 rounded-lg bg-foreground-light/20 dark:bg-foreground-dark/20 border-1 border-border-light/50 dark:border-border-dark/50'>
    <p className='text-2xl font-dm_sans font-semibold'>{value}</p>
    <p className='text-xs opacity-60 mt-1'>{label}</p>
  </div>
);

const AnalyticsContent = ({
  analytics,
  readCount,
}: {
  analytics: BlogAnalytics;
  readCount: number;
}) => {
  const countries = useMemo(
    () => filterLocal(normalizeCountries(analytics.countries)),
    [analytics.countries]
  );

  const sortedCountries = useMemo(
    () => Object.entries(countries).sort(([, a], [, b]) => b - a),
    [countries]
  );

  const sortedCities = useMemo(
    () =>
      Object.entries(filterLocal(analytics.cities))
        .filter(([key]) => key.trim())
        .sort(([, a], [, b]) => b - a),
    [analytics.cities]
  );

  const sortedReferrers = useMemo(
    () =>
      Object.entries(filterLocal(analytics.referrers)).sort(
        ([, a], [, b]) => b - a
      ),
    [analytics.referrers]
  );

  const sortedPlatforms = useMemo(
    () =>
      Object.entries(analytics.platforms)
        .map(([k, v]) => [k.replace('PLATFORM_', ''), v] as [string, number])
        .sort(([, a], [, b]) => b - a),
    [analytics.platforms]
  );

  const countryMax = sortedCountries[0]?.[1] ?? 1;
  const cityMax = sortedCities[0]?.[1] ?? 1;
  const referrerMax = sortedReferrers[0]?.[1] ?? 1;
  const platformMax = sortedPlatforms[0]?.[1] ?? 1;

  return (
    <div className='space-y-8'>
      {/* Top-level stats grid */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
        <StatCard label='Total Reads' value={readCount} />
        <StatCard label='Unique Readers' value={analytics.unique_readers} />
        <StatCard label='Valid Views' value={analytics.valid_views} />
        <StatCard
          label='Avg Read Time'
          value={formatDuration(analytics.avg_read_time_ms)}
        />
      </div>

      {/* Daily Activity */}
      {analytics.daily_activity &&
        Object.keys(analytics.daily_activity).length > 0 && (
          <StatSection title='Daily Activity (Last 28 Days)'>
            <DailyActivityChart dailyActivity={analytics.daily_activity} />
          </StatSection>
        )}

      {/* Two-column layout for geo + referrers */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Countries */}
        {sortedCountries.length > 0 && (
          <StatSection title='Countries'>
            <div className='space-y-2'>
              {sortedCountries.map(([country, count]) => (
                <HBar
                  key={country}
                  label={country}
                  value={count}
                  maxValue={countryMax}
                />
              ))}
            </div>
          </StatSection>
        )}

        {/* Cities */}
        {sortedCities.length > 0 && (
          <StatSection title='Cities'>
            <div className='space-y-2'>
              {sortedCities.map(([city, count]) => (
                <HBar
                  key={city}
                  label={city}
                  value={count}
                  maxValue={cityMax}
                />
              ))}
            </div>
          </StatSection>
        )}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        {/* Platforms */}
        {sortedPlatforms.length > 0 && (
          <StatSection title='Platforms'>
            <div className='space-y-2'>
              {sortedPlatforms.map(([platform, count]) => (
                <HBar
                  key={platform}
                  label={platform}
                  value={count}
                  maxValue={platformMax}
                />
              ))}
            </div>
          </StatSection>
        )}

        {/* Read Time Distribution */}
        {analytics.read_time_distribution && (
          <StatSection title='Read Time Distribution'>
            <div className='space-y-2'>
              {Object.entries(analytics.read_time_distribution)
                .sort(([, a], [, b]) => b - a)
                .map(([bucket, count]) => (
                  <HBar
                    key={bucket}
                    label={bucket}
                    value={count}
                    maxValue={Math.max(
                      ...Object.values(analytics.read_time_distribution),
                      1
                    )}
                  />
                ))}
            </div>
          </StatSection>
        )}
      </div>

      {/* Monthly Activity (all-time) */}
      {analytics.monthly_activity &&
        Object.keys(analytics.monthly_activity).length > 0 && (
          <StatSection title='Monthly Activity (All Time)'>
            <MonthlyActivityChart
              monthlyActivity={analytics.monthly_activity}
            />
          </StatSection>
        )}

      {/* Referrers */}
      {sortedReferrers.length > 0 && (
        <StatSection title='Referrers'>
          <div className='space-y-2'>
            {sortedReferrers.map(([referrer, count]) => (
              <HBar
                key={referrer}
                label={formatReferrer(referrer)}
                value={count}
                maxValue={referrerMax}
              />
            ))}
          </div>
        </StatSection>
      )}

      {/* Bottom stats */}
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
        <StatCard label='Bounces' value={analytics.bounces} />
        <StatCard label='Total Likes' value={analytics.total_likes} />
        <StatCard
          label='Engagement Rate'
          value={`${(analytics.engagement_rate * 100).toFixed(1)}%`}
        />
      </div>
    </div>
  );
};

export const BlogAnalyticsDashboard = ({ blogId }: { blogId?: string }) => {
  const [open, setOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('');
  const contentRef = useRef<HTMLDivElement>(null);
  const { stats, statsLoading, statsError } = useGetBlogStats(
    blogId,
    timeRange
  );

  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  if (statsLoading || statsError || !stats?.analytics) return null;

  const { read_count, analytics } = stats;

  return (
    <div className='w-full max-w-5xl mx-auto px-4'>
      {/* Trigger bar */}
      <button
        type='button'
        onClick={toggle}
        className='w-full flex items-center justify-center gap-2 py-2 text-sm opacity-80 hover:opacity-100 transition-opacity group'
      >
        <Icon name='RiEye' size={16} />
        <span className='font-dm_sans font-medium'>
          {read_count} {read_count === 1 ? 'read' : 'reads'}
        </span>
        <span className='opacity-40'>·</span>
        <span className='font-dm_sans'>{analytics.unique_readers} unique</span>
        <span className='opacity-40'>·</span>
        <span className='font-dm_sans'>
          {formatDuration(analytics.avg_read_time_ms)} avg
        </span>
        <Icon
          name='RiArrowDownS'
          size={14}
          className={`ml-1 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Collapsible panel */}
      <div
        className='overflow-hidden transition-[max-height] duration-500 ease-in-out'
        style={{
          maxHeight: open
            ? `${contentRef.current?.scrollHeight ?? 5000}px`
            : '0px',
        }}
      >
        <div ref={contentRef} className='pt-4 pb-6'>
          <div className='p-4 sm:p-6 rounded-xl border-1 border-border-light/60 dark:border-border-dark/60 bg-foreground-light/5 dark:bg-foreground-dark/5'>
            {/* Time range selector */}
            <div className='flex flex-wrap items-center justify-between gap-2 mb-6'>
              <h5 className='font-dm_sans font-semibold text-lg'>Analytics</h5>
              <div className='flex flex-wrap gap-1'>
                {TIME_RANGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setTimeRange(opt.value)}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      timeRange === opt.value
                        ? 'bg-brand-orange text-white'
                        : 'bg-foreground-light/20 dark:bg-foreground-dark/20 hover:bg-foreground-light/40 dark:hover:bg-foreground-dark/40'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <AnalyticsContent analytics={analytics} readCount={read_count} />
          </div>
        </div>
      </div>
    </div>
  );
};
