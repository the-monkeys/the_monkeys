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
import { updateUsername } from '@/lib/schema/settings';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const Username = () => {
  const form = useForm<z.infer<typeof updateUsername>>({
    resolver: zodResolver(updateUsername),
    defaultValues: {
      username: '',
    },
  });

  function onSubmit(values: z.infer<typeof updateUsername>) {
    console.log(values);
  }

  return (
    <div className='flex flex-col items-start'>
      <h4 className='font-josefin_Sans text-lg'>Update Username</h4>

      <p className='font-jost text-sm opacity-75'>
        Change your username to something that reflects your individuality.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full mt-4'>
          <div className='flex items-end flex-wrap gap-2'>
            <div className='w-full sm:w-1/2'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-josefin_Sans text-sm'>
                      Username
                    </FormLabel>
                    <FormMessage />
                    <FormControl>
                      <Input placeholder='Enter username' {...field} />
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

export default Username;
