'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Icon from '@/components/icon';
import PasswordInput from '@/components/input/PasswordInput';
import { Loader } from '@/components/loader';
import { otpVerificationSchema, registerUserSchema } from '@/lib/schema/auth';
import { cn } from '@/lib/utils';
import {
  initiateRegistration,
  resendRegistrationOTP,
  verifyRegistrationOTP,
} from '@/services/auth/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@the-monkeys/ui/atoms/tooltip';
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

type Step = 'register' | 'verify-otp';

export default function RegisterUserForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>('register');
  const [email, setEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Step 1: Registration form
  const registerForm = useForm<z.infer<typeof registerUserSchema>>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      agreeToTerms: undefined,
    },
  });

  // Step 2: OTP verification form
  const otpForm = useForm<z.infer<typeof otpVerificationSchema>>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: {
      otp_code: '',
    },
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

  // Step 1: Submit registration → send OTP
  const onRegisterSubmit = async (
    values: z.infer<typeof registerUserSchema>
  ) => {
    setLoading(true);
    try {
      await initiateRegistration({
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        password: values.password,
      });

      setEmail(values.email);
      setStep('verify-otp');
      setResendCooldown(30);
      otpForm.reset({ otp_code: '' });

      toast({
        variant: 'success',
        title: 'Verification code sent',
        description: 'Check your email for the 6-digit code',
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to send verification code';
      toast({
        variant: 'error',
        title: 'Registration failed',
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP → create account
  const onOTPSubmit = async (values: z.infer<typeof otpVerificationSchema>) => {
    setLoading(true);
    try {
      const user = await verifyRegistrationOTP({
        email,
        otp_code: values.otp_code,
      });

      // Update auth cache so useAuth picks up the new session immediately (no hard refresh)
      queryClient.setQueryData(['auth'], user);
      queryClient.invalidateQueries({ queryKey: ['auth'] });

      toast({
        variant: 'success',
        title: 'Account created successfully',
      });

      router.replace('/feed');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Invalid verification code';
      toast({
        variant: 'error',
        title: 'Verification failed',
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = useCallback(async () => {
    if (resendCooldown > 0) return;
    try {
      await resendRegistrationOTP({ email });
      setResendCooldown(30);
      toast({
        variant: 'success',
        title: 'New verification code sent',
      });
    } catch {
      toast({
        variant: 'error',
        title: 'Failed to resend code',
      });
    }
  }, [email, resendCooldown]);

  // Step 2: OTP verification UI
  if (step === 'verify-otp') {
    return (
      <Form {...otpForm} key='otp-step'>
        <form
          onSubmit={otpForm.handleSubmit(onOTPSubmit)}
          className='space-y-4'
          autoComplete='off'
        >
          <p className='text-sm text-muted-foreground'>
            We sent a 6-digit verification code to{' '}
            <span className='font-medium text-foreground'>{email}</span>
          </p>

          <FormField
            control={otpForm.control}
            name='otp_code'
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className='text-sm'>Verification Code</FormLabel>
                <FormControl>
                  <input
                    id='otp-verify-input'
                    name='otp-verify-input'
                    placeholder='Enter 6-digit code'
                    maxLength={6}
                    inputMode='numeric'
                    autoComplete='off'
                    data-lpignore='true'
                    data-form-type='other'
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '');
                      field.onChange(v);
                      if (v.length === 6) {
                        otpForm.handleSubmit(onOTPSubmit)();
                      }
                    }}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    className={cn(
                      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-center text-lg tracking-widest ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                      !!fieldState.error && 'dark:border-red-500 border-red-600'
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='pt-2 flex flex-col gap-3'>
            <Button variant='brand' disabled={loading} className='flex-1'>
              {loading && <Loader />} Verify & Create Account
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
                setStep('register');
                otpForm.reset();
              }}
              className='text-sm text-muted-foreground hover:underline'
            >
              &larr; Back to registration
            </button>
          </div>
        </form>
      </Form>
    );
  }

  // Step 1: Registration form UI
  return (
    <Form {...registerForm}>
      <form
        onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
        className='space-y-2'
      >
        <FormField
          control={registerForm.control}
          name='first_name'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className='text-sm'>First Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter first Name'
                  {...field}
                  className={cn(
                    !!fieldState.error && 'dark:border-red-500 border-red-600'
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={registerForm.control}
          name='last_name'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className='text-sm'>Last Name</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter last Name'
                  {...field}
                  className={cn(
                    !!fieldState.error && 'dark:border-red-500 border-red-600'
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={registerForm.control}
          name='email'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className='text-sm'>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter email address'
                  {...field}
                  className={cn(
                    !!fieldState.error && 'dark:border-red-500 border-red-600'
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name='password'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className='text-sm'>
                <div className='flex items-center'>
                  Password
                  <Tooltip>
                    <TooltipTrigger type='button'>
                      <Icon
                        name='RiInformation'
                        className='ml-2 opacity-90'
                        size={18}
                      />
                    </TooltipTrigger>
                    <TooltipContent asChild>
                      <ul className='p-4 bg-background-light dark:bg-background-dark border-1 border-border-light/25 dark:border-border-dark/25 rounded-lg space-y-1'>
                        <li className='text-xs sm:text-sm list-disc list-inside'>
                          Must be at least 6 characters long.
                        </li>
                        <li className='text-xs sm:text-sm list-disc list-inside'>
                          Must contain at least one lowercase letter.
                        </li>
                        <li className='text-xs sm:text-sm list-disc list-inside'>
                          Must contain at least one uppercase letter.
                        </li>
                        <li className='text-xs sm:text-sm list-disc list-inside'>
                          Must contain at least one number.
                        </li>
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='Enter password'
                  value={field.value}
                  onChange={field.onChange}
                  className={cn(
                    !!fieldState.error && 'dark:border-red-500 border-red-600'
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name='confirmPassword'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className='text-sm'>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='Confirm Password'
                  onChange={field.onChange}
                  value={field.value}
                  className={cn(
                    !!fieldState.error && 'dark:border-red-500 border-red-600'
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={registerForm.control}
          name='agreeToTerms'
          render={({ field, fieldState }) => (
            <FormItem className='pt-3'>
              <div className='flex items-start gap-2'>
                <FormControl>
                  <input
                    type='checkbox'
                    checked={field.value === true}
                    onChange={(e) =>
                      field.onChange(e.target.checked || undefined)
                    }
                    className={cn(
                      'mt-1 h-4 w-4 rounded border accent-brand-orange cursor-pointer',
                      !!fieldState.error && 'border-red-500'
                    )}
                  />
                </FormControl>
                <label className='text-xs sm:text-sm leading-snug text-muted-foreground'>
                  I agree to the{' '}
                  <Link
                    href='/terms'
                    target='_blank'
                    className='font-medium text-brand-orange hover:underline'
                  >
                    Terms of Service
                  </Link>
                  ,{' '}
                  <Link
                    href='/privacy'
                    target='_blank'
                    className='font-medium text-brand-orange hover:underline'
                  >
                    Privacy Policy
                  </Link>
                  , and{' '}
                  <Link
                    href='/terms'
                    target='_blank'
                    className='font-medium text-brand-orange hover:underline'
                  >
                    Code of Conduct
                  </Link>
                </label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='pt-6 flex'>
          <Button variant='brand' disabled={loading} className='flex-1'>
            {loading && <Loader />} Register
          </Button>
        </div>
      </form>
    </Form>
  );
}
