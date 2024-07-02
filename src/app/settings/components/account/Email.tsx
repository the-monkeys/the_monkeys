'use client';

import React, { useState } from 'react';

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
import { updateEmailSchema } from '@/lib/schema/settings';
import axiosInstance from '@/services/api/axiosInstance';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const Email = () => {
  const { data } = useSession();
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof updateEmailSchema>>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email: '',
    },
  });

  async function reqVerification() {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `/auth/req-email-verification`,
        {
          email: data?.user?.email,
        }
      );

      if (response.status === 200) {
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Email verification request has been sent successfully.',
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message || 'Failed to send verification request.',
        });
      } else {
        toast({
          variant: 'error',
          title: 'Error',
          description: 'An unknown error occured.',
        });
      }
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(values: z.infer<typeof updateEmailSchema>) {
    console.log(values);
  }

  return (
    <div className='flex flex-col items-start'>
      <h4 className='font-josefin_Sans text-lg'>Verify Email</h4>

      <p className='font-jost text-sm opacity-75'>
        Verify your email address to keep your account secure and stay updated.
      </p>

      <Button
        type='button'
        size='lg'
        variant='secondary'
        className='mt-4'
        onClick={reqVerification}
        disabled={loading ? true : false}
      >
        {loading && <Loader />} Verify Email
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
