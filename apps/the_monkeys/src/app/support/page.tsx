import { Metadata } from 'next';
import Link from 'next/link';

import Icon from '@/components/icon';
import Container from '@/components/layout/Container';
import { Button } from '@the-monkeys/ui/atoms/button';

export const metadata: Metadata = {
  title: 'Support Monkeys | Fund our Research & Partner With Us',
  description:
    'Help us invest in open-source research, AI, and engineering education. Partner with Monkeys for software-as-a-service builds, training programs, and tech consulting.',
  alternates: {
    canonical: '/support',
  },
};

const PITCH_ITEMS: Array<{
  icon: 'RiShakeHands' | 'RiCodeSSlash' | 'RiBookShelf' | 'RiLightbulb';
  title: string;
  body: string;
}> = [
  {
    icon: 'RiShakeHands',
    title: 'Software as a service for partner companies',
    body: 'We are looking for business partners. Our engineers ship production software for partner companies, and the revenue funds the servers, datacenters, and research that keep Monkeys independent.',
  },
  {
    icon: 'RiCodeSSlash',
    title: 'Open-source & AI research',
    body: 'We are actively investing in tech research: open-source tooling, distributed systems, and applied AI. Funding goes directly to infrastructure and to the engineers doing the work.',
  },
  {
    icon: 'RiBookShelf',
    title: 'Training the next generation',
    body: 'We teach and mentor students on cutting-edge tech: software orchestration, distributed system design, and the production patterns that real platforms run on.',
  },
  {
    icon: 'RiLightbulb',
    title: 'Technology consulting',
    body: 'We provide architectural and engineering consultations, from microservices design to platform reliability and AI integration strategy.',
  },
];

const SUPPORT_EMAIL = 'monkeys.admin@monkeys.com.co';

const SupportPage = () => {
  return (
    <Container className='py-12 sm:py-16'>
      <div className='mx-auto max-w-3xl'>
        <p className='font-inter text-xs font-extrabold uppercase tracking-[0.22em] text-brand-orange'>
          Spotlight
        </p>

        <h1 className='mt-3 font-newsreader text-3xl sm:text-5xl font-bold leading-tight text-gray-900 dark:text-gray-50'>
          Help us invest in tech research, education, and independent
          engineering.
        </h1>

        <p className='mt-5 font-inter text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-300'>
          Monkeys is a research-first writing platform built by working
          engineers. We are inviting partners and supporters to help us keep the
          lights on and push the work forward through funding, business
          partnerships, training engagements, or consulting work.
        </p>

        <div className='mt-10 grid gap-6 sm:grid-cols-2'>
          {PITCH_ITEMS.map((item) => (
            <div
              key={item.title}
              className='rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5'
            >
              <div className='flex items-center gap-2'>
                <span className='inline-flex h-9 w-9 items-center justify-center rounded-md bg-brand-orange/10 text-brand-orange'>
                  <Icon name={item.icon} size={20} />
                </span>
                <h2 className='font-newsreader text-lg font-semibold text-gray-900 dark:text-gray-50'>
                  {item.title}
                </h2>
              </div>
              <p className='mt-3 font-inter text-sm leading-relaxed text-gray-600 dark:text-gray-400'>
                {item.body}
              </p>
            </div>
          ))}
        </div>

        <div className='mt-12 rounded-lg border border-brand-orange/30 bg-brand-orange/5 p-6 sm:p-8'>
          <h3 className='font-newsreader text-2xl font-bold text-gray-900 dark:text-gray-50'>
            Want to fund us or do business with us?
          </h3>
          <p className='mt-3 font-inter text-base text-gray-700 dark:text-gray-300'>
            Reach out, we read every message. Tell us what you have in mind:
            sponsorship, a build, a training cohort, or a consulting engagement.
          </p>

          <div className='mt-6 flex flex-col sm:flex-row sm:items-center gap-3'>
            {/*
              `mailto:` opens the user's default mail client. We render an
              <a> directly so the protocol isn't run through Next's <Link>
              prefetcher.
            */}
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=Partner%20with%20Monkeys`}
              className='inline-flex'
            >
              <Button className='bg-brand-orange hover:bg-brand-orange/90 text-white inline-flex items-center gap-2'>
                <Icon name='RiMail' size={18} />
                Email {SUPPORT_EMAIL}
              </Button>
            </a>

            <Link
              href='/about'
              className='font-inter text-sm font-semibold text-brand-orange hover:underline inline-flex items-center gap-1'
            >
              Learn more about Monkeys
              <Icon name='RiArrowRight' size={16} />
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default SupportPage;
