'use client';

import { Loader } from '@/components/loader';
import { forgotPasswordSchema } from '@/lib/schema/auth';
import { forgotPass } from '@/services/auth/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  RiCheckLine,
  RiCloseCircleFill,
  RiResetRightLine,
} from '@remixicon/react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@the-monkeys/ui/molecules/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function ForgotPasswordForm() {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const mutation = useMutation({
    mutationFn: forgotPass,
    onError: (err) => console.log(err),
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    mutation.mutate({ email: values.email });
  }

  const getButtonText = () => {
    if (mutation.isSuccess) return 'Submitted Successfully';

    if (mutation.isError) return 'Click to retry';

    return 'Submit';
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-roboto text-sm'>Email</FormLabel>
                <FormControl onChange={() => mutation.reset()}>
                  <div className='relative'>
                    <Input placeholder='Enter email address' {...field} />
                    {field.value && (
                      <button
                        type='button'
                        aria-label='clear button'
                        className='absolute right-2 top-1/2 -translate-y-1/2'
                        disabled={mutation.isPending}
                        onClick={() => {
                          form.resetField('email');
                          mutation.reset();
                        }}
                      >
                        <RiCloseCircleFill />
                      </button>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='pt-6 flex gap-2 items-center'>
            <Button
              variant={mutation.isSuccess ? 'outline' : 'default'}
              className='flex-1'
              disabled={mutation.isPending || mutation.isSuccess}
              aria-label={getButtonText()}
              aria-live='polite'
            >
              {mutation.isPending && <Loader className='mr-2' />}
              {!mutation.isPending && mutation.isSuccess && (
                <RiCheckLine className='mr-2' />
              )}
              {!mutation.isPending && mutation.isError && (
                <RiResetRightLine size={18} className='mr-2' />
              )}
              {getButtonText()}
            </Button>
          </div>
        </form>
      </Form>
      <p className='text-alert-red text-center mx-auto w-11/12' role='alert'>
        {mutation.isError &&
          'An unexpected error occurred while submitting the form, please retry again or contact support'}
      </p>
    </>
  );
}
