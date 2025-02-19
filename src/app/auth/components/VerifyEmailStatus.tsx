'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';

import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { verifyEmailVerificationToken } from '@/services/auth/auth';

import { SearchParamsComponent } from './SearchParams';

export const VerifyEmailStatus = () => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

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
    if (searchParams.username !== '' && searchParams.evpw !== '') {
      setLoading(true);

      verifyEmailVerificationToken({
        user: searchParams.username,
        evpw: searchParams.evpw,
      })
        .then(() => {
          toast({
            variant: 'success',
            title: 'Success',
            description: 'Email verification successful!',
          });

          setIsSuccess(true);
        })
        .catch((err) => {
          toast({
            variant: 'error',
            title: 'Error',
            description:
              err.message || 'An error occurred during verification.',
          });

          setIsError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [searchParams]);

  return (
    <div className='flex flex-col items-center px-4 py-5'>
      <Suspense
        fallback={
          <div>
            <Loader />
          </div>
        }
      >
        <SearchParamsComponent setSearchParams={updateSearchParams} />
      </Suspense>

      {loading && <Loader size={32} />}

      {(isSuccess || isError) && (
        <Alert
          variant={isSuccess ? 'constructive' : 'destructive'}
          className='w-full sm:w-1/2'
        >
          <Icon name='RiErrorWarning' />
          <AlertTitle>
            {isSuccess && 'Success'}
            {isError && 'Failed'}
          </AlertTitle>
          <AlertDescription className='text-base'>
            {isError && 'An error occurred during verification.'}
            {isSuccess &&
              'Email verification successful. You can now continue using our services without any interruptions.'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
