'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import useAuth from '@/hooks/auth/useAuth';

import { Section } from './Section';
import { Email } from './account/Email';
import { Password } from './account/Password';
import { Username } from './account/Username';
import { Visibility } from './account/Visibility';

export const Account = () => {
  const { data: session, isError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isError) router.replace('/feed');
  }, [isError]);

  return (
    <>
      {session && (
        <div className='space-y-8'>
          <Section sectionTitle='Change Username'>
            <Username data={session} />
          </Section>

          <Section sectionTitle='Update Password'>
            <Password data={session} />
          </Section>

          <Section sectionTitle='Manage Email'>
            <Email data={session} />
          </Section>

          <Section sectionTitle='Change Visibility'>
            <Visibility />
          </Section>
        </div>
      )}
    </>
  );
};
