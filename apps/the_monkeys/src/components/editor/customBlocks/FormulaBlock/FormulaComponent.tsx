'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  BlockWrapper,
  EmptyState,
  FormField,
  StyledInput,
  StyledSelect,
} from '../shared/BlockWrapper';
import type { FormulaBlockData } from '../shared/types';

/* ------------------------------------------------------------------ */
/*  FormulaComponent — React UI for the Formula Block                  */
/*  Renders LaTeX via KaTeX. Falls back to raw text on error.          */
/*  Uses internal state + ref to handle edits without stale closures.  */
/* ------------------------------------------------------------------ */

interface FormulaComponentProps {
  data: FormulaBlockData;
  readOnly: boolean;
  onChange: (data: FormulaBlockData) => void;
}

export default function FormulaComponent({
  data,
  readOnly,
  onChange,
}: FormulaComponentProps) {
  // Internal state to drive re-renders on user input
  const [internal, setInternal] = useState<FormulaBlockData>(data);
  // Ref to always have latest data for the onChange callback
  const latestRef = useRef<FormulaBlockData>(data);

  // When EditorJS re-invokes render() we get new props.data via the bridge key
  useEffect(() => {
    setInternal(data);
    latestRef.current = data;
  }, [data]);

  const update = useCallback(
    (patch: Partial<FormulaBlockData>) => {
      const next = { ...latestRef.current, ...patch };
      latestRef.current = next;
      setInternal(next);
      onChange(next);
    },
    [onChange]
  );

  return (
    <BlockWrapper readOnly={readOnly}>
      <h3 className='mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200'>
        Formula
      </h3>

      {!readOnly && (
        <div className='mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <FormField label='LaTeX Expression' className='sm:col-span-2'>
            <StyledInput
              value={internal.expression}
              onChange={(e) => update({ expression: e.target.value })}
              placeholder='E = mc^2'
            />
          </FormField>
          <FormField label='Mode'>
            <StyledSelect
              value={internal.mode}
              onChange={(e) =>
                update({ mode: e.target.value as 'inline' | 'display' })
              }
            >
              <option value='display'>Display</option>
              <option value='inline'>Inline</option>
            </StyledSelect>
          </FormField>
          <FormField label='Description (optional)'>
            <StyledInput
              value={internal.description}
              onChange={(e) => update({ description: e.target.value })}
              placeholder="e.g. Einstein's mass-energy equivalence"
            />
          </FormField>
        </div>
      )}

      {/* KaTeX Preview */}
      <div className='mt-2'>
        {!internal.expression ? (
          <EmptyState
            message={readOnly ? 'No formula' : 'Type a LaTeX expression above'}
          />
        ) : (
          <KaTeXPreview
            expression={internal.expression}
            mode={internal.mode}
            description={internal.description}
          />
        )}
      </div>
    </BlockWrapper>
  );
}

/* ------------------------------------------------------------------ */
/*  KaTeXPreview — lazy-loads KaTeX and renders the formula            */
/* ------------------------------------------------------------------ */

interface KaTeXPreviewProps {
  expression: string;
  mode: 'inline' | 'display';
  description: string;
}

function KaTeXPreview({ expression, mode, description }: KaTeXPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (!containerRef.current) return;

      try {
        // Lazy-load KaTeX
        const katex = (await import('katex')).default;
        // CSS is loaded globally — see _app.tsx or layout.tsx

        if (cancelled) return;
        setError(null);

        katex.render(expression, containerRef.current, {
          displayMode: mode === 'display',
          throwOnError: false,
          errorColor: '#ef4444',
        });
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to render formula'
          );
        }
      }
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [expression, mode]);

  return (
    <div className='rounded-lg border border-slate-200/60 bg-white/50 p-4 dark:border-slate-700/40 dark:bg-slate-900/40'>
      {error ? (
        <div className='space-y-2'>
          <p className='text-sm text-red-500'>Render error: {error}</p>
          <pre className='overflow-x-auto rounded bg-slate-100 p-2 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300'>
            {expression}
          </pre>
        </div>
      ) : (
        <div
          ref={containerRef}
          className={`${mode === 'display' ? 'flex justify-center py-3' : 'inline'}`}
        />
      )}

      {description && (
        <p className='mt-2 text-xs text-slate-400 dark:text-slate-500'>
          {description}
        </p>
      )}
    </div>
  );
}
