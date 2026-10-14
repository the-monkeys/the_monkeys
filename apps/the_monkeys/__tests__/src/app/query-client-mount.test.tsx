import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@tanstack/react-query-devtools', () => ({
  ReactQueryDevtools: () => <aside aria-label='React Query Devtools' />,
}));

describe('QueryClientMount', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('does not render development tools in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { QueryClientMount } = await import('@/app/query-client-mount');

    render(
      <QueryClientMount>
        <p>Application</p>
      </QueryClientMount>
    );

    expect(screen.getByText('Application')).toBeDefined();
    expect(screen.queryByLabelText('React Query Devtools')).toBeNull();
  });
});
