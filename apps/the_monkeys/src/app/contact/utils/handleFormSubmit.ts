import { Dispatch, FormEvent, SetStateAction } from 'react';

import { ContactFormInputs, contactFormSchema } from '@/lib/schema/contact';
import { toast } from '@the-monkeys/ui/hooks/use-toast.js';
import { ZodError } from 'zod';

type FormErrorState = Partial<Record<keyof ContactFormInputs, string>>;

const handleFormSubmit = async (
  e: FormEvent<HTMLFormElement>,
  refreshCaptcha: () => void,
  setFormErrors: Dispatch<SetStateAction<FormErrorState>>,
  setFormData: Dispatch<SetStateAction<ContactFormInputs>>,
  userData?: { first_name?: string; last_name?: string; email?: string }
) => {
  e.preventDefault();
  setFormErrors({});

  const formData = new FormData(e.currentTarget);
  const data = Object.fromEntries(formData);

  try {
    const validData: ContactFormInputs = contactFormSchema.parse(data);

    // Captcha validation
    const captchaEquation = validData['captcha-field'];
    const userAnswer = parseInt(validData['captcha-field-value']);

    const [num1Str, , num2Str] = captchaEquation.split(' ');
    const expectedAnswer = parseInt(num1Str) + parseInt(num2Str);

    if (userAnswer !== expectedAnswer) {
      setFormErrors({
        'captcha-field-value': 'Incorrect answer',
      });
      toast({
        variant: 'destructive',
        title: 'Captcha verification failed.',
        description: 'Please try again.',
      });

      setFormData((prev) => ({
        ...prev,
        'captcha-field-value': '',
      }));

      refreshCaptcha();
      return;
    }

    // TODO: API call to backend to send form data

    toast({
      variant: 'success',
      title: 'Message sent successfully.',
      description: "We'll get back to you soon.",
    });

    setFormData({
      'first-name': userData?.first_name ?? '',
      'last-name': userData?.last_name ?? '',
      email: userData?.email ?? '',
      'company-size': '',
      'company-name': '',
      subject: '',
      message: '',
      'captcha-field-value': '',
      'captcha-field': '',
    });

    refreshCaptcha();
    e.currentTarget.reset();
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors = error.formErrors.fieldErrors;

      const newErrors: FormErrorState = {};
      Object.entries(fieldErrors).forEach(([field, messages]) => {
        newErrors[field as keyof ContactFormInputs] = messages?.[0];
      });
      setFormErrors(newErrors);
      refreshCaptcha();
    } else {
      console.error('Submission failed:', error);
      toast({
        variant: 'destructive',
        title: 'An unexpected error occurred.',
        description: 'Please try again later.',
      });
      refreshCaptcha();
    }
  }
};

export default handleFormSubmit;
