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
  BlockHelp,
  BlockWrapper,
  EditDataDetails,
  EmptyState,
  FormField,
  StyledInput,
} from '../shared/BlockWrapper';
import type { TrendBlockData } from '../shared/types';
import { buildSparklineSvg, computeTrend } from './trendMath';

interface TrendComponentProps {
  data: TrendBlockData;
  readOnly: boolean;
  onChange: (data: TrendBlockData) => void;
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

  const sparklineSvg = useMemo(
    () => buildSparklineSvg(internal.values, internal.direction),
    [internal.values, internal.direction]
  );

  const values = Array.isArray(internal.values) ? internal.values : [];
  const periodLabels = Array.isArray(internal.periodLabels)
    ? internal.periodLabels
    : [];
  const directionLabel =
    internal.direction === 'up'
      ? 'Up'
      : internal.direction === 'down'
        ? 'Down'
        : 'Flat';
  const pctLabel =
    typeof internal.percentChange !== 'number'
      ? 'N/A'
      : `${internal.percentChange > 0 ? '+' : ''}${internal.percentChange.toFixed(0)}%`;
  const deltaLabel =
    typeof internal.delta !== 'number'
      ? '0'
      : `${internal.delta > 0 ? '+' : ''}${internal.delta.toFixed(0)}`;

  return (
    <BlockWrapper readOnly={readOnly}>
      <h3 className='mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200'>
        Trend
      </h3>

      {!readOnly && (
        <BlockHelp>
          Comma-separated values. Optional labels. Percent and direction are
          calculated for you.
        </BlockHelp>
      )}

      {values.length === 0 ? (
        <EmptyState
          message={
            readOnly
              ? 'No trend data'
              : 'Enter values above to see trend analysis'
          }
        />
      ) : (
        <div className='rounded-lg border border-slate-200/60 bg-white/50 p-4 dark:border-slate-700/40 dark:bg-slate-900/40'>
          {sparklineSvg ? (
            <div
              className='mb-3'
              dangerouslySetInnerHTML={{ __html: sparklineSvg }}
            />
          ) : null}

          <div className='mb-3 flex flex-wrap gap-2'>
            <Badge variant={BADGE_VARIANT[internal.direction] || 'default'}>
              {directionLabel}
            </Badge>
            <Badge>{pctLabel}</Badge>
            <Badge>{deltaLabel}</Badge>
          </div>

          <p className='text-sm text-slate-600 dark:text-slate-300'>
            {internal.summary}
          </p>
        </div>
      )}

      {!readOnly && (
        <EditDataDetails>
          <FormField
            label='Time Period Labels (comma-separated)'
            className='sm:col-span-2'
          >
            <StyledInput
              value={periodLabels.join(', ')}
              onChange={(e) =>
                update(
                  e.target.value
                    .split(',')
                    .map((l) => l.trim())
                    .filter(Boolean),
                  values
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
              value={values.join(', ')}
              onChange={(e) =>
                update(
                  periodLabels,
                  e.target.value
                    .split(',')
                    .map((v) => Number(v.trim()))
                    .filter((v) => Number.isFinite(v))
                )
              }
              placeholder='100, 118, 121…'
            />
          </FormField>
        </EditDataDetails>
      )}
    </BlockWrapper>
  );
}
