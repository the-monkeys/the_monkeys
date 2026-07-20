'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Badge,
  BlockWrapper,
  EmptyState,
  FormField,
  StyledInput,
  StyledSelect,
  StyledTextarea,
} from '../shared/BlockWrapper';
import type { ChartBlockData, ChartSeries, ChartType } from '../shared/types';
import { PALETTES } from '../shared/types';

/* ------------------------------------------------------------------ */
/*  ChartComponent — React UI for the Chart Block                      */
/*  Renders SVG via D3 or a simple preview for edit mode.              */
/*  Uses internal state + ref to handle edits without stale closures.  */
/* ------------------------------------------------------------------ */

interface ChartComponentProps {
  data: ChartBlockData;
  readOnly: boolean;
  onChange: (data: ChartBlockData) => void;
}

const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: 'line', label: 'Line' },
  { value: 'bar', label: 'Bar' },
  { value: 'area', label: 'Area' },
  { value: 'pie', label: 'Pie' },
];

const PALETTE_NAMES = Object.keys(PALETTES);

export default function ChartComponent({
  data,
  readOnly,
  onChange,
}: ChartComponentProps) {
  // Internal state + ref to avoid stale closures
  const [internal, setInternal] = useState<ChartBlockData>(data);
  const latestRef = useRef<ChartBlockData>(data);
  const [csvText, setCsvText] = useState('');

  useEffect(() => {
    setInternal(data);
    latestRef.current = data;
  }, [data]);

  // ---- helpers ----

  const update = useCallback(
    (patch: Partial<ChartBlockData>) => {
      const next = { ...latestRef.current, ...patch };
      latestRef.current = next;
      setInternal(next);
      onChange(next);
    },
    [onChange]
  );

  const parseSeriesInput = useCallback((input: string): ChartSeries[] => {
    return input
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, valuesRaw] = line.split(':');
        if (!name || !valuesRaw) return null;
        const values = valuesRaw
          .split(',')
          .map((v) => Number(v.trim()))
          .filter((v) => Number.isFinite(v));
        return { name: name.trim(), values };
      })
      .filter((s): s is ChartSeries => s !== null);
  }, []);

  const parseCSV = useCallback(
    (csv: string) => {
      const rows = csv
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean)
        .map((r) => r.split(',').map((c) => c.trim()));

      if (rows.length < 2 || rows[0].length < 2) return;

      const header = rows[0];
      const labels: string[] = [];
      const series = header.slice(1).map((name, i) => ({
        name: name || `Series ${i + 1}`,
        values: [] as number[],
      }));

      rows.slice(1).forEach((row) => {
        labels.push(row[0] || `Item ${labels.length + 1}`);
        row.slice(1).forEach((val, i) => {
          const n = Number(val);
          if (series[i]) series[i].values.push(Number.isFinite(n) ? n : 0);
        });
        // pad missing columns
        for (let i = row.length - 1; i < series.length; i++) {
          series[i].values.push(0);
        }
      });

      update({ labels, series, source: 'csv' });
    },
    [update]
  );

  const seriesText = internal.series
    .map((s) => `${s.name}:${s.values.join(',')}`)
    .join('\n');

  // ---- render ----

  return (
    <BlockWrapper readOnly={readOnly}>
      {/* Header */}
      <div className='mb-3 flex items-center justify-between'>
        <h3 className='text-sm font-semibold text-slate-700 dark:text-slate-200'>
          {internal.title || 'Chart'}
        </h3>
        {!readOnly && (
          <Badge variant='info'>
            {CHART_TYPES.find((t) => t.value === internal.type)?.label ||
              internal.type}
          </Badge>
        )}
      </div>

      {!readOnly && (
        <div className='mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2'>
          {/* Chart Type */}
          <FormField label='Chart Type'>
            <StyledSelect
              value={internal.type}
              onChange={(e) => update({ type: e.target.value as ChartType })}
            >
              {CHART_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </StyledSelect>
          </FormField>

          {/* Palette */}
          <FormField label='Palette'>
            <StyledSelect
              value={internal.palette}
              onChange={(e) => update({ palette: e.target.value })}
            >
              {PALETTE_NAMES.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </StyledSelect>
          </FormField>

          {/* Title */}
          <FormField label='Title'>
            <StyledInput
              value={internal.title}
              onChange={(e) => update({ title: e.target.value })}
              placeholder='Chart title'
            />
          </FormField>

          {/* Legend Toggle */}
          <FormField label='Show Legend'>
            <label className='flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300'>
              <input
                type='checkbox'
                checked={internal.showLegend}
                onChange={(e) => update({ showLegend: e.target.checked })}
                className='rounded border-slate-300 text-blue-500 focus:ring-blue-400 dark:border-slate-600'
              />
              {internal.showLegend ? 'Visible' : 'Hidden'}
            </label>
          </FormField>

          {/* X Label */}
          <FormField label='X-Axis Label'>
            <StyledInput
              value={internal.xLabel}
              onChange={(e) => update({ xLabel: e.target.value })}
              placeholder='e.g. Month'
            />
          </FormField>

          {/* Y Label */}
          <FormField label='Y-Axis Label'>
            <StyledInput
              value={internal.yLabel}
              onChange={(e) => update({ yLabel: e.target.value })}
              placeholder='e.g. Revenue ($)'
            />
          </FormField>

          {/* Labels */}
          <FormField label='Labels (comma-separated)' className='sm:col-span-2'>
            <StyledInput
              value={internal.labels.join(', ')}
              onChange={(e) =>
                update({
                  labels: e.target.value
                    .split(',')
                    .map((l) => l.trim())
                    .filter(Boolean),
                })
              }
              placeholder='Jan, Feb, Mar…'
            />
          </FormField>

          {/* Series Editor */}
          <FormField
            label='Series (Name:val1,val2,…)'
            className='sm:col-span-2'
          >
            <StyledTextarea
              rows={3}
              value={seriesText}
              onChange={(e) => {
                const parsed = parseSeriesInput(e.target.value);
                if (parsed.length > 0)
                  update({ series: parsed, source: 'manual' });
              }}
              placeholder={'Revenue:100,200,150\nUsers:50,80,120'}
            />
          </FormField>

          {/* CSV Paste */}
          <FormField
            label='Paste CSV (header: label,series1,…)'
            className='sm:col-span-2'
          >
            <StyledTextarea
              rows={3}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder={'Month,Revenue,Users\nJan,100,50\nFeb,200,80'}
            />
            <button
              type='button'
              onClick={() => parseCSV(csvText)}
              className='mt-1 w-fit rounded-lg border border-slate-300/50 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-600/50 dark:text-slate-300 dark:hover:bg-slate-800'
            >
              Parse CSV
            </button>
          </FormField>
        </div>
      )}

      {/* Chart Preview */}
      <div className='mt-2'>
        {internal.labels.length === 0 || internal.series.length === 0 ? (
          <EmptyState
            message={
              readOnly ? 'No chart data' : 'Add data above to see a preview'
            }
          />
        ) : (
          <ChartPreview data={internal} />
        )}
      </div>

      {/* Axis Labels */}
      {(internal.xLabel || internal.yLabel) && (
        <div className='mt-2 flex gap-3 text-xs text-slate-400 dark:text-slate-500'>
          {internal.xLabel && <span>X: {internal.xLabel}</span>}
          {internal.yLabel && <span>Y: {internal.yLabel}</span>}
        </div>
      )}

      {/* Legend */}
      {internal.showLegend && internal.series.length > 0 && (
        <div className='mt-2 flex flex-wrap gap-3'>
          {internal.series.map((s, i) => {
            const colors = PALETTES[internal.palette] || PALETTES.ocean;
            return (
              <span
                key={s.name}
                className='inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300'
              >
                <span
                  className='inline-block h-2.5 w-2.5 rounded-full'
                  style={{ backgroundColor: colors[i % colors.length] }}
                />
                {s.name}
              </span>
            );
          })}
        </div>
      )}
    </BlockWrapper>
  );
}

/* ------------------------------------------------------------------ */
/*  ChartPreview — renders the actual SVG chart                        */
/*  Uses D3 library for all chart types.                               */
/* ------------------------------------------------------------------ */

function ChartPreview({ data }: { data: ChartBlockData }) {
  const svgContent = useMemo(() => generateSVG(data), [data]);

  return (
    <div
      className='w-full overflow-hidden rounded-lg border border-slate-200/60 bg-white/50 dark:border-slate-700/40 dark:bg-slate-900/40'
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

function generateSVG(data: ChartBlockData): string {
  if (data.type === 'pie') return renderPieSVG(data);
  return renderCartesianSVG(data);
}

/* ---------- Cartesian (line, bar, area) ---------- */

function renderCartesianSVG(data: ChartBlockData): string {
  const W = 600;
  const H = 300;
  const PL = 50;
  const PR = 20;
  const PT = 20;
  const PB = 40;
  const plotW = W - PL - PR;
  const plotH = H - PT - PB;

  const count = Math.max(
    data.labels.length,
    ...data.series.map((s) => s.values.length),
    1
  );

  const pointsPerSeries = data.series.map((s) =>
    Array.from({ length: count }, (_, i) => s.values[i] ?? 0)
  );
  const allVals = pointsPerSeries.flat();
  const rawMin = Math.min(0, ...allVals);
  const rawMax = Math.max(...allVals, 1);
  const span = rawMax - rawMin || 1;

  const colors = PALETTES[data.palette] || PALETTES.ocean;

  const toX = (i: number) =>
    PL + (count > 1 ? (i / (count - 1)) * plotW : plotW / 2);
  const toY = (v: number) => PT + plotH - ((v - rawMin) / span) * plotH;

  // Axis ticks
  const tickCount = 5;
  const tickStep = getNice(rawMax / (tickCount - 1), true);

  let lines = '';
  let yTicks = '';
  for (
    let v = Math.floor(rawMin / tickStep) * tickStep;
    v <= rawMax + tickStep * 0.5;
    v += tickStep
  ) {
    const y = toY(v);
    lines += `<line x1="${PL}" y1="${y}" x2="${W - PR}" y2="${y}" stroke="rgba(148,163,184,0.25)" stroke-dasharray="4 4"/>`;
    yTicks += `<text x="${PL - 6}" y="${y + 4}" fill="rgba(100,116,139,0.7)" font-size="10" text-anchor="end">${fmtAxis(v)}</text>`;
  }

  // X labels
  let xTicks = '';
  const stride = count > 10 ? 2 : 1;
  for (let i = 0; i < count; i++) {
    if (i % stride !== 0 && i !== count - 1) continue;
    xTicks += `<text x="${toX(i)}" y="${H - PB + 16}" fill="rgba(100,116,139,0.7)" font-size="10" text-anchor="middle">${data.labels[i] || `P${i + 1}`}</text>`;
  }

  // Axes
  const axisColor = 'rgba(148,163,184,0.5)';
  const axes = `
    <line x1="${PL}" y1="${PT}" x2="${PL}" y2="${H - PB}" stroke="${axisColor}"/>
    <line x1="${PL}" y1="${H - PB}" x2="${W - PR}" y2="${H - PB}" stroke="${axisColor}"/>
  `;

  // Series rendering
  let seriesRenders = '';

  if (data.type === 'bar') {
    const groupW = plotW / count;
    const barW = Math.max(6, (groupW - 8) / data.series.length);

    data.series.forEach((s, si) => {
      pointsPerSeries[si].forEach((v, i) => {
        const x = PL + i * groupW + 4 + si * barW;
        const y = toY(v);
        const h = Math.max(1, H - PB - y);
        seriesRenders += `<rect x="${x}" y="${y}" width="${Math.max(6, barW - 2)}" height="${h}" fill="${colors[si % colors.length]}" opacity="0.88" rx="2"/>`;
      });
    });
  } else {
    // line / area
    data.series.forEach((s, si) => {
      const pts = pointsPerSeries[si]
        .map((v, i) => `${toX(i)},${toY(v)}`)
        .filter((_, i) => Number.isFinite(pointsPerSeries[si][i]))
        .join(' ');

      if (!pts) return;

      if (data.type === 'area') {
        const firstX = toX(0);
        const lastX = toX(count - 1);
        const baseline = H - PB;
        seriesRenders += `<polygon points="${firstX},${baseline} ${pts} ${lastX},${baseline}" fill="${colors[si % colors.length]}" opacity="0.2"/>`;
      }

      seriesRenders += `<polyline points="${pts}" fill="none" stroke="${colors[si % colors.length]}" stroke-width="2" stroke-linejoin="round"/>`;
    });
  }

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:auto;">
    ${lines}${yTicks}${xTicks}${axes}${seriesRenders}
  </svg>`;
}

/* ---------- Pie ---------- */

function renderPieSVG(data: ChartBlockData): string {
  const values = data.series[0]?.values || [];
  const labels = data.labels;
  const total = values.reduce((s, v) => s + Math.max(v, 0), 0);

  if (total <= 0) {
    return `<div class="flex items-center justify-center h-[200px] text-xs text-slate-400">No positive values</div>`;
  }

  const colors = PALETTES[data.palette] || PALETTES.ocean;
  let offset = 0;
  const segments = values
    .map((v, i) => {
      const ratio = Math.max(v, 0) / total;
      const from = offset;
      const to = offset + ratio * 100;
      offset = to;
      return `${colors[i % colors.length]} ${from}% ${to}%`;
    })
    .join(', ');

  // Simple conic gradient pie
  const labelsHtml = values
    .map((v, i) => {
      const pct = ((v / total) * 100).toFixed(1);
      return `<span class="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
        <span class="inline-block h-2.5 w-2.5 rounded-full" style="background:${colors[i % colors.length]}"></span>
        ${labels[i] || `Item ${i + 1}`}: ${pct}%
      </span>`;
    })
    .join('');

  return `<div style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:16px;">
    <div style="width:160px;height:160px;border-radius:50%;background:conic-gradient(${segments});border:1px solid rgba(148,163,184,0.3);"></div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">${labelsHtml}</div>
  </div>`;
}

/* ---------- Utils ---------- */

function getNice(v: number, round: boolean): number {
  const sv = Math.max(v, 0.000001);
  const exp = Math.floor(Math.log10(sv));
  const frac = sv / Math.pow(10, exp);
  let nf: number;
  if (round) {
    if (frac < 1.5) nf = 1;
    else if (frac < 3) nf = 2;
    else if (frac < 7) nf = 5;
    else nf = 10;
  } else {
    if (frac <= 1) nf = 1;
    else if (frac <= 2) nf = 2;
    else if (frac <= 5) nf = 5;
    else nf = 10;
  }
  return nf * Math.pow(10, exp);
}

function fmtAxis(v: number): string {
  if (Math.abs(v) >= 1000) return Math.round(v).toLocaleString();
  if (Math.abs(v) >= 1) return Number(v.toFixed(0)).toString();
  return v.toFixed(2);
}
