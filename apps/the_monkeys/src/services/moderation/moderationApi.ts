import axiosInstance from '@/services/api/axiosInstance';

import type {
  ContentRating,
  ContentTarget,
  ModerationActionResponse,
  ReportReason,
} from './moderationTypes';

function path(target: ContentTarget) {
  if (
    !['blog', 'event', 'group', 'discussion'].includes(target.kind) ||
    !target.id.trim()
  )
    throw new Error('Invalid content.');
  return `/moderation/${target.kind}/${encodeURIComponent(target.id)}`;
}
export async function getContentAccess(
  target: ContentTarget,
  signal?: AbortSignal
): Promise<ContentRating> {
  const { data } = await axiosInstance.get<ContentRating>(path(target), {
    signal,
  });
  if (
    !data?.target ||
    data.target.kind !== target.kind ||
    data.target.id !== target.id
  )
    throw new Error('Content checks are temporarily unavailable.');
  return data;
}
export async function reportContent(
  target: ContentTarget,
  body: { reason: ReportReason; details?: string }
): Promise<ModerationActionResponse> {
  const { data } = await axiosInstance.post<ModerationActionResponse>(
    `${path(target)}/report`,
    body
  );
  if (!data?.report?.id || !data.report.status)
    throw new Error('Your report was not confirmed. Please try again.');
  return data;
}
export async function revealContent(
  target: ContentTarget
): Promise<ModerationActionResponse> {
  const { data } = await axiosInstance.post<ModerationActionResponse>(
    `${path(target)}/reveal`,
    {}
  );
  if (!data?.access?.revealed)
    throw new Error(
      'Content could not be revealed. Please check your profile birthday.'
    );
  return data;
}
export async function setNSFWLabel(
  target: ContentTarget,
  isNSFW: boolean
): Promise<ModerationActionResponse> {
  const { data } = await axiosInstance.put<ModerationActionResponse>(
    `${path(target)}/label`,
    { is_nsfw: isNSFW }
  );
  if (!data?.access)
    throw new Error('Your content rating was not confirmed. Please try again.');
  return data;
}
