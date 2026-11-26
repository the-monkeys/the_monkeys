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
import type { UploadedDoc } from '../schema';
import { cameraSupported } from './CameraCapture';

const CameraCapture = dynamic(
  () => import('./CameraCapture').then((m) => m.CameraCapture),
  { ssr: false }
);

/** Capture and feedback only. The panel owns the private upload pipeline. */
export const DocumentTile = ({
  kind,
  label,
  doc,
  progress,
  error,
  disabled,
  onFile,
  onInvalidFile,
}: {
  kind: DocKind;
  label: string;
  doc?: UploadedDoc;
  progress?: number;
  error?: string;
  disabled?: boolean;
  onFile: (kind: DocKind, file: File) => void;
  onInvalidFile?: (kind: DocKind, message: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [camOk, setCamOk] = useState(false);
  const [camOpen, setCamOpen] = useState(false);
  const [validationError, setValidationError] = useState<string>();
  useEffect(() => setCamOk(cameraSupported()), []);

  const uploadProgress = progress ?? doc?.progress;
  const uploading =
    progress !== undefined ||
    (uploadProgress !== undefined && uploadProgress < 100);
  const feedback = validationError || error;
  const ready = !!doc?.checksum;
  const blocked = disabled || uploading;
  const errorId = `doc-error-${kind}`;

  const acceptFile = (file: File) => {
    if (blocked) return;
    if (!ACCEPTED_DOC_MIME.includes(file.type)) {
      const message = 'Choose a JPEG, PNG or WebP image.';
      setValidationError(message);
      onInvalidFile?.(kind, message);
      return;
    }
    if (file.size > MAX_DOC_BYTES) {
      const message = 'Choose an image smaller than 10 MB.';
      setValidationError(message);
      onInvalidFile?.(kind, message);
      return;
    }
    setValidationError(undefined);
    onFile(kind, file);
  };

  return (
    <div className='flex h-full min-w-0 flex-col gap-3 rounded-xl border-1 border-border-light p-4 dark:border-border-dark'>
      <div className='flex items-start gap-2'>
        {uploading ? (
          <RiLoader4Line
            size={20}
            className='shrink-0 animate-spin'
            aria-hidden
          />
        ) : feedback ? (
          <RiErrorWarningLine
            size={20}
            className='shrink-0 text-alert-red'
            aria-hidden
          />
        ) : ready ? (
          <RiCheckboxCircleFill
            size={20}
            className='shrink-0 text-brand-orange'
            aria-hidden
          />
        ) : (
          <RiFileAddLine
            size={20}
            className='shrink-0 opacity-70'
            aria-hidden
          />
        )}
        <p className='text-sm font-medium leading-5'>{label}</p>
      </div>

      <input
        ref={inputRef}
        type='file'
        accept={ACCEPTED_DOC_MIME.join(',')}
        aria-label={`Choose file for ${label}`}
        aria-invalid={!!feedback}
        aria-describedby={feedback ? errorId : undefined}
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (file) acceptFile(file);
        }}
        disabled={blocked}
        className='hidden'
        data-testid={`doc-input-${kind}`}
      />

      {uploading ? (
        <div className='flex flex-col gap-2'>
          <p className='text-sm' aria-live='polite'>
            {uploadProgress === 100
              ? 'Finishing upload…'
              : `Uploading… ${uploadProgress ?? 0}%`}
          </p>
          <progress
            aria-label={`Uploading ${label}`}
            aria-valuenow={uploadProgress ?? 0}
            max={100}
            value={uploadProgress ?? 0}
            className='h-2 w-full accent-brand-orange'
          />
        </div>
      ) : (
        <p className='text-sm opacity-75' aria-live='polite'>
          {feedback
            ? 'Choose an image to try again.'
            : ready
              ? 'Uploaded'
              : kind === 'selfie'
                ? 'Keep your face and ID clearly visible.'
                : 'Make sure all details are readable.'}
        </p>
      )}

      {feedback && (
        <p
          id={errorId}
          role='alert'
          className='break-words text-sm text-alert-red'
        >
          {feedback}
        </p>
      )}

      <div className='mt-auto flex flex-wrap gap-2'>
        <Button
          type='button'
          variant='outline'
          size='sm'
          className='h-auto min-h-9 whitespace-normal'
          aria-label={`${feedback ? 'Retry upload' : ready ? 'Replace' : 'Upload'} ${label}`}
          aria-describedby={feedback ? errorId : undefined}
          disabled={blocked}
          onClick={() => inputRef.current?.click()}
        >
          {feedback ? 'Retry upload' : ready ? 'Replace image' : 'Upload image'}
        </Button>
        {camOk && (
          <Button
            type='button'
            variant='outline'
            size='icon'
            disabled={blocked}
            title='Use camera'
            aria-label={`Use camera for ${label}`}
            onClick={() => setCamOpen(true)}
          >
            <RiCameraLine size={18} aria-hidden />
          </Button>
        )}
      </div>

      {camOk && camOpen && (
        <CameraCapture
          kind={kind}
          open={camOpen}
          onOpenChange={setCamOpen}
          initialFacing={kind === 'selfie' ? 'user' : 'environment'}
          onCapture={(_, file) => acceptFile(file)}
        />
      )}
    </div>
  );
};
