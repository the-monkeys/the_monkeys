import { describe, expect, it } from 'vitest';

import {
  carouselSlide2Body,
  carouselSlide3Body,
  splitDescriptionForCarousel,
} from './carouselSlides';

describe('carouselSlides', () => {
  it('slide 2 uses description excerpt, not pull-quote field', () => {
    const description =
      'First paragraph hook that should appear on slide two. ' +
      'Second part continues on slide three with more detail.';
    const slide2 = carouselSlide2Body(description, 'Title');
    expect(slide2).not.toBe('This is only a pull quote');
    expect(slide2.length).toBeGreaterThan(0);
    expect(slide2).toContain('First');
  });

  it('splits long copy on word boundaries', () => {
    const words = Array.from({ length: 40 }, (_, i) => `word${i}`).join(' ');
    const [a, b] = splitDescriptionForCarousel(words);
    expect(a.split(/\s+/).length).toBe(20);
    expect(b.split(/\s+/).length).toBe(20);
  });

  it('slide 3 prefers second half when present', () => {
    const description = Array.from({ length: 40 }, (_, i) => `w${i}`).join(' ');
    const slide3 = carouselSlide3Body(description, 'Title');
    const [, second] = splitDescriptionForCarousel(description);
    expect(slide3).toBe(second);
  });
});
