'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { axiosInstance } from '@/services/fetcher';
import { signOut, useSession } from 'next-auth/react';

const Danger = () => {
  const { data } = useSession();

  const router = useRouter();

  const [deleteMessage, setDeleteMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const onAccountDelete = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.delete(
        `/user/${data?.user.user_name}`,
        {
          headers: {
            Authorization: `Bearer ${data?.user.token}`,
          },
        }
      );

      if (response.status === 200) {
        signOut();
        router.push('/');

        toast({
          variant: 'success',
          title: 'Success',
          description: 'Your account has been deleted successfully.',
        });
      }
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
          description: 'An unknown error occured.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-start'>
      <h4 className='font-josefin_Sans text-lg'>Delete Account</h4>

      <p className='font-jost text-sm opacity-75'>
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

          <p className='font-jost text-secondary-darkGrey dark:text-secondary-white'>
            Are you sure you want to delete your account? This action is
            irreversible and cannot be undone.
          </p>

          <div className='space-y-2'>
            <p className='font-jost font-medium text-sm'>
              To confirm, type "delete my account" in the box below
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
              I Agree, Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Danger;
