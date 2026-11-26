import { verificationSchema } from '@/features/verification/schema';
import { describe, expect, it } from 'vitest';

const checksum = 'a'.repeat(64);

describe('verification document requirements', () => {
  it('rejects new social-proof submissions', () => {
    expect(
      verificationSchema.safeParse({
        verification_type: 'social_proof',
        docs: {},
        additional_info: 'https://example.test/creator — local test profile',
      }).success
    ).toBe(false);
  });

  it('allows government ID without the optional back image', () => {
    expect(
      verificationSchema.safeParse({
        verification_type: 'id_document',
        country: 'IN',
        id_document_type: 'national_id',
        docs: { selfie: { checksum }, id_front: { checksum } },
      }).success
    ).toBe(true);
  });

  it('still requires the selfie and front image for ID verification', () => {
    const result = verificationSchema.safeParse({
      verification_type: 'id_document',
      country: 'IN',
      id_document_type: 'national_id',
      docs: {},
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path.join('.'))).toEqual(
        expect.arrayContaining(['docs.selfie', 'docs.id_front'])
      );
    }
  });

  it.each([
    'passport',
    'national_id',
    'drivers_license',
    'residence_permit',
    'government_id',
  ])(
    'accepts %s with a selfie and front image from any issuing country',
    (id_document_type) => {
      for (const country of ['US', 'IN', 'CN', 'NP', 'AQ', 'XK']) {
        expect(
          verificationSchema.safeParse({
            verification_type: 'id_document',
            country,
            id_document_type,
            docs: { selfie: { checksum }, id_front: { checksum } },
          }).success
        ).toBe(true);
      }
    }
  );

  it.each(['OT', 'ZZ', ''])(
    'requires an actual issuing country instead of %s',
    (country) => {
      expect(
        verificationSchema.safeParse({
          verification_type: 'id_document',
          country,
          id_document_type: 'passport',
          docs: { selfie: { checksum }, id_front: { checksum } },
        }).success
      ).toBe(false);
    }
  );
});
