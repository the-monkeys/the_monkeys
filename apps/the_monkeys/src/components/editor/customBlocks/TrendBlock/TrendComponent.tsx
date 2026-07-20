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
} from '../shared/BlockWrapper';
import type { TrendBlockData } from '../shared/types';

/* ------------------------------------------------------------------ */
/*  TrendComponent — React UI for the Trend Block                      */
/*  Shows sparkline + computed stats (direction, percent, delta).      */
/*  Uses internal state + ref to handle edits without stale closures.  */
/* ------------------------------------------------------------------ */

interface TrendComponentProps {
  data: TrendBlockData;
  readOnly: boolean;
  onChange: (data: TrendBlockData) => void;
}

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

const BADGE_VARIANT: Record<string, 'success' | 'danger' | 'warning'> = {
  up: 'success',
  down: 'danger',
  flat: 'warning',
};

export default function TrendComponent({
  data,
  readOnly,
  onChange,
}: TrendComponentProps) {
  // Internal state + ref to avoid stale closures
  const [internal, setInternal] = useState<TrendBlockData>(data);
  const latestRef = useRef<TrendBlockData>(data);

  useEffect(() => {
    setInternal(data);
    latestRef.current = data;
  }, [data]);

  const update = useCallback(
    (labels: string[], values: number[]) => {
      const next = computeTrend(labels, values);
      latestRef.current = next;
      setInternal(next);
      onChange(next);
    },
    [onChange]
  );

  const { sparklineSvg } = useMemo(() => {
    if (!internal.values || internal.values.length < 2)
      return { sparklineSvg: '' };
    const w = 200;
    const h = 50;
    const min = Math.min(...internal.values);
    const max = Math.max(...internal.values);
    const range = max - min || 1;
    const count = internal.values.length;
    const pts = internal.values
      .map((v, i) => {
        const x = (i / (count - 1)) * w;
        const y = h - ((v - min) / range) * h;
        return `${x},${y}`;
      })
      .join(' ');

    const color =
      internal.direction === 'up'
        ? '#22c55e'
        : internal.direction === 'down'
          ? '#ef4444'
          : '#a3a3a3';

    return {
      sparklineSvg: `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:200px;height:50px;">
        <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>
      </svg>`,
    };
  }, [internal]);

  return (
    <BlockWrapper readOnly={readOnly}>
      <h3 className='mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200'>
        Trend Insight
      </h3>

      {!readOnly && (
        <div className='mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <FormField
            label='Time Period Labels (comma-separated)'
            className='sm:col-span-2'
          >
            <StyledInput
              value={internal.periodLabels.join(', ')}
              onChange={(e) =>
                update(
                  e.target.value
                    .split(',')
                    .map((l) => l.trim())
                    .filter(Boolean),
                  internal.values
                )
              }
              placeholder='Jan, Feb, Mar…'
            />
          </FormField>
          <FormField
            label='Numeric Values (comma-separated)'
            className='sm:col-span-2'
          >
            <StyledInput
              value={internal.values.join(', ')}
              onChange={(e) =>
                update(
                  internal.periodLabels,
                  e.target.value
                    .split(',')
                    .map((v) => Number(v.trim()))
                    .filter((v) => Number.isFinite(v))
                )
              }
              placeholder='100, 118, 121…'
            />
          </FormField>
        </div>
      )}

      {internal.values.length === 0 ? (
        <EmptyState
          message={
            readOnly
              ? 'No trend data'
              : 'Enter values above to see trend analysis'
          }
        />
      ) : (
        <div className='rounded-lg border border-slate-200/60 bg-white/50 p-4 dark:border-slate-700/40 dark:bg-slate-900/40'>
          {/* Sparkline */}
          {sparklineSvg && (
            <div
              className='mb-3'
              dangerouslySetInnerHTML={{ __html: sparklineSvg }}
            />
          )}

          {/* Badges */}
          <div className='mb-3 flex flex-wrap gap-2'>
            <Badge variant={BADGE_VARIANT[internal.direction] || 'default'}>
              Direction: {internal.direction}
            </Badge>
            <Badge>
              {internal.percentChange === null
                ? 'Pct: N/A'
                : `Pct: ${internal.percentChange.toFixed(1)}%`}
            </Badge>
            <Badge>Delta: {internal.delta.toFixed(1)}</Badge>
          </div>

          {/* Summary */}
          <p className='text-sm text-slate-600 dark:text-slate-300'>
            {internal.summary}
          </p>
        </div>
      )}
    </BlockWrapper>
  );
}
