import { describe, expect, it } from 'vitest';

import { fitPreviewScale } from './fitPreviewScale';

describe('fitPreviewScale', () => {
  it('scales 4:5 editorial by width only', () => {
    const r = fitPreviewScale(1080, 1350, 360);
    expect(r.scale).toBeCloseTo(360 / 1080);
    expect(r.scaledWidth).toBeCloseTo(360);
    expect(r.scaledHeight).toBeCloseTo(450);
  });

  it('scales 1:1 quote to a square, not a 4:5 box', () => {
    const r = fitPreviewScale(1080, 1080, 360);
    expect(r.scaledWidth).toBeCloseTo(360);
    expect(r.scaledHeight).toBeCloseTo(360);
  });

  it('scales 16:9 X share landscape', () => {
    const r = fitPreviewScale(1200, 675, 360);
    expect(r.scaledWidth).toBeCloseTo(360);
    expect(r.scaledHeight).toBeCloseTo(360 * (675 / 1200));
  });

  it('scales LinkedIn 1200x627', () => {
    const r = fitPreviewScale(1200, 627, 360);
    expect(r.scaledHeight).toBeCloseTo(360 * (627 / 1200));
  });

  it('scales Instagram carousel 3240x1350', () => {
    const r = fitPreviewScale(3240, 1350, 360);
    expect(r.scaledWidth).toBeCloseTo(360);
    expect(r.scaledHeight).toBeCloseTo(360 * (1350 / 3240));
  });

  it('scales story 9:16 by width (taller well, no letterbox)', () => {
    const r = fitPreviewScale(1080, 1920, 360);
    expect(r.scaledWidth).toBeCloseTo(360);
    expect(r.scaledHeight).toBeCloseTo(640);
  });

  it('scales business card 1050x600', () => {
    const r = fitPreviewScale(1050, 600, 360);
    expect(r.scaledWidth).toBeCloseTo(360);
    expect(r.scaledHeight).toBeCloseTo(360 * (600 / 1050));
  });

  it('does not upscale past native size', () => {
    const r = fitPreviewScale(1080, 1350, 2000);
    expect(r.scale).toBe(1);
    expect(r.scaledWidth).toBe(1080);
    expect(r.scaledHeight).toBe(1350);
  });

  it('returns zeros when width is not measurable yet', () => {
    expect(fitPreviewScale(1080, 1350, 0)).toEqual({
      scale: 0,
      scaledWidth: 0,
      scaledHeight: 0,
    });
  });
});
