'use client';

import React from 'react';

import Button from '@/components/button';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const VerifyEmail = () => {
  const form = useForm<z.infer<typeof updateEmailSchema>>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(values: z.infer<typeof updateEmailSchema>) {
    console.log(values);
  }

  return (
    <div className='w-full'>
      <p className='font-josefin_Sans text-lg'>Update your Email</p>

      <p className='font-light font-jost opacity-75'>
        Update your email for seamless communication and enhanced security.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='mt-4 space-y-8'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='font-josefin_Sans text-sm'>
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    className='w-1/2'
                    variant='border'
                    placeholder='Enter Email Address'
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      <p className='mt-8 font-josefin_Sans text-lg'>Verify your Email</p>

      <p className='font-light font-jost opacity-75'>
        Verify your email address to keep your account secure and stay updated.
      </p>

      <Button
        variant='shallow'
        title='Verify Email'
        className='mt-4 bg-primary-monkeyWhite text-primary-monkeyBlack hover:text-primary-monkeyBlack'
      />
    </div>
  );
};

export default VerifyEmail;
