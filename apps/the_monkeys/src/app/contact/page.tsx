'use client';

import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import useAuth from '@/hooks/auth/useAuth';
import { ContactFormInputs } from '@/lib/schema/contact';
import { Button } from '@the-monkeys/ui/atoms/button';

import InputField from './components/InputField';
import StaticText from './components/StaticText';
import { generateCaptcha } from './utils/captcha';
import { COMPANY_SIZE, SUBJECT_OPTIONS } from './utils/dropDownOptions';
import handleFormSubmit from './utils/handleFormSubmit';

type FormErrorState = Partial<Record<keyof ContactFormInputs, string>>;
type InputElement = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

const ContactPage = () => {
  const { data } = useAuth();

  const [captcha, setCaptcha] = useState<{
    firstNum: number | null;
    secondNum: number | null;
  }>({ firstNum: null, secondNum: null });

  const [formErrors, setFormErrors] = useState<FormErrorState>({});

  const [formData, setFormData] = useState<ContactFormInputs>(() => ({
    'first-name': data?.first_name ?? '',
    'last-name': data?.last_name ?? '',
    email: data?.email ?? '',
    'company-size': '',
    'company-name': '',
    subject: '',
    message: '',
    'captcha-field-value': '',
    'captcha-field': '',
  }));

  const [isRotating, setIsRotating] = useState(false);
  const rotationTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = useCallback((e: InputElement) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof ContactFormInputs]: value,
    }));
  }, []);

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

  const clearError = (name: keyof ContactFormInputs) => {
    setFormErrors((prev) => {
      const { [name]: removed, ...rest } = prev;
      return rest;
    });
  };

  const captchaError = formErrors['captcha-field-value'];

  return (
    <Container className='max-w-5xl w-full min-h-screen flex flex-col md:flex-row md:justify-between justify-center items-start pt-32 pb-16 gap-10 overflow-hidden'>
      <StaticText />

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
            value={formData['first-name']}
            onValueChange={() => clearError('first-name')}
            onChange={handleInputChange}
          />
          <InputField
            label='Last name'
            name='last-name'
            placeholder='Doe'
            required
            error={formErrors['last-name']}
            value={formData['last-name']}
            onValueChange={() => clearError('last-name')}
            onChange={handleInputChange}
          />
        </div>

        <InputField
          label='Email'
          name='email'
          placeholder='you@example.com'
          required
          error={formErrors['email']}
          value={formData['email']}
          onValueChange={() => clearError('email')}
          onChange={handleInputChange}
        />

        <div className='w-full flex flex-col sm:flex-row gap-4'>
          <InputField
            label='Company size'
            name='company-size'
            error={formErrors['company-size']}
            value={formData['company-size']}
            onValueChange={() => clearError('company-size')}
            onChange={handleInputChange}
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
            value={formData['company-name']}
            onValueChange={() => clearError('company-name')}
            onChange={handleInputChange}
          />
        </div>

        <InputField
          label='Subject'
          name='subject'
          required
          error={formErrors['subject']}
          value={formData['subject']}
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
          value={formData['message']}
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
              className='w-full'
              label={`Verify you're human`}
              name='captcha-field'
              value={
                captcha.firstNum !== null && captcha.secondNum !== null
                  ? `${captcha?.firstNum} + ${captcha?.secondNum} = ?`
                  : formData['captcha-field']
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
            value={formData['captcha-field-value']}
            onValueChange={() => clearError('captcha-field-value')}
            onChange={handleInputChange}
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
