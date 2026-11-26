/* eslint-disable @next/next/no-img-element -- Native test images verify protected children never mount. */
import React from 'react';

import { ContentGate } from '@/components/moderation/ContentGate';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  auth: { data: undefined as any, isLoading: false },
  get: vi.fn(),
  reveal: vi.fn(),
  push: vi.fn(),
  refresh: vi.fn(),
  pathname: '/discussions/post',
}));
vi.mock('@/hooks/auth/useAuth', () => ({ default: () => mocks.auth }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push, refresh: mocks.refresh }),
  usePathname: () => mocks.pathname,
}));
vi.mock('@/services/moderation/moderationApi', () => ({
  getContentAccess: mocks.get,
  revealContent: mocks.reveal,
}));

const target = { kind: 'discussion' as const, id: 'post' };
const restricted = {
  is_nsfw: true,
  content_rating: {
    is_nsfw: true,
    revision: 1,
    revealed: false,
    reason: 'login_required',
  },
};
function mount(content: any = restricted) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <ContentGate target={target} content={content}>
        <img src='/secret.jpg' alt='secret image' />
        <p>secret body</p>
      </ContentGate>
    </QueryClientProvider>
  );
}
afterEach(() => cleanup());
beforeEach(() => {
  vi.clearAllMocks();
  mocks.auth = { data: undefined, isLoading: false };
  mocks.pathname = '/discussions/post';
  mocks.get.mockResolvedValue({
    is_nsfw: true,
    can_reveal: false,
    reason: 'dob_required',
  });
  mocks.reveal.mockResolvedValue({ access: { is_nsfw: true, revealed: true } });
});
describe('ContentGate', () => {
  it('preserves old safe responses without a query provider', () => {
    render(
      <ContentGate target={target} content={{}}>
        <p>ordinary article</p>
      </ContentGate>
    );
    expect(screen.getByText('ordinary article')).toBeTruthy();
    expect(mocks.get).not.toHaveBeenCalled();
  });
  it('never mounts restricted text or images for anonymous visitors', () => {
    mount();
    expect(screen.queryByText('secret body')).toBeNull();
    expect(screen.queryByAltText('secret image')).toBeNull();
    expect(
      screen.getByRole('link', { name: /log in/i }).getAttribute('href')
    ).toContain('callbackURL');
  });
  it('asks for a missing birthday and preserves a safe return path', async () => {
    mocks.auth.data = { account_id: 'adult' };
    mount();
    const link = await screen.findByRole('link', {
      name: /add your birthday/i,
    });
    expect(link.getAttribute('href')).toContain('returnTo=');
    expect(screen.queryByText('secret body')).toBeNull();
  });
  it('does not give an underage account a reveal button', async () => {
    mocks.auth.data = { account_id: 'young' };
    mocks.get.mockResolvedValue({
      is_nsfw: true,
      reason: 'underage',
      can_reveal: false,
    });
    mount();
    await screen.findByText(/18 or older/i);
    expect(screen.queryByRole('button', { name: /show content/i })).toBeNull();
    expect(screen.queryByText('secret body')).toBeNull();
  });
  it('requires fresh account policy even if cached props say revealed', async () => {
    mocks.auth.data = { account_id: 'other' };
    mocks.get.mockResolvedValue({
      is_nsfw: true,
      can_reveal: false,
      reason: 'underage',
    });
    mount({
      ...restricted,
      content_rating: { ...restricted.content_rating, revealed: true },
    });
    await waitFor(() => expect(mocks.get).toHaveBeenCalled());
    expect(screen.queryByText('secret body')).toBeNull();
  });
  it('reveals only after explicit consent and prevents rapid duplicate clicks', async () => {
    mocks.auth.data = { account_id: 'adult' };
    mocks.get.mockResolvedValue({
      is_nsfw: true,
      can_reveal: true,
      reason: 'reveal_required',
    });
    let finish: (v: any) => void = () => {};
    mocks.reveal.mockReturnValue(
      new Promise((r) => {
        finish = r;
      })
    );
    mount();
    const button = await screen.findByRole('button', { name: /show content/i });
    fireEvent.click(button);
    fireEvent.click(button);
    expect(mocks.reveal).toHaveBeenCalledTimes(1);
    finish({ access: { is_nsfw: true, revealed: true } });
    await waitFor(() => expect(mocks.refresh).toHaveBeenCalled());
  });
  it('allows a freshly authorised account and hides again on logout', async () => {
    mocks.auth.data = { account_id: 'adult' };
    mocks.get.mockResolvedValue({
      is_nsfw: true,
      revealed: true,
      can_reveal: true,
    });
    const view = mount({
      ...restricted,
      content_rating: { ...restricted.content_rating, revealed: true },
    });
    await screen.findByText('secret body');
    mocks.auth.data = undefined;
    view.rerender(
      <QueryClientProvider client={new QueryClient()}>
        <ContentGate
          target={target}
          content={{
            ...restricted,
            content_rating: { revealed: true, is_nsfw: true },
          }}
        >
          <p>secret body</p>
        </ContentGate>
      </QueryClientProvider>
    );
    expect(screen.queryByText('secret body')).toBeNull();
  });
  it('keeps content hidden if the policy service fails', async () => {
    mocks.auth.data = { account_id: 'adult' };
    mocks.get.mockRejectedValue(new Error('unavailable'));
    mount({ ...restricted, content_rating: { revealed: true, is_nsfw: true } });
    await screen.findByText(/temporarily unavailable/i);
    expect(screen.queryByText('secret body')).toBeNull();
  });
});

it('blurs a safe cached card immediately after a confirmed staff flag, even if its list is held locally', async () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const older = { is_nsfw: false, content_rating: { target, revision: 1 } };
  function view(content: any) {
    return (
      <QueryClientProvider client={client}>
        <ContentGate target={target} content={content}>
          <p>cached body</p>
        </ContentGate>
      </QueryClientProvider>
    );
  }
  const rendered = render(view(older));
  expect(screen.getByText('cached body')).toBeTruthy();
  window.dispatchEvent(
    new CustomEvent('monkeys:content-rating-changed', {
      detail: {
        target,
        access: {
          target,
          is_nsfw: true,
          revision: 2,
          revealed: false,
          reason: 'login_required',
        },
      },
    })
  );
  await waitFor(() => expect(screen.queryByText('cached body')).toBeNull());
  rendered.rerender(
    view({ ...older, content_rating: { ...older.content_rating } })
  );
  expect(screen.queryByText('cached body')).toBeNull();
  rendered.rerender(
    view({ is_nsfw: false, content_rating: { target, revision: 3 } })
  );
  await screen.findByText('cached body');
});

it.each([
  ['blog', 'Sensitive content'],
  ['discussion', 'Sensitive content'],
  ['event', 'Sensitive event'],
  ['group', 'Sensitive group'],
] as const)(
  'identifies concealed %s with the right accessible label',
  (kind, label) => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <ContentGate target={{ kind, id: 'fixture' }} content={restricted}>
          <p>secret body</p>
        </ContentGate>
      </QueryClientProvider>
    );
    expect(screen.getByRole('region', { name: label })).toBeTruthy();
    expect(screen.getByText(label)).toBeTruthy();
    expect(screen.queryByText('secret body')).toBeNull();
  }
);

it('reveals a homepage card without navigating away or refreshing unrelated data', async () => {
  mocks.pathname = '/';
  mocks.auth.data = { account_id: 'adult' };
  mocks.get.mockResolvedValue({
    is_nsfw: true,
    can_reveal: true,
    reason: 'reveal_required',
  });
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const unrelated = vi.fn(async () => 'unchanged');
  await client.fetchQuery({ queryKey: ['user', 'adult'], queryFn: unrelated });
  const view = render(
    <QueryClientProvider client={client}>
      <ContentGate
        target={target}
        content={restricted}
        href='/discussions/post'
      >
        <p>secret body</p>
      </ContentGate>
    </QueryClientProvider>
  );
  fireEvent.click(await screen.findByRole('button', { name: 'Show content' }));
  await waitFor(() => expect(mocks.reveal).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(mocks.get).toHaveBeenCalledTimes(2));
  expect(mocks.push).not.toHaveBeenCalled();
  expect(mocks.refresh).not.toHaveBeenCalled();
  expect(unrelated).toHaveBeenCalledTimes(1);
  view.unmount();
});
it('honours a remembered reveal while waiting for the authorised card, without asking again', async () => {
  mocks.pathname = '/';
  mocks.auth.data = { account_id: 'adult' };
  mocks.get.mockResolvedValue({
    is_nsfw: true,
    can_reveal: true,
    revealed: true,
    revision: 1,
  });
  const view = mount();
  await waitFor(() => expect(mocks.get).toHaveBeenCalled());
  expect(screen.queryByRole('button', { name: 'Show content' })).toBeNull();
  expect(mocks.reveal).not.toHaveBeenCalled();
  expect(screen.queryByText('secret body')).toBeNull();
  view.unmount();
});

it('keeps a neutral protected placeholder until the session is known', () => {
  mocks.auth = { data: undefined, isLoading: true };
  mount();
  expect(screen.queryByRole('link', { name: /log in/i })).toBeNull();
  expect(
    screen.getByRole('status', { name: 'Loading sensitive content' })
  ).toBeTruthy();
  expect(screen.queryByText('secret body')).toBeNull();
  expect(screen.queryByAltText('secret image')).toBeNull();
});
it('does not refresh the whole homepage when the signed-in viewer becomes known', async () => {
  mocks.pathname = '/';
  mocks.auth = { data: undefined, isLoading: true };
  const view = mount();
  mocks.auth = { data: { account_id: 'adult' }, isLoading: false };
  mocks.get.mockResolvedValue({
    is_nsfw: true,
    can_reveal: true,
    revealed: true,
    revision: 1,
  });
  view.rerender(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <ContentGate target={target} content={restricted}>
        <p>secret body</p>
      </ContentGate>
    </QueryClientProvider>
  );
  await waitFor(() => expect(mocks.get).toHaveBeenCalled());
  expect(mocks.refresh).not.toHaveBeenCalled();
  expect(screen.queryByText('secret body')).toBeNull();
});

it.each([true, false])(
  'preserves a caller gate footprint while session loading is %s without mounting private content',
  (isLoading) => {
    mocks.auth = { data: undefined, isLoading };
    render(
      <QueryClientProvider client={new QueryClient()}>
        <ContentGate
          target={target}
          content={restricted}
          gateClassName='min-h-[calc(56.25vw+13.5rem)] sm:min-h-[254px]'
        >
          <img src='/secret.jpg' alt='secret image' />
          <p>secret body</p>
        </ContentGate>
      </QueryClientProvider>
    );
    const gate = screen.getByRole('region', { name: 'Sensitive content' });
    expect(gate.classList.contains('min-h-[calc(56.25vw+13.5rem)]')).toBe(true);
    expect(gate.classList.contains('sm:min-h-[254px]')).toBe(true);
    expect(screen.queryByText('secret body')).toBeNull();
    expect(screen.queryByAltText('secret image')).toBeNull();
    if (isLoading) {
      expect(
        screen.getByRole('status', { name: 'Loading sensitive content' })
      ).toBeTruthy();
      expect(screen.queryByRole('link', { name: /log in/i })).toBeNull();
    } else {
      expect(screen.getByRole('link', { name: /log in/i })).toBeTruthy();
    }
  }
);

it('does not apply gate-only geometry to an ordinary article', () => {
  const view = render(
    <ContentGate
      target={target}
      content={{}}
      gateClassName='min-h-[calc(56.25vw+13.5rem)]'
    >
      <article>ordinary article</article>
    </ContentGate>
  );
  expect(view.container.firstElementChild?.tagName).toBe('ARTICLE');
  expect(
    screen.queryByRole('region', { name: 'Sensitive content' })
  ).toBeNull();
});
