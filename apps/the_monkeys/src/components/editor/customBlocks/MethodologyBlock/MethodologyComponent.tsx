'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  BlockWrapper,
  EmptyState,
  FormField,
  StyledTextarea,
} from '../shared/BlockWrapper';
import type { MethodologyBlockData } from '../shared/types';

/* ------------------------------------------------------------------ */
/*  MethodologyComponent — React UI for the Methodology Block          */
/*  Accordion-style structured template in edit mode;                  */
/*  collapsed labelled sections in read-only mode.                     */
/*  Uses internal state + ref to avoid stale closures on edits.        */
/* ------------------------------------------------------------------ */

interface MethodologyComponentProps {
  data: MethodologyBlockData;
  readOnly: boolean;
  onChange: (data: MethodologyBlockData) => void;
}

const SECTIONS: {
  key: keyof MethodologyBlockData;
  label: string;
  placeholder: string;
}[] = [
  {
    key: 'studyDesign',
    label: 'Study Design',
    placeholder: 'Describe the study design (e.g. cohort, RCT, observational)',
  },
  {
    key: 'dataCollection',
    label: 'Data Collection',
    placeholder: 'How was data collected? Instruments, procedures, sampling',
  },
  {
    key: 'analysisMethod',
    label: 'Analysis Method',
    placeholder: 'Statistical tests, models, or analytical approaches used',
  },
  {
    key: 'assumptions',
    label: 'Assumptions',
    placeholder: 'Key assumptions made during analysis',
  },
  {
    key: 'limitations',
    label: 'Limitations',
    placeholder: 'Limitations, biases, and caveats',
  },
];

export default function MethodologyComponent({
  data,
  readOnly,
  onChange,
}: MethodologyComponentProps) {
  // Internal state + ref to avoid stale closures
  const [internal, setInternal] = useState<MethodologyBlockData>(data);
  const latestRef = useRef<MethodologyBlockData>(data);

  useEffect(() => {
    setInternal(data);
    latestRef.current = data;
  }, [data]);

  const update = useCallback(
    (patch: Partial<MethodologyBlockData>) => {
      const next = { ...latestRef.current, ...patch };
      latestRef.current = next;
      setInternal(next);
      onChange(next);
    },
    [onChange]
  );

  const hasContent = SECTIONS.some((s) => !!internal[s.key]);

  return (
    <BlockWrapper readOnly={readOnly}>
      <h3 className='mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200'>
        Methodology
      </h3>

      {!readOnly && (
        <div className='mb-4 space-y-3'>
          {SECTIONS.map((section) => (
            <FormField key={section.key} label={section.label}>
              <StyledTextarea
                rows={3}
                value={internal[section.key]}
                onChange={(e) =>
                  update({
                    [section.key]: e.target.value,
                  } as Partial<MethodologyBlockData>)
                }
                placeholder={section.placeholder}
              />
            </FormField>
          ))}
        </div>
      )}

      {!hasContent ? (
        <EmptyState
          message={
            readOnly
              ? 'No methodology data'
              : 'Fill in methodology details above'
          }
        />
      ) : (
        <div className='space-y-2'>
          {SECTIONS.map((section) => {
            const content = internal[section.key];
            if (!content) return null;

            return (
              <details
                key={section.key}
                className='rounded-lg border border-slate-200/60 bg-white/50 dark:border-slate-700/40 dark:bg-slate-900/40'
              >
                <summary className='cursor-pointer px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                  {section.label}
                </summary>
                <div className='border-t border-slate-200/40 px-4 py-3 dark:border-slate-700/30'>
                  <p className='whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200'>
                    {content}
                  </p>
                </div>
              </details>
            );
          })}
        </div>
      )}
    </BlockWrapper>
  );
}
