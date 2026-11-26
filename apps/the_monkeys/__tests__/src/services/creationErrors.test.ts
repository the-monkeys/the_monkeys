import { eventError } from '@/services/events/eventsApi';
import { groupError } from '@/services/groups/groupsApi';
import { verificationErrorMessage } from '@/services/verification/verificationApi';
import { expect, it } from 'vitest';

it.each([eventError, groupError, verificationErrorMessage])(
  '%s translates creation error codes before raw technical server text',
  (message) => {
    for (const [code, expected] of [
      [
        'idempotency_in_progress',
        'Your request is still processing. Please wait a moment and try again.',
      ],
      [
        'idempotency_unavailable',
        'We could not confirm your request. Please try again in a moment.',
      ],
      [
        'idempotency_key_reused',
        'This submission differs from an earlier attempt. Please reopen the form and try again.',
      ],
      [
        'idempotency_reused',
        'This submission differs from an earlier attempt. Please reopen the form and try again.',
      ],
    ]) {
      expect(
        message({
          isAxiosError: true,
          response: {
            status: 409,
            data: {
              code,
              error: 'same key: internal conflict',
              message: 'same key: internal conflict',
            },
          },
        })
      ).toBe(expected);
    }
  }
);

it.each([eventError, groupError, verificationErrorMessage])(
  '%s preserves ordinary backend error messages',
  (message) => {
    expect(
      message({
        isAxiosError: true,
        response: {
          status: 422,
          data: { message: 'Choose a future start time.' },
        },
      })
    ).toBe('Choose a future start time.');
  }
);
