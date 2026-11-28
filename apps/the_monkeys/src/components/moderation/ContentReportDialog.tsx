'use client';

import { useRef, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import useAuth from '@/hooks/auth/useAuth';
import { loginHref } from '@/lib/authRedirect';
import { notifyContentRating } from '@/lib/contentRatingEvents';
import { currentContentPath } from '@/lib/moderationNavigation';
import { reportContent } from '@/services/moderation/moderationApi';
import type {
  ContentTarget,
  ReportReason,
} from '@/services/moderation/moderationTypes';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@the-monkeys/ui/atoms/dialog';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

type Props = {
  target: ContentTarget;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
export function ContentReportDialog(props: Props) {
  return props.open ? <ReportForm {...props} /> : null;
}
function ReportForm({ target, open, onOpenChange }: Props) {
  const auth = useAuth();
  const client = useQueryClient();
  const router = useRouter();
  const [reason, setReason] = useState<ReportReason | ''>('');
  const [details, setDetails] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const submitting = useRef(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    if (!reason) {
      setError('Choose a reason for your report.');
      return;
    }
    submitting.current = true;
    setBusy(true);
    setError('');
    try {
      const response = await reportContent(target, {
        reason,
        details: details.trim(),
      });
      if (
        response.report?.status === 'confirmed_nsfw' ||
        response.report?.status === 'action_taken'
      )
        notifyContentRating(target, response.access);
      const descriptions = {
        pending: 'Your report has been saved for review by the Monkeys team.',
        confirmed_nsfw: 'The content has been marked NSFW.',
        action_taken: 'The content has been marked NSFW.',
        dismissed:
          'Your earlier report has already been reviewed and dismissed.',
        reversed:
          'Your earlier report was reviewed and its restriction was reversed.',
      };
      toast({
        title: 'Report saved',
        description: descriptions[response.report!.status],
      });
      await client.invalidateQueries();
      router.refresh();
      onOpenChange(false);
    } catch {
      setError('Unable to save your report. Please try again.');
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!submitting.current) onOpenChange(next);
      }}
    >
      <DialogContent className='max-h-[85dvh] w-[calc(100vw-2rem)] max-w-lg overflow-y-auto rounded-2xl'>
        <DialogHeader>
          <DialogTitle>Report content</DialogTitle>
          <DialogDescription>
            Tell us what needs attention. Reports from members are reviewed by
            the Monkeys team.
          </DialogDescription>
        </DialogHeader>
        {auth.isLoading ? (
          <p role='status' className='text-sm'>
            Checking your session?
          </p>
        ) : !auth.data?.account_id ? (
          <div className='space-y-4'>
            <p className='text-sm'>Log in to submit a report.</p>
            <Button asChild>
              <Link href={loginHref(currentContentPath(target))}>
                Log in to continue
              </Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className='min-w-0 space-y-4'>
            <div className='space-y-2'>
              <label
                htmlFor='content-report-reason'
                className='text-sm font-medium'
              >
                Reason
              </label>
              <select
                id='content-report-reason'
                required
                value={reason}
                onChange={(e) => setReason(e.target.value as ReportReason)}
                disabled={busy}
                className='block w-full rounded-md border border-border-light bg-transparent px-3 py-2 text-sm dark:border-border-dark'
              >
                <option value=''>Choose a reason</option>
                <option value='nsfw'>NSFW / explicit content</option>
                <option value='spam'>Spam</option>
                <option value='harassment'>Harassment or abuse</option>
                <option value='misinformation'>Misleading information</option>
                <option value='copyright'>Copyright concern</option>
                <option value='other'>Something else</option>
              </select>
            </div>
            <div className='space-y-2'>
              <label
                htmlFor='content-report-details'
                className='text-sm font-medium'
              >
                Details (optional)
              </label>
              <textarea
                id='content-report-details'
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                maxLength={2000}
                disabled={busy}
                rows={4}
                className='block w-full resize-y rounded-md border border-border-light bg-transparent px-3 py-2 text-sm dark:border-border-dark'
                placeholder='Explain what we should review.'
              />
            </div>
            {error ? (
              <p role='alert' className='text-sm text-red-600'>
                {error}
              </p>
            ) : null}
            <div className='flex flex-wrap justify-end gap-2'>
              <Button
                type='button'
                variant='outline'
                disabled={busy}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={busy}>
                {busy ? 'Submitting...' : 'Submit report'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
