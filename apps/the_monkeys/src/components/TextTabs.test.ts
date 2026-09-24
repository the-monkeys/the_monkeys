import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const src = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'TextTabs.tsx'),
  'utf8'
);

describe('TextTabs', () => {
  it('does not show a Windows overflow scrollbar on the Posts/Events/Groups row', () => {
    expect(src).toContain('overflow-x-auto');
    expect(src).toContain('overflow-y-hidden');
    expect(src).toContain('scrollbar-hide');
  });
});
