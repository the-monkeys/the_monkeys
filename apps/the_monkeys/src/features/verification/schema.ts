import { z } from 'zod';

import { COUNTRY_CODES, MAX_ADDITIONAL_INFO, MAX_DOC_BYTES } from './constants';

const CHECKSUM_RE = /^[a-f0-9]{64}$/;

/**
 * One uploaded document slot (client-side state, not an API DTO).
 * Single zod source so form values and tile props stay structurally locked.
 */
export const uploadedDocSchema = z.object({
  checksum: z.string(),
  size: z.number().optional(),
  contentType: z.string().optional(),
  progress: z.number().optional(),
});
export type UploadedDoc = z.infer<typeof uploadedDocSchema>;

export const verificationSchema = z
  .object({
    verification_type: z.literal('id_document'),
    country: z
      .string()
      .trim()
      .length(2)
      .regex(/^[A-Za-z]{2}$/, 'Pick a country')
      .optional()
      .or(z.literal('')),
    id_document_type: z
      .enum([
        'passport',
        'national_id',
        'drivers_license',
        'residence_permit',
        'government_id',
      ])
      .optional(),
    docs: z.partialRecord(
      z.enum(['selfie', 'id_front', 'id_back']),
      uploadedDocSchema.optional()
    ),
    additional_info: z
      .string()
      .max(
        MAX_ADDITIONAL_INFO,
        `Keep it under ${MAX_ADDITIONAL_INFO} characters`
      )
      .optional()
      .or(z.literal('')),
  })
  .superRefine((val, ctx) => {
    if (!val.country || !COUNTRY_CODES.includes(val.country)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['country'],
        message: 'Choose the country that issued your ID',
      });
    }
    if (!val.id_document_type) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['id_document_type'],
        message: 'Choose your document type',
      });
    }
    if (!CHECKSUM_RE.test(val.docs.selfie?.checksum ?? '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['docs.selfie'],
        message: 'Selfie is required',
      });
    }
    if (!CHECKSUM_RE.test(val.docs.id_front?.checksum ?? '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['docs.id_front'],
        message: 'ID front is required',
      });
    }
  });

export type VerificationFormValues = z.infer<typeof verificationSchema>;

export { MAX_DOC_BYTES };
