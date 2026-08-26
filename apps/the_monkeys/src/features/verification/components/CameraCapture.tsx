'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { DocKind } from '@/services/verification/verificationTypes';
import {
  RiCameraLine,
  RiCameraOffLine,
  RiCameraSwitchLine,
  RiLoader4Line,
} from '@remixicon/react';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@the-monkeys/ui/atoms/dialog';

import { MAX_DOC_BYTES } from '../constants';

/** True when in-page camera capture is usable (HTTPS + getUserMedia API). */
export function cameraSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const secure =
    window.isSecureContext ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';
  return !!navigator.mediaDevices?.getUserMedia && secure;
}

type Facing = 'user' | 'environment';

const CAPTURE_ERROR_TEXT: Record<string, string> = {
  NotAllowedError:
    'Camera permission was denied. Allow it in your browser settings or upload a file instead.',
  NotFoundError: 'No camera found on this device.',
  NotReadableError: 'The camera is busy in another app. Close it and retry.',
};

// Longest-edge cap keeps JPEGs well under the 10 MB server limit and
// consistent enough for review without shipping multi-MB frames.
const MAX_EDGE = 1600;

/**
 * Live-capture dialog for verification documents. Emits a standard File so it
 * feeds the SAME upload pipeline as file picking (validation, checksum,
 * progress) — nothing downstream changes. Front/back camera switchable.
 *
 * Honest scope: live capture raises friction against re-used images; it is
 * not cryptographic proof of identity. Server-side review remains the gate.
 */
export const CameraCapture = ({
  kind,
  open,
  onOpenChange,
  initialFacing,
  onCapture,
}: {
  kind: DocKind;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** selfie → front cam; ID sides → rear cam. User can still flip. */
  initialFacing: Facing;
  onCapture: (kind: DocKind, file: File) => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facing, setFacing] = useState<Facing>(initialFacing);
  const [error, setError] = useState<string>();
  const [starting, setStarting] = useState(false);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => {
    if (!open) return;

    let alive = true;
    setStarting(true);
    setError(undefined);

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      })
      .then((stream) => {
        if (!alive) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        stopStream();
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(
        (err: DOMException) =>
          alive &&
          setError(
            CAPTURE_ERROR_TEXT[err.name] ??
              'Camera unavailable. You can still upload a file.'
          )
      )
      .finally(() => alive && setStarting(false));

    return () => {
      alive = false;
      stopStream();
    };
  }, [open, facing, stopStream]);

  // Hard safety: never leave a camera running after unmount mid-dialog.
  useEffect(() => () => stopStream(), [stopStream]);

  const shoot = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;

    const scale = Math.min(
      1,
      MAX_EDGE / Math.max(video.videoWidth, video.videoHeight)
    );
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(video.videoWidth * scale);
    canvas.height = Math.round(video.videoHeight * scale);
    canvas
      .getContext('2d')
      ?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const finish = (blob: Blob | null) => {
      if (!blob) return;
      onCapture(
        kind,
        new File([blob], `verification-${kind}.jpg`, { type: 'image/jpeg' })
      );
      onOpenChange(false);
    };

    canvas.toBlob(finish, 'image/jpeg', 0.9);
  };

  const closeAndStop = (o: boolean) => {
    if (!o) stopStream();
    onOpenChange(o);
  };

  return (
    <Dialog open={open} onOpenChange={closeAndStop}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='capitalize'>
            Capture — {kind.replace('_', ' ')}
          </DialogTitle>
          <DialogDescription>
            Frame it clearly, avoid glare. Nothing is stored until you confirm.
          </DialogDescription>
        </DialogHeader>

        <div className='relative overflow-hidden rounded-md bg-black aspect-[4/3] grid place-items-center'>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className='size-full object-cover'
          />
          {(starting || (!streamRef.current && !error)) && !error && (
            <div className='absolute inset-0 grid place-items-center bg-black/50'>
              <RiLoader4Line size={24} className='animate-spin text-white' />
            </div>
          )}
          {error && (
            <div className='absolute inset-0 grid place-items-center bg-black/70 p-4'>
              <div className='text-center text-white/90 space-y-2 max-w-xs'>
                <RiCameraOffLine size={22} className='mx-auto' />
                <p className='text-sm'>{error}</p>
              </div>
            </div>
          )}
        </div>

        <div className='flex items-center justify-center gap-3'>
          <Button
            type='button'
            variant='outline'
            size='icon'
            title='Switch camera'
            aria-label='Switch camera'
            onClick={() =>
              setFacing((f) => (f === 'user' ? 'environment' : 'user'))
            }
            disabled={!!error}
          >
            <RiCameraSwitchLine size={18} />
          </Button>

          <Button
            type='button'
            onClick={shoot}
            disabled={!!error || starting}
            className='px-6'
          >
            <RiCameraLine size={16} className='mr-1' /> Capture
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
