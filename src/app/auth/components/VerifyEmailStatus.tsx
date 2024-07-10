'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';

import { Loader } from '@/components/loader';
import { toast } from '@/components/ui/use-toast';
import { verifyEmailVerificationToken } from '@/services/auth/auth';

import SearchParamsComponent from './SearchParams';

const VerifyEmailStatus = () => {
  const [searchParams, setSearchParams] = useState<{
    username: string;
    evpw: string;
  }>({ username: '', evpw: '' });

  const updateSearchParams = useCallback(
    (params: { username: string; evpw: string }) => {
      setSearchParams(params);
    },
    []
  );

  useEffect(() => {
    if (searchParams.username && searchParams.evpw) {
      verifyEmailVerificationToken({
        user: searchParams.username,
        evpw: searchParams.evpw,
      })
        .then((res) => {
          toast({
            variant: 'success',
            title: 'Success',
            description: 'Email verification successful!',
          });
        })
        .catch((err) => {
          toast({
            variant: 'error',
            title: 'Error',
            description:
              err.message || 'An error occurred during verification.',
          });
        });
    }
  }, [searchParams]);

  return (
    <div className='flex flex-col items-center px-5 py-4'>
      <Suspense
        fallback={
          <div>
            <Loader />
          </div>
        }
      >
        <SearchParamsComponent setSearchParams={updateSearchParams} />
      </Suspense>
    </div>
  );
};

export default VerifyEmailStatus;
