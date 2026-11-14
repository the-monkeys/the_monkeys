// @vitest-environment node
import SnapshotNewPage from '@/app/snapshot/new/page';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/snapshot/new',
  useRouter: () => ({ replace: vi.fn() }),
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
vi.mock('@/components/StudioTabs', () => ({
  StudioTabs: ({ active }: { active: string }) => (
    <nav aria-label={`Studio ${active}`} />
  ),
}));
vi.mock('@/features/snapshot/components/SnapshotStudio', () => ({
  SnapshotStudio: ({ previewMode }: { previewMode: string }) => (
    <p>Preview mode: {previewMode}</p>
  ),
}));

describe('server-selected Studio mode', () => {
  it.each([
    ['x', 'x'],
    ['template', 'template'],
    [undefined, 'template'],
  ] as const)('renders %s before browser effects', (view, expected) => {
    const html = renderToStaticMarkup(
      <SnapshotNewPage searchParams={{ view }} />
    );
    expect(html).toContain(`aria-label="Studio ${expected}"`);
    expect(html).toContain(`Preview mode: ${expected}`);
  });
});
