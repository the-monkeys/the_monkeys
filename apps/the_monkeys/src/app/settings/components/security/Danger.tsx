import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Loader } from '@/components/loader';
import { IUser } from '@/services/models/user';
import { deleteUser } from '@/services/user/user';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';
import { Input } from '@the-monkeys/ui/atoms/input';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

export const Danger = ({ data }: { data?: IUser }) => {
  const router = useRouter();

  const [deleteMessage, setDeleteMessage] = useState<string>('');

  const mutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Your account has been deleted successfully.',
      });

      router.replace('/');
    },
    onError: (err) => {
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
    },
  });

  const onAccountDelete = async () => {
    if (data?.username) mutation.mutate(data?.username);
  };

  const deleteFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (deleteMessage === 'delete my account' && !mutation.isPending) {
      onAccountDelete();
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

          <form onSubmit={deleteFormSubmit} className='space-y-4'>
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
                disabled={
                  deleteMessage !== 'delete my account' || mutation.isPending
                }
              >
                {mutation.isPending && <Loader />}I Agree, Delete
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
