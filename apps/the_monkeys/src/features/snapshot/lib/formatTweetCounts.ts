export const formatTweetCount = (n: number | undefined): string | null => {
  if (n == null || Number.isNaN(n)) return null;
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `${v >= 10 ? Math.round(v) : v.toFixed(1)}M`;
  }
  if (n >= 10_000) return `${Math.round(n / 1000)}K`;
  if (n >= 1000) {
    const v = n / 1000;
    return v >= 10 ? `${Math.round(v)}K` : `${v.toFixed(1)}K`;
  }
  return String(n);
};
