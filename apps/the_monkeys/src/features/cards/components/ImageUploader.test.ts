import { describe, expect, it } from 'vitest';

import { resizeImageDimensions } from './ImageUploader';

describe('ImageUploader resize logic', () => {
  it('scales down dimensions proportionally when exceeding maxDim', () => {
    // 2000 x 1000 with maxDim = 512 => 512 x 256
    const { width, height } = resizeImageDimensions(2000, 1000, 512);
    expect(width).toBe(512);
    expect(height).toBe(256);
  });

  it('preserves dimensions when already within maxDim', () => {
    const { width, height } = resizeImageDimensions(300, 200, 512);
    expect(width).toBe(300);
    expect(height).toBe(200);
  });

  it('scales down square or portrait dimensions proportionally', () => {
    const { width, height } = resizeImageDimensions(1200, 2400, 512);
    expect(width).toBe(256);
    expect(height).toBe(512);
  });
});
