import { LOGIN_ROUTE } from '@/constants/routeConstants';

const STORAGE_KEY = 'monkeys_auth_callback';

/** Same-origin path only. Rejects protocol-relative and auth loops. */
export function safeCallbackPath(
  value: string | null | undefined
): string | null {
  if (!value) return null;
  const path = value.trim();
  if (!path.startsWith('/') || path.startsWith('//')) return null;
  if (path.startsWith('/auth')) return null;
  return path;
}

export function loginHref(returnTo?: string | null): string {
  const path = safeCallbackPath(returnTo);
  if (!path) return LOGIN_ROUTE;
  return `${LOGIN_ROUTE}?callbackURL=${encodeURIComponent(path)}`;
}

export function rememberAuthCallback(path: string | null | undefined): void {
  if (typeof window === 'undefined') return;
  const safe = safeCallbackPath(path);
  if (safe) sessionStorage.setItem(STORAGE_KEY, safe);
  else sessionStorage.removeItem(STORAGE_KEY);
}

export function peekAuthCallback(): string {
  if (typeof window === 'undefined') return '/';
  return safeCallbackPath(sessionStorage.getItem(STORAGE_KEY)) || '/';
}
