import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import type { ChartBlockData } from '../shared/types';
import ChartComponent from './ChartComponent';

afterEach(cleanup);

const sample: ChartBlockData = {
  type: 'line',
  title: 'Revenue',
  xLabel: '',
  yLabel: '',
  showLegend: true,
  palette: 'ocean',
  labels: ['Jan', 'Feb', 'Mar'],
  series: [{ name: 'Series A', values: [12, 24, 18] }],
  source: 'manual',
};

describe('ChartComponent', () => {
  it('shows how-to and a preview in edit, with Edit data collapsed', () => {
    render(
      <ChartComponent data={sample} readOnly={false} onChange={() => {}} />
    );
    screen.getByText(
      'Paste CSV (first row = headers) or one series per line: Revenue:10,20,30'
    );
    const details = screen.getByText('Edit data').closest('details');
    expect(details!.hasAttribute('open')).toBe(false);
    expect(document.querySelector('svg')).not.toBeNull();
    const preview = document.querySelector('[data-chart-preview]');
    expect(preview).not.toBeNull();
    expect(preview!.className).toContain('h-36');
  });

  it('hides how-to and Edit data in readOnly', () => {
    render(
      <ChartComponent data={sample} readOnly={true} onChange={() => {}} />
    );
    expect(
      screen.queryByText(
        'Paste CSV (first row = headers) or one series per line: Revenue:10,20,30'
      )
    ).toBeNull();
    expect(screen.queryByText('Edit data')).toBeNull();
    expect(document.querySelector('svg')).not.toBeNull();
  });

  it('does not crash when labels and series are missing', () => {
    expect(() =>
      render(
        <ChartComponent
          data={{} as ChartBlockData}
          readOnly={false}
          onChange={() => {}}
        />
      )
    ).not.toThrow();
  });
});
