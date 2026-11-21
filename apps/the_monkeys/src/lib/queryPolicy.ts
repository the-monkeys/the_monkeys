import axios from 'axios';

/** Retry only a bounded number of transient read failures; never retry denial. */
export function shouldRetryQuery(
  failureCount: number,
  error: unknown
): boolean {
  if (failureCount >= 2 || axios.isCancel(error)) return false;
  if (
    error &&
    typeof error === 'object' &&
    'name' in error &&
    error.name === 'AbortError'
  )
    return false;
  const value = error as
    | { response?: { status?: number }; status?: number }
    | undefined;
  const status = value?.response?.status ?? value?.status;
  if (typeof status === 'number')
    return status === 408 || status === 429 || status >= 500;
  return axios.isAxiosError(error) && !error.response;
}

export const queryRetryDelay = (attempt: number) =>
  Math.min(500 * 2 ** attempt, 2000);
