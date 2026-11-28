import { createMenuItems } from '@/lib/createMenuItems';
import { describe, expect, it } from 'vitest';

describe('createMenuItems', () => {
  it('lists discussion before post on site and omits create group on group', () => {
    expect(createMenuItems('site').map((i) => i.id)).toEqual([
      'discussion',
      'post',
      'event',
      'group',
    ]);
    expect(createMenuItems('group').map((i) => i.id)).toEqual([
      'discussion',
      'post',
      'event',
    ]);
  });

  it('uses Create Discussion as the first label', () => {
    expect(createMenuItems('site')[0].label).toBe('Create Discussion');
  });

  it('hides Create Event for members who cannot host events', () => {
    expect(
      createMenuItems('group', { includeEvent: false }).map((i) => i.id)
    ).toEqual(['discussion', 'post']);
    expect(createMenuItems('site', { includeEvent: false }).map((i) => i.id)).toEqual(
      ['discussion', 'post', 'event', 'group']
    );
  });
});
