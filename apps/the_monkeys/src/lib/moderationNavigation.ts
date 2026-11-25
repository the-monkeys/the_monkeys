import { safeCallbackPath } from '@/lib/authRedirect';
import {
  type ContentTarget,
  contentHref,
} from '@/services/moderation/moderationTypes';

/** Keep birthday completion on the original local content page. */
export function safeModerationReturn(value?: string | null): string | null {
  const path = safeCallbackPath(value);
  if (!path) return null;
  try {
    const decoded = decodeURIComponent(path);
    if (/[\\\u0000-\u0020\u007f]/.test(decoded) || !safeCallbackPath(decoded))
      return null;
    const origin = 'https://return.monkeys.invalid';
    if (new URL(path, origin).origin !== origin) return null;
    return path;
  } catch {
    return null;
  }
}
export function birthdaySettingsHref(returnTo?: string | null): string {
  const safe = safeModerationReturn(returnTo);
  return `/settings?focus=birthday${safe ? `&returnTo=${encodeURIComponent(safe)}` : ''}`;
}
export function birthdayReturnPath(search: string): string | null {
  return safeModerationReturn(new URLSearchParams(search).get('returnTo'));
}
export function currentContentPath(target: ContentTarget): string {
  if (typeof window === 'undefined') return contentHref(target);
  return (
    safeModerationReturn(window.location.pathname + window.location.search) ||
    contentHref(target)
  );
}
