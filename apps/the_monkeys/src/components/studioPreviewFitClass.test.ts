import { describe, expect, it } from 'vitest';

import { studioPreviewFitClass } from './StudioPreviewSticky';

describe('studioPreviewFitClass', () => {
  it('is mobile-first width caps with no locked height or aspect', () => {
    expect(studioPreviewFitClass).toContain('w-full');
    expect(studioPreviewFitClass).toContain('sm:max-w-[420px]');
    expect(studioPreviewFitClass).toContain('md:max-w-[520px]');
    expect(studioPreviewFitClass).toContain('lg:max-w-[560px]');
    expect(studioPreviewFitClass).not.toContain('h-80');
    expect(studioPreviewFitClass).not.toContain('max-w-[280px]');
    expect(studioPreviewFitClass).not.toContain('aspect-[');
    expect(studioPreviewFitClass).not.toContain('min(');
    expect(studioPreviewFitClass).not.toContain('svh');
    expect(studioPreviewFitClass).not.toContain('w-auto');
  });
});
