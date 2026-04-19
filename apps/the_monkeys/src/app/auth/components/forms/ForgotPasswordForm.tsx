'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { forgotPasswordSchema, otpVerificationSchema } from '@/lib/schema/auth';
import { cn } from '@/lib/utils';
import { forgotPass, verifyResetOTP } from '@/services/auth/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
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

type Step = 'email' | 'verify-otp';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verifying, setVerifying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const emailForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const otpForm = useForm<z.infer<typeof otpVerificationSchema>>({
    resolver: zodResolver(otpVerificationSchema),
  });

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      timerRef.current = setTimeout(
        () => setResendCooldown((c) => c - 1),
        1000
      );
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resendCooldown]);

  // Step 1: Send OTP to email
  const sendOTPMutation = useMutation({
    mutationFn: forgotPass,
    onSuccess: () => {
      setEmail(emailForm.getValues('email'));
      setStep('verify-otp');
      setResendCooldown(30);
    },
    onError: () => {
      // We still show success to not reveal if email exists
      setEmail(emailForm.getValues('email'));
      setStep('verify-otp');
      setResendCooldown(30);
    },
  });

  const onEmailSubmit = (values: z.infer<typeof forgotPasswordSchema>) => {
    sendOTPMutation.mutate({ email: values.email });
  };

  // Resend OTP
  const handleResendOTP = useCallback(() => {
    if (resendCooldown > 0) return;
    sendOTPMutation.mutate({ email });
    setResendCooldown(30);
  }, [email, resendCooldown, sendOTPMutation]);

  // Step 2: Verify OTP → get reset token → go to reset page
  const onOTPSubmit = async (values: z.infer<typeof otpVerificationSchema>) => {
    setVerifying(true);
    try {
      const { token } = await verifyResetOTP({
        email,
        otp_code: values.otp_code,
      });

      toast({
        variant: 'success',
        title: 'Code verified',
        description: 'You can now set a new password',
      });

      // Navigate to reset password page with the reset token
      router.push(
        `/auth/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`
      );
    } catch {
      toast({
        variant: 'error',
        title: 'Invalid code',
        description: 'Please check the code and try again',
      });
    } finally {
      setVerifying(false);
    }
  };

  // Step 2: OTP verification UI
  if (step === 'verify-otp') {
    return (
      <Form {...otpForm}>
        <form
          onSubmit={otpForm.handleSubmit(onOTPSubmit)}
          className='space-y-4'
        >
          <p className='text-sm text-muted-foreground'>
            If an account exists for{' '}
            <span className='font-medium text-foreground'>{email}</span>, we
            sent a 6-digit verification code.
          </p>

          <FormField
            control={otpForm.control}
            name='otp_code'
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className='text-sm'>Verification Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter 6-digit code'
                    maxLength={6}
                    inputMode='numeric'
                    autoComplete='one-time-code'
                    {...field}
                    className={cn(
                      'text-center text-lg tracking-widest',
                      !!fieldState.error && 'dark:border-red-500 border-red-600'
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='pt-2 flex flex-col gap-3'>
            <Button variant='brand' disabled={verifying} className='flex-1'>
              {verifying && <Loader className='mr-2' />} Verify Code
            </Button>

            <div className='text-center text-sm'>
              <span className='text-muted-foreground'>
                Didn&apos;t receive the code?{' '}
              </span>
              <button
                type='button'
                disabled={resendCooldown > 0}
                onClick={handleResendOTP}
                className={cn(
                  'font-medium text-brand-orange hover:underline',
                  resendCooldown > 0 && 'opacity-50 cursor-not-allowed'
                )}
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : 'Resend Code'}
              </button>
            </div>

            <button
              type='button'
              onClick={() => {
                setStep('email');
                otpForm.reset();
                sendOTPMutation.reset();
              }}
              className='text-sm text-muted-foreground hover:underline'
            >
              &larr; Change email
            </button>
          </div>
        </form>
      </Form>
    );
  }

  // Step 1: Email form UI
  return (
    <>
      <Form {...emailForm}>
        <form
          onSubmit={emailForm.handleSubmit(onEmailSubmit)}
          className='space-y-2'
        >
          <FormField
            control={emailForm.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-sm'>Email</FormLabel>
                <FormControl onChange={() => sendOTPMutation.reset()}>
                  <div className='relative'>
                    <Input placeholder='Enter email address' {...field} />
                    {field.value && (
                      <button
                        type='button'
                        aria-label='clear button'
                        className='absolute right-2 top-1/2 -translate-y-1/2'
                        disabled={sendOTPMutation.isPending}
                        onClick={() => {
                          emailForm.resetField('email');
                          sendOTPMutation.reset();
                        }}
                      >
                        <Icon name='RiCloseCircle' type='Fill' />
                      </button>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='pt-6 flex'>
            <Button
              variant='brand'
              className='flex-1'
              disabled={sendOTPMutation.isPending}
            >
              {sendOTPMutation.isPending && <Loader className='mr-2' />}
              Send Verification Code
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
