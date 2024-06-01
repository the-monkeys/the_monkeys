import React, { FC, useState } from 'react';
import axios from 'axios';

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
import { toast } from '@/components/ui/use-toast';
import { loginSteps } from '@/constants/modal';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '@/lib/schema/auth';
import ModalContent from '../layout/ModalContent';
import { LoginStep } from './LoginModal';


type Step3Props = {
  setLoginStep: React.Dispatch<React.SetStateAction<LoginStep>>;
};

const Step3: FC<Step3Props> = ({ setLoginStep }) => {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://themonkeys.site/api/v1";
const AUTH_SECRET = process.env.AUTH_SECRET;
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    try {
      const response = await axios.post(`${NEXT_PUBLIC_API_URL}/auth/forgot-pass`, { email: values.email });

      if (response.status === 200) {
        toast({
          variant: 'success',
          title: 'Success',
          description: response.data.message,
        });
        setLoginStep(loginSteps[0]); // Redirect to the first step or login step
      }
    } catch (error) {
      toast({
        variant: 'error',
        title: 'Error',
        description: 'Failed to send password reset email. Please try again.',
      });
    }
  }

  const handlePreviousStep = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    setLoginStep(loginSteps[0]);
  };

  return (
    <ModalContent className='flex flex-col justify-center px-4'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className=''
                    placeholder='Enter Your Email'
                    {...field}
                    variant='border'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex flex-row-reverse gap-2 items-center mt-4'>
            <Button
              className='w-full order-1'
              title='Send Reset Link'
              variant='primary'
              type='submit'
            />
            <Button
              className='w-full order-2'
              title='Previous'
              variant='secondary'
              type='button'
              onClick={handlePreviousStep}
            />
          </div>
        </form>
      </Form>
    </ModalContent>
  );
};

export default Step3;
