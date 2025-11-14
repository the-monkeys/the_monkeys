import { FormEvent } from 'react';

const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const firstName = formData.get('first-name');
  const lastName = formData.get('last-name');
  const email = formData.get('email');
  const companySize = formData.get('company-size');
  const companyName = formData.get('company-name');
  const subject = formData.get('subject');
  const message = formData.get('message');
  const captchaField = formData.set('captcha-field', '5 + 3');
  const captchaFieldValue = formData.get('captcha-field-value');

  console.log(
    firstName,
    lastName,
    email,
    companySize,
    companyName,
    subject,
    message,
    captchaField,
    captchaFieldValue
  );
};

export default handleFormSubmit;
