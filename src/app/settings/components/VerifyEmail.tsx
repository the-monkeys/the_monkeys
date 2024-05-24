'use client';

import React from 'react';

import Button from '@/components/button';
import {
  Form,
  FormControl,
  FormDescription,
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
  // 1. Define your form.
  const form = useForm<z.infer<typeof updateEmailSchema>>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email: '',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof updateEmailSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <div>
      <div className='grid grid-cols-[25%_70%]'>
        <div className='font-josefin_Sans text-xl '>Email</div>
        <div>
          <p className='font-josefin_Sans text-base  '>Verify your Email</p>
          <p className='font-jost text-secondary-mute'>
            Update your email to keep your account secure and receive important
            notifications.
          </p>
          <Button
            variant='shallow'
            title='Verify Email'
            className='mt-4 mb-[22px] bg-primary-monkeyWhite text-primary-monkeyBlack hover:text-primary-monkeyBlack'
          />
          <p className='font-josefin_Sans text-base  '>Update Your Email</p>
          <p className='font-jost text-secondary-mute dark:text-'>
            Update your email to keep your account secure and receive important
            notifications.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-secondary-mute'>
                      Email Address{' '}
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='max-w-[234px]'
                        variant='border'
                        placeholder=''
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <Button variant='secondary' type='submit' title='submit' /> */}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
