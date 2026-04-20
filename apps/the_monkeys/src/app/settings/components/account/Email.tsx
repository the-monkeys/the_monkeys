'use client';

import { useCallback, useEffect, useState } from 'react';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { updateEmailSchema } from '@/lib/schema/settings';
import { IUser } from '@/services/models/user';
import {
  initiateEmailChange,
  requestEmailVerification,
  resendEmailChangeOTP,
  verifyEmailChangeOTP,
} from '@/services/user/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
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

const otpSchema = z.object({
  otp_code: z
    .string()
    .length(6, 'OTP must be 6 digits')
    .regex(/^\d+$/, 'OTP must be numeric'),
});

export const Email = ({ data }: { data: IUser }) => {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [pendingEmail, setPendingEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

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
      toast({
        variant: 'error',
        title: 'Error',
        description:
          err instanceof Error
            ? err.message
            : 'Failed to send verification request.',
      });
    },
  });

  const emailForm = useForm<z.infer<typeof updateEmailSchema>>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: { email: '' },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp_code: '' },
  });

  const initiateMutation = useMutation({
    mutationFn: initiateEmailChange,
    onSuccess: () => {
      setPendingEmail(emailForm.getValues('email'));
      setStep('otp');
      setResendCooldown(30);
      toast({
        variant: 'success',
        title: 'OTP Sent',
        description: `A 6-digit code has been sent to ${emailForm.getValues('email')}.`,
      });
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Error',
        description:
          err instanceof Error
            ? err.message
            : 'Failed to initiate email change.',
      });
    },
  });

  const verifyMutation = useMutation({
    mutationFn: verifyEmailChangeOTP,
    onSuccess: () => {
      setStep('email');
      emailForm.reset();
      otpForm.reset();
      // Invalidate auth cache so the UI picks up the new email without a hard refresh
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast({
        variant: 'success',
        title: 'Email Updated',
        description: `Your email has been changed to ${pendingEmail}.`,
      });
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Verification Failed',
        description:
          err instanceof Error ? err.message : 'Invalid or expired OTP.',
      });
    },
  });

  const resendMutation = useMutation({
    mutationFn: resendEmailChangeOTP,
    onSuccess: () => {
      setResendCooldown(30);
      toast({
        variant: 'success',
        title: 'OTP Resent',
        description: `A new code has been sent to ${pendingEmail}.`,
      });
    },
    onError: (err) => {
      toast({
        variant: 'error',
        title: 'Error',
        description:
          err instanceof Error ? err.message : 'Failed to resend OTP.',
      });
    },
  });

  const onInitiate = useCallback(
    (values: z.infer<typeof updateEmailSchema>) => {
      initiateMutation.mutate({
        username: data.username,
        newEmail: values.email,
      });
    },
    [data.username, initiateMutation]
  );

  const onVerify = useCallback(
    (values: z.infer<typeof otpSchema>) => {
      verifyMutation.mutate({
        username: data.username,
        newEmail: pendingEmail,
        otpCode: values.otp_code,
      });
    },
    [data.username, pendingEmail, verifyMutation]
  );

  const onResend = useCallback(() => {
    resendMutation.mutate({
      username: data.username,
      newEmail: pendingEmail,
    });
  }, [data.username, pendingEmail, resendMutation]);

  return (
    <div className='p-1 space-y-4'>
      <div className='space-y-2'>
        <p className='text-sm opacity-80'>Registered Email: {data.email}</p>

        {data.email_verification_status !== 'Verified' ? (
          <Button
            type='button'
            size='lg'
            className='mt-4'
            onClick={() => requestVerificationMutation.mutate(data.email)}
            disabled={requestVerificationMutation.isPending}
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
      </div>

      {step === 'email' ? (
        <Form {...emailForm}>
          <form
            onSubmit={emailForm.handleSubmit(onInitiate)}
            className='w-full'
          >
            <div className='flex items-end gap-[6px]'>
              <div className='w-full sm:w-1/2'>
                <FormField
                  control={emailForm.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm'>Change Email</FormLabel>
                      <FormMessage />
                      <FormControl>
                        <Input
                          placeholder={data.email || 'yourmail@monkeys.xyz'}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Button
                variant='secondary'
                size='lg'
                type='submit'
                disabled={initiateMutation.isPending}
                className='shrink-0'
              >
                {initiateMutation.isPending && <Loader />} Send OTP
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className='space-y-3'>
          <p className='text-sm'>
            Enter the 6-digit code sent to{' '}
            <span className='font-medium'>{pendingEmail}</span>
          </p>

          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onVerify)} className='w-full'>
              <div className='flex items-end gap-[6px]'>
                <div className='w-full sm:w-1/2'>
                  <FormField
                    control={otpForm.control}
                    name='otp_code'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-sm'>
                          Verification Code
                        </FormLabel>
                        <FormMessage />
                        <FormControl>
                          <Input
                            placeholder='000000'
                            maxLength={6}
                            inputMode='numeric'
                            autoComplete='one-time-code'
                            {...field}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, '');
                              field.onChange(v);
                              if (v.length === 6) {
                                otpForm.handleSubmit(onVerify)();
                              }
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  variant='secondary'
                  size='lg'
                  type='submit'
                  disabled={verifyMutation.isPending}
                  className='shrink-0'
                >
                  {verifyMutation.isPending && <Loader />} Verify
                </Button>
              </div>
            </form>
          </Form>

          <div className='flex items-center gap-3'>
            <Button
              variant='ghost'
              size='sm'
              type='button'
              onClick={onResend}
              disabled={resendCooldown > 0 || resendMutation.isPending}
            >
              {resendMutation.isPending && <Loader />}
              {resendCooldown > 0
                ? `Resend OTP (${resendCooldown}s)`
                : 'Resend OTP'}
            </Button>
            <Button
              variant='ghost'
              size='sm'
              type='button'
              onClick={() => {
                setStep('email');
                otpForm.reset();
              }}
            >
              {'\u2190'} Change email
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
