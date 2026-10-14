import { createBlock } from '../shared/createBlock';
import { TREND_TOOLBOX } from '../shared/types';
import type { TrendBlockData } from '../shared/types';
import TrendComponent from './TrendComponent';
import { computeTrend } from './trendMath';

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
