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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  location: z.string().max(100),
  contactNumber: z
    .string()
    .regex(/^[0-9]+$/, 'Contact number must be digits only')
    .min(10)
    .max(15),
  bio: z.string().max(500),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format'),
  twitterProfile: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  instagram: z.string().url().optional(),
  github: z.string().url().optional(),
});

const UpdateProfile = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      location: '',
      contactNumber: '',
      bio: '',
      dateOfBirth: '',
      twitterProfile: '',
      linkedin: '',
      instagram: '',
      github: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className='mt-[52px]'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='max-w-[1000px] mx-auto'
        >
          {/* Basic Info  */}
          <div className='grid grid-cols-2 '>
            <h3 className='font-josefin_Sans  text-xl'>Basic Info</h3>
            <div className='grid grid-cols-2 gap-x-[70px] gap-y-5'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input variant='border' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lastName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-josefin_Sans text-xs'>
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input variant='border' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='location'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-josefin_Sans text-xs'>
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input variant='border' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='contactNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-josefin_Sans text-xs'>
                      Contact Number
                    </FormLabel>
                    <FormControl>
                      <Input variant='border' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='bio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-josefin_Sans text-xs'>
                      Bio
                    </FormLabel>
                    <FormControl>
                      <Input variant='border' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='dateOfBirth'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-josefin_Sans text-xs'>
                      Date of Birth
                    </FormLabel>
                    <FormControl>
                      <Input type='date' variant='border' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Basic Info END */}
          {/* Social  */}
          <div className='grid grid-cols-2 mt-5'>
            <h3 className='font-josefin_Sans text-xl'>Social</h3>
            <div className='grid grid-cols-2 gap-x-[70px] gap-y-5'>
              <FormField
                control={form.control}
                name='twitterProfile'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-josefin_Sans text-xs'>
                      Twitter Profile
                    </FormLabel>
                    <FormControl>
                      <Input type='url' variant='border' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='linkedin'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-josefin_Sans text-xs'>
                      LinkedIn Profile
                    </FormLabel>
                    <FormControl>
                      <Input type='url' variant='border' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='instagram'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-josefin_Sans text-xs'>
                      Instagram Profile
                    </FormLabel>
                    <FormControl>
                      <Input type='url' variant='border' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='github'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-josefin_Sans text-xs'>
                      GitHub Profile
                    </FormLabel>
                    <FormControl>
                      <Input type='url' variant='border' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Social END */}
          <div className='flex justify-center items-center mt-24'>
            {' '}
            <Button title='Update Profile' variant='primary' type='submit' />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateProfile;
