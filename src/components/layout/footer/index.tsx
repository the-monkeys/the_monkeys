'use client';

import Link from 'next/link';

import Icon from '@/components/icon';
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
import { footerList } from '@/constants/footer';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import Container from '../Container';

const contactFormSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
});

const FooterList = ({
  heading,
  items,
}: {
  heading: string;
  items: {
    text: string;
    link: string;
  }[];
}) => {
  return (
    <div className='space-y-2'>
      <h4 className='font-josefin_Sans font-semibold uppercase'>{heading}</h4>

      <ul className='font-jost space-y-2'>
        {items.map((item, index) => (
          <li className='opacity-75 hover:opacity-100' key={index}>
            <Link href={item.link}>{item.text}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Footer = () => {
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      email: '',
    },
  });

  const currentYear = new Date().getFullYear();

  function onSubmit(values: z.infer<typeof contactFormSchema>) {
    console.log(values.email);
  }

  return (
    <Container className='px-5 pt-10 pb-14 border-t-1 border-secondary-lightGrey/15'>
      <footer className='space-y-6'>
        <Logo showSubHeading showMix />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='flex items-end gap-2'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='w-72 md:w-80'>
                    <FormLabel>Get in Touch</FormLabel>
                    <FormMessage />
                    <FormControl>
                      <Input placeholder='Enter email address' {...field} />
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

        <div className='w-full pt-4 flex flex-col sm:flex-row justify-between gap-8'>
          {footerList.map((listItem, index) => {
            return <FooterList {...listItem} key={index} />;
          })}
        </div>

        <div className='pb-8 space-y-2'>
          <div className='py-2 flex items-center justify-center gap-4'>
            <Link
              className='flex items-center hover:opacity-75'
              href='https://discord.gg/6fK9YuV8FV'
              target='_blank'
            >
              <Icon name='RiDiscord' type='Fill' />
            </Link>

            <Link
              className='flex items-center hover:opacity-75'
              href='https://github.com/the-monkeys'
              target='_blank'
            >
              <Icon name='RiGithub' type='Fill' />
            </Link>

            <Link
              className='flex items-center hover:opacity-75'
              href='https://twitter.com/TheMonkeysLife'
              target='_blank'
            >
              <Icon name='RiTwitterX' type='Fill' />
            </Link>
          </div>

          <p className='font-josefin_Sans text-secondary-darkGrey dark:text-secondary-white text-sm text-center opacity-75'>
            Monkeys, {currentYear}, All Rights Reserved
          </p>
        </div>
      </footer>
    </Container>
  );
};

export default Footer;
