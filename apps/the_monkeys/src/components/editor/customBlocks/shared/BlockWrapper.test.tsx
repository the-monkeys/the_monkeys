import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { BlockHelp, EditDataDetails } from './BlockWrapper';

describe('BlockHelp', () => {
  it('renders help as a sentence, not a tooltip', () => {
    render(<BlockHelp>Paste CSV (first row = headers)</BlockHelp>);
    const help = screen.getByText('Paste CSV (first row = headers)');
    expect(help.tagName).toBe('P');
    expect(help.className).toContain('text-sm');
  });
});

describe('EditDataDetails', () => {
  it('starts collapsed with a 44px tap target', () => {
    render(
      <EditDataDetails>
        <input aria-label='hidden-field' />
      </EditDataDetails>
    );
    const details = screen.getByText('Edit data').closest('details');
    expect(details).not.toBeNull();
    expect(details!.hasAttribute('open')).toBe(false);
    const summary = details!.querySelector('summary');
    expect(summary?.className).toMatch(/min-h-11/);
  });
});
