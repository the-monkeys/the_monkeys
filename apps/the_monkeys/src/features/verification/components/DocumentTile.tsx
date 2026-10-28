'use client';

import { useEffect, useRef, useState } from 'react';

import dynamic from 'next/dynamic';

import type { DocKind } from '@/services/verification/verificationTypes';
import {
  RiCameraLine,
  RiCheckboxCircleFill,
  RiErrorWarningLine,
  RiFileAddLine,
  RiLoader4Line,
} from '@remixicon/react';
import { Button } from '@the-monkeys/ui/atoms/button';

import { ACCEPTED_DOC_MIME, MAX_DOC_BYTES } from '../constants';
import { UploadedDoc } from '../schema';
import { cameraSupported } from './CameraCapture';

// Code-split: the getUserMedia dialog ships only when a tile can use it.
const CameraCapture = dynamic(
  () => import('./CameraCapture').then((m) => m.CameraCapture),
  { ssr: false }
);

/**
 * One document slot (selfie / id_front / id_back). Two capture modes feed the
 * SAME pipeline (`onFile` -> panel mutation -> checksum): file picking and
 * live camera. Presentational + capture only — uploading is owned by the
 * panel's mutation so progress and errors stay in one place.
 */
export const DocumentTile = ({
  kind,
  label,
  doc,
  error,
  disabled,
  onFile,
}: {
  kind: DocKind;
  label: string;
  doc?: UploadedDoc;
  error?: string;
  disabled?: boolean;
  onFile: (kind: DocKind, file: File) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  // Mount-gated: camera APIs exist only in-browser, keeps SSR markup stable.
  const [camOk, setCamOk] = useState(false);
  const [camOpen, setCamOpen] = useState(false);
  useEffect(() => setCamOk(cameraSupported()), []);

  // Selfie uses the front camera; ID sides are photographed with the rear.
  const initialFacing: 'user' | 'environment' =
    kind === 'selfie' ? 'user' : 'environment';

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Reset so re-selecting the same file fires change again.
    e.target.value = '';
    if (!file || disabled) return;

    if (!ACCEPTED_DOC_MIME.includes(file.type)) {
      return; // surfaced via accept attr; server double-checks magic bytes
    }
    if (file.size > MAX_DOC_BYTES) {
      return;
    }
    onFile(kind, file);
  };

  const state = error
    ? 'error'
    : doc?.progress !== undefined && doc.progress < 100
      ? 'uploading'
      : doc
        ? 'ready'
        : 'empty';

  return (
    <div
      className={`rounded-md border-1 p-3 flex flex-col gap-1 items-center justify-center min-h-[120px] text-center ${
        state === 'ready'
          ? 'border-brand-orange/60 bg-brand-orange/5'
          : 'border-border-light dark:border-border-dark border-dashed'
      }`}
    >
      <input
        ref={inputRef}
        type='file'
        accept={ACCEPTED_DOC_MIME.join(',')}
        onChange={handleFile}
        disabled={disabled}
        className='hidden'
        data-testid={`doc-input-${kind}`}
      />

      {state === 'uploading' ? (
        <>
          <RiLoader4Line size={20} className='animate-spin opacity-70' />
          <p className='text-sm opacity-80'>{doc?.progress ?? 0}%</p>
        </>
      ) : state === 'ready' ? (
        <>
          <RiCheckboxCircleFill size={20} className='text-brand-orange' />
          <p className='text-sm font-medium leading-tight'>{label}</p>
          <button
            type='button'
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className='text-xs underline underline-offset-2 opacity-80 hover:opacity-100'
          >
            Replace
          </button>
        </>
      ) : (
        <>
          {state === 'error' ? (
            <RiErrorWarningLine size={20} className='text-alert-red' />
          ) : (
            <RiFileAddLine size={20} className='opacity-60' />
          )}
          <div className='flex items-center gap-2'>
            <Button
              type='button'
              variant='outline'
              className='h-7 px-2 text-xs'
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
            >
              {state === 'error' ? 'Retry upload' : label}
            </Button>
            {camOk && (
              <Button
                type='button'
                variant='outline'
                className='h-7 w-7 !p-0'
                disabled={disabled}
                title='Use camera'
                aria-label={'Use camera for ' + kind}
                onClick={() => setCamOpen(true)}
              >
                <RiCameraLine size={14} />
              </Button>
            )}
          </div>
          {error && <p className='text-xs text-alert-red px-1'>{error}</p>}
        </>
      )}

      {doc?.checksum && (
        <p
          className='text-[10px] opacity-50 font-mono truncate max-w-full px-1'
          title={doc.checksum}
        >
          {doc.checksum.slice(0, 10)}…
        </p>
      )}

      {camOk && camOpen && (
        <CameraCapture
          kind={kind}
          open={camOpen}
          onOpenChange={setCamOpen}
          initialFacing={initialFacing}
          onCapture={onFile}
        />
      )}
    </div>
  );
};
