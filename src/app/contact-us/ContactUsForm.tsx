'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { contactUsSchema } from '@/lib/schema/contactus';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function ContactUsForm() {
  const { data, status } = useSession();

  const form = useForm<z.infer<typeof contactUsSchema>>({
    resolver: zodResolver(contactUsSchema),
    defaultValues: {
      email: data?.user.email,
      full_name: data?.user.name || '',
    },
  });

  const onSubmit = (values: z.infer<typeof contactUsSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name='full_name'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className=''>Full Name</FormLabel>
              <Input
                placeholder='Enter full name'
                disabled={status === 'authenticated'}
                defaultValue={data?.user.name ?? undefined}
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='email'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className=''>Email</FormLabel>
              <Input
                placeholder='Enter email address'
                defaultValue={data?.user.email}
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='message'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className=''>Email</FormLabel>
              <Textarea placeholder='Enter message' {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant='brand'>Submit</Button>
      </form>
    </Form>
  );
}
