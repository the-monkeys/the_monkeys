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

  it('catches edit saver.save failures instead of an unhandled rejection', () => {
    const editor = readFileSync(join(dir, 'index.tsx'), 'utf8');
    expect(editor).toMatch(/saver\.save\(\)[\s\S]*catch/);
  });
});
