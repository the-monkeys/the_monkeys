'use client';

import { VerificationPanel } from '@/features/verification/components/VerificationPanel';

import { Section } from './Section';

/**
 * Settings → Verification tab. Thin wrapper so the feature stays decoupled
 * from settings chrome and can be mounted elsewhere later if needed.
 */
export const Verification = () => {
  return (
    <div className='min-w-0 font-dm_sans'>
      <Section sectionTitle='Account verification'>
        <p className='mb-5 max-w-xl text-sm leading-relaxed opacity-80'>
          Help people recognise you with a verified badge on your profile.
          Review your request and manage your verification here.
        </p>
        <VerificationPanel />
      </Section>
    </div>
  );
};
