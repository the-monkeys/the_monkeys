import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import type { TrendBlockData } from '../shared/types';
import TrendComponent from './TrendComponent';

afterEach(cleanup);

const sample: TrendBlockData = {
  periodLabels: ['Jan', 'Feb', 'Mar'],
  values: [100, 118, 121],
  direction: 'up',
  percentChange: 21,
  delta: 21,
  summary: 'Trend is up by 21.0% over this period.',
};

describe('TrendComponent', () => {
  it('shows how-to, plain badges, sparkline, and collapsed Edit data', () => {
    render(
      <TrendComponent data={sample} readOnly={false} onChange={() => {}} />
    );
    screen.getByText(
      'Comma-separated values. Optional labels. Percent and direction are calculated for you.'
    );
    expect(screen.getByText('Up')).toBeTruthy();
    expect(screen.getByText('+21%')).toBeTruthy();
    expect(screen.getByText('+21')).toBeTruthy();
    expect(screen.queryByText(/Direction:/)).toBeNull();
    expect(
      screen.getByText('Edit data').closest('details')!.hasAttribute('open')
    ).toBe(false);
    const svg = document.querySelector('svg');
    expect(svg?.getAttribute('style') ?? svg?.outerHTML).toContain(
      'width:100%'
    );
    expect(svg?.outerHTML).not.toContain('max-width:200px');
  });

  it('does not crash when percentChange is missing', () => {
    expect(() =>
      render(
        <TrendComponent
          data={
            {
              periodLabels: ['Jan'],
              values: [10],
              direction: 'up',
              summary: 'Trend',
            } as TrendBlockData
          }
          readOnly={false}
          onChange={() => {}}
        />
      )
    ).not.toThrow();
  });

  it('hides how-to in readOnly', () => {
    render(
      <TrendComponent data={sample} readOnly={true} onChange={() => {}} />
    );
    expect(screen.queryByText('Edit data')).toBeNull();
    expect(
      screen.queryByText(
        'Comma-separated values. Optional labels. Percent and direction are calculated for you.'
      )
    ).toBeNull();
    expect(screen.getByText('Up')).toBeTruthy();
  });
});
