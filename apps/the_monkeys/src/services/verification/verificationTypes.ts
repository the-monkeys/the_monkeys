// DTOs mirroring documents/apis/user_service.yaml §8 (Account Verification).
// Field names stay snake_case so responses pass through untouched.

export type VerificationType = 'social_proof' | 'id_document';

export type VerificationStatus =
  | 'pending'
  | 'under_review'
  | 'approved'
  | 'rejected';

export type DocKind = 'selfie' | 'id_front' | 'id_back';

export type IDDocumentType =
  | 'passport'
  | 'national_id'
  | 'drivers_license'
  | 'residence_permit';

/** One submitted verification request (owner or admin view). */
export interface VerificationRequest {
  id: string;
  username: string;
  verification_type: VerificationType;
  country?: string;
  id_document_type?: string;
  status: VerificationStatus;
  selfie_checksum?: string;
  id_front_checksum?: string;
  id_back_checksum?: string;
  additional_info?: string;
  reviewer_username?: string;
  rejection_reason?: string;
  created_at?: string;
  updated_at?: string;
  reviewed_at?: string;
}

/** GET /user/verification/me returns this when nothing was ever submitted. */
export interface NoVerificationResponse {
  status: 'none';
  message?: string;
}

/** POST /v2/storage/verifications response — the checksum feeds step 2. */
export interface UploadDocResponse {
  kind: DocKind;
  checksum: string;
  bucket?: string;
  object?: string;
  etag?: string;
  size: number;
  contentType: string;
  blurhash?: string;
  width?: number;
  height?: number;
}

/** GET /v2/storage/verifications/{id}/{kind}/url */
export interface AssetUrlResponse {
  url: string;
  expires_in_seconds: number;
}

/** POST /user/verification body (checksums come from step-1 uploads). */
export interface SubmitVerificationPayload {
  verification_type: VerificationType;
  country?: string;
  id_document_type?: IDDocumentType;
  selfie_checksum?: string;
  id_front_checksum?: string;
  id_back_checksum?: string;
  additional_info?: string;
}
