import { describe, expect, it } from 'vitest';

import { buildSparklineSvg, computeTrend } from './trendMath';

describe('computeTrend', () => {
  it('matches the stored default sample', () => {
    const t = computeTrend(['Jan', 'Feb', 'Mar'], [100, 118, 121]);
    expect(t.direction).toBe('up');
    expect(t.percentChange).toBe(21);
    expect(t.delta).toBe(21);
  });

  it('returns flat with empty values', () => {
    const t = computeTrend(['Jan'], []);
    expect(t.direction).toBe('flat');
    expect(t.values).toEqual([]);
    expect(t.percentChange).toBeNull();
  });
});

describe('buildSparklineSvg', () => {
  it('is full width and does not cap at 200px', () => {
    const svg = buildSparklineSvg([100, 118, 121], 'up');
    expect(svg).toContain('<svg');
    expect(svg).toContain('width:100%');
    expect(svg).toContain('preserveAspectRatio="none"');
    expect(svg).not.toContain('max-width:200px');
  });

  it('returns empty string for a single point', () => {
    expect(buildSparklineSvg([10], 'flat')).toBe('');
  });
});
