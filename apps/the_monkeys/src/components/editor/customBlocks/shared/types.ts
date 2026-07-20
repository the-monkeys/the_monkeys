import type { ToolboxConfig } from '@editorjs/editorjs';

/* ------------------------------------------------------------------ */
/*  Data Types (shared between editor + read-only)                     */
/* ------------------------------------------------------------------ */

export type ChartType = 'line' | 'bar' | 'area' | 'pie';
export type DataSource = 'table' | 'csv' | 'manual';

export interface ChartSeries {
  name: string;
  values: number[];
}

export interface ChartBlockData {
  type: ChartType;
  title: string;
  xLabel: string;
  yLabel: string;
  showLegend: boolean;
  palette: string;
  labels: string[];
  series: ChartSeries[];
  source: DataSource;
}

export interface TrendBlockData {
  periodLabels: string[];
  values: number[];
  direction: 'up' | 'down' | 'flat';
  percentChange: number | null;
  delta: number;
  summary: string;
}

export interface FormulaBlockData {
  expression: string;
  mode: 'inline' | 'display';
  description: string;
}

export interface CitationBlockData {
  title: string;
  authors: string;
  year: string;
  source: string;
  identifier: string;
  url: string;
  citationText: string;
}

export interface MethodologyBlockData {
  studyDesign: string;
  dataCollection: string;
  analysisMethod: string;
  assumptions: string;
  limitations: string;
}

export interface DatasetBlockData {
  title: string;
  source: string;
  sampleSize: string;
  collectionDate: string;
  license: string;
  variables: string;
  notes: string;
}

/* ------------------------------------------------------------------ */
/*  Block Constructor Arguments                                        */
/* ------------------------------------------------------------------ */

export interface BlockConstructorArgs<T> {
  data?: Partial<T>;
  api: any;
  readOnly?: boolean;
  config?: Record<string, unknown>;
}

/* ------------------------------------------------------------------ */
/*  Toolbox definitions (categorized)                                  */
/* ------------------------------------------------------------------ */

export const TIER_LABELS: Record<string, string> = {
  core: 'Core',
  data: 'Data',
  research: 'Research',
  advanced: 'Advanced',
};

export const CHART_TOOLBOX: ToolboxConfig = {
  title: 'Chart',
  icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
};

export const TREND_TOOLBOX: ToolboxConfig = {
  title: 'Trend',
  icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
};

export const FORMULA_TOOLBOX: ToolboxConfig = {
  title: 'Formula',
  icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v2H9.8l5.2 5-5.2 5H19v2H4v-2h2.2l5.2-5-5.2-5H5V4z"/></svg>',
};

export const CITATION_TOOLBOX: ToolboxConfig = {
  title: 'Citation',
  icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0-7.07 0M14 13a5 5 0 0 1 7.07 0"/><path d="M3 21v-3a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v3"/></svg>',
};

export const METHODOLOGY_TOOLBOX: ToolboxConfig = {
  title: 'Methodology',
  icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
};

export const DATASET_TOOLBOX: ToolboxConfig = {
  title: 'Dataset',
  icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
};

/* ------------------------------------------------------------------ */
/*  Color Palettes                                                     */
/* ------------------------------------------------------------------ */

export const PALETTES: Record<string, string[]> = {
  ocean: ['#60A5FA', '#38BDF8', '#2DD4BF', '#22D3EE', '#818CF8'],
  sunset: ['#F97316', '#FB7185', '#F59E0B', '#EF4444', '#F472B6'],
  forest: ['#22C55E', '#84CC16', '#10B981', '#16A34A', '#65A30D'],
  mono: ['#94A3B8', '#64748B', '#475569', '#334155', '#1E293B'],
  vibrant: ['#8B5CF6', '#EC4899', '#F43F5E', '#3B82F6', '#14B8A6'],
};
