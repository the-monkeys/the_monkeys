'use client';

import { useEffect, useState } from 'react';

import { Loader } from '@/components/loader';
import {
  getVerificationAssetUrl,
  verificationErrorMessage,
} from '@/services/verification/verificationApi';
import type { DocKind } from '@/services/verification/verificationTypes';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@the-monkeys/ui/atoms/dialog';

/**
 * Lazy document viewer. The presigned URL is fetched ONLY while this dialog
 * is open (10-min TTL from the API) — identity documents never sit in the
 * DOM or network otherwise. Loaded via next/dynamic from VerificationPanel.
 */
export const DocumentPreview = ({
  requestId,
  kind,
  open,
  onOpenChange,
}: {
  requestId: string;
  kind: DocKind;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [url, setUrl] = useState<string>();
  const [error, setError] = useState<string>();
  const [expiresIn, setExpiresIn] = useState<number>();

  useEffect(() => {
    if (!open) return;
    let alive = true;
    setUrl(undefined);
    setError(undefined);

    getVerificationAssetUrl(requestId, kind)
      .then((res) => {
        if (!alive) return;
        setUrl(res.url);
        setExpiresIn(res.expires_in_seconds);
      })
      .catch((err) => alive && setError(verificationErrorMessage(err)));

    return () => {
      alive = false;
    };
  }, [open, requestId, kind]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle className='capitalize'>
            Document — {kind.replace('_', ' ')}
          </DialogTitle>
          <DialogDescription>
            Private link
            {expiresIn ? `, expires in ~${Math.round(expiresIn / 60)} min` : ''}
            . Only you and review admins can open this.
          </DialogDescription>
        </DialogHeader>

        <div className='min-h-[240px] grid place-items-center'>
          {error ? (
            <p className='text-sm text-alert-red text-center px-4'>{error}</p>
          ) : url ? (
            // eslint-disable-next-line @next/next/no-img-element -- presigned S3 URL, one-off view
            <img
              src={url}
              alt={`Uploaded ${kind}`}
              className='max-h-[60vh] w-auto rounded-md border-1 border-border-light dark:border-border-dark'
            />
          ) : (
            <Loader size={32} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;
