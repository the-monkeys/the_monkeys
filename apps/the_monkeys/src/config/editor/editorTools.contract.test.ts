import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const dir = dirname(fileURLToPath(import.meta.url));

describe('editor tools contract', () => {
  it('registers title on both write and read configs so drafts never stub', () => {
    const write = readFileSync(join(dir, 'monkeys_editor.config.ts'), 'utf8');
    const read = readFileSync(
      join(dir, 'monkeys_editor_readonly.config.ts'),
      'utf8'
    );
    expect(write).toMatch(/title:\s*\{/);
    expect(write).toContain('TitleBlockTool');
    expect(read).toMatch(/title:\s*\{/);
    expect(read).toContain('TitleBlockTool');
  });

  it('registers every block type so EditorJS never shows an uneditable stub', () => {
    const write = readFileSync(join(dir, 'monkeys_editor.config.ts'), 'utf8');
    const read = readFileSync(
      join(dir, 'monkeys_editor_readonly.config.ts'),
      'utf8'
    );
    const tools = [
      'title',
      'header',
      'paragraph',
      'list',
      'quote',
      'delimiter',
      'table',
      'code',
      'image',
      'embed',
      'markdown',
      'chart',
      'trend',
      'formula',
      'citation',
      'methodology',
      'dataset',
      'mention',
    ];
    for (const tool of tools) {
      expect(write).toMatch(new RegExp(`\\b${tool}:`));
      expect(read).toMatch(new RegExp(`\\b${tool}:`));
    }
  });
});
