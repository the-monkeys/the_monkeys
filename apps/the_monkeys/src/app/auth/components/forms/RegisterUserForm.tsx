'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

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
import { registerUserSchema } from '@/lib/schema/auth';
import { cn } from '@/lib/utils';
import { register } from '@/services/auth/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiInformationLine } from '@remixicon/react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@the-monkeys/ui/atoms/tooltip';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function RegisterUserForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof registerUserSchema>>({
    resolver: zodResolver(registerUserSchema),
  });

  const onSubmit = async (values: z.infer<typeof registerUserSchema>) => {
    setLoading(true);

    const requestBody = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      password: values.password,
    };

    try {
      await register(requestBody);

      toast({
        variant: 'success',
        title: 'Account created successfully',
      });

      router.replace('/auth/login');
    } catch (err) {
      console.log(err);

      toast({
        variant: 'error',
        title: 'Failed to create account',
        description: 'An error occurred while creating your account',
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
          name='first_name'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className='font-roboto text-sm'>First Name</FormLabel>
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
          control={form.control}
          name='last_name'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className='font-roboto text-sm'>Last Name</FormLabel>
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
          control={form.control}
          name='email'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className='font-roboto text-sm'>Email</FormLabel>
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
          control={form.control}
          name='password'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className='font-roboto text-sm'>
                <div className='flex items-center'>
                  Password
                  <Tooltip>
                    <TooltipTrigger type='button'>
                      <RiInformationLine className='ml-2' size={18} />
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
          control={form.control}
          name='confirmPassword'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel className='font-roboto text-sm'>
                Confirm Password
              </FormLabel>
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

        <div className='pt-6 flex flex-row-reverse  gap-2 items-center'>
          <Button disabled={loading ? true : false} className='flex-1 order-1'>
            {loading && <Loader />} Register
          </Button>
        </div>
      </form>
    </Form>
  );
}
