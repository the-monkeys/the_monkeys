'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  BlockWrapper,
  EmptyState,
  FormField,
  StyledInput,
  StyledTextarea,
} from '../shared/BlockWrapper';
import type { DatasetBlockData } from '../shared/types';

/* ------------------------------------------------------------------ */
/*  DatasetComponent — React UI for the Dataset Block                  */
/*  Structured metadata card with source attribution.                  */
/*  Uses internal state + ref to avoid stale closures on edits.        */
/* ------------------------------------------------------------------ */

interface DatasetComponentProps {
  data: DatasetBlockData;
  readOnly: boolean;
  onChange: (data: DatasetBlockData) => void;
}

const FIELDS: {
  key: keyof DatasetBlockData;
  label: string;
  placeholder: string;
  isTextarea?: boolean;
}[] = [
  { key: 'title', label: 'Dataset Title', placeholder: 'Name of the dataset' },
  { key: 'source', label: 'Source', placeholder: 'URL or organisation name' },
  {
    key: 'sampleSize',
    label: 'Sample Size',
    placeholder: 'e.g. 1,000 respondents',
  },
  {
    key: 'collectionDate',
    label: 'Collection Date',
    placeholder: 'e.g. Jan–Mar 2024',
  },
  {
    key: 'license',
    label: 'License',
    placeholder: 'e.g. CC BY 4.0, MIT, Proprietary',
  },
  {
    key: 'variables',
    label: 'Variables',
    placeholder: 'Key variables (comma or line separated)',
    isTextarea: true,
  },
  {
    key: 'notes',
    label: 'Notes',
    placeholder: 'Additional context or caveats',
    isTextarea: true,
  },
];

export default function DatasetComponent({
  data,
  readOnly,
  onChange,
}: DatasetComponentProps) {
  // Internal state + ref to avoid stale closures
  const [internal, setInternal] = useState<DatasetBlockData>(data);
  const latestRef = useRef<DatasetBlockData>(data);

  useEffect(() => {
    setInternal(data);
    latestRef.current = data;
  }, [data]);

  const update = useCallback(
    (patch: Partial<DatasetBlockData>) => {
      const next = { ...latestRef.current, ...patch };
      latestRef.current = next;
      setInternal(next);
      onChange(next);
    },
    [onChange]
  );

  const hasContent = FIELDS.some((f) => !!internal[f.key]);

  return (
    <BlockWrapper readOnly={readOnly}>
      <h3 className='mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200'>
        Dataset{internal.title ? `: ${internal.title}` : ''}
      </h3>

      {!readOnly && (
        <div className='mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2'>
          {FIELDS.map((field) => {
            const input = field.isTextarea ? (
              <StyledTextarea
                rows={3}
                value={internal[field.key]}
                onChange={(e) =>
                  update({
                    [field.key]: e.target.value,
                  } as Partial<DatasetBlockData>)
                }
                placeholder={field.placeholder}
              />
            ) : (
              <StyledInput
                value={internal[field.key]}
                onChange={(e) =>
                  update({
                    [field.key]: e.target.value,
                  } as Partial<DatasetBlockData>)
                }
                placeholder={field.placeholder}
              />
            );

            return (
              <FormField
                key={field.key}
                label={field.label}
                className={field.isTextarea ? 'sm:col-span-2' : ''}
              >
                {input}
              </FormField>
            );
          })}
        </div>
      )}

      {!hasContent ? (
        <EmptyState
          message={
            readOnly ? 'No dataset metadata' : 'Fill in dataset details above'
          }
        />
      ) : (
        <div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
          {FIELDS.map((field) => {
            const value = internal[field.key];
            if (!value) return null;

            return (
              <div
                key={field.key}
                className='rounded-lg border border-slate-200/60 bg-white/50 p-3 dark:border-slate-700/40 dark:bg-slate-900/40'
              >
                <p className='mb-0.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
                  {field.label}
                </p>
                <p className='whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200'>
                  {value}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </BlockWrapper>
  );
}
