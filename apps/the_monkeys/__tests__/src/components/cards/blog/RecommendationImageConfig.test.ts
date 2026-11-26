import { imageConfigDefault } from 'next/dist/shared/lib/image-config';
import loader from 'next/dist/shared/lib/image-loader';

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import nextConfig from '../../../../../next.config.mjs';

describe('recommendation images with the real Next configuration', () => {
  it('uses an allowed quality in the actual image optimizer', () => {
    const source = readFileSync(
      'src/components/cards/blog/TrendingBlogCard.tsx',
      'utf8'
    ).split('export const TrendingBlogCardSmall')[1];
    const quality = Number(source.match(/quality=\{(\d+)\}/)?.[1]);
    expect(() =>
      loader({
        config: { ...imageConfigDefault, ...nextConfig.images },
        src: '/api/v2/storage/posts/example/image.png',
        width: 640,
        quality,
      })
    ).not.toThrow();
  });
});
