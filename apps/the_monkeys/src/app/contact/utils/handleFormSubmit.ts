import { FormEvent, Dispatch, SetStateAction } from 'react';
import { ZodError} from 'zod';

import { contactFormSchema, ContactFormInputs } from '@/lib/schema/contact';

type FormErrorState = Partial<Record<keyof ContactFormInputs, string>>;

const handleFormSubmit = async (
  e: FormEvent<HTMLFormElement>,
  refreshCaptcha: () => void,
  setFormErrors: Dispatch<SetStateAction<FormErrorState>>
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

    if(userAnswer !== expectedAnswer) {
      setFormErrors({
        'captcha-field-value': 'Incorrect answer'
      });
      refreshCaptcha();
      return;
    }

    console.log('✅ Captcha Succeeded. Ready to submit to API:', validData);
    // TODO: API call to backend to send form data

    alert('Message sent successfully!');
    refreshCaptcha();
    e.currentTarget.reset();

  } catch (error) {
    if(error instanceof ZodError) {
      const fieldErrors = error.formErrors.fieldErrors;

      const newErrors: FormErrorState = {};
      Object.entries(fieldErrors).forEach( ([field, messages]) => {
        newErrors[field as keyof ContactFormInputs] = messages?.[0];
      });
      setFormErrors(newErrors);
      refreshCaptcha();

    }else {
      console.error('Submission failed:', error);
      alert('An unexpected error occurred during form submission.');
      refreshCaptcha();
    }
  }
};

export default handleFormSubmit;
