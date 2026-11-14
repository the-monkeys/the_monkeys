import SnapshotNewClient from '@/app/snapshot/new/SnapshotNewClient';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock('next/navigation', () => ({
  usePathname: () => '/snapshot/new',
  useRouter: () => ({ replace }),
}));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: undefined }),
}));
vi.mock('@/hooks/user/useGetAuthUserProfile', () => ({
  default: () => ({ data: undefined }),
}));
vi.mock('@/features/snapshot/hooks/useSnapshotAuthor', () => ({
  useSnapshotAuthor: () => ({ author: undefined }),
}));
vi.mock('@/features/snapshot/components/SnapshotStudio', () => ({
  SnapshotStudio: ({ previewMode }: { previewMode: string }) => (
    <p>Preview mode: {previewMode}</p>
  ),
}));

beforeEach(() => {
  localStorage.clear();
  replace.mockReset();
  window.history.replaceState({}, '', '/snapshot/new');
});
afterEach(cleanup);

describe('Studio search entry compatibility', () => {
  const expectMatchingFaq = (container: HTMLElement) => {
    const faq = Array.from(
      container.querySelectorAll('script[type="application/ld+json"]')
    )
      .map((script) => JSON.parse(script.textContent || '{}'))
      .find((schema) => schema['@type'] === 'FAQPage');
    expect(faq).toBeDefined();
    const questions = screen
      .getAllByRole('heading', { level: 3 })
      .map((heading) => heading.textContent);
    expect(
      faq.mainEntity.map((question: { name: string }) => question.name)
    ).toEqual(questions);
    for (const question of faq.mainEntity) {
      expect(screen.getByText(question.acceptedAnswer.text)).toBeTruthy();
    }
  };
  it('keeps the heading and help in sync when changing tabs and preserves other query parameters', () => {
    window.history.replaceState({}, '', '/snapshot/new?source=learn');
    const { container } = render(<SnapshotNewClient />);
    fireEvent.click(screen.getByRole('tab', { name: 'X screenshot' }));
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Free X / Twitter screenshot generator'
    );
    expect(
      screen.getByRole('heading', { name: 'How to make an X screenshot' })
    ).toBeTruthy();
    expect(
      screen.queryByRole('heading', { name: 'How to create a social image' })
    ).toBeNull();
    expect(replace).toHaveBeenLastCalledWith(
      '/snapshot/new?source=learn&view=x',
      { scroll: false }
    );
    expect(localStorage.getItem('monkeys_studio_view')).toBe('x');
    expectMatchingFaq(container);
    fireEvent.click(screen.getByRole('tab', { name: 'Image template' }));
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Free social image studio'
    );
    expect(
      screen.getByRole('heading', { name: 'How to create a social image' })
    ).toBeTruthy();
    expectMatchingFaq(container);
  });

  it('preserves explicit X deep links over the stored template preference', () => {
    localStorage.setItem('monkeys_studio_view', 'template');
    window.history.replaceState({}, '', '/snapshot/new?view=x');
    render(<SnapshotNewClient initialView='x' />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'X / Twitter'
    );
    expect(screen.getByText('Preview mode: x')).toBeTruthy();
  });

  it('restores the saved X preference when the URL has no mode', () => {
    localStorage.setItem('monkeys_studio_view', 'x');
    const { container } = render(<SnapshotNewClient />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain(
      'X / Twitter'
    );
    expect(screen.getByText('Preview mode: x')).toBeTruthy();
    expectMatchingFaq(container);
  });
});
