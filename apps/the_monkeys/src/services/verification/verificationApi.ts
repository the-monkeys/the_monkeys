import axiosInstance from '@/services/api/axiosInstance';
import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import axios, { AxiosProgressEvent } from 'axios';

import {
  AssetUrlResponse,
  DocKind,
  NoVerificationResponse,
  SubmitVerificationPayload,
  UploadDocResponse,
  VerificationRequest,
} from './verificationTypes';

/**
 * Account-verification API. Contract: documents/apis/user_service.yaml §8.
 *
 * Two surfaces, matching the backend split:
 *  - /api/v2/storage/verifications…  document uploads into the PRIVATE bucket
 *  - /api/v1/user/verification…      request lifecycle (submit/status/cancel)
 */

export async function uploadVerificationAsset(
  kind: DocKind,
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadDocResponse> {
  const form = new FormData();
  form.append('file', file);

  const res = await axiosInstanceV2.post<UploadDocResponse>(
    `/storage/verifications?kind=${kind}`,
    form,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e: AxiosProgressEvent) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      },
    }
  );
  return res.data;
}

export async function submitVerification(
  payload: SubmitVerificationPayload
): Promise<VerificationRequest> {
  const res = await axiosInstance.post<VerificationRequest>(
    '/user/verification',
    payload
  );
  return res.data;
}

export async function getMyVerification(): Promise<
  VerificationRequest | NoVerificationResponse
> {
  const res = await axiosInstance.get<
    VerificationRequest | NoVerificationResponse
  >('/user/verification/me');
  return res.data;
}

export async function cancelVerification(requestId: string): Promise<string> {
  const res = await axiosInstance.delete<{ message: string }>(
    `/user/verification/${requestId}`
  );
  return res.data?.message ?? 'verification request cancelled';
}

export async function getVerificationAssetUrl(
  requestId: string,
  kind: DocKind
): Promise<AssetUrlResponse> {
  const res = await axiosInstanceV2.get<AssetUrlResponse>(
    `/storage/verifications/${requestId}/${kind}/url`
  );
  return res.data;
}

/** Human message from an axios error, preferring the API's own detail. */
export function verificationErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const msg = err.response?.data?.message;
    if (typeof msg === 'string' && msg.length > 0) return msg;
    if (err.response?.status === 409)
      return 'You already have an active verification request.';
    if (err.response?.status === 413) return 'File is larger than 10 MB.';
    if (err.response?.status === 415)
      return 'Unsupported file — upload JPEG, PNG or WebP.';
    if (err.code === 'ERR_NETWORK') return 'Network error. Please retry.';
  }
  return 'Something went wrong. Please try again.';
}
