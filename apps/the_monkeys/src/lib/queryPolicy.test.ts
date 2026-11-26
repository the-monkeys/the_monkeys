import { getQueryClient } from '@/utils/get-query-client';
import { AxiosError, CanceledError } from 'axios';
import { describe, expect, it } from 'vitest';

describe('default query retry policy', () => {
  const options = getQueryClient().getDefaultOptions().queries;
  const retry = (count: number, error: unknown) => {
    expect(typeof options?.retry).toBe('function');
    return (options!.retry as (count: number, error: unknown) => boolean)(
      count,
      error
    );
  };
  it.each([400, 401, 403, 404, 422])(
    'never retries a permanent HTTP %s response',
    (status) => {
      expect(retry(0, { response: { status } })).toBe(false);
    }
  );
  it.each([408, 429, 500, 502, 503, 504])(
    'bounds transient HTTP %s retries',
    (status) => {
      expect(retry(0, { response: { status } })).toBe(true);
      expect(retry(1, { response: { status } })).toBe(true);
      expect(retry(2, { response: { status } })).toBe(false);
    }
  );
  it('retries a network interruption but not cancellation or validation errors', () => {
    expect(retry(0, new AxiosError('offline', 'ERR_NETWORK'))).toBe(true);
    expect(retry(2, new AxiosError('offline', 'ERR_NETWORK'))).toBe(false);
    expect(retry(0, new CanceledError())).toBe(false);
    expect(retry(0, new DOMException('aborted', 'AbortError'))).toBe(false);
    expect(retry(0, new Error('Invalid response'))).toBe(false);
  });
});
