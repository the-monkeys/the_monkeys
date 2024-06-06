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

import Section from './Section';

const Profile = () => {
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
    <div className='mt-12 px-4 sm:px-6 lg:px-8'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='mx-auto space-y-10'
        >
          <Section sectionTitle='Basic'>
            <div className='mb-4'>
              <p className='font-josefin_Sans text-sm'>Profile Image</p>

              <div className='mt-2 rounded-lg h-32 w-32 flex bg-secondary-lightGrey/15' />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='firstName'
                render={({ field }) => (
                  <FormItem className='mr-4'>
                    <FormLabel className='font-josefin_Sans text-sm'>
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='w-full'
                        variant='border'
                        {...field}
                        placeholder='Enter First Name'
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
                  <FormItem className='mr-4'>
                    <FormLabel className='font-josefin_Sans text-sm'>
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='w-full'
                        variant='border'
                        {...field}
                        placeholder='Enter Last name'
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
                  <FormItem className='mr-4'>
                    <FormLabel className='font-josefin_Sans text-sm'>
                      Location
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='w-full'
                        variant='border'
                        {...field}
                        placeholder='Enter Location'
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
                  <FormItem className='mr-4'>
                    <FormLabel className='font-josefin_Sans text-sm'>
                      Contact Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='w-full'
                        variant='border'
                        {...field}
                        placeholder='Enter Contact Number'
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
                  <FormItem className='mr-4'>
                    <FormLabel className='font-josefin_Sans text-sm'>
                      Bio
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='w-full'
                        variant='border'
                        {...field}
                        placeholder='Enter Bio'
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
                  <FormItem className='mr-4'>
                    <FormLabel className='font-josefin_Sans text-sm'>
                      Date of Birth
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='w-full'
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
          </Section>

          <Section sectionTitle='Social'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='twitterProfile'
                render={({ field }) => (
                  <FormItem className='mr-4'>
                    <FormLabel className='font-josefin_Sans text-sm'>
                      Twitter Profile
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='w-full'
                        type='url'
                        variant='border'
                        {...field}
                        placeholder='Enter Twitter Profile'
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
                  <FormItem className='mr-4'>
                    <FormLabel className='font-josefin_Sans text-sm'>
                      LinkedIn Profile
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='w-full'
                        type='url'
                        variant='border'
                        {...field}
                        placeholder='Enter LinkedIn Profile'
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
                  <FormItem className='mr-4'>
                    <FormLabel className='font-josefin_Sans text-sm'>
                      Instagram Profile
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='w-full'
                        type='url'
                        variant='border'
                        {...field}
                        placeholder='Enter Instagram Profile'
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
                  <FormItem className='mr-4'>
                    <FormLabel className='font-josefin_Sans text-sm'>
                      GitHub Profile
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='w-full'
                        type='url'
                        variant='border'
                        {...field}
                        placeholder='Enter GitHub Profile'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Section>

          <Section sectionTitle='Topics'>
            <div>
              <Button title='Add Topics' variant='secondary' />
            </div>
          </Section>

          <div className='pt-8 flex justify-center items-center'>
            <Button title='Update Profile' variant='primary' type='submit' />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Profile;
