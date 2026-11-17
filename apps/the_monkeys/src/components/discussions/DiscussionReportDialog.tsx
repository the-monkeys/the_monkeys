'use client';

import { useEffect, useId, useState } from 'react';

import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@the-monkeys/ui/atoms/dialog';
import { Label } from '@the-monkeys/ui/atoms/label';
import { RadioGroup, RadioGroupItem } from '@the-monkeys/ui/atoms/radio-group';
import { TextArea } from '@the-monkeys/ui/atoms/text-area';

const reasons = [
  'Spam',
  'Abusive content',
  'Inappropriate content',
  'Misinformation',
  'Other',
];

export function DiscussionReportDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const id = useId();
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  useEffect(() => {
    if (!open) {
      setReason('');
      setNotes('');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[85vh] w-[calc(100vw_-_2rem)] max-w-md overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Report discussion</DialogTitle>
          <DialogDescription>
            Reporting is coming soon. Nothing you enter here will be sent.
          </DialogDescription>
        </DialogHeader>
        <form
          className='space-y-5'
          onSubmit={(event) => event.preventDefault()}
        >
          <div className='space-y-3'>
            <p className='font-dm_sans text-sm font-medium' id={`${id}-label`}>
              Why are you reporting this discussion?
            </p>
            <RadioGroup
              aria-labelledby={`${id}-label`}
              value={reason}
              onValueChange={setReason}
              className='gap-1'
            >
              {reasons.map((label, index) => (
                <div className='flex min-h-11 items-center gap-3' key={label}>
                  <RadioGroupItem id={`${id}-${index}`} value={label} />
                  <Label
                    className='cursor-pointer text-sm'
                    htmlFor={`${id}-${index}`}
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className='space-y-2'>
            <Label htmlFor={`${id}-notes`}>Additional details (optional)</Label>
            <TextArea
              id={`${id}-notes`}
              rows={3}
              maxLength={1000}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>
          <div className='flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button type='submit' variant='brand' disabled>
              Submit report
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
