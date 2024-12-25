'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import PasswordInput from '@/components/input/PasswordInput';
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
import { toast } from '@/components/ui/use-toast';
import { loginSchema } from '@/lib/schema/auth';
import { cn } from '@/lib/utils';
import { login } from '@/services/auth/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);

    const callbackURL = params.get('callback-url');

    try {
      await login(values);

      toast({
        variant: 'success',
        title: 'Login Successful',
        description: 'You have successfully logged in. Welcome back!',
      });

      if (callbackURL) {
        router.replace('/' + callbackURL);
      }

      router.replace('/');
    } catch (err) {
      toast({
        variant: 'error',
        title: 'Login Error',
        description:
          'There was an error registring in. Please check your credentials and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
        <FormField
          control={form.control}
          name='email'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className='font-roboto text-sm'>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder='Enter email address'
                  className={cn(
                    !!fieldState.error && 'dark:border-red-500 border-red-600'
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className='font-roboto text-sm'>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder='Enter password'
                  value={field.value}
                  className={cn(
                    !!fieldState.error && 'dark:border-red-500 border-red-600'
                  )}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='pt-6 flex gap-2 items-center'>
          <Button
            variant='brand'
            className='flex-1 order-1 transition-colors duration-300'
            disabled={loading ? true : false}
          >
            {loading && <Loader />} Login
          </Button>
        </div>
      </form>

      <div className='mt-4 text-center'>
        <Link
          href='/auth/forgot-password'
          className='font-dm_sans text-sm hover:underline opacity-80 text-blue-600 dark:text-blue-400'
        >
          Forgot your password?
        </Link>
      </div>
    </Form>
  );
}