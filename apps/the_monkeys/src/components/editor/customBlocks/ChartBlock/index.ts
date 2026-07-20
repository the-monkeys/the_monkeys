import { createBlock } from '../shared/createBlock';
import { CHART_TOOLBOX, PALETTES } from '../shared/types';
import type { ChartBlockData } from '../shared/types';
import ChartComponent from './ChartComponent';

/* ------------------------------------------------------------------ */
/*  ChartBlock — EditorJS block for data visualisation                 */
/* ------------------------------------------------------------------ */

const DEFAULT_DATA: ChartBlockData = {
  type: 'line',
  title: '',
  xLabel: '',
  yLabel: '',
  showLegend: true,
  palette: 'ocean',
  labels: ['Jan', 'Feb', 'Mar'],
  series: [{ name: 'Series A', values: [12, 24, 18] }],
  source: 'manual',
};

function normalizeData(data?: Partial<ChartBlockData>): ChartBlockData {
  const raw = data || {};
  const normalizedSeries = (raw.series || DEFAULT_DATA.series)
    .filter((s) => s && typeof s.name === 'string')
    .map((s) => ({
      name: s.name || 'Series',
      values: Array.isArray(s.values)
        ? s.values.map((v) => Number(v) || 0)
        : [],
    }));

  const chartType = raw.type as ChartBlockData['type'];
  const validTypes: ChartBlockData['type'][] = ['line', 'bar', 'area', 'pie'];

  return {
    type: validTypes.includes(chartType) ? chartType : DEFAULT_DATA.type,
    title: raw.title ?? DEFAULT_DATA.title,
    xLabel: raw.xLabel ?? DEFAULT_DATA.xLabel,
    yLabel: raw.yLabel ?? DEFAULT_DATA.yLabel,
    showLegend:
      typeof raw.showLegend === 'boolean'
        ? raw.showLegend
        : DEFAULT_DATA.showLegend,
    palette:
      raw.palette && PALETTES[raw.palette] ? raw.palette : DEFAULT_DATA.palette,
    labels:
      Array.isArray(raw.labels) && raw.labels.length > 0
        ? raw.labels
        : DEFAULT_DATA.labels,
    series:
      normalizedSeries.length > 0 ? normalizedSeries : DEFAULT_DATA.series,
    source:
      raw.source === 'csv' || raw.source === 'table'
        ? raw.source
        : DEFAULT_DATA.source,
  };
}

export default createBlock<ChartBlockData>({
  toolbox: CHART_TOOLBOX,
  defaultData: DEFAULT_DATA,
  sanitize: {
    type: true,
    title: true,
    xLabel: true,
    yLabel: true,
    showLegend: false,
    palette: true,
    labels: true,
    series: { name: true, values: true },
    source: true,
  },
  Component: ChartComponent,
  normalizeData,
});
