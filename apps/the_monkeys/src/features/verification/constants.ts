import {
  DocKind,
  IDDocumentType,
  VerificationType,
} from '@/services/verification/verificationTypes';

/**
 * Client-side mirror of the server's verification rules
 * (constants/verification.go). Kept deliberately COMPACT: only the buckets
 * that differ from the fallback set are encoded, so the two can't drift far.
 * The API remains the source of truth — this exists purely for UX gating.
 */

export const MAX_ADDITIONAL_INFO = 2000;
export const MAX_DOC_BYTES = 10 * 1024 * 1024; // 10 MB (server: VerificationAssetMaxBytes)

export const ACCEPTED_DOC_MIME = ['image/jpeg', 'image/png', 'image/webp'];

export const DOC_KIND_LABELS: Record<DocKind, string> = {
  selfie: 'Selfie holding your ID',
  id_front: 'ID — front side',
  id_back: 'ID — back side (optional)',
};

export const VERIFICATION_TYPES: {
  value: VerificationType;
  label: string;
  hint: string;
}[] = [
  {
    value: 'social_proof',
    label: 'Social proof',
    hint: 'Link your established presence elsewhere in additional info.',
  },
  {
    value: 'id_document',
    label: 'Government ID',
    hint: 'Upload a selfie plus a valid ID document. Reviewed privately.',
  },
];

export const ID_DOCUMENT_TYPE_LABELS: Record<IDDocumentType, string> = {
  passport: 'Passport',
  national_id: 'National ID card',
  drivers_license: "Driver's license",
  residence_permit: 'Residence permit',
};

// Countries where ONLY a driver's license is accepted (no national ID card).
const DL_ONLY = ['AU', 'CA', 'GB', 'IE', 'NZ', 'US'];
// Countries accepting national ID + driver's license.
const NAT_ID_DL =
  'AR BD BR CH CL CO DE EG ES FR GH ID IL IN IT JP KE KR MA MX MY NG NL PH PK PL SA SE SG TH TR UA VN ZA'.split(
    ' '
  );
// China accepts national ID + residence permit.
const CN_SPECIAL = ['CN'];

/** ISO-3166-1 alpha-2 codes offered in the country selector. */
export const COUNTRY_CODES = Array.from(
  new Set([...DL_ONLY, ...NAT_ID_DL, ...CN_SPECIAL])
).sort();

/** Doc types allowed for a country code ('' or unknown → fallback pair). */
export function allowedDocTypes(country?: string): IDDocumentType[] {
  if (!country) return ['passport', 'residence_permit'];
  const cc = country.toUpperCase();
  if (DL_ONLY.includes(cc)) return ['drivers_license'];
  if (cc === 'CN') return ['national_id', 'residence_permit'];
  if (NAT_ID_DL.includes(cc)) return ['national_id', 'drivers_license'];
  return ['passport', 'residence_permit'];
}

/** Localized country name via Intl — zero lookup-table bloat. */
export function countryLabel(code: string): string {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? code;
  } catch {
    return code;
  }
}
