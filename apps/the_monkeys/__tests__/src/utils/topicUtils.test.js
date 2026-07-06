import { createTopicUrl, slugToTopic, topicToSlug } from '@/utils/topicUtils';
import { describe, expect, it } from 'vitest';

describe('topicToSlug', () => {
  it('Converts topic name with spaces to hyphenated slug', () => {
    expect(topicToSlug('machine learning')).toBe('machine-learning');
  });

  it('Lowercases topic names', () => {
    expect(topicToSlug('Artificial Intelligence')).toBe(
      'artificial-intelligence'
    );
  });

  it('Removes special characters', () => {
    expect(topicToSlug('node.js & react!')).toBe('nodejs-react');
  });

  it('Collapses multiple hyphens', () => {
    expect(topicToSlug('a   b')).toBe('a-b');
  });

  it('Trims leading and trailing hyphens', () => {
    expect(topicToSlug(' hello world ')).toBe('hello-world');
  });

  it('Returns empty string for falsy input', () => {
    expect(topicToSlug('')).toBe('');
    expect(topicToSlug(null)).toBe('');
    expect(topicToSlug(undefined)).toBe('');
  });

  it('Is idempotent for already-slugified input', () => {
    expect(topicToSlug('machine-learning')).toBe('machine-learning');
  });
});

describe('slugToTopic', () => {
  it('Converts slug to title-cased topic name', () => {
    expect(slugToTopic('machine-learning')).toBe('Machine Learning');
  });

  it('Handles single word slugs', () => {
    expect(slugToTopic('javascript')).toBe('Javascript');
  });

  it('Returns empty string for falsy input', () => {
    expect(slugToTopic('')).toBe('');
  });
});

describe('createTopicUrl', () => {
  it('Returns correct URL path for a topic', () => {
    expect(createTopicUrl('machine learning')).toBe('/topics/machine-learning');
  });
});
