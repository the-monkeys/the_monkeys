'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Button } from '@the-monkeys/ui/atoms/button';
import { Label } from '@the-monkeys/ui/atoms/label';
import { Switch } from '@the-monkeys/ui/atoms/switch';

import {
  Badge,
  BlockHelp,
  BlockWrapper,
  EditDataDetails,
  EmptyState,
  FormField,
  StyledInput,
  StyledSelect,
  StyledTextarea,
} from '../shared/BlockWrapper';
import type { ChartBlockData, ChartSeries, ChartType } from '../shared/types';
import { PALETTES } from '../shared/types';
import { generateChartMarkup } from './chartSvg';

/* ------------------------------------------------------------------ */
/*  ChartComponent — React UI for the Chart Block                      */
/*  Hand-rolled SVG, not D3. Preview for edit mode.                  */
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

  const labels = Array.isArray(internal.labels) ? internal.labels : [];
  const series = Array.isArray(internal.series) ? internal.series : [];
  const seriesText = series
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
        <BlockHelp>
          Paste CSV (first row = headers) or one series per line:
          Revenue:10,20,30
        </BlockHelp>
      )}

      {/* Chart Preview */}
      <div className='mt-2'>
        {labels.length === 0 || series.length === 0 ? (
          <EmptyState
            message={
              readOnly ? 'No chart data' : 'Add data above to see a preview'
            }
          />
        ) : (
          <ChartPreview data={{ ...internal, labels, series }} />
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
      {internal.showLegend && series.length > 0 && (
        <div className='mt-2 flex flex-wrap gap-3'>
          {series.map((s, i) => {
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

      {!readOnly && (
        <EditDataDetails>
          {/* Chart Type */}
          <FormField label='Chart Type'>
            <StyledSelect
              value={internal.type}
              onValueChange={(value) => update({ type: value as ChartType })}
              options={CHART_TYPES.map((t) => ({
                value: t.value,
                label: t.label,
              }))}
            />
          </FormField>

          {/* Palette */}
          <FormField label='Palette'>
            <StyledSelect
              value={internal.palette}
              onValueChange={(value) => update({ palette: value })}
              options={PALETTE_NAMES.map((p) => ({
                value: p,
                label: p.charAt(0).toUpperCase() + p.slice(1),
              }))}
            />
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
            <div className='flex items-center gap-2'>
              <Switch
                id='chart-show-legend'
                checked={internal.showLegend}
                onCheckedChange={(checked) => update({ showLegend: checked })}
              />
              <Label htmlFor='chart-show-legend' className='text-sm'>
                {internal.showLegend ? 'Visible' : 'Hidden'}
              </Label>
            </div>
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
              value={labels.join(', ')}
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
            <Button
              type='button'
              variant='outline'
              size='sm'
              className='mt-1 w-full text-xs sm:w-auto'
              onClick={() => parseCSV(csvText)}
            >
              Parse CSV
            </Button>
          </FormField>
        </EditDataDetails>
      )}
    </BlockWrapper>
  );
}

/* ------------------------------------------------------------------ */
/*  ChartPreview — hand-rolled SVG, not D3                             */
/* ------------------------------------------------------------------ */

function ChartPreview({ data }: { data: ChartBlockData }) {
  const svgContent = useMemo(() => {
    try {
      return generateChartMarkup(data);
    } catch {
      return '';
    }
  }, [data]);

  return (
    <div
      data-chart-preview
      className='h-36 w-full overflow-hidden rounded-lg border border-slate-200/60 bg-white/50 text-slate-600 dark:border-slate-700/40 dark:bg-slate-900/40 dark:text-slate-300 sm:h-44'
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}
