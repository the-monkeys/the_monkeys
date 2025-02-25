'use client';

import { useState } from 'react';

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
import { forgotPasswordSchema } from '@/lib/schema/auth';
import { forgotPass } from '@/services/auth/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  RiCheckLine,
  RiCloseCircleFill,
  RiResetRightLine,
} from '@remixicon/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setLoading(true);
    try {
      await forgotPass({ email: values.email });

      setSubmitSuccess(true);
      setSubmitError(false);
    } catch (err) {
      console.error(err);
      setSubmitSuccess(false);
      setSubmitError(true);
    } finally {
      setLoading(false);
    }
  }

  const getButtonText = () => {
    if (submitSuccess) return 'Submitted Successfully';

    if (submitError) return 'Click to retry';

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
                <FormControl>
                  <div className='relative'>
                    <Input placeholder='Enter email address' {...field} />
                    {(field.value || submitSuccess) && (
                      <button
                        type='button'
                        aria-label='clear button'
                        className='absolute right-2 top-1/2 -translate-y-1/2'
                        disabled={loading}
                        onClick={() => {
                          setSubmitSuccess(false);
                          setSubmitError(false);
                          form.resetField('email');
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
              variant={submitSuccess ? 'outline' : 'brand'}
              className='flex-1'
              disabled={loading || submitSuccess}
              aria-label={getButtonText()}
              aria-live='polite'
            >
              {loading ? (
                <Loader />
              ) : (
                <>
                  {submitSuccess && <RiCheckLine className='mr-2' />}
                  {submitError && (
                    <RiResetRightLine size={18} className='mr-2' />
                  )}
                </>
              )}
              {getButtonText()}
            </Button>
          </div>
        </form>
      </Form>
      <p className='text-alert-red text-center mx-auto w-11/12' role='alert'>
        {submitError &&
          'An unexpected error occurred while submitting the form, please retry again or contact support'}
      </p>
    </>
  );
}
