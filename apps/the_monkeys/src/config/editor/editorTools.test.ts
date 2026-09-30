import { describe, expect, it } from 'vitest';

import { getEditorConfig } from './monkeys_editor.config';
import { editorConfig } from './monkeys_editor_readonly.config';

describe('editor tools', () => {
  it('registers markdown, chart, and trend in the edit config', () => {
    const tools = getEditorConfig('blog-id').tools;
    expect(tools).toHaveProperty('markdown');
    expect(tools).toHaveProperty('chart');
    expect(tools).toHaveProperty('trend');
  });

  it('registers markdown, chart, and trend in the read-only config', () => {
    expect(editorConfig.tools).toHaveProperty('markdown');
    expect(editorConfig.tools).toHaveProperty('chart');
    expect(editorConfig.tools).toHaveProperty('trend');
  });
});
