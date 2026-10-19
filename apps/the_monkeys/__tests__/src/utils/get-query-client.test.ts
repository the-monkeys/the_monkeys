import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';

import { shouldRetryQuery } from '@/utils/get-query-client';

function axiosError(status?: number) {
  const error = new AxiosError('Request failed');
  if (status !== undefined) {
    Object.defineProperty(error, 'response', { value: { status } });
  }
  if (status === undefined) {
    Object.defineProperty(error, 'request', { value: {} });
  }
  return error;
}

describe('shouldRetryQuery', () => {
  it.each([400, 401, 403, 404])('does not retry HTTP %s', (status) => {
    expect(shouldRetryQuery(0, axiosError(status))).toBe(false);
  });

  it.each([408, 429, 500, 503])('retries transient HTTP %s errors', (status) => {
    expect(shouldRetryQuery(0, axiosError(status))).toBe(true);
  });

  it('retries network errors twice', () => {
    const error = axiosError();
    expect(shouldRetryQuery(0, error)).toBe(true);
    expect(shouldRetryQuery(1, error)).toBe(true);
    expect(shouldRetryQuery(2, error)).toBe(false);
  });

  it('does not retry non-Axios errors', () => {
    expect(shouldRetryQuery(0, new Error('Unexpected failure'))).toBe(false);
  });

  it('does not retry canceled requests', () => {
    const error = new AxiosError('Request canceled', 'ERR_CANCELED');
    expect(shouldRetryQuery(0, error)).toBe(false);
  });
});
