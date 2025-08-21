'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import PasswordInput from '@/components/input/PasswordInput';
import { Loader } from '@/components/loader';
import { loginSchema } from '@/lib/schema/auth';
import { cn } from '@/lib/utils';
import { login } from '@/services/auth/auth';
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

export default function LoginForm({ isLoading }: { isLoading: boolean }) {
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
              <FormLabel className='text-sm'>Email</FormLabel>
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
              <FormLabel className='text-sm'>Password</FormLabel>

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

              <div className='pt-[6px] flex justify-between'>
                <FormMessage />

                <Link
                  href='/auth/forgot-password'
                  className='font-dm_sans text-sm hover:underline opacity-90 ml-auto'
                >
                  Forgot your password?
                </Link>
              </div>
            </FormItem>
          )}
        />

        <div className='pt-6 flex'>
          <Button
            variant='brand'
            className='flex-1'
            disabled={mutation.isPending || isLoading}
          >
            {mutation.isPending && <Loader />} Login
          </Button>
        </div>
      </form>
    </Form>
  );
}
