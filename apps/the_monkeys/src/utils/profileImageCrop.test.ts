import { describe, expect, it } from 'vitest';

import { getCropSourceCoordinates } from './profileImageCrop';

describe('getCropSourceCoordinates', () => {
  it('maps a crop selection to the source image coordinates', () => {
    const result = getCropSourceCoordinates({
      imageDimensions: { width: 1200, height: 800 },
      crop: { x: 25, y: 10, width: 50, height: 50, unit: '%' },
      frameSize: 320,
    });

    expect(result).toEqual({
      sourceX: 300,
      sourceY: 80,
      sourceWidth: 600,
      sourceHeight: 400,
      outputSize: 600,
    });
  });
});
