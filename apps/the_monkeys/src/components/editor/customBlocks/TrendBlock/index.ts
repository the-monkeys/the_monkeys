import { createBlock } from '../shared/createBlock';
import { TREND_TOOLBOX } from '../shared/types';
import type { TrendBlockData } from '../shared/types';
import TrendComponent from './TrendComponent';

/* ------------------------------------------------------------------ */
/*  TrendBlock — EditorJS block for trend analysis                     */
/* ------------------------------------------------------------------ */

const DEFAULT_DATA: TrendBlockData = {
  periodLabels: ['Jan', 'Feb', 'Mar'],
  values: [100, 118, 121],
  direction: 'up',
  percentChange: 21,
  delta: 21,
  summary: 'Trend is up by 21.0% over this period.',
};

const FLAT_THRESHOLD_PCT = 1;

function computeTrend(
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

function round1(v: number): number {
  return Number(v.toFixed(1));
}

function normalizeData(data?: Partial<TrendBlockData>): TrendBlockData {
  const periodLabels = Array.isArray(data?.periodLabels)
    ? data!.periodLabels!.map((l) => String(l).trim()).filter(Boolean)
    : DEFAULT_DATA.periodLabels;

  const values = Array.isArray(data?.values)
    ? data!.values!.map((v) => Number(v)).filter((v) => Number.isFinite(v))
    : DEFAULT_DATA.values;

  return computeTrend(periodLabels, values);
}

export default createBlock<TrendBlockData>({
  toolbox: TREND_TOOLBOX,
  defaultData: DEFAULT_DATA,
  sanitize: {
    periodLabels: true,
    values: true,
    direction: true,
    percentChange: false,
    delta: false,
    summary: true,
  },
  Component: TrendComponent,
  normalizeData,
});
