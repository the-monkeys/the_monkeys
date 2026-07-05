'use client';

import { useCallback, useMemo, useRef, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import useAuth from '@/hooks/auth/useAuth';

type Status = 'idle' | 'processing' | 'done' | 'error';

export default function BrandVideoPage() {
  const { data: session, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayName = useMemo(() => {
    const fn = session?.first_name?.trim();
    const ln = session?.last_name?.trim();
    return [fn, ln].filter(Boolean).join(' ') || session?.username || '';
  }, [session?.first_name, session?.last_name, session?.username]);

  const pickFile = useCallback(
    (f: File) => {
      if (!f.type.startsWith('video/')) {
        setErrorMsg('Please select a video file.');
        return;
      }
      if (f.size > 500 * 1024 * 1024) {
        setErrorMsg('File must be under 500 MB.');
        return;
      }
      setErrorMsg('');
      setFile(f);
      setStatus('idle');
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(f));
    },
    [previewUrl]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) pickFile(f);
    },
    [pickFile]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files?.[0];
      if (f) pickFile(f);
    },
    [pickFile]
  );

  // Redirect if not logged in once auth resolves.
  if (!authLoading && !session) {
    router.replace('/login');
    return null;
  }

  const username = session?.username ?? '';

  const handleExport = async () => {
    if (!file) return;
    setStatus('processing');
    setErrorMsg('');

    try {
      // Badges are generated server-side — send text primitives only.
      const form = new FormData();
      form.append('video', file, file.name);
      form.append('authorName', displayName);
      form.append('authorHandle', username);
      form.append('accentColor', '#FF5542');

      const res = await fetch('/api/snapshot/video/brand', {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? 'Branding failed');
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name.replace(/\.[^.]+$/, '')}-branded.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus('done');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  };

  return (
    <div className='mx-auto w-full max-w-4xl px-4 py-6'>
      {/* Header */}
      <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='flex flex-col gap-1'>
          <Link
            href='/snapshot'
            className='text-xs text-foreground/60 hover:text-foreground'
          >
            ← Back to Snapshot
          </Link>
          <h1 className='font-newsreader text-2xl'>
            Brand<span className='text-brand-orange'>.</span>{' '}
            <span className='text-foreground/60'>your video</span>
          </h1>
          <p className='text-xs text-foreground/60'>
            Upload any video from your device. Your monkeys.com.co watermark
            will be burned in — brand badge top-left, your name bottom-left.
          </p>
        </div>

        {/* Tab strip — matches snapshot pages */}
        <div
          className='inline-flex self-start rounded-lg border p-0.5 text-xs sm:self-center shrink-0'
          role='tablist'
          aria-label='Preview mode'
        >
          <span
            role='tab'
            aria-selected={true}
            className='rounded-md px-3 py-1.5 font-medium bg-brand-orange text-white'
          >
            Brand video
          </span>
          <Link
            href='/snapshot/new?mode=template'
            scroll={false}
            role='tab'
            aria-selected={false}
            className='rounded-md px-3 py-1.5 font-medium transition-colors text-foreground/70 hover:text-foreground'
          >
            Image template
          </Link>
          <Link
            href='/snapshot/new?mode=x'
            scroll={false}
            role='tab'
            aria-selected={false}
            className='rounded-md px-3 py-1.5 font-medium transition-colors text-foreground/70 hover:text-foreground'
          >
            X screenshot
          </Link>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        {/* Upload area */}
        <div className='flex flex-col gap-4'>
          <div
            role='button'
            tabIndex={0}
            className={`flex min-h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
              isDragging
                ? 'border-brand-orange bg-brand-orange/5'
                : 'border-border hover:border-foreground/40'
            }`}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          >
            <svg
              className='h-10 w-10 text-foreground/30'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z'
              />
            </svg>
            {file ? (
              <div className='flex flex-col gap-0.5'>
                <span className='text-sm font-medium text-foreground'>
                  {file.name}
                </span>
                <span className='text-xs text-foreground/50'>
                  {(file.size / (1024 * 1024)).toFixed(1)} MB — click to change
                </span>
              </div>
            ) : (
              <div className='flex flex-col gap-0.5'>
                <span className='text-sm font-medium text-foreground'>
                  Drop a video here
                </span>
                <span className='text-xs text-foreground/50'>
                  or click to browse · MP4, MOV, WebM · max 500 MB
                </span>
              </div>
            )}
          </div>

          <input
            ref={inputRef}
            type='file'
            accept='video/*'
            className='hidden'
            onChange={onInputChange}
          />

          {/* Watermark preview info */}
          <div className='rounded-lg border bg-surface p-4 text-xs text-foreground/70'>
            <p className='mb-1 font-medium text-foreground'>Watermark</p>
            <p>
              <span className='font-medium'>Top-left:</span> monkeys.com.co logo
            </p>
            <p>
              <span className='font-medium'>Bottom-left:</span>{' '}
              {displayName || username || '—'} {username ? `@${username}` : ''}
            </p>
          </div>

          {/* Error */}
          {errorMsg && <p className='text-xs text-red-500'>{errorMsg}</p>}

          {/* Export button */}
          <button
            type='button'
            disabled={!file || status === 'processing'}
            onClick={handleExport}
            className='flex items-center justify-center gap-2 rounded-lg bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50'
          >
            {status === 'processing' ? (
              <>
                <svg
                  className='h-4 w-4 animate-spin'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8v8H4z'
                  />
                </svg>
                Branding…
              </>
            ) : status === 'done' ? (
              'Download another'
            ) : (
              'Brand & Download'
            )}
          </button>

          {status === 'done' && (
            <p className='text-xs text-green-600'>
              ✓ Branded video downloaded successfully.
            </p>
          )}
        </div>

        {/* Video preview */}
        <div className='flex items-start justify-center'>
          {previewUrl ? (
            <video
              src={previewUrl}
              controls
              className='w-full rounded-xl border bg-black'
              style={{ maxHeight: '480px' }}
            />
          ) : (
            <div className='flex min-h-48 w-full items-center justify-center rounded-xl border bg-surface text-xs text-foreground/40'>
              Video preview will appear here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
