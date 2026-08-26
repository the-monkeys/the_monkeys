'use client';

import { useState } from 'react';

import dynamic from 'next/dynamic';

import { Loader } from '@/components/loader';
import { VerifiedBadge } from '@/components/user/VerifiedBadge';
import { verificationErrorMessage } from '@/services/verification/verificationApi';
import type {
  DocKind,
  VerificationStatus,
} from '@/services/verification/verificationTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  RiCloseLine,
  RiErrorWarningLine,
  RiEyeLine,
  RiLoader4Line,
} from '@remixicon/react';
import { Badge } from '@the-monkeys/ui/atoms/badge';
import { Button } from '@the-monkeys/ui/atoms/button';
import { Input } from '@the-monkeys/ui/atoms/input';
import { Label } from '@the-monkeys/ui/atoms/label';
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
import {
  UploadedDoc,
  VerificationFormValues,
  verificationSchema,
} from '../schema';
import { DocumentTile } from './DocumentTile';

// Code-split: the viewer (and its dialog markup) loads only when used.
const DocumentPreview = dynamic(
  () => import('./DocumentPreview').then((m) => m.DocumentPreview),
  { ssr: false }
);

const STATUS_META: Record<
  VerificationStatus,
  { label: string; variant: 'brand' | 'destructive' | 'default' }
> = {
  pending: { label: 'Pending review', variant: 'default' },
  under_review: { label: 'Under review', variant: 'brand' },
  approved: { label: 'Approved', variant: 'brand' },
  rejected: { label: 'Rejected', variant: 'destructive' },
};

/**
 * Settings tab body for account verification. One component, four states
 * (form / pending / decided) — no per-status subcomponents to keep the
 * tree flat and the bundle small.
 */
export const VerificationPanel = () => {
  const { request, none, isLoading, uploadDoc, submit, cancel } =
    useMyVerification();

  const [showForm, setShowForm] = useState(false);
  const [progress, setProgress] = useState<Partial<Record<DocKind, number>>>(
    {}
  );
  const [tileErrors, setTileErrors] = useState<
    Partial<Record<DocKind, string>>
  >({});
  const [previewKind, setPreviewKind] = useState<DocKind>();
  const [armCancel, setArmCancel] = useState(false);

  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      verification_type: 'id_document',
      docs: {},
    },
  });
  const { register, watch, setValue, handleSubmit, reset, formState } = form;
  const values = watch();
  const isID = values.verification_type === 'id_document';

  // A decided-but-rejected request can be resubmitted; anything else active
  // blocks the form.
  const status = request?.status;
  const formVisible =
    none || status === undefined || (status === 'rejected' && showForm);

  const handleFile = (kind: DocKind, file: File) => {
    setTileErrors((p) => ({ ...p, [kind]: undefined }));
    setProgress((p) => ({ ...p, [kind]: 0 }));
    uploadDoc.mutate(
      {
        kind,
        file,
        onProgress: (pct) => setProgress((p) => ({ ...p, [kind]: pct })),
      },
      {
        onSuccess: (res) => {
          setProgress((p) => ({ ...p, [kind]: undefined }));
          setValue(
            `docs.${kind}` as const,
            { checksum: res.checksum },
            {
              shouldValidate: true,
            }
          );
        },
        onError: (err) =>
          setTileErrors((p) => ({
            ...p,
            [kind]: verificationErrorMessage(err),
          })),
      }
    );
  };

  const onSubmit = handleSubmit(
    (v) => {
      submit.mutate(
        {
          verification_type: v.verification_type,
          additional_info: v.additional_info || undefined,
          ...(v.verification_type === 'id_document'
            ? {
                country: v.country,
                id_document_type: v.id_document_type,
                selfie_checksum: v.docs.selfie?.checksum,
                id_front_checksum: v.docs.id_front?.checksum,
                id_back_checksum: v.docs.id_back?.checksum,
              }
            : {}),
        },
        {
          onSuccess: () => {
            setShowForm(false);
            toast({
              title: 'Request submitted',
              description: 'We review requests within a few days.',
            });
          },
          onError: (err) =>
            toast({
              title: 'Could not submit',
              description: verificationErrorMessage(err),
              variant: 'destructive',
            }),
        }
      );
    },
    (errors) => {
      const first = Object.values(errors)[0];
      if (first?.message) {
        toast({
          title: 'Check the form',
          description: first.message,
          variant: 'destructive',
        });
      }
    }
  );

  if (isLoading) {
    return (
      <div className='p-6 grid place-items-center'>
        <Loader size={32} />
      </div>
    );
  }

  /* ----------------------------- status views ---------------------------- */

  if (!formVisible && status) {
    const meta = STATUS_META[status];
    return (
      <div className='space-y-4'>
        <div className='rounded-md border-1 border-border-light dark:border-border-dark p-4 space-y-3'>
          <div className='flex items-center gap-2'>
            {status === 'approved' ? (
              <>
                <VerifiedBadge isVerified />
                <span className='text-sm opacity-80'>
                  Your account shows the verified badge.
                </span>
              </>
            ) : status === 'rejected' ? (
              <>
                <RiErrorWarningLine
                  size={18}
                  className='text-alert-red shrink-0'
                />
                <Badge variant={meta.variant}>{meta.label}</Badge>
              </>
            ) : (
              <>
                <RiLoader4Line size={16} className='animate-spin opacity-70' />
                <Badge variant={meta.variant}>{meta.label}</Badge>
              </>
            )}
          </div>

          {status === 'rejected' && request.rejection_reason && (
            <div className='text-sm space-y-1'>
              <p className='font-medium'>Reviewer note</p>
              <p className='opacity-80'>{request.rejection_reason}</p>
            </div>
          )}

          {(status === 'pending' || status === 'under_review') && (
            <p className='text-sm opacity-70'>
              Submitted{' '}
              {request.created_at
                ? new Date(request.created_at).toLocaleDateString()
                : 'recently'}
              . You&apos;ll see the decision here — no emails needed.
            </p>
          )}
        </div>

        <div className='flex flex-wrap gap-2'>
          {status === 'pending' && (
            <Button
              type='button'
              variant='outline'
              disabled={cancel.isPending}
              onClick={() => {
                if (!armCancel) {
                  setArmCancel(true);
                  setTimeout(() => setArmCancel(false), 4000);
                  return;
                }
                cancel.mutate(request.id, {
                  onSuccess: () => setArmCancel(false),
                  onError: (err) =>
                    toast({
                      title: 'Could not cancel',
                      description: verificationErrorMessage(err),
                      variant: 'destructive',
                    }),
                });
              }}
            >
              {cancel.isPending
                ? 'Cancelling…'
                : armCancel
                  ? 'Tap again to confirm cancel'
                  : 'Cancel request'}
            </Button>
          )}

          {status === 'rejected' && (
            <Button
              type='button'
              onClick={() => {
                reset({
                  verification_type: request.verification_type,
                  country: request.country ?? '',
                  id_document_type:
                    (request.id_document_type as VerificationFormValues['id_document_type']) ??
                    undefined,
                  docs: {
                    selfie: request.selfie_checksum
                      ? ({ checksum: request.selfie_checksum } as UploadedDoc)
                      : undefined,
                    id_front: request.id_front_checksum
                      ? ({ checksum: request.id_front_checksum } as UploadedDoc)
                      : undefined,
                    id_back: request.id_back_checksum
                      ? ({ checksum: request.id_back_checksum } as UploadedDoc)
                      : undefined,
                  },
                  additional_info: request.additional_info ?? '',
                });
                setShowForm(true);
              }}
            >
              Resubmit
            </Button>
          )}
        </div>
      </div>
    );
  }

  /* -------------------------------- form -------------------------------- */

  const docTypes = allowedDocTypes(values.country || undefined);
  const infoLen = values.additional_info?.length ?? 0;

  return (
    <form onSubmit={onSubmit} className='space-y-5 max-w-xl'>
      {/* Type */}
      <div className='space-y-2'>
        <Label>Verification type</Label>
        <div className='grid gap-2 sm:grid-cols-2'>
          {(['social_proof', 'id_document'] as const).map((t) => (
            <button
              key={t}
              type='button'
              onClick={() => setValue('verification_type', t)}
              className={`text-left rounded-md border-1 p-3 transition-colors ${
                values.verification_type === t
                  ? 'border-brand-orange bg-brand-orange/5'
                  : 'border-border-light dark:border-border-dark hover:border-brand-orange/40'
              }`}
            >
              <p className='text-sm font-medium capitalize'>
                {t.replace('_', ' ')}
              </p>
              <p className='text-xs opacity-70 mt-0.5'>
                {t === 'id_document'
                  ? 'Selfie + government ID, reviewed privately'
                  : 'Established presence elsewhere'}
              </p>
            </button>
          ))}
        </div>
      </div>

      {isID && (
        <>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <Label htmlFor='ver-country'>Country</Label>
              <select
                id='ver-country'
                value={values.country ?? ''}
                onChange={(e) => {
                  const cc = e.target.value;
                  setValue('country', cc);
                  if (!allowedDocTypes(cc).includes(values.id_document_type!)) {
                    setValue('id_document_type', undefined);
                  }
                }}
                className='w-full h-9 rounded-md border-1 border-border-light dark:border-border-dark bg-transparent px-2 text-sm'
              >
                <option value=''>Select…</option>
                {COUNTRY_CODES.map((cc) => (
                  <option key={cc} value={cc}>
                    {countryLabel(cc)} ({cc})
                  </option>
                ))}
                <option value='OT'>Other / not listed</option>
              </select>
            </div>

            <div className='space-y-1.5'>
              <Label htmlFor='ver-doctype'>Document type</Label>
              <select
                id='ver-doctype'
                value={values.id_document_type ?? ''}
                onChange={(e) =>
                  setValue(
                    'id_document_type',
                    (e.target.value ||
                      undefined) as VerificationFormValues['id_document_type']
                  )
                }
                className='w-full h-9 rounded-md border-1 border-border-light dark:border-border-dark bg-transparent px-2 text-sm'
              >
                <option value=''>Select…</option>
                {docTypes.map((dt) => (
                  <option key={dt} value={dt}>
                    {ID_DOCUMENT_TYPE_LABELS[dt]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className='space-y-2'>
            <Label>Documents</Label>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
              {(['selfie', 'id_front', 'id_back'] as const).map((k) => (
                <div key={k} className='space-y-1'>
                  <DocumentTile
                    kind={k}
                    label={DOC_KIND_LABELS[k]}
                    doc={values.docs[k]}
                    error={tileErrors[k]}
                    disabled={uploadDoc.isPending && progress[k] !== undefined}
                    onFile={handleFile}
                  />
                </div>
              ))}
            </div>

            {request && (
              <button
                type='button'
                onClick={() => setPreviewKind('selfie')}
                className='inline-flex items-center gap-1 text-xs underline underline-offset-2 opacity-70 hover:opacity-100'
              >
                <RiEyeLine size={12} /> View an uploaded document
              </button>
            )}
          </div>
        </>
      )}

      {/* Notes */}
      <div className='space-y-1.5'>
        <Label htmlFor='ver-info'>
          {isID ? 'Anything reviewers should know (optional)' : 'Proof & links'}
        </Label>
        <textarea
          id='ver-info'
          rows={4}
          maxLength={MAX_ADDITIONAL_INFO}
          {...register('additional_info')}
          className='w-full rounded-md border-1 border-border-light dark:border-border-dark bg-transparent p-2 text-sm resize-y'
          placeholder={
            isID
              ? 'Optional context'
              : 'https://linkedin.com/in/you · https://github.com/you …'
          }
        />
        <p className='text-[11px] opacity-50 text-right'>
          {infoLen}/{MAX_ADDITIONAL_INFO}
        </p>
      </div>

      <div className='flex items-center gap-3'>
        <Button
          type='submit'
          disabled={submit.isPending || uploadDoc.isPending}
        >
          {submit.isPending ? 'Submitting…' : 'Submit request'}
        </Button>
        {status === 'rejected' && (
          <Button
            type='button'
            variant='outline'
            onClick={() => {
              setShowForm(false);
              reset();
            }}
          >
            <RiCloseLine size={14} /> Close
          </Button>
        )}
      </div>

      {previewKind && request && (
        <DocumentPreview
          requestId={request.id}
          kind={previewKind}
          open
          onOpenChange={(o) => !o && setPreviewKind(undefined)}
        />
      )}
    </form>
  );
};
