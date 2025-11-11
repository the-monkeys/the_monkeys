'use client';

import React, { FC, useState } from 'react';

import Link from 'next/link';

import Icon from '@/components/icon';
import useAuth from '@/hooks/auth/useAuth';
import axiosInstance from '@/services/api/axiosInstance';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';
import { Label } from '@the-monkeys/ui/atoms/label';
import { RadioGroup, RadioGroupItem } from '@the-monkeys/ui/atoms/radio-group';
import { Textarea } from '@the-monkeys/ui/atoms/text-area';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

interface BlogReportDialogProps {
  blogId: string;
  size?: number;
}

export const BlogReportDialog: FC<BlogReportDialogProps> = ({
  size = 18,
  blogId,
}) => {
  const reasonOptions = [
    { label: 'Spam', value: 'SPAM' },
    { label: 'Abusive Content', value: 'ABUSE' },
    { label: 'NSFW (Not Safe For Work)', value: 'NSFW' },
    { label: 'Misinformation', value: 'MISINFORMATION' },
    { label: 'Other', value: 'OTHER' },
  ] as const;

  type ReasonType = (typeof reasonOptions)[number]['value'];

  const [open, setOpen] = useState<boolean>(false);
  const [reasonType, setReasonType] = useState<ReasonType | ''>('');
  const [reporterNotes, setReporterNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session, isError } = useAuth();

  const handleCloseButton = () => {
    setReasonType('');
    setReporterNotes('');
    setOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!reasonType) {
      toast({ title: 'Please select a reason', variant: 'destructive' });
      setLoading(false);
      return;
    }

    if (!session) {
      toast({
        title: 'You must be logged in to report',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    const body = {
      reason_type: reasonType,
      reporter_id: session?.account_id,
      reported_type: 'BLOG',
      reported_id: blogId,
      reporter_notes: reporterNotes,
    };

    try {
      const response = await axiosInstance.post('/reports', body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status) {
        toast({
          title: response.data?.message ?? 'Report submitted successfully',
          variant: 'success',
        });

        handleCloseButton();
      }
    } catch (error) {
      toast({ title: 'Failed to submit report', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className='p-1 flex items-center justify-center cursor-pointer opacity-80 hover:opacity-100'
          title='Report Blog'
        >
          <Icon name='RiErrorWarning' size={size} className='text-white' />
        </button>
      </DialogTrigger>

      <DialogContent className='max-h-[80vh] overflow-y-auto'>
        <DialogHeader className='mb-4'>
          <DialogTitle>Report Post</DialogTitle>
          <DialogDescription className='hidden'></DialogDescription>
        </DialogHeader>

        {isError || !session ? (
          <div className='w-full flex flex-col items-center justify-center space-y-5 pb-3'>
            <p className='text-sm'>You must be logged in to report a post.</p>
            <Button variant='brand' asChild>
              <Link href='/auth/login'>Login</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-8'>
            <div className='space-y-4'>
              <Label className=''>Why are you reporting this post?</Label>
              <RadioGroup
                className='grid grid-cols-1 gap-3'
                value={reasonType}
                onValueChange={(value) => setReasonType(value as ReasonType)}
              >
                {reasonOptions.map((option) => (
                  <div
                    key={option.value}
                    className='flex items-center space-x-2'
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label
                      htmlFor={option.value}
                      className='text-sm cursor-pointer'
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className='space-y-1'>
              <Label className='text-sm opacity-80'>
                Additional Info {`(optional)`}
              </Label>
              <Textarea
                value={reporterNotes}
                onChange={(e) => setReporterNotes(e.target.value)}
                rows={3}
                className='max-h-24'
                placeholder='Provide more details to the moderators'
              />
            </div>

            <div className='flex justify-end gap-2 pt-2'>
              <Button
                type='button'
                variant={'outline'}
                onClick={handleCloseButton}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                variant={'destructive'}
                disabled={!reasonType || loading}
              >
                Report
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
