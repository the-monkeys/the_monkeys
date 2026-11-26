'use client';

import { useRef, useState } from 'react';

import dynamic from 'next/dynamic';
import Link from 'next/link';

import { Loader } from '@/components/loader';
import { VerifiedBadge } from '@/components/user/VerifiedBadge';
import { parseEventTime } from '@/lib/eventTime';
import { verificationErrorMessage } from '@/services/verification/verificationApi';
import type {
  DocKind,
  VerificationStatus,
} from '@/services/verification/verificationTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiEyeLine, RiShieldCheckLine } from '@remixicon/react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@the-monkeys/ui/atoms/alert';
import { Badge } from '@the-monkeys/ui/atoms/badge';
import { Button } from '@the-monkeys/ui/atoms/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@the-monkeys/ui/atoms/dialog';
import { Label } from '@the-monkeys/ui/atoms/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@the-monkeys/ui/atoms/select';
import { toast } from '@the-monkeys/ui/hooks/use-toast';
import { useForm } from 'react-hook-form';

import {
  COUNTRY_CODES,
  DOC_KIND_LABELS,
  ID_DOCUMENT_TYPE_LABELS,
  MAX_ADDITIONAL_INFO,
  allowedDocTypes,
  countryLabel,
} from '../constants';
import { useMyVerification } from '../hooks/useMyVerification';
import { type VerificationFormValues, verificationSchema } from '../schema';
import { DocumentTile } from './DocumentTile';

// Private URLs are requested only after the owner explicitly opens the viewer.
const DocumentPreview = dynamic(
  () => import('./DocumentPreview').then((m) => m.DocumentPreview),
  { ssr: false }
);

const STATUS_META: Record<
  VerificationStatus,
  { title: string; label: string; description: string }
> = {
  pending: {
    title: 'Request received',
    label: 'Pending review',
    description:
      'Your request is waiting for review. You can check its progress here, or cancel it before the review starts.',
  },
  under_review: {
    title: 'Review in progress',
    label: 'Under review',
    description:
      'A reviewer is checking your request. No further action is needed right now. Return here to see the decision.',
  },
  approved: {
    title: "You're verified",
    label: 'Verified',
    description:
      'Your account now has a verified badge, helping people recognise your profile across Monkeys.',
  },
  rejected: {
    title: 'Your request needs an update',
    label: 'Changes needed',
    description:
      'We could not verify your account from this request. Review the feedback below, update your details and submit again.',
  },
};

export const VerificationPanel = () => {
  const state = useMyVerification();
  return (
    <VerificationPanelContent
      key={state.accountIdentity ?? 'anonymous'}
      state={state}
    />
  );
};

// Changing accounts unmounts every private form value and upload callback target.
const VerificationPanelContent = ({
  state,
}: {
  state: ReturnType<typeof useMyVerification>;
}) => {
  const {
    request,
    none,
    isLoading,
    isError,
    refetch,
    uploadDoc,
    submit,
    cancel,
  } = state;
  const [showForm, setShowForm] = useState(false);
  const [progress, setProgress] = useState<Partial<Record<DocKind, number>>>(
    {}
  );
  const [tileErrors, setTileErrors] = useState<
    Partial<Record<DocKind, string>>
  >({});
  const [previewKind, setPreviewKind] = useState<DocKind>();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelError, setCancelError] = useState<string>();
  // Serialize uploads so mutation callbacks cannot be lost to another tile's upload.
  const uploadActive = useRef(false);
  const cancelActive = useRef(false);

  const { register, watch, setValue, handleSubmit, reset, formState } =
    useForm<VerificationFormValues>({
      resolver: zodResolver(verificationSchema),
      defaultValues: { verification_type: 'id_document', docs: {} },
    });
  const values = watch();
  const status = request?.status;
  const uploading =
    uploadDoc.isPending ||
    Object.values(progress).some((pct) => pct !== undefined);
  const busy = uploading || submit.isPending;
  const formVisible = (!request && none) || (status === 'rejected' && showForm);
  const docTypes = allowedDocTypes(values.country);

  const handleFile = (kind: DocKind, file: File) => {
    if (uploadActive.current || submit.isPending) return;
    uploadActive.current = true;
    // A replacement must succeed before its document reference can be submitted.
    setValue(`docs.${kind}`, undefined, { shouldDirty: true });
    setTileErrors((previous) => ({ ...previous, [kind]: undefined }));
    setProgress((previous) => ({ ...previous, [kind]: 0 }));
    uploadDoc.mutate(
      {
        kind,
        file,
        onProgress: (pct) =>
          setProgress((previous) => ({ ...previous, [kind]: pct })),
      },
      {
        onSuccess: (result) => {
          uploadActive.current = false;
          setProgress((previous) => ({ ...previous, [kind]: undefined }));
          setValue(
            `docs.${kind}`,
            { checksum: result.checksum },
            { shouldValidate: true, shouldDirty: true }
          );
        },
        onError: (error) => {
          uploadActive.current = false;
          setProgress((previous) => ({ ...previous, [kind]: undefined }));
          setTileErrors((previous) => ({
            ...previous,
            [kind]: verificationErrorMessage(error),
          }));
        },
      }
    );
  };

  const onSubmit = handleSubmit((values) => {
    if (uploadActive.current || busy) return;
    submit.mutate(
      {
        verification_type: 'id_document',
        additional_info: values.additional_info || undefined,
        country: values.country,
        id_document_type: values.id_document_type,
        selfie_checksum: values.docs.selfie?.checksum,
        id_front_checksum: values.docs.id_front?.checksum,
        id_back_checksum: values.docs.id_back?.checksum,
      },
      {
        onSuccess: () => {
          setShowForm(false);
          toast({
            title: 'Request submitted',
            description: 'You can check the review status here.',
          });
        },
        onError: (error) =>
          toast({
            title: 'Could not submit',
            description: verificationErrorMessage(error),
            variant: 'destructive',
          }),
      }
    );
  });

  if (isLoading) {
    return (
      <div
        role='status'
        aria-label='Loading verification status'
        className='flex items-center gap-3 rounded-xl border-1 border-border-light p-5 dark:border-border-dark'
      >
        <Loader size={24} />
        <p className='text-sm'>Loading verification status…</p>
      </div>
    );
  }

  if (isError || (!formVisible && (!status || !STATUS_META[status]))) {
    return (
      <Alert className='rounded-xl'>
        <AlertTitle>We couldn&apos;t load your verification status</AlertTitle>
        <AlertDescription className='flex flex-col items-start gap-4 text-sm'>
          <p>
            Your request may still be active. Try again to see its current
            status.
          </p>
          <Button
            type='button'
            variant='outline'
            onClick={() => void refetch()}
          >
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!formVisible && status && request) {
    const meta = STATUS_META[status];
    const createdAt = parseEventTime(request.created_at);
    const submittedDate =
      createdAt && !Number.isNaN(createdAt.getTime())
        ? createdAt.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : undefined;
    return (
      <section
        aria-labelledby='verification-status-title'
        className='flex flex-col gap-5 rounded-xl border-1 border-border-light bg-foreground-light/20 p-5 dark:border-border-dark dark:bg-foreground-dark/20 sm:p-6'
      >
        <div className='flex flex-wrap items-center gap-2'>
          {status === 'approved' && <VerifiedBadge isVerified />}
          <Badge
            variant={
              status === 'rejected'
                ? 'destructive'
                : status === 'approved'
                  ? 'brand'
                  : 'default'
            }
          >
            {meta.label}
          </Badge>
        </div>
        <div className='flex flex-col gap-2'>
          <h2
            id='verification-status-title'
            className='font-dm_sans text-xl font-medium sm:text-2xl'
          >
            {meta.title}
          </h2>
          <p className='max-w-xl text-sm leading-relaxed opacity-80'>
            {meta.description}
          </p>
        </div>
        <dl className='grid gap-4 border-t-1 border-border-light pt-4 text-sm dark:border-border-dark sm:grid-cols-2'>
          <div className='flex flex-col gap-1'>
            <dt className='opacity-70'>Verification method</dt>
            <dd className='font-medium'>
              {request.verification_type === 'id_document'
                ? 'Government ID'
                : request.verification_type === 'social_proof'
                  ? 'Social proof (previous request)'
                  : 'Previous verification method'}
            </dd>
          </div>
          <div className='flex flex-col gap-1'>
            <dt className='opacity-70'>Submitted</dt>
            <dd className='font-medium'>
              {submittedDate ?? 'Date unavailable'}
            </dd>
          </div>
          {request.country && (
            <div className='flex flex-col gap-1'>
              <dt className='opacity-70'>Issuing country / territory</dt>
              <dd className='font-medium'>{countryLabel(request.country)}</dd>
            </div>
          )}
        </dl>
        {status === 'rejected' && request.rejection_reason && (
          <Alert className='rounded-xl'>
            <AlertTitle>Reviewer note</AlertTitle>
            <AlertDescription className='whitespace-pre-wrap break-words text-sm'>
              {request.rejection_reason}
            </AlertDescription>
          </Alert>
        )}
        {status === 'approved' && (
          <div className='flex flex-col items-start gap-3'>
            <p className='text-sm opacity-80'>
              Your documents stay private. Only you and authorised reviewers can
              access them.
            </p>
            <Button asChild variant='outline'>
              <Link href={`/${encodeURIComponent(request.username)}`}>
                View profile
              </Link>
            </Button>
          </div>
        )}
        {status === 'pending' && (
          <Dialog
            open={cancelOpen}
            onOpenChange={(open) => {
              setCancelOpen(open);
              if (open) setCancelError(undefined);
            }}
          >
            <DialogTrigger asChild>
              <Button type='button' variant='outline' className='self-start'>
                Cancel request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel verification request?</DialogTitle>
                <DialogDescription>
                  This withdraws your pending request. You can submit a new
                  request when you are ready.
                </DialogDescription>
              </DialogHeader>
              {cancelError && (
                <Alert variant='destructive'>
                  <AlertDescription>{cancelError}</AlertDescription>
                </Alert>
              )}
              <DialogFooter className='gap-2 sm:space-x-0'>
                <Button
                  type='button'
                  variant='outline'
                  disabled={cancel.isPending}
                  onClick={() => setCancelOpen(false)}
                >
                  Keep request
                </Button>
                <Button
                  type='button'
                  variant='destructive'
                  disabled={cancel.isPending}
                  onClick={() => {
                    if (cancelActive.current) return;
                    cancelActive.current = true;
                    cancel.mutate(request.id, {
                      onSuccess: () => {
                        cancelActive.current = false;
                        setCancelOpen(false);
                        submit.reset();
                        reset();
                      },
                      onError: (error) => {
                        cancelActive.current = false;
                        setCancelError(verificationErrorMessage(error));
                      },
                    });
                  }}
                >
                  {cancel.isPending ? 'Cancelling…' : 'Cancel request'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        {status === 'rejected' && (
          <Button
            type='button'
            variant='brand'
            className='self-start'
            onClick={() => {
              submit.reset();
              reset({
                verification_type: 'id_document',
                country:
                  request.country && COUNTRY_CODES.includes(request.country)
                    ? request.country
                    : '',
                id_document_type: docTypes.find(
                  (type) => type === request.id_document_type
                ),
                docs: {
                  selfie: request.selfie_checksum
                    ? { checksum: request.selfie_checksum }
                    : undefined,
                  id_front: request.id_front_checksum
                    ? { checksum: request.id_front_checksum }
                    : undefined,
                  id_back: request.id_back_checksum
                    ? { checksum: request.id_back_checksum }
                    : undefined,
                },
                additional_info: request.additional_info ?? '',
              });
              setTileErrors({});
              setShowForm(true);
            }}
          >
            Update and resubmit
          </Button>
        )}
      </section>
    );
  }

  return (
    <form onSubmit={onSubmit} className='flex min-w-0 flex-col gap-5'>
      <section
        aria-labelledby='verification-method-title'
        className='flex flex-col gap-5 rounded-xl border-1 border-border-light p-4 dark:border-border-dark sm:p-6'
      >
        <div className='flex flex-col gap-2'>
          <h2
            id='verification-method-title'
            className='font-dm_sans text-lg font-medium'
          >
            Verify with a government ID
          </h2>
          <p className='text-sm leading-relaxed opacity-80'>
            Use a government-issued ID from any country or territory. Upload a
            clear front image and a selfie holding the same ID.
          </p>
        </div>
        {request?.country === 'OT' && (
          <p className='text-sm opacity-80'>
            Your previous request did not specify a country. Choose the country
            or territory that issued your ID to continue.
          </p>
        )}
        <div className='grid gap-5 sm:grid-cols-2'>
          <div className='flex min-w-0 flex-col gap-2'>
            <Label htmlFor='ver-country'>Issuing country / territory</Label>
            <Select
              value={values.country || ''}
              disabled={busy}
              onValueChange={(country) =>
                setValue('country', country, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger
                id='ver-country'
                className='h-auto min-h-10 w-full text-left [&>span]:truncate'
                aria-invalid={!!formState.errors.country}
                aria-describedby={
                  formState.errors.country ? 'ver-country-error' : undefined
                }
              >
                <SelectValue placeholder='Choose a country or territory' />
              </SelectTrigger>
              <SelectContent side='bottom' className='max-h-60'>
                {COUNTRY_CODES.map((code) => (
                  <SelectItem key={code} value={code}>
                    {countryLabel(code)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formState.errors.country && (
              <p
                role='alert'
                id='ver-country-error'
                className='text-sm text-alert-red'
              >
                {formState.errors.country.message}
              </p>
            )}
          </div>
          <div className='flex min-w-0 flex-col gap-2'>
            <Label htmlFor='ver-doctype'>Document type</Label>
            <Select
              value={values.id_document_type || ''}
              disabled={busy}
              onValueChange={(type) =>
                setValue(
                  'id_document_type',
                  type as VerificationFormValues['id_document_type'],
                  { shouldValidate: true, shouldDirty: true }
                )
              }
            >
              <SelectTrigger
                id='ver-doctype'
                className='h-auto min-h-10 w-full text-left [&>span]:truncate'
                aria-invalid={!!formState.errors.id_document_type}
                aria-describedby={
                  formState.errors.id_document_type
                    ? 'ver-doctype-error'
                    : undefined
                }
              >
                <SelectValue placeholder='Choose a document type' />
              </SelectTrigger>
              <SelectContent side='bottom' className='max-h-60'>
                {docTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {ID_DOCUMENT_TYPE_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formState.errors.id_document_type && (
              <p
                role='alert'
                id='ver-doctype-error'
                className='text-sm text-alert-red'
              >
                {formState.errors.id_document_type.message}
              </p>
            )}
          </div>
        </div>
      </section>

      <section
        aria-labelledby='verification-documents-title'
        className='flex flex-col gap-4 rounded-xl border-1 border-border-light p-4 dark:border-border-dark sm:p-6'
      >
        <div className='flex flex-col gap-2'>
          <h3
            id='verification-documents-title'
            className='font-dm_sans text-lg font-medium'
          >
            Your documents
          </h3>
          <p className='text-sm leading-relaxed opacity-80'>
            JPEG, PNG or WebP, up to 10 MB per image. Use your camera or upload
            a file. The back of your ID is optional.
          </p>
        </div>
        <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
          {(['selfie', 'id_front', 'id_back'] as const).map((kind) => (
            <div key={kind} className='flex min-w-0 flex-col gap-2'>
              <DocumentTile
                kind={kind}
                label={DOC_KIND_LABELS[kind]}
                doc={values.docs[kind]}
                progress={progress[kind]}
                error={
                  tileErrors[kind] || formState.errors.docs?.[kind]?.message
                }
                disabled={busy}
                onFile={handleFile}
                onInvalidFile={(kind, message) => {
                  setValue(`docs.${kind}`, undefined, { shouldDirty: true });
                  setTileErrors((previous) => ({
                    ...previous,
                    [kind]: message,
                  }));
                }}
              />
              {request?.[`${kind}_checksum`] && (
                <Button
                  type='button'
                  variant='link'
                  size='sm'
                  className='h-auto whitespace-normal px-0 text-left'
                  onClick={() => setPreviewKind(kind)}
                >
                  <RiEyeLine size={16} className='mr-1 shrink-0' aria-hidden />
                  View previously submitted{' '}
                  {kind === 'selfie'
                    ? 'selfie'
                    : kind === 'id_front'
                      ? 'front'
                      : 'back'}
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className='flex flex-col gap-2'>
        <Label htmlFor='ver-info'>
          Anything reviewers should know (optional)
        </Label>
        <textarea
          id='ver-info'
          rows={3}
          maxLength={MAX_ADDITIONAL_INFO}
          disabled={busy}
          {...register('additional_info')}
          aria-invalid={!!formState.errors.additional_info}
          aria-describedby='ver-info-help'
          className='w-full resize-y rounded-xl border-1 border-border-light bg-transparent p-3 text-base leading-relaxed focus-visible:outline-brand-orange dark:border-border-dark sm:text-sm'
          placeholder='Add context to help us review your ID.'
        />
        <p id='ver-info-help' className='text-right text-sm opacity-70'>
          {values.additional_info?.length ?? 0}/{MAX_ADDITIONAL_INFO}
        </p>
        {formState.errors.additional_info && (
          <p role='alert' className='text-sm text-alert-red'>
            {formState.errors.additional_info.message}
          </p>
        )}
      </div>

      <Alert role='note' className='rounded-xl'>
        <RiShieldCheckLine size={20} aria-hidden />
        <AlertTitle>Your documents stay private</AlertTitle>
        <AlertDescription className='text-sm'>
          Only you and authorised reviewers can access these images. They are
          not shown on your profile. You can check the decision here after
          submitting.
        </AlertDescription>
      </Alert>

      <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
        <Button
          type='submit'
          variant='brand'
          className='min-h-10'
          disabled={busy}
        >
          {submit.isPending ? 'Submitting…' : 'Submit request'}
        </Button>
        {status === 'rejected' && (
          <Button
            type='button'
            variant='outline'
            disabled={busy}
            onClick={() => {
              setShowForm(false);
              reset();
            }}
          >
            Back to request
          </Button>
        )}
        {uploading && (
          <p role='status' className='text-sm opacity-80'>
            Wait for your image to finish uploading.
          </p>
        )}
      </div>

      {previewKind && request && (
        <DocumentPreview
          requestId={request.id}
          kind={previewKind}
          open
          onOpenChange={(open) => !open && setPreviewKind(undefined)}
        />
      )}
    </form>
  );
};
