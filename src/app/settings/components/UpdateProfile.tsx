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
import { updateProfileSchema } from '@/lib/schema/settings';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const UpdateProfile = () => {
  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
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

  function onSubmit(values: z.infer<typeof updateProfileSchema>) {
    console.log(values);
  }

  return (
    <div className='mt-[52px]'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='max-w-[1000px] ml-auto'
        >
          {/* Basic Info  */}
          <div className='grid grid-cols-[25%_75%]'>
            <h3 className='font-josefin_Sans text-xl'>Basic Info</h3>
            <div className='grid  grid-cols-2   gap-y-5 justify-center'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        className='max-w-[234px]'
                        variant='border'
                        {...field}
                      />
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
                      <Input
                        className='max-w-[234px]'
                        variant='border'
                        {...field}
                      />
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
                      <Input
                        className='max-w-[234px]'
                        variant='border'
                        {...field}
                      />
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
                      <Input
                        className='max-w-[234px]'
                        variant='border'
                        {...field}
                      />
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
                      <Input
                        className='max-w-[234px]'
                        variant='border'
                        {...field}
                      />
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
                      <Input
                        className='max-w-[234px]'
                        type='date'
                        variant='border'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Basic Info END */}
          {/* Social  */}
          <div className='grid grid-cols-[25%_75%] mt-5'>
            <h3 className='font-josefin_Sans text-xl '>Social</h3>
            <div className='grid  grid-cols-2  gap-y-5 justify-center'>
              <FormField
                control={form.control}
                name='twitterProfile'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='font-josefin_Sans text-xs'>
                      Twitter Profile
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='max-w-[234px]'
                        type='url'
                        variant='border'
                        {...field}
                      />
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
                      <Input
                        className='max-w-[234px]'
                        type='url'
                        variant='border'
                        {...field}
                      />
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
                      <Input
                        className='max-w-[234px]'
                        type='url'
                        variant='border'
                        {...field}
                      />
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
                      <Input
                        className='max-w-[234px]'
                        type='url'
                        variant='border'
                        {...field}
                      />
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
