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
      <h2 className='font-dm_sans font-medium text-base'>{heading}</h2>

      <ul className='space-y-2'>
        {items.map((item, index) => (
          <li
            className='font-roboto text-sm opacity-80 hover:opacity-100'
            key={index}
          >
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

  return (
    <Container className='px-4 py-12'>
      <footer className='space-y-6'>
        <Logo showSubHeading={true} />

        <Form {...form}>
          <form>
            <div className='flex items-end gap-2'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='w-72 md:w-80'>
                    <FormLabel className='font-roboto text-sm'>
                      Get in Touch
                    </FormLabel>
                    <FormMessage />
                    <FormControl>
                      <Input placeholder='Enter email address' {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button variant='brand' size='lg' disabled>
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
              className='hover:opacity-80'
              href='https://discord.gg/6fK9YuV8FV'
              target='_blank'
            >
              <Icon name='RiDiscord' type='Fill' />
            </Link>

            <Link
              className='hover:opacity-80'
              href='https://github.com/the-monkeys'
              target='_blank'
            >
              <Icon name='RiGithub' type='Fill' />
            </Link>

            <Link
              className='hover:opacity-80'
              href='https://x.com/MonkeysInsight'
              target='_blank'
            >
              <Icon name='RiTwitterX' type='Fill' />
            </Link>
          </div>

          <p className='font-roboto text-text-light/80 dark:text-text-dark/80 text-xs sm:text-sm text-center'>
            Monkeys, {currentYear}, All Rights Reserved
          </p>
        </div>
      </footer>
    </Container>
  );
};

export default Footer;
