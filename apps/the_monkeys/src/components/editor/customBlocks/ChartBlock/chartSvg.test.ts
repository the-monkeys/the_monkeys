import { describe, expect, it } from 'vitest';

import type { ChartBlockData } from '../shared/types';
import { generateChartMarkup } from './chartSvg';

const sample: ChartBlockData = {
  type: 'line',
  title: '',
  xLabel: '',
  yLabel: '',
  showLegend: true,
  palette: 'ocean',
  labels: ['Jan', 'Feb', 'Mar'],
  series: [{ name: 'Series A', values: [12, 24, 18] }],
  source: 'manual',
};

describe('generateChartMarkup', () => {
  it('emits a full-width SVG and does not use the old faint axis color', () => {
    const html = generateChartMarkup(sample);
    expect(html).toContain('<svg');
    expect(html).toContain('viewBox="0 0 600 180"');
    expect(html).toContain('width:100%');
    expect(html).toContain('max-height:11rem');
    expect(html).toContain('currentColor');
    expect(html).not.toContain('rgba(100,116,139,0.7)');
  });

  it('prints a zero Y tick as 0, not 0.00', () => {
    const html = generateChartMarkup(sample);
    expect(html).toContain('>0</text>');
    expect(html).not.toContain('0.00');
  });

  it('keeps a bar chart working from old JSON', () => {
    const html = generateChartMarkup({
      ...sample,
      type: 'bar',
      labels: ['A'],
      series: [{ name: 'S', values: [1] }],
    });
    expect(html).toContain('<rect');
  });

  it('renders pie as a conic-gradient div, not an empty string', () => {
    const html = generateChartMarkup({
      ...sample,
      type: 'pie',
      labels: ['A', 'B'],
      series: [{ name: 'S', values: [1, 2] }],
    });
    expect(html).toContain('conic-gradient');
    expect(html).not.toContain('<svg');
  });

  it('does not throw when labels or series are missing', () => {
    expect(() => generateChartMarkup({} as ChartBlockData)).not.toThrow();
    expect(() =>
      generateChartMarkup({ type: 'pie' } as ChartBlockData)
    ).not.toThrow();
  });
});
