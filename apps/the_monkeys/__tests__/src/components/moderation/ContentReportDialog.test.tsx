import React from 'react';

import { ContentReportDialog } from '@/components/moderation/ContentReportDialog';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mock = vi.hoisted(() => ({
  auth: { data: { account_id: 'reader' } as any, isLoading: false },
  report: vi.fn(),
  toast: vi.fn(),
  refresh: vi.fn(),
  notify: vi.fn(),
}));
vi.mock('@/hooks/auth/useAuth', () => ({ default: () => mock.auth }));
vi.mock('@/services/moderation/moderationApi', () => ({
  reportContent: mock.report,
}));
vi.mock('@the-monkeys/ui/hooks/use-toast', () => ({ toast: mock.toast }));
vi.mock('@/lib/contentRatingEvents', () => ({
  notifyContentRating: mock.notify,
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mock.refresh }),
}));

const close = vi.fn();
function mount() {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <ContentReportDialog
        target={{ kind: 'discussion', id: 'post' }}
        open
        onOpenChange={close}
      />
    </QueryClientProvider>
  );
}
afterEach(() => cleanup());
beforeEach(() => {
  vi.clearAllMocks();
  mock.auth = { data: { account_id: 'reader' }, isLoading: false };
  mock.report.mockResolvedValue({ report: { id: 1, status: 'pending' } });
});
function submit() {
  fireEvent.change(screen.getByLabelText('Reason'), {
    target: { value: 'nsfw' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Submit report' }));
}
describe('ContentReportDialog', () => {
  it('saves a normal report for review and uses the original target', async () => {
    mount();
    submit();
    await waitFor(() => expect(close).toHaveBeenCalledWith(false));
    expect(mock.report).toHaveBeenCalledWith(
      { kind: 'discussion', id: 'post' },
      { reason: 'nsfw', details: '' }
    );
    expect(mock.toast.mock.calls[0][0].description).toMatch(/review/i);
  });
  it('only claims immediate restriction when the server confirms it', async () => {
    mock.report.mockResolvedValue({
      report: { id: 2, status: 'action_taken' },
    });
    mount();
    submit();
    await waitFor(() => expect(mock.refresh).toHaveBeenCalled());
    expect(mock.toast.mock.calls[0][0].description).toMatch(/marked NSFW/i);
  });
  it('recognizes the persisted confirmed_nsfw status returned by the backend', async () => {
    const access = { is_nsfw: true, revision: 2 };
    mock.report.mockResolvedValue({
      report: { id: 3, status: 'confirmed_nsfw' },
      access,
    });
    mount();
    submit();
    await waitFor(() => expect(close).toHaveBeenCalledWith(false));
    expect(mock.toast.mock.calls[0][0].description).toMatch(/marked NSFW/i);
    expect(mock.notify).toHaveBeenCalledWith(
      { kind: 'discussion', id: 'post' },
      access
    );
  });
  it('prevents duplicate clicks before the first render finishes', async () => {
    mock.report.mockReturnValue(new Promise(() => {}));
    mount();
    submit();
    fireEvent.click(screen.getByRole('button', { name: /submitting/i }));
    expect(mock.report).toHaveBeenCalledTimes(1);
  });
  it('keeps the form open with a safe error on failure', async () => {
    mock.report.mockRejectedValue(new Error('secret database detail'));
    mount();
    submit();
    const error = await screen.findByRole('alert');
    expect(error.textContent).not.toContain('secret');
    expect(close).not.toHaveBeenCalled();
    expect(mock.toast).not.toHaveBeenCalled();
  });
  it('asks anonymous users to sign in', () => {
    mock.auth.data = undefined;
    mount();
    expect(screen.getByRole('link', { name: /log in/i })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Submit report' })).toBeNull();
  });
});
