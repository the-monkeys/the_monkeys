'use client';

import { VerificationPanel } from '@/features/verification/components/VerificationPanel';

import { Section } from './Section';

/**
 * Settings → Verification tab. Thin wrapper so the feature stays decoupled
 * from settings chrome and can be mounted elsewhere later if needed.
 */
export const Verification = () => {
  return (
    <div className='space-y-6'>
      <Section sectionTitle='Account verification'>
        <p className='text-sm opacity-70 -mt-2 mb-4 max-w-xl'>
          Get a verified badge on your profile. Documents are stored privately
          and are visible only to you and review admins.
        </p>
        <VerificationPanel />
      </Section>
    </div>
  );
};
