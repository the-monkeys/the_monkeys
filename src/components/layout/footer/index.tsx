'use client';

import Link from 'next/link';

import Icon from '@/components/icon/Icon';
import Logo from '@/components/logo';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { footerList } from './footerList';
import List from './list';

const contactFormSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
});

const Footer = () => {
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(values: z.infer<typeof contactFormSchema>) {
    console.log(values.email);
  }

  return (
    <footer className='px-5 py-10 space-y-6'>
      <Logo showSubHeading showMix />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex items-end gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='w-72 md:w-80'>
                  <FormLabel htmlFor='contact_email'>Get in Touch</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      id='contact_email'
                      placeholder='Enter email address'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button size='lg' type='submit'>
              Subscribe
            </Button>
          </div>
        </form>
      </Form>

      <div className='w-full py-4 flex flex-wrap justify-between gap-8'>
        {footerList.map((listItem, index) => {
          return <List listData={listItem} key={index} />;
        })}
      </div>

      <div className='pb-10'>
        <div className='py-2 flex items-center justify-center gap-4'>
          <Link
            className='flex items-center gap-2'
            href='https://discord.gg/6fK9YuV8FV'
            target='_blank'
          >
            <Icon name='RiDiscordFill' size={20} />
          </Link>

          <Link
            className='flex items-center gap-2'
            href='https://github.com/the-monkeys'
            target='_blank'
          >
            <Icon name='RiGithubFill' size={20} />
          </Link>

          <Link
            className='flex items-center gap-2'
            href='https://twitter.com/TheMonkeysLife'
            target='_blank'
          >
            <Icon name='RiTwitterXFill' size={20} />
          </Link>
        </div>

        <p className='font-josefin_Sans text-secondary-darkGrey dark:text-secondary-white text-sm text-center'>
          Monkeys, 2024, All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
