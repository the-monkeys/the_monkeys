'use client';

import { useEffect, useState } from 'react';

import { useSession } from '@/app/session-store-provider';
import { Loader } from '@/components/loader';
import ProfileImage, { ProfileFrame } from '@/components/profileImage';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover } from '@/components/ui/popover';
import { toast } from '@/components/ui/use-toast';
import { DeleteProfileDialog } from '@/components/user/dialogs/deleteProfileDialog';
import { UpdateProfileDialog } from '@/components/user/dialogs/updateProfileDialog';
import useGetAuthUserProfile from '@/hooks/user/useGetAuthUserProfile';
import { updateProfileSchema } from '@/lib/schema/settings';
import axiosInstance from '@/services/api/axiosInstance';
import { zodResolver } from '@hookform/resolvers/zod';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Section } from './Section';
import { parseDateTime } from './profile/parseDate';

export const Profile = () => {
  const { data } = useSession();
  const { user, isLoading, isError } = useGetAuthUserProfile(
    data?.user.username
  );
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      address: '',
      contact_number: undefined,
      bio: '',
      date_of_birth: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      github: '',
    },
  });

  function onSubmit(values: z.infer<typeof updateProfileSchema>) {
    setLoading(true);
    axiosInstance
      .put(`/user/${data?.user.username}`, {
        values,
      })
      .then((res) => {
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Your profile has been updated successfully',
        });
      })
      .catch((err) => {
        toast({
          variant: 'error',
          title: 'Error',
          description: err.message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    if (user) {
      form.reset({
        first_name: user.first_name,
        last_name: user.last_name,
        address: user.address,
        contact_number: user.contact_number,
        bio: user.bio,
        date_of_birth: user.date_of_birth,
        twitter: user.twitter,
        linkedin: user.linkedin,
        instagram: user.instagram,
        github: user.github,
      });
    }
  }, [user, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <Section sectionTitle='Basic Infomation'>
          <div className='p-1 grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='col-span-1 sm:col-span-2 flex flex-wrap items-end gap-2'>
              <p className='w-full col-span-1 sm:col-span-2 text-sm'>
                Profile Photo
              </p>

              <ProfileFrame className='size-28 sm:size-32'>
                {data?.user && <ProfileImage username={data.user?.username} />}
              </ProfileFrame>

              <div className='space-x-2'>
                <DeleteProfileDialog />

                <UpdateProfileDialog />
              </div>
            </div>

            <FormField
              control={form.control}
              name='first_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>First Name</FormLabel>
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
              name='last_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Last Name</FormLabel>
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
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Location</FormLabel>
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
              name='contact_number'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Contact Number</FormLabel>
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
                <FormItem>
                  <FormLabel className='text-sm'>Bio</FormLabel>
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
              name='date_of_birth'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Birth Date</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <div>
                          <Input
                            readOnly
                            onChange={field.onChange}
                            value={
                              field.value
                                ? format(field.value, 'yyyy-MM-dd')
                                : 'Pick a date'
                            }
                            className='w-full'
                            type='date'
                          />
                        </div>
                      </PopoverTrigger>

                      <PopoverContent className='w-auto'>
                        <Calendar
                          mode='single'
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            if (date) {
                              const formatedDate = parseDateTime(
                                format(date, 'yyyy-MM-dd')
                              );
                              field.onChange(formatedDate);
                            }
                          }}
                          captionLayout='dropdown-buttons'
                          fromYear={1960}
                          toYear={new Date().getFullYear()}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Section>

        <Section sectionTitle='Social Accounts'>
          <div className='p-1 grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='twitter'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm'>Twitter</FormLabel>
                  <FormControl>
                    <Input
                      className='w-full'
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
                <FormItem>
                  <FormLabel className='text-sm'>LinkedIn</FormLabel>
                  <FormControl>
                    <Input
                      className='w-full'
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
                <FormItem>
                  <FormLabel className='text-sm'>Instagram</FormLabel>
                  <FormControl>
                    <Input
                      className='w-full'
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
                <FormItem>
                  <FormLabel className='text-sm'>GitHub</FormLabel>
                  <FormControl>
                    <Input
                      className='w-full'
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

        <div className='flex justify-end'>
          <Button disabled={loading ? true : false} type='submit'>
            {loading && <Loader />} Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
};
