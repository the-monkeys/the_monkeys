'use client';

import { ReactNode, useState } from 'react';

import { Loader } from '@/components/loader';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';

type Props = {
  trigger: ReactNode;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
};

/**
 * Reusable confirmation gate for irreversible actions. Keeps its own open and
 * pending state so callers only supply the action; the dialog closes on
 * success and stays open (surfacing the error via the caller's toast) on
 * failure.
 */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive,
  onConfirm,
}: Props) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    setBusy(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !busy && setOpen(v)}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='font-dm_sans'>{title}</DialogTitle>
          {description && (
            <DialogDescription className='font-inter text-sm'>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className='mt-2 gap-2 sm:gap-2'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => setOpen(false)}
            disabled={busy}
          >
            {cancelLabel}
          </Button>
          <Button
            type='button'
            variant={destructive ? 'destructive' : 'brand'}
            size='sm'
            onClick={handleConfirm}
            disabled={busy}
            className='gap-1.5'
          >
            {busy && <Loader size={16} />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
