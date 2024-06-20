'use client';

import React from 'react';

import Icon from '@/components/icon';
import ProfileImage from '@/components/profileImage';
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
import { updateProfileSchema } from '@/lib/schema/settings';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Section from './Section';
import ProfileDeleteDialog from './profile/ProfileDeleteDialog';
import ProfileUpdateDialog from './profile/ProfileUpdateDialog';

const Profile = () => {
  const { data, status } = useSession();

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
    <div className='mt-5 p-5'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='mx-auto space-y-10'
        >
          <Section sectionTitle='Basic'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className='col-span-1 sm:col-span-2 flex flex-wrap items-end gap-2'>
                <p className='w-full col-span-1 sm:col-span-2 font-josefin_Sans text-sm'>
                  Profile Image
                </p>

                <div className='rounded-full size-32 ring-1 ring-secondary-lightGrey/25 flex items-center justify-center overflow-hidden'>
                  <ProfileImage username={data?.user?.user_name || ''} />
                </div>

                <div className='space-x-2'>
                  <ProfileDeleteDialog />

                  <ProfileUpdateDialog />
                </div>
              </div>

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
                        {...field}
                        placeholder='Enter first name'
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
                        {...field}
                        placeholder='Enter last name'
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
                        {...field}
                        placeholder='Enter location'
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
                        {...field}
                        placeholder='Enter contact number'
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
                        {...field}
                        placeholder='Enter bio'
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
                      Birth Date
                    </FormLabel>
                    <FormControl>
                      <Input className='w-full' type='date' {...field} />
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
                      Twitter
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='w-full'
                        type='url'
                        {...field}
                        placeholder='Enter username'
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
                      LinkedIn
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='w-full'
                        type='url'
                        {...field}
                        placeholder='Enter username'
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
                      Instagram
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='w-full'
                        type='url'
                        {...field}
                        placeholder='Enter username'
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
                      GitHub
                    </FormLabel>
                    <FormControl>
                      <Input
                        className='w-full'
                        type='url'
                        {...field}
                        placeholder='Enter username'
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
              <Button
                type='button'
                size='icon'
                variant='outline'
                className='rounded-full'
              >
                <Icon name='RiAdd' size={16} />
              </Button>
            </div>
          </Section>

          <div className='pt-8 flex justify-center items-center'>
            <Button size='lg' type='submit'>
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Profile;
