'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { BackgroundWaves } from '@/components/branding/BackgroundWaves';
import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import { ContactFormInputs } from '@/lib/schema/contact';
import { Button } from '@the-monkeys/ui/atoms/button';

import InputField from './components/InputField';
import { generateCaptcha } from './utils/captcha';
import { COMPANY_SIZE, SUBJECT_OPTIONS } from './utils/dropDownOptions';
import handleFormSubmit from './utils/handleFormSubmit';

const ContactPage = () => {
  const [captcha, setCaptcha] = useState<{
    firstNum: number | null;
    secondNum: number | null;
  }>({ firstNum: null, secondNum: null });

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof ContactFormInputs, string>>
  >({});

  const [isRotating, setIsRotating] = useState(false);
  const rotationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearError = (name: keyof ContactFormInputs) => {
    setFormErrors((prev) => {
      const { [name]: removed, ...rest } = prev;
      return rest;
    });
  };

  const refreshCaptcha = useCallback(() => {
    if (rotationTimerRef.current) {
      clearTimeout(rotationTimerRef.current);
    }

    setIsRotating(true);

    const { value1, value2 } = generateCaptcha();
    setCaptcha({ firstNum: value1, secondNum: value2 });

    rotationTimerRef.current = setTimeout(() => {
      setIsRotating(false);
    }, 200);
  }, []);

  useEffect(() => {
    refreshCaptcha();

    return () => {
      if (rotationTimerRef.current) {
        clearTimeout(rotationTimerRef.current);
      }
    };
  }, [refreshCaptcha]);

  const captchaError = formErrors['captcha-field-value'];

  return (
    <Container className='max-w-5xl w-full min-h-screen flex flex-col sm:flex-row sm:justify-between justify-center items-start pt-32 pb-16 gap-10 overflow-hidden'>
      <div className='w-full sm:w-1/2 relative flex flex-col items-center sm:items-start gap-4 p-6'>
        <h2 className='text-4xl md:text-5xl font-dm_sans font-bold text-center'>
          Got an Idea<span className='text-brand-orange'>?</span>&nbsp; Found an
          Issue<span className='text-brand-orange'>?</span>
          <br />
          {`Let's Connect`}
          <span className='text-brand-orange'>.</span>
        </h2>
        <p className='pt-3 text-base sm:text-lg text-center tracking-tight'>
          Our community is evolving. Get in touch with the team behind &nbsp;
          <span className='font-semibold'>Monkeys</span>&nbsp; and explore
          partnership, collaboration, or support opportunities.
        </p>

        <div className='absolute top-0 left-0 w-full h-full -z-10 opacity-80'>
          <BackgroundWaves />
        </div>
      </div>

      <form
        className='w-full sm:w-1/2 relative flex flex-col gap-6 p-6'
        onSubmit={(e) => {
          handleFormSubmit(e, refreshCaptcha, setFormErrors);
        }}
      >
        <div className='w-full flex flex-col sm:flex-row gap-4'>
          <InputField
            label='First name'
            name='first-name'
            placeholder='John'
            required
            error={formErrors['first-name']}
            onValueChange={() => clearError('first-name')}
          />
          <InputField
            label='Last name'
            name='last-name'
            placeholder='Doe'
            required
            error={formErrors['last-name']}
            onValueChange={() => clearError('last-name')}
          />
        </div>

        <InputField
          label='Email'
          name='email'
          placeholder='you@example.com'
          required
          error={formErrors['email']}
          onValueChange={() => clearError('email')}
        />

        <div className='w-full flex flex-col sm:flex-row gap-4'>
          <InputField
            label='Company size'
            name='company-size'
            error={formErrors['company-size']}
            onValueChange={() => clearError('company-size')}
          >
            <select
              className='px-4 h-10 text-sm rounded-md outline-none bg-foreground-light/40 dark:bg-foreground-dark/40 border-1 border-border-light/60 dark:border-border-dark/60 focus-visible:border-2 focus-visible:border-foreground-light dark:focus-visible:border-foreground-dark'
              defaultValue='Please select'
              name='company-size'
            >
              {COMPANY_SIZE.map((size, index) => (
                <option
                  className='bg-foreground-light dark:bg-foreground-dark'
                  key={index}
                  value={size?.value}
                >
                  {size?.value}
                </option>
              ))}
            </select>
          </InputField>
          <InputField
            label='Company name'
            name='company-name'
            placeholder='XYZ Corp'
            error={formErrors['company-name']}
            onValueChange={() => clearError('company-name')}
          />
        </div>

        <InputField
          label='Subject'
          name='subject'
          required
          error={formErrors['subject']}
          onValueChange={() => clearError('subject')}
        >
          <select
            className='px-4 h-10 text-sm rounded-md outline-none bg-foreground-light/40 dark:bg-foreground-dark/40 border-1 border-border-light/60 dark:border-border-dark/60 focus-visible:border-2 focus-visible:border-foreground-light dark:focus-visible:border-foreground-dark'
            defaultValue='Please select'
            name='subject'
          >
            <option
              className='bg-foreground-light dark:bg-foreground-dark'
              value=''
              disabled
              selected
            >
              Please select
            </option>
            {SUBJECT_OPTIONS.map((value, index) => (
              <option
                className='bg-foreground-light dark:bg-foreground-dark'
                key={index}
                value={value?.subject}
                aria-hidden='true'
              >
                {value?.subject}
              </option>
            ))}
          </select>
        </InputField>

        <InputField
          label='Your message'
          name='message'
          error={formErrors['message']}
          onValueChange={() => clearError('message')}
        >
          <textarea
            className='py-2 px-4 rounded-md text-sm min-h-[100px] outline-none bg-foreground-light/40 dark:bg-foreground-dark/40 border-1 border-border-light/60 dark:border-border-dark/60 focus-visible:border-2 focus-visible:border-foreground-light dark:focus-visible:border-foreground-dark'
            name='message'
            placeholder='Type your message here...'
          ></textarea>
        </InputField>

        <div className='w-full flex flex-col sm:flex-row items-end gap-8'>
          <div className='w-full flex gap-1'>
            <InputField
              className='max-w-max w-full'
              label={`Verify you're human`}
              name='captcha-field'
              value={
                captcha.firstNum !== null && captcha.secondNum !== null
                  ? `${captcha?.firstNum} + ${captcha?.secondNum} = ?`
                  : ''
              }
              required
              readOnly
            />

            <Button
              variant='default'
              type='button'
              className='h-10 mr-2 flex-shrink-0 self-end border border-border-light/60 dark:border-border-dark/60 rounded bg-foreground-light/40 dark:bg-foreground-dark/40'
              title='Refresh captcha'
              onClick={(e) => {
                e.stopPropagation();
                refreshCaptcha();
              }}
            >
              <Icon
                name='RiRestartLine'
                type='NIL'
                className={`w-5 h-5 text-text-light dark:text-text-dark ${isRotating ? 'animate-loader-rotate duration-200' : ''}`}
              />
            </Button>
          </div>

          <InputField
            className={`w-full flex-shrink self-end ${captchaError ? 'text-red-500 font-semibold' : ''}`}
            name='captcha-field-value'
            type='text'
            required
            placeholder='Answer'
            onValueChange={() => clearError('captcha-field-value')}
          />
        </div>

        <Button
          variant='brand'
          type='submit'
          className='group rounded hover:!bg-background-light dark:hover:!bg-background-dark'
        >
          <Icon
            name='RiSendPlane'
            type='Fill'
            className='mr-[6px] group-hover:animate-icon-shake opacity-90'
          />{' '}
          Send Message
        </Button>
      </form>
    </Container>
  );
};

export default ContactPage;
