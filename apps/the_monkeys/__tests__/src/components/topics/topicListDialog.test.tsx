import TopicListDialog from '@/components/topics/topicListDialog';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, expect, it, vi } from 'vitest';

const topics = ['Smart home privacy', 'Technology'];
afterEach(cleanup);

it('hydrates the real topic trigger without invalid nested buttons or client recovery', async () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  container.innerHTML = renderToString(<TopicListDialog topics={topics} />);
  const recover = vi.fn();
  try {
    expect(container.querySelectorAll('button')).toHaveLength(1);
    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(container, <TopicListDialog topics={topics} />, {
        onRecoverableError: recover,
      });
    });
    expect(recover).not.toHaveBeenCalled();
    await act(async () => root.unmount());
  } finally {
    container.remove();
  }
});

it('keeps the styled trigger, topic destinations and close action working', async () => {
  render(<TopicListDialog topics={topics} />);
  const trigger = screen.getByRole('button', { name: 'show all...' });
  expect(trigger.className).toContain('inline-flex');
  fireEvent.click(trigger);
  const dialog = await screen.findByRole('dialog');
  expect(
    within(dialog)
      .getByRole('link', { name: /Smart home privacy/i })
      .getAttribute('href')
  ).toBe('/topics/smart-home-privacy');
  expect(
    within(dialog)
      .getByRole('link', { name: /Technology/i })
      .getAttribute('href')
  ).toBe('/topics/technology');
  fireEvent.click(
    within(dialog).getByRole('button', { name: 'Close', exact: true })
  );
  await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
});
