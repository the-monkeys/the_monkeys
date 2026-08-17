'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  BlockWrapper,
  EmptyState,
  FormField,
  StyledInput,
} from '../shared/BlockWrapper';
import type { CitationBlockData } from '../shared/types';

/* ------------------------------------------------------------------ */
/*  CitationComponent — React UI for the Citation Block                */
/*  Structured form with auto-generated APA-like citation preview.     */
/*  Uses internal state + ref to avoid stale closures on edits.        */
/* ------------------------------------------------------------------ */

interface CitationComponentProps {
  data: CitationBlockData;
  readOnly: boolean;
  onChange: (data: CitationBlockData) => void;
}

function buildCitationText(
  data: Omit<CitationBlockData, 'citationText'>
): string {
  const parts: string[] = [];
  if (data.authors) parts.push(data.authors);
  if (data.year) parts.push(`(${data.year})`);
  if (data.title) parts.push(`<em>${data.title}</em>`);
  if (data.source) parts.push(data.source);
  if (data.identifier) parts.push(data.identifier);
  if (data.url) parts.push(data.url);
  return parts.join('. ').trim();
}

export default function CitationComponent({
  data,
  readOnly,
  onChange,
}: CitationComponentProps) {
  // Internal state + ref to avoid stale closures
  const [internal, setInternal] = useState<CitationBlockData>(data);
  const latestRef = useRef<CitationBlockData>(data);

  useEffect(() => {
    setInternal(data);
    latestRef.current = data;
  }, [data]);

  const update = useCallback(
    (patch: Partial<CitationBlockData>) => {
      const next = { ...latestRef.current, ...patch };
      next.citationText = buildCitationText(next);
      latestRef.current = next;
      setInternal(next);
      onChange(next);
    },
    [onChange]
  );

  const hasContent = !!(
    internal.authors ||
    internal.title ||
    internal.year ||
    internal.source
  );

  return (
    <BlockWrapper readOnly={readOnly}>
      <h3 className='mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200'>
        Citation
      </h3>

      {!readOnly && (
        <div className='mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2'>
          <FormField label='Title'>
            <StyledInput
              value={internal.title}
              onChange={(e) => update({ title: e.target.value })}
              placeholder='Article or book title'
            />
          </FormField>
          <FormField label='Authors'>
            <StyledInput
              value={internal.authors}
              onChange={(e) => update({ authors: e.target.value })}
              placeholder='Last, F., Last, F.'
            />
          </FormField>
          <FormField label='Year'>
            <StyledInput
              value={internal.year}
              onChange={(e) => update({ year: e.target.value })}
              placeholder='2024'
            />
          </FormField>
          <FormField label='Source / Journal'>
            <StyledInput
              value={internal.source}
              onChange={(e) => update({ source: e.target.value })}
              placeholder='Journal name or publisher'
            />
          </FormField>
          <FormField label='Identifier (DOI/arXiv/PMID)'>
            <StyledInput
              value={internal.identifier}
              onChange={(e) => update({ identifier: e.target.value })}
              placeholder='10.1234/example'
            />
          </FormField>
          <FormField label='URL'>
            <StyledInput
              value={internal.url}
              onChange={(e) => update({ url: e.target.value })}
              placeholder='https://doi.org/...'
            />
          </FormField>
        </div>
      )}

      {/* Citation Preview */}
      <div className='mt-2'>
        {!hasContent ? (
          <EmptyState
            message={
              readOnly ? 'No citation' : 'Fill in citation details above'
            }
          />
        ) : (
          <div className='rounded-lg border border-slate-200/60 bg-white/50 p-4 dark:border-slate-700/40 dark:bg-slate-900/40'>
            <p className='mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500'>
              Formatted Citation
            </p>
            <p
              className='text-sm text-slate-700 dark:text-slate-200 [&>em]:italic [&>em]:not-italic'
              dangerouslySetInnerHTML={{
                __html: internal.citationText || 'No citation details yet.',
              }}
            />
          </div>
        )}
      </div>
    </BlockWrapper>
  );
}
