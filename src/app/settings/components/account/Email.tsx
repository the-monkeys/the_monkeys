'use client';

import React from 'react';

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
import { updateEmailSchema } from '@/lib/schema/settings';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const Email = () => {
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
    <div className='flex flex-col items-start'>
      <h4 className='font-josefin_Sans text-lg'>Verify Email</h4>

      <p className='font-jost text-sm opacity-75'>
        Verify your email address to keep your account secure and stay updated.
      </p>

      <Button variant='secondary' className='mt-4'>
        Verify Email
      </Button>

      <h4 className='mt-6 font-josefin_Sans text-lg'>Update Email</h4>

      <p className='font-jost text-sm opacity-75'>
        Update your email for seamless communication and enhanced security.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full mt-4'>
          <div className='flex items-end flex-wrap gap-2'>
            <div className='w-full sm:w-1/2'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-josefin_Sans text-sm'>
                      Email Address
                    </FormLabel>
                    <FormMessage />
                    <FormControl>
                      <Input placeholder='Enter email address' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button size='lg' variant='secondary' type='submit'>
              Update
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Email;
