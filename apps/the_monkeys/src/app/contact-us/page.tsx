'use client';

import { useEffect, useRef, useState } from 'react';

import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import { Loader } from '@/components/loader';
import useAuth from '@/hooks/auth/useAuth';
import { contactFormSchema } from '@/lib/schema/contact';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@the-monkeys/ui/atoms/select';
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

import StaticText from './components/StaticText';
import { COMPANY_SIZES, SUBJECTS, generateCaptcha } from './utils/constants';

const ContactPage = () => {
  const { data: user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [isRotating, setIsRotating] = useState(false);

  const rotationTimerRef = useRef<NodeJS.Timeout | null>(null);

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
      captcha_answer: '',
    },
  });

  /* Auto-fill user data when logged in */
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
        captcha_answer: '',
      });
    }
  }, [user, form]);

  useEffect(() => {
    return () => {
      if (rotationTimerRef.current) {
        clearTimeout(rotationTimerRef.current);
      }
    };
  }, []);

  const refreshCaptcha = () => {
    if (rotationTimerRef.current) {
      clearTimeout(rotationTimerRef.current);
    }

    setIsRotating(true);
    setCaptcha(generateCaptcha());
    rotationTimerRef.current = setTimeout(() => {
      setIsRotating(false);
    }, 200);
  };

  const onSubmit = (values: z.infer<typeof contactFormSchema>) => {
    /* Validate captcha */
    if (parseInt(values.captcha_answer) !== captcha.answer) {
      toast({
        variant: 'destructive',
        title: 'Captcha verification failed!',
        description: 'Please try again.',
      });
      form.reset((prev) => ({
        ...prev,
        captcha_answer: '',
      }));
      refreshCaptcha();
      return;
    }

    setLoading(true);

    // Todo: Send data to backend

    toast({
      variant: 'success',
      title: 'Success',
      description: 'Your message has been sent successfully',
    });

    form.reset({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      company_size: '',
      company_name: '',
      subject: '',
      message: '',
      captcha_answer: '',
    });
    refreshCaptcha();
    setLoading(false);
  };

  return (
    <Container className='max-w-7xl w-full min-h-screen flex flex-col lg:flex-row lg:justify-between justify-center items-start px-6 sm:px-6 pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 gap-6 sm:gap-8 lg:gap-10 overflow-hidden'>
      <StaticText />

      <div className='w-full lg:w-1/2 p-4 sm:p-6'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 sm:space-y-6'
          >
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='first_name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm sm:text-base'>
                      First name <span className='text-brand-orange'>*</span>
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
                  <FormItem>
                    <FormLabel className='text-sm sm:text-base'>
                      Last name <span className='text-brand-orange'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Enter last name' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm sm:text-base'>
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

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='company_size'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm sm:text-base'>
                      Company size
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className='h-10'>
                          <SelectValue placeholder='Please select' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Employees</SelectLabel>
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
                  <FormItem>
                    <FormLabel className='text-sm sm:text-base'>
                      Company name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='XYZ Corp' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='subject'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm sm:text-base'>
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
                <FormItem>
                  <FormLabel className='text-sm sm:text-base'>
                    Your message
                  </FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder='Type your message here...'
                      className='w-full py-2 px-4 rounded-md text-sm min-h-[80px] sm:min-h-[100px] outline-none bg-background-light dark:bg-background-dark border border-border-light/60 dark:border-border-dark/60 focus-visible:border-2 focus-visible:border-foreground-light dark:focus-visible:border-foreground-dark resize-none'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 items-end'>
              <div className='flex flex-col gap-2'>
                <FormLabel className='text-sm sm:text-base'>
                  {`Verify you're human `}
                  <span className='text-brand-orange'>*</span>
                </FormLabel>
                <div className='flex gap-2'>
                  <Input
                    value={`${captcha.a} + ${captcha.b} = ?`}
                    readOnly
                    className='text-center pointer-events-none'
                  />
                  <Button
                    type='button'
                    variant='default'
                    onClick={refreshCaptcha}
                    className='h-10 px-3 border border-border-light/60 dark:border-border-dark/60 rounded bg-background-light dark:bg-background-dark'
                    title='Refresh captcha'
                  >
                    <Icon
                      name='RiRestartLine'
                      type='NIL'
                      className={`w-5 h-5 text-text-light dark:text-text-dark ${isRotating ? 'animate-spin duration-200' : ''}`}
                    />
                  </Button>
                </div>
              </div>

              <FormField
                control={form.control}
                name='captcha_answer'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder='Answer' />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type='submit'
              variant='brand'
              size='lg'
              disabled={loading}
              className='w-full group rounded hover:!bg-background-light dark:hover:!bg-background-dark'
            >
              {loading && <Loader />}
              <Icon
                name='RiSendPlane'
                type='Fill'
                className='mr-2 group-hover:animate-icon-shake'
              />
              Send Message
            </Button>
          </form>
        </Form>
      </div>
    </Container>
  );
};

export default ContactPage;
