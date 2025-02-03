'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useSession } from '@/app/session-store-provider';
import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/services/api/axiosInstance';

export const Danger = () => {
  const { data, update } = useSession();
  const router = useRouter();

  const [deleteMessage, setDeleteMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const onAccountDelete = async () => {
    setLoading(true);

    try {
      await axiosInstance.delete(`/user/${data?.user.username}`);

      update({ status: 'unauthenticated', data: null });
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Your account has been deleted successfully.',
      });

      router.replace('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message || 'Failed to delete your account.',
        });
      } else {
        toast({
          variant: 'error',
          title: 'Error',
          description: 'An unknown error occurred.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-1 space-y-2'>
      <p className='text-sm opacity-80'>
        When you delete your account on Monkeys, all your personal data will be
        permanently erased. This action cannot be undone.
      </p>

      <Dialog>
        <DialogTrigger asChild>
          <Button size='lg' variant='destructive' className='mt-4'>
            Delete Account
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogTitle className='text-alert-red'>Delete Account</DialogTitle>

          <DialogDescription className='hidden'></DialogDescription>

          <p>
            Are you sure you want to delete your account? This action is
            irreversible and cannot be undone.
          </p>

          <div className='space-y-2'>
            <p className='font-medium text-sm'>
              {`To confirm, type "delete my account" in the box below`}
            </p>

            <Input
              value={deleteMessage}
              placeholder='Enter required text'
              onChange={(e) => {
                setDeleteMessage(e.target.value);
              }}
            ></Input>
          </div>

          <div>
            <Button
              type='button'
              variant='destructive'
              className='w-fit float-right'
              onClick={onAccountDelete}
              disabled={deleteMessage !== 'delete my account' || loading}
            >
              {loading && <Loader />}I Agree, Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
