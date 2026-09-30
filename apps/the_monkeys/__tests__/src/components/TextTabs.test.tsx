import { TextTabs } from '@/components/TextTabs';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('TextTabs mobile overflow', () => {
  it('keeps long tab sets horizontally scrollable without shrinking labels', () => {
    render(
      <TextTabs
        aria-label='Group community'
        value='events'
        onChange={vi.fn()}
        items={[
          { id: 'events', label: 'Events' },
          { id: 'blogs', label: 'Blogs' },
          { id: 'requests', label: 'Join requests' },
        ]}
      />
    );

    expect(screen.getByRole('tablist').className).toContain('overflow-x-auto');
    expect(
      screen.getByRole('tab', { name: 'Join requests' }).className
    ).toContain('shrink-0');
  });
});
