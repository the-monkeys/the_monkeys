'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@the-monkeys/ui/atoms/button';

import {
  BlockWrapper,
  EmptyState,
  StyledTextarea,
} from '../shared/BlockWrapper';
import type { MarkdownBlockData } from '../shared/types';
import { validateMarkdownFile } from './markdownFile';
import { MARKDOWN_PREVIEW_CLASS, renderMarkdownHtml } from './markdownRender';

interface MarkdownComponentProps {
  data: MarkdownBlockData;
  readOnly: boolean;
  onChange: (data: MarkdownBlockData) => void;
}

export default function MarkdownComponent({
  data,
  readOnly,
  onChange,
}: MarkdownComponentProps) {
  const [internal, setInternal] = useState<MarkdownBlockData>(data);
  const latestRef = useRef<MarkdownBlockData>(data);
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const [html, setHtml] = useState('');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const markdown =
    typeof internal.markdown === 'string' ? internal.markdown : '';

  useEffect(() => {
    setInternal(data);
    latestRef.current = data;
  }, [data]);

  const update = useCallback(
    (patch: MarkdownBlockData) => {
      latestRef.current = patch;
      setInternal(patch);
      onChange(patch);
    },
    [onChange]
  );

  useEffect(() => {
    let cancelled = false;
    const source = markdown;
    if (!source.trim()) {
      setHtml('');
      setRenderError(null);
      return;
    }

    renderMarkdownHtml(source)
      .then((next) => {
        if (cancelled) return;
        setHtml(next);
        setRenderError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setHtml('');
        setRenderError('Could not render Markdown.');
      });

    return () => {
      cancelled = true;
    };
  }, [markdown]);

  const onUpload = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      const error = validateMarkdownFile(file);
      if (error) {
        setFileError(error);
        return;
      }
      if (markdown.trim()) {
        const ok = window.confirm('Replace current Markdown with this file?');
        if (!ok) return;
      }
      const text = await file.text();
      setFileError(null);
      update({ markdown: text, sourceFileName: file.name });
    },
    [markdown, update]
  );

  if (readOnly && !markdown.trim()) {
    return null;
  }

  if (readOnly) {
    return (
      <BlockWrapper readOnly>
        {renderError ? (
          <p className='text-sm text-red-500'>{renderError}</p>
        ) : (
          <div
            data-markdown-preview
            className={MARKDOWN_PREVIEW_CLASS}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </BlockWrapper>
    );
  }

  return (
    <BlockWrapper>
      <h3 className='mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200'>
        Markdown
      </h3>

      {!markdown.trim() ? (
        <EmptyState message='Write or paste Markdown, or upload a .md file.' />
      ) : null}

      <div className='mb-3 flex w-full'>
        <button
          type='button'
          className={`min-h-11 w-1/2 border text-sm font-medium ${
            tab === 'write'
              ? 'border-slate-400 bg-white dark:border-slate-500 dark:bg-slate-800'
              : 'border-slate-300/40 bg-transparent'
          }`}
          onClick={() => setTab('write')}
        >
          Write
        </button>
        <button
          type='button'
          className={`min-h-11 w-1/2 border text-sm font-medium ${
            tab === 'preview'
              ? 'border-slate-400 bg-white dark:border-slate-500 dark:bg-slate-800'
              : 'border-slate-300/40 bg-transparent'
          }`}
          onClick={() => setTab('preview')}
        >
          Preview
        </button>
      </div>

      {tab === 'write' ? (
        <StyledTextarea
          className='min-h-[160px] w-full'
          value={markdown}
          onChange={(e) =>
            update({
              markdown: e.target.value,
              ...(internal.sourceFileName
                ? { sourceFileName: internal.sourceFileName }
                : {}),
            })
          }
          placeholder='# Heading'
        />
      ) : renderError ? (
        <p className='text-sm text-red-500'>{renderError}</p>
      ) : (
        <div
          data-markdown-preview
          className={`${MARKDOWN_PREVIEW_CLASS} min-h-[160px] rounded-lg border border-slate-200/60 p-3 dark:border-slate-700/40`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}

      <div className='mt-3'>
        <input
          id='markdown-upload'
          type='file'
          accept='.md,.markdown,.txt,text/markdown,text/plain'
          aria-label='Upload .md'
          className='sr-only'
          onChange={(e) => {
            void onUpload(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
        <Button asChild className='min-h-11 w-full sm:w-auto' variant='outline'>
          <label htmlFor='markdown-upload'>Upload .md</label>
        </Button>
      </div>

      {internal.sourceFileName ? (
        <p className='mt-2 text-xs text-slate-500'>{internal.sourceFileName}</p>
      ) : null}
      {fileError ? (
        <p className='mt-2 text-sm text-red-500'>{fileError}</p>
      ) : null}
    </BlockWrapper>
  );
}
