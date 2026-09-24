import type { TrendBlockData } from '../shared/types';

const FLAT_THRESHOLD_PCT = 1;

function round1(v: number): number {
  return Number(v.toFixed(1));
}

export function computeTrend(
  periodLabels: string[],
  values: number[]
): TrendBlockData {
  const safeValues = values.filter((v) => Number.isFinite(v));
  if (safeValues.length === 0) {
    return {
      periodLabels: periodLabels.filter(Boolean),
      values: [],
      direction: 'flat',
      percentChange: null,
      delta: 0,
      summary: 'Trend is flat with minimal change over this period.',
    };
  }

  const first = safeValues[0];
  const last = safeValues[safeValues.length - 1];
  const delta = last - first;

  if (first === 0) {
    const direction = delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat';
    return {
      periodLabels: periodLabels.filter(Boolean),
      values: safeValues,
      direction,
      percentChange: null,
      delta: round1(delta),
      summary:
        direction === 'flat'
          ? 'Trend is flat with minimal change over this period.'
          : `Trend is ${direction} by ${round1(Math.abs(delta))} over this period.`,
    };
  }

  const pct = ((last - first) / first) * 100;
  const absPct = Math.abs(pct);
  const direction =
    absPct >= FLAT_THRESHOLD_PCT ? (pct > 0 ? 'up' : 'down') : 'flat';

  return {
    periodLabels: periodLabels.filter(Boolean),
    values: safeValues,
    direction,
    percentChange: round1(pct),
    delta: round1(delta),
    summary:
      direction === 'flat'
        ? 'Trend is flat with minimal change over this period.'
        : `Trend is ${direction} by ${round1(absPct)}% over this period.`,
  };
}

export function buildSparklineSvg(
  values: number[],
  direction: TrendBlockData['direction']
): string {
  try {
    if (!values || values.length < 2) return '';
    const w = 200;
    const h = 50;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const count = values.length;
    const pts = values
      .map((v, i) => {
        const x = (i / (count - 1)) * w;
        const y = h - ((v - min) / range) * h;
        return `${x},${y}`;
      })
      .join(' ');
    const color =
      direction === 'up'
        ? '#22c55e'
        : direction === 'down'
          ? '#ef4444'
          : '#a3a3a3';
    return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style="width:100%;height:48px;"><polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round"/></svg>`;
  } catch {
    return '';
  }
}
