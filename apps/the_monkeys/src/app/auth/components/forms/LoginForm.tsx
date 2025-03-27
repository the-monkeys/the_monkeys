'use client';

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
import { loginSchema } from '@/lib/schema/auth';
import { cn } from '@/lib/utils';
import { login } from '@/services/auth/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });

      const callbackURL = params.get('callbackURL');
      if (callbackURL) {
        router.replace(callbackURL);
        return;
      }

      toast({
        variant: 'success',
        title: 'Login Successful',
        description: 'You have successfully logged in. Welcome back!',
      });
      router.replace('/feed');
    },
    onError: (err) => {
      console.log(err);
      toast({
        variant: 'error',
        title: 'Login Error',
        description:
          'There was an error registering in. Please check your credentials and try again.',
      });
    },
  });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    mutation.mutate(values);
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
                  autoFocus
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
              <div className='flex justify-between'>
                <FormMessage />
                <Link
                  href='/auth/forgot-password'
                  className='font-dm_sans text-sm hover:underline opacity-80 ml-auto'
                >
                  Forgot your password?
                </Link>
              </div>
            </FormItem>
          )}
        />

        <div className='pt-6 flex gap-2 items-center'>
          <Button
            className='flex-1 order-1 transition-colors duration-300'
            disabled={mutation.isPending}
          >
            {mutation.isPending && <Loader />} Login
          </Button>
        </div>
      </form>
    </Form>
  );
}
