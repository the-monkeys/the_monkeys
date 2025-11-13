'use client';

import { BackgroundWaves } from '@/components/branding/BackgroundWaves';
import Container from '@/components/layout/Container';
import { Button } from '@the-monkeys/ui/atoms/button';

import InputField from './components/InputField';
import { COMPANY_SIZE, SUBJECT_OPTIONS } from './utils/dropDownOptions';

const ContactPage = () => {
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
        onSubmit={(e) => {}}
      >
        <div className='w-full flex flex-col sm:flex-row gap-4'>
          <InputField
            label='First name'
            name='first-name'
            placeholder='John'
            required
          />
          <InputField
            label='Last name'
            name='last-name'
            placeholder='Doe'
            required
          />
        </div>

        <InputField
          label='Email'
          name='email'
          type='email'
          placeholder='you@example.com'
          required
        />

        <div className='w-full flex flex-col sm:flex-row gap-4'>
          <InputField label='Company size' name='company-size'>
            <select
              className='px-4 h-10 text-sm rounded-md outline-none bg-foreground-light/40 dark:bg-foreground-dark/40 border-1 border-border-light/60 dark:border-border-dark/60 focus-visible:border-2 focus-visible:border-foreground-light dark:focus-visible:border-foreground-dark'
              defaultValue='Please select'
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
          />
        </div>

        <InputField label='Subject' name='subject' required>
          <select className='px-4 h-10 text-sm rounded-md outline-none bg-foreground-light/40 dark:bg-foreground-dark/40 border-1 border-border-light/60 dark:border-border-dark/60 focus-visible:border-2 focus-visible:border-foreground-light dark:focus-visible:border-foreground-dark'>
            {SUBJECT_OPTIONS.map((value, index) => (
              <option
                className='bg-foreground-light dark:bg-foreground-dark'
                key={index}
              >
                {value?.subject}
              </option>
            ))}
          </select>
        </InputField>

        <InputField label='Your message' name='message'>
          <textarea
            className='py-2 px-4 rounded-md text-sm min-h-[100px] outline-none bg-foreground-light/40 dark:bg-foreground-dark/40 border-1 border-border-light/60 dark:border-border-dark/60 focus-visible:border-2 focus-visible:border-foreground-light dark:focus-visible:border-foreground-dark'
            name='message'
            placeholder='Type your message here...'
          ></textarea>
        </InputField>

        <Button
          variant='brand'
          type='submit'
          className='group rounded hover:!bg-background-light dark:hover:!bg-background-dark'
        >
          Send Message
        </Button>
      </form>
    </Container>
  );
};

export default ContactPage;
