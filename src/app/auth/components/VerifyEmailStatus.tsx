'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';

import { updateAuthCookie } from '@/app/action';
import Icon from '@/components/icon';
import { Loader } from '@/components/loader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { useSession } from '@/lib/store/useSession';
import { verifyEmailVerificationToken } from '@/services/auth/auth';

import { SearchParamsComponent } from './SearchParams';

export const VerifyEmailStatus = () => {
  const { data: session } = useSession();

  const [searchParams, setSearchParams] = useState<{
    username: string;
    evpw: string;
  }>({ username: '', evpw: '' });
  const [verificationStatus, setVerificationStatus] = useState<{
    loading: boolean;
    status: boolean;
    message: string;
  }>({
    loading: true,
    status: false,
    message: '',
  });

  const updateSearchParams = useCallback(
    (params: { username: string; evpw: string }) => {
      setSearchParams(params);
    },
    []
  );

  const updateUserSession = async () => {
    await updateAuthCookie({
      ...session.user,
      email_verification_status: 'Verified',
    });
  };

  useEffect(() => {
    if (searchParams.username !== '' && searchParams.evpw !== '') {
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

          setVerificationStatus({
            loading: false,
            status: true,
            message:
              'Email verification successful. You can now continue using our services without any interruptions.',
          });

          updateUserSession();
        })
        .catch((err) => {
          toast({
            variant: 'error',
            title: 'Error',
            description:
              err.message || 'An error occurred during verification.',
          });

          setVerificationStatus({
            loading: false,
            status: false,
            message: 'Email verification failed. Please try again.',
          });
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

      {verificationStatus.loading ? (
        <Loader size={32} />
      ) : (
        <Alert
          variant={verificationStatus.status ? 'constructive' : 'destructive'}
          className='w-full sm:w-1/2'
        >
          <Icon name='RiErrorWarning' />
          <AlertTitle>
            {verificationStatus.status ? 'Success' : 'Error'}
          </AlertTitle>
          <AlertDescription className='text-base'>
            {verificationStatus.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
