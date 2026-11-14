import { EventReactions } from '@/components/events/EventReactions';
import { EventItem } from '@/services/events/eventTypes';
import { IUser } from '@/services/models/user';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { add, remove } = vi.hoisted(() => ({ add: vi.fn(), remove: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock('@/services/events/eventsApi', () => ({
  addReaction: add,
  removeReaction: remove,
  eventError: () => 'Local failure',
}));
vi.mock('@the-monkeys/ui/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));
const event: EventItem = {
  id: 1,
  slug: 'local',
  title: 'Workshop',
  status: 'published',
  event_type: 'virtual',
  reactions: [{ reaction_type: 'like', count: 2 }],
};
const viewer = { username: 'local_viewer' } as IUser;
beforeEach(() => {
  vi.clearAllMocks();
  add.mockResolvedValue({});
  remove.mockResolvedValue({});
});
afterEach(cleanup);

describe('event reactions after public hydration', () => {
  it('ignores an old request after logout and sign-in to the same account', async () => {
    let rejectFirst!: (error: Error) => void;
    let finishSecond!: (value: unknown) => void;
    add.mockImplementationOnce(
      () =>
        new Promise((_resolve, reject) => {
          rejectFirst = reject;
        })
    );
    add.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishSecond = resolve;
        })
    );
    const { rerender } = render(
      <EventReactions event={event} session={viewer} />
    );
    fireEvent.click(screen.getByTitle('Like', { exact: true }));
    rerender(<EventReactions event={event} session={null} />);
    rerender(<EventReactions event={event} session={viewer} />);
    fireEvent.click(screen.getByTitle('Like', { exact: true }));
    await act(async () => rejectFirst(new Error('Old local request failed')));
    expect(
      screen.getByTitle('Like', { exact: true }).getAttribute('aria-pressed')
    ).toBe('true');
    expect(
      screen
        .getByText('Like', { selector: 'span' })
        .closest('button')
        ?.getAttribute('aria-busy')
    ).toBe('true');
    fireEvent.click(screen.getByTitle('Like', { exact: true }));
    expect(add).toHaveBeenCalledTimes(2);
    expect(remove).not.toHaveBeenCalled();
    await act(async () => finishSecond({}));
    expect(
      screen.getByTitle('Like', { exact: true }).getAttribute('aria-pressed')
    ).toBe('true');
  });
  it('reconciles viewer reactions and sends remove when a signed-in refresh reveals an existing like', async () => {
    const { rerender } = render(
      <EventReactions event={event} session={viewer} />
    );
    rerender(
      <EventReactions
        event={{ ...event, viewer_reactions: ['like'] }}
        session={viewer}
      />
    );
    const like = screen.getByTitle('Like', { exact: true });
    await waitFor(() => expect(like.getAttribute('aria-pressed')).toBe('true'));
    fireEvent.click(like);
    await waitFor(() => expect(remove).toHaveBeenCalledWith('local', 'like'));
    expect(add).not.toHaveBeenCalled();
  });
  it('keeps an in-flight optimistic like while a public snapshot refreshes', async () => {
    let finish!: (value: unknown) => void;
    add.mockImplementation(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        })
    );
    const { rerender } = render(
      <EventReactions event={event} session={viewer} />
    );
    const like = screen.getByTitle('Like', { exact: true });
    fireEvent.click(like);
    rerender(
      <EventReactions
        event={{
          ...event,
          reactions: [{ reaction_type: 'like', count: 5 }],
          viewer_reactions: [],
        }}
        session={viewer}
      />
    );
    expect(like.getAttribute('aria-pressed')).toBe('true');
    await act(async () => finish({}));
    expect(like.getAttribute('aria-pressed')).toBe('true');
    expect(add).toHaveBeenCalledTimes(1);
  });
});
