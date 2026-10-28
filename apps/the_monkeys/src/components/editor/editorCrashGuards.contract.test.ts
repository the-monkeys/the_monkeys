import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const dir = dirname(fileURLToPath(import.meta.url));

describe('editor crash guards', () => {
  it('wraps readonly preview destroy so a dead instance cannot white-screen', () => {
    const preview = readFileSync(join(dir, 'preview.tsx'), 'utf8');
    expect(preview).toMatch(/try\s*\{[\s\S]*destroy[\s\S]*\}\s*catch/);
  });

  // Edit save failures are exercised behaviorally in index.test.tsx rather
  // than assuming a particular saver call spelling or component layout.
});
