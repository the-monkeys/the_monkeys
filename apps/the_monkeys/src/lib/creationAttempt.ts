/** Optional, per-request only. Never put this header on shared Axios defaults. */
export const creationHeaders = (idempotencyKey?: string) =>
  idempotencyKey
    ? { headers: { 'Idempotency-Key': idempotencyKey } }
    : undefined;

/** Prefer actionable copy over technical idempotency details from the server. */
export function creationErrorMessage(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return;
  const error = data as { code?: unknown; error?: unknown };
  switch (error.code || error.error) {
    case 'idempotency_in_progress':
      return 'Your request is still processing. Please wait a moment and try again.';
    case 'idempotency_unavailable':
      return 'We could not confirm your request. Please try again in a moment.';
    case 'idempotency_key_reused':
    case 'idempotency_reused':
      return 'This submission differs from an earlier attempt. Please reopen the form and try again.';
  }
}

function creationKey(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  // getRandomValues remains available in older browsers and HTTP contexts
  // where randomUUID is absent. Keep the UUID v4 version and variant bits.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** One mounted form / account / endpoint, never a global payload cache. */
export function createCreationAttempt() {
  let inFlight: Promise<unknown> | undefined;
  // In-memory only, like the form itself. Nothing is written to browser storage.
  let previousInput: string | undefined;
  let key: string | undefined;

  return {
    reset() {
      if (inFlight) return;
      previousInput = undefined;
      key = undefined;
    },
    run<T>(
      input: unknown,
      create: (idempotencyKey: string) => Promise<T>
    ): Promise<T> {
      if (inFlight) return inFlight as Promise<T>;
      let resolve!: (value: T) => void;
      let reject!: (reason: unknown) => void;
      const pending = new Promise<T>((yes, no) => {
        resolve = yes;
        reject = no;
      });
      // Set before invoking any callback, including synchronous/reentrant callers.
      inFlight = pending;
      void (async () => {
        try {
          const signature = JSON.stringify(input);
          if (!key || previousInput !== signature) {
            key = creationKey();
            previousInput = signature;
          }
          const result = await create(key);
          key = undefined;
          previousInput = undefined;
          resolve(result);
        } catch (error) {
          // A lost response, timeout or server error may follow a committed write.
          // Release single-flight, but reuse this key for unchanged retries.
          reject(error);
        } finally {
          inFlight = undefined;
        }
      })();
      return pending;
    },
  };
}
