'use client';

import { useEffect, useState } from 'react';

import { Loader } from '@/components/loader';
import useAuth from '@/hooks/auth/useAuth';
import { contactFormSchema } from '@/lib/schema/contact';
import axiosInstance from '@/services/api/axiosInstance';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@the-monkeys/ui/atoms/select';
import { TextArea } from '@the-monkeys/ui/atoms/text-area';
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

import { COMPANY_SIZES, SUBJECTS } from '../utils/constants';

const ContactForm = () => {
  const { data: user } = useAuth();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      company_size: '',
      company_name: '',
      subject: '',
      message: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        company_size: '',
        company_name: '',
        subject: '',
        message: '',
      });
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof contactFormSchema>) => {
    setLoading(true);

    try {
      const res = await axiosInstance.post('/contact', values);
      const result = await res.data?.message;

      toast({
        variant: 'success',
        title: 'Success',
        description: result || 'Your message has been sent successfully.',
      });

      form.reset({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        company_size: '',
        company_name: '',
        subject: '',
        message: '',
      });
    } catch (err: unknown) {
      toast({
        variant: 'error',
        title: 'Error',
        description: 'Failed to send message. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='first_name'
            render={({ field }) => (
              <FormItem className='col-span-2 sm:col-span-1'>
                <FormLabel className='text-sm'>
                  First Name <span className='text-brand-orange'>*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Enter first name' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='last_name'
            render={({ field }) => (
              <FormItem className='col-span-2 sm:col-span-1'>
                <FormLabel className='text-sm'>
                  Last Name <span className='text-brand-orange'>*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder='Enter last name' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem className='col-span-2'>
                <FormLabel className='text-sm'>
                  Email <span className='text-brand-orange'>*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type='email'
                    placeholder='Enter email address'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='company_size'
            render={({ field }) => (
              <FormItem className='col-span-2 sm:col-span-1'>
                <FormLabel className='text-sm'>Company Size</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className='h-10'>
                      <SelectValue placeholder='Please select' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {COMPANY_SIZES.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='company_name'
            render={({ field }) => (
              <FormItem className='col-span-2 sm:col-span-1'>
                <FormLabel className='text-sm'>Company Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder='e.g Buddhicintaka Pvt. Ltd.' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='subject'
            render={({ field }) => (
              <FormItem className='col-span-2'>
                <FormLabel className='text-sm'>
                  Subject <span className='text-brand-orange'>*</span>
                </FormLabel>

                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className='h-10'>
                      <SelectValue placeholder='Please select' />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        {SUBJECTS.map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='message'
            render={({ field }) => (
              <FormItem className='col-span-2'>
                <FormLabel className='text-sm'>
                  Additional Info {`(optional)`}
                </FormLabel>
                <FormControl>
                  <TextArea {...field} placeholder='Write your message here' />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex'>
          <Button type='submit' disabled={loading} className='w-full'>
            {loading && <Loader />}
            Send Message
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContactForm;
