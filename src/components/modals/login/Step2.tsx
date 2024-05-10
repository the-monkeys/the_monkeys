import React, { FC } from 'react';

import { useRouter } from 'next/navigation';

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
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import ModalContent from '../layout/ModalContent';
import { LoginStep } from './LoginModal';
import { loginSteps } from './loginSteps';

const formSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
  // .min(8, 'Password must be more than 8 characters')
  // .max(32, 'Password must be less than 32 characters'),
});
type Step2Props = {
  setLoginStep: React.Dispatch<React.SetStateAction<LoginStep>>;
};

const Step2: FC<Step2Props> = ({ setLoginStep }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const res = await signIn('credentials', {
      email: values.email,
      password: values.password,
    });
    console.log(res);
    console.log(res?.ok, 'res.ok');

    if (res?.ok) {
      console.log('OK');
      router.back();
      setTimeout(() => {
        router.refresh();
      }, 300);
    }
    if (res?.error) {
      console.log(res.error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: res.error,
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
                    placeholder=' Enter Your Email'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder=' Enter Your Password'
                    {...field}
                    type='password'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex gap-2 items-center mt-4'>
            <Button
              className='w-full'
              title='Previous'
              variant='secondary'
              onClick={(e) => handlePreviousStep(e)}
            />
            <Button
              className='w-full'
              title='Login'
              variant='primary'
              type='submit'
            />
          </div>
        </form>
      </Form>
    </ModalContent>
  );
};

export default Step2;
