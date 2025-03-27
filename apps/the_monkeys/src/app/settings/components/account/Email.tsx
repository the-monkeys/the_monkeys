'use client';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { updateEmailSchema } from '@/lib/schema/settings';
import { IUser } from '@/services/models/user';
import { requestEmailVerification, updateEmail } from '@/services/user/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const Email = ({ data }: { data: IUser }) => {
  const requestVerificationMutation = useMutation({
    mutationFn: requestEmailVerification,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Email verification request has been sent successfully.',
      });
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message || 'Failed to send verification request.',
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

  const form = useForm<z.infer<typeof updateEmailSchema>>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email: '',
    },
  });

  async function reqVerification() {
    requestVerificationMutation.mutate(data.email);
  }

  const updateEmailMutation = useMutation({
    mutationFn: updateEmail,
    onSuccess: () => {
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Your email address has been updated successfully.',
      });
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message || 'Failed to update your email address.',
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
  const onSubmit = async (values: z.infer<typeof updateEmailSchema>) => {
    updateEmailMutation.mutate({
      username: data.username,
      email: values.email,
    });
  };

  return (
    <div className='p-1 space-y-2'>
      <p className='text-sm opacity-80'>Registered Email: {data.email}</p>

      {data.email_verification_status !== 'Verified' ? (
        <Button
          type='button'
          size='lg'
          className='mt-4'
          onClick={reqVerification}
          disabled={requestVerificationMutation.isPending ? true : false}
        >
          {requestVerificationMutation.isPending && <Loader />} Verify Email
        </Button>
      ) : (
        <div className='mt-4 flex items-center gap-2'>
          <Icon
            name='RiVerifiedBadge'
            type='Fill'
            className='text-brand-orange'
          />

          <p>Email Verified</p>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
          <div className='flex items-end flex-wrap gap-2'>
            <div className='w-full sm:w-1/2'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm'>Change Email</FormLabel>
                    <FormMessage />
                    <FormControl>
                      <Input
                        placeholder={`${data.email}` || 'yourmail@monkeys.xyz'}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button
              size='lg'
              type='submit'
              disabled={updateEmailMutation.isPending}
            >
              {updateEmailMutation.isPending && <Loader />} Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
