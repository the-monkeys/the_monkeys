'use client';

import { FormEvent, useState } from 'react';

/**
 * Brand-orange newsletter signup card for the right rail. Form is wired
 * to a local handler. Replace `onSubscribe` with a real submission once
 * the subscription endpoint exists.
 */
export interface NewsletterCardProps {
  onSubscribe?: (email: string) => Promise<void> | void;
  eyebrow?: string;
  title?: string;
  description?: string;
  buttonLabel?: string;
}

export const NewsletterCard = ({
  onSubscribe,
  eyebrow,
  title = 'Insight delivered to your inbox every morning.',
  description = 'Join thousands of researchers and writers for the most relevant long-form analysis from the community.',
  buttonLabel = 'Join the Daily',
}: NewsletterCardProps) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'submitting' | 'done' | 'error' | 'unavailable'
  >('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Basic client-side validation. The server must re-validate.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      return;
    }
    if (!onSubscribe) {
      setStatus('unavailable');
      return;
    }
    try {
      setStatus('submitting');
      await onSubscribe(email);
      setStatus('done');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className='rounded-xl bg-brand-orange p-6 text-white shadow-sm'>
      {eyebrow ? (
        <p className='mb-2 font-inter text-[10px] font-bold uppercase tracking-[0.16em] text-white/90'>
          {eyebrow}
        </p>
      ) : null}
      <h2 className='font-newsreader font-bold text-2xl leading-tight'>
        {title}
      </h2>
      <p className='mt-3 text-sm font-inter text-white/90 leading-relaxed'>
        {description}
      </p>

      <form onSubmit={handleSubmit} className='mt-5 flex flex-col gap-3'>
        <label htmlFor='newsletter-email' className='sr-only'>
          Email address
        </label>
        <input
          id='newsletter-email'
          type='email'
          required
          autoComplete='email'
          maxLength={254}
          placeholder='email@address.com'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='h-10 rounded-md px-3 bg-white/15 placeholder:text-white/70 text-white font-inter text-sm border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/60'
        />
        <button
          type='submit'
          disabled={status === 'submitting'}
          className='h-10 rounded-md bg-white text-brand-orange font-inter font-bold text-[12px] uppercase tracking-[0.18em] hover:bg-white/90 transition-colors disabled:opacity-60'
        >
          {status === 'submitting' ? 'Joining...' : buttonLabel}
        </button>

        {status === 'done' ? (
          <p className='text-xs font-inter text-white/90'>
            Thanks. Check your inbox to confirm.
          </p>
        ) : null}
        {status === 'error' ? (
          <p className='text-xs font-inter text-white' role='alert'>
            Please enter a valid email address.
          </p>
        ) : null}
        {status === 'unavailable' ? (
          <p className='text-xs font-inter text-white' role='status'>
            Subscriptions are coming soon.
          </p>
        ) : null}
      </form>
    </section>
  );
};

export default NewsletterCard;
