import React from 'react';

import { ContentLabelToggle } from '@/components/moderation/ContentLabelToggle';
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
  save: vi.fn(),
  toast: vi.fn(),
  refresh: vi.fn(),
}));
vi.mock('@/services/moderation/moderationApi', () => ({
  setNSFWLabel: mock.save,
}));
vi.mock('@the-monkeys/ui/hooks/use-toast', () => ({ toast: mock.toast }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mock.refresh }),
}));

afterEach(() => cleanup());
beforeEach(() => {
  vi.clearAllMocks();
  mock.save.mockResolvedValue({ access: { is_nsfw: true } });
});
function mount(props: any = {}) {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <ContentLabelToggle target={{ kind: 'blog', id: 'post' }} {...props} />
    </QueryClientProvider>
  );
}
describe('author content rating', () => {
  it('tells publishing controls that the selected rating is unsaved', () => {
    const dirty = vi.fn();
    mount({ onDirtyChange: dirty });
    fireEvent.click(screen.getByRole('checkbox'));
    expect(dirty).toHaveBeenLastCalledWith(true);
  });
  it('holds the publish lock until the server confirms the rating', async () => {
    const pending = vi.fn(),
      dirty = vi.fn();
    let finish: (v: any) => void = () => {};
    mock.save.mockReturnValue(
      new Promise((r) => {
        finish = r;
      })
    );
    mount({ onPendingChange: pending, onDirtyChange: dirty });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Save rating' }));
    expect(pending).toHaveBeenLastCalledWith(true);
    finish({ access: { is_nsfw: true } });
    await waitFor(() => expect(pending).toHaveBeenLastCalledWith(false));
    expect(dirty).toHaveBeenLastCalledWith(false);
  });
  it('does not remove an effective moderation restriction locally', async () => {
    mount({ initialMarked: true });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Save rating' }));
    await waitFor(() => expect(mock.toast).toHaveBeenCalled());
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(
      true
    );
    expect(mock.toast.mock.calls[0][0].description).toMatch(/still applies/);
  });
  it('keeps unsaved changes on failure and does not claim success', async () => {
    const dirty = vi.fn();
    mock.save.mockRejectedValue(new Error('private diagnostic'));
    mount({ onDirtyChange: dirty });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Save rating' }));
    const error = await screen.findByRole('alert');
    expect(error.textContent).not.toContain('private');
    expect(dirty).toHaveBeenLastCalledWith(true);
    expect(mock.toast).not.toHaveBeenCalled();
  });
});
