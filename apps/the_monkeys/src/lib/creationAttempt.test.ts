import { createCreationAttempt } from '@/lib/creationAttempt';
import { describe, expect, it, vi } from 'vitest';

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
}

describe('a form-local creation attempt', () => {
  it('uses cryptographic UUID v4 keys when randomUUID is unavailable', async () => {
    const getRandomValues = crypto.getRandomValues.bind(crypto);
    vi.stubGlobal('crypto', { getRandomValues });
    try {
      const attempt = createCreationAttempt();
      const keys: string[] = [];
      await attempt.run({}, async (key) => {
        keys.push(key);
      });
      await attempt.run({}, async (key) => {
        keys.push(key);
      });
      for (const key of keys)
        expect(key).toMatch(
          /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i
        );
      expect(keys[1]).not.toBe(keys[0]);
    } finally {
      vi.unstubAllGlobals();
    }
  });
  it('locks synchronously and shares the result of same-turn submissions', async () => {
    const attempt = createCreationAttempt();
    const transport = deferred<string>();
    const keys: string[] = [];
    const create = (key: string) => {
      keys.push(key);
      return transport.promise;
    };
    const first = attempt.run({ title: 'Meetup' }, create);
    const second = attempt.run({ title: 'Meetup' }, create);
    expect(keys).toHaveLength(1);
    expect(second).toBe(first);
    expect(keys[0]).toMatch(/^[\da-f-]{36}$/i);
    transport.resolve('created');
    await expect(second).resolves.toBe('created');
  });

  it('unlocks after transport failure but keeps the key for an unchanged retry', async () => {
    const attempt = createCreationAttempt();
    const keys: string[] = [];
    await expect(
      attempt.run({ title: 'Meetup' }, async (key) => {
        keys.push(key);
        throw new Error('Response lost');
      })
    ).rejects.toThrow('Response lost');
    await expect(
      attempt.run({ title: 'Meetup' }, async (key) => {
        keys.push(key);
        return 'created';
      })
    ).resolves.toBe('created');
    expect(keys[1]).toBe(keys[0]);
  });

  it('also releases the guard after a synchronous exception', async () => {
    const attempt = createCreationAttempt();
    await expect(
      attempt.run({}, () => {
        throw new Error('Failed');
      })
    ).rejects.toThrow('Failed');
    await expect(attempt.run({}, async () => 'retry')).resolves.toBe('retry');
  });

  it('gives changed input and a later identical creation fresh keys', async () => {
    const attempt = createCreationAttempt();
    const keys: string[] = [];
    await attempt
      .run({ title: 'A' }, async (key) => {
        keys.push(key);
        throw new Error('Uncertain');
      })
      .catch(() => {});
    await attempt.run({ title: 'B' }, async (key) => {
      keys.push(key);
    });
    await attempt.run({ title: 'B' }, async (key) => {
      keys.push(key);
    });
    expect(new Set(keys).size).toBe(3);
  });

  it('never shares keys across separate forms or new create intents', async () => {
    const keys: string[] = [];
    for (const attempt of [createCreationAttempt(), createCreationAttempt()]) {
      await attempt.run({ title: 'Same event' }, async (key) => {
        keys.push(key);
      });
    }
    expect(keys[0]).not.toBe(keys[1]);
  });
});
