import { useRef, useState } from 'react';

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ReadinessPanel } from './ReadinessPanel';
import type { ReadinessReport, ReadinessState } from './types';

function report(overrides: Partial<ReadinessReport> = {}): ReadinessReport {
  return {
    resourceKey: 'post:one',
    accountKey: 'ada',
    revision: 1,
    rulesVersion: 'creator-event-v1',
    kind: 'post',
    publicationState: 'draft',
    seoScore: 100,
    passedCount: 4,
    applicableKnownCount: 4,
    coverage: 'complete',
    visibility: 'public',
    coverageReasons: [],
    preview: {
      title: 'A clear title',
      description: 'A useful summary',
      url: 'https://monkeys.com/blog/clear-title',
    },
    checks: [
      {
        id: 'post.title',
        section: 'seo',
        status: 'pass',
        scored: true,
        label: 'Title',
        finding: 'Title is available',
        reason: 'Helps readers understand the subject',
      },
      {
        id: 'post.topics',
        section: 'seo',
        status: 'improve',
        scored: true,
        label: 'Topics',
        finding: 'Choose a relevant topic',
        reason: 'Helps describe the subject',
        fieldKey: 'topics',
      },
      {
        id: 'post.answers',
        section: 'answers',
        status: 'manual',
        scored: false,
        label: 'Reader question',
        finding: 'Review the intended question',
        reason: 'Structure cannot verify usefulness',
      },
      {
        id: 'post.sources',
        section: 'sources',
        status: 'unknown',
        scored: false,
        label: 'Sources',
        finding: 'Source coverage is unknown',
        reason: 'Some content was not inspected',
      },
      {
        id: 'post.image',
        section: 'seo',
        status: 'not-applicable',
        scored: false,
        label: 'Image',
        finding: 'No image is used',
        reason: 'An image is optional',
      },
    ],
    ...overrides,
  };
}

function show(
  input: {
    state?: ReadinessState;
    report?: ReadinessReport | null;
    onGoToField?: (fieldKey: string) => void;
  } = {}
) {
  const onCheckAgain = vi.fn();
  const onOpenChange = vi.fn();
  const view = render(
    <ReadinessPanel
      open
      onOpenChange={onOpenChange}
      state='current'
      report={report()}
      onCheckAgain={onCheckAgain}
      {...input}
    />
  );
  return { ...view, onCheckAgain, onOpenChange };
}

beforeEach(() => {
  // JSDOM has no animation lifecycle; Radix otherwise waits indefinitely for
  // Vaul's exit animation instead of running its close/focus cleanup.
  const styles = document.createElement('style');
  styles.id = 'readiness-test-no-animation';
  styles.textContent = '* { animation-name: none !important; }';
  document.head.appendChild(styles);
  vi.stubGlobal(
    'matchMedia',
    vi.fn((media: string) => ({
      matches: false,
      media,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  );
});
afterEach(() => {
  cleanup();
  document.getElementById('readiness-test-no-animation')?.remove();
  vi.unstubAllGlobals();
});

describe('ReadinessPanel', () => {
  it('uses an accessible drawer, three named sections and text statuses without a new H1', () => {
    show();
    const dialog = screen.getByRole('dialog', {
      name: 'Search and AI readiness',
    });
    const description = document.getElementById(
      dialog.getAttribute('aria-describedby')!
    );
    expect(description?.textContent).toMatch(/optional.*free/i);
    for (const name of ['SEO', 'Answer readiness', 'Source clarity']) {
      expect(within(dialog).getByRole('heading', { name })).toBeTruthy();
    }
    for (const status of [
      'Passed',
      'Improve',
      'Human review',
      'Unknown',
      'Not applicable',
    ]) {
      expect(within(dialog).getAllByText(status).length).toBeGreaterThan(0);
    }
    expect(dialog.querySelector('h1')).toBeNull();
    expect(screen.getByText('Structure cannot verify usefulness')).toBeTruthy();
    expect(
      screen
        .getByRole('button', { name: 'Close readiness report' })
        .getAttribute('type')
    ).toBe('button');
  });

  it('explains the SEO estimate and keeps manual review visible even with a perfect number', () => {
    show();
    expect(screen.getByText('Monkeys readiness estimate')).toBeTruthy();
    expect(screen.getByText('100/100')).toBeTruthy();
    expect(screen.getByText('4 of 4 automated checks passed')).toBeTruthy();
    expect(
      screen.getByText(/unknown, human review and not applicable.*excluded/i)
    ).toBeTruthy();
    expect(
      screen.getByText(/does not predict.*ranking.*traffic.*AI citations/i)
    ).toBeTruthy();
    expect(screen.getByText('Review the intended question')).toBeTruthy();
    expect(document.body.textContent).not.toMatch(
      /upgrade|subscribe|buy credits|AI score|AEO score|GEO score|guaranteed ranking/i
    );
  });

  it('shows partial coverage and no fabricated score or exact preview when data is unavailable', () => {
    show({
      report: report({
        seoScore: null,
        passedCount: 0,
        applicableKnownCount: 0,
        coverage: 'partial',
        coverageReasons: ['Unsupported content was not inspected'],
        preview: null,
      }),
    });
    expect(screen.getByText('Partial check')).toBeTruthy();
    expect(
      screen.getByText('Unsupported content was not inspected')
    ).toBeTruthy();
    expect(screen.getByText('No automated estimate available')).toBeTruthy();
    expect(screen.getByText('0 of 0 automated checks passed')).toBeTruthy();
    expect(screen.getByText(/search preview is unavailable/i)).toBeTruthy();
    expect(document.body.textContent).not.toContain('null');
  });

  it.each([
    ['restricted', 'draft', /not intended for public search/i],
    ['unknown', 'published', /public search visibility is unknown/i],
    ['public', 'draft', /intended for public search after publishing/i],
    ['public', 'published', /public setting does not confirm indexing/i],
  ] as const)(
    'separates %s visibility in a %s from quality',
    (visibility, publicationState, expected) => {
      show({ report: report({ visibility, publicationState }) });
      expect(screen.getByText(expected)).toBeTruthy();
      if (visibility !== 'public')
        expect(
          screen.queryByText('https://monkeys.com/blog/clear-title')
        ).toBeNull();
      expect(document.body.textContent).not.toMatch(
        /make (it|this) public|change.*visibility.*improve/i
      );
    }
  );

  it.each([
    ['idle', /add content.*check readiness/i],
    ['pending', /checking.*readiness/i],
    ['stale', /content changed\. check again\./i],
    ['error', /could not check.*try.*check again/i],
  ] as const)(
    'provides a useful %s state and a local retry without assertive announcements',
    (state, message) => {
      const { onCheckAgain } = show({ state, report: null });
      expect(screen.getByText(message)).toBeTruthy();
      const retry = screen.getByRole('button', { name: 'Check again' });
      expect(retry.getAttribute('type')).toBe('button');
      fireEvent.click(retry);
      expect(onCheckAgain).toHaveBeenCalledOnce();
      expect(document.querySelector('[aria-live="assertive"]')).toBeNull();
    }
  );

  it('labels retained stale/error reports and does not announce every edit or move focus', () => {
    const { rerender, onOpenChange, onCheckAgain } = show();
    const retry = screen.getByRole('button', { name: 'Check again' });
    retry.focus();
    rerender(
      <ReadinessPanel
        open
        onOpenChange={onOpenChange}
        onCheckAgain={onCheckAgain}
        report={report()}
        state='stale'
      />
    );
    const stale = screen.getByText('Content changed. Check again.');
    expect(
      stale.closest('[aria-live], [role="status"], [role="alert"]')
    ).toBeNull();
    expect(document.activeElement).toBe(retry);
    expect(screen.getByText('Title is available')).toBeTruthy();
    rerender(
      <ReadinessPanel
        open
        onOpenChange={onOpenChange}
        onCheckAgain={onCheckAgain}
        report={report()}
        state='error'
      />
    );
    expect(
      screen.getByText(/previous report.*may be out of date/i)
    ).toBeTruthy();
  });

  it('renders snippets as text and never loads content, image or unsafe preview links', () => {
    const snippet = '<img src=x onerror="alert(1)"><script>alert(2)</script>';
    show({
      report: report({
        preview: {
          title: snippet,
          description: snippet,
          url: 'javascript:alert(3)',
        },
        coverageReasons: [snippet],
        checks: [
          {
            id: 'safe',
            section: 'sources',
            status: 'manual',
            scored: false,
            label: 'Excerpt',
            finding: snippet,
            reason: snippet,
          },
        ],
      }),
    });
    expect(screen.getAllByText(snippet).length).toBeGreaterThan(0);
    expect(
      document.querySelector('script, img, iframe, a[href^="javascript:"]')
    ).toBeNull();
  });

  it('does not expose a private meeting URL supplied as an event location diagnostic', () => {
    // The adapter contract excludes meeting links; the panel never renders raw
    // schedule diagnostics or invents links from internal identity fields.
    const meeting = 'https://meet.example.com/private?token=secret';
    show({
      report: report({
        kind: 'event',
        resourceKey: meeting,
        accountKey: meeting,
        preview: null,
        schedule: { status: 'unknown', reason: meeting },
      }),
    });
    expect(document.body.textContent).not.toContain(meeting);
    expect(document.querySelector(`a[href="${meeting}"]`)).toBeNull();
    expect(screen.getByText('Event draft preview')).toBeTruthy();
  });

  it('uses a text-only search preview with an optional safe public URL and no URL invention', () => {
    const { rerender, onOpenChange, onCheckAgain } = show();
    expect(screen.getByText('Search-result preview')).toBeTruthy();
    expect(
      screen.getByText('https://monkeys.com/blog/clear-title')
    ).toBeTruthy();
    expect(document.querySelector('a')).toBeNull();
    rerender(
      <ReadinessPanel
        open
        onOpenChange={onOpenChange}
        onCheckAgain={onCheckAgain}
        state='current'
        report={report({
          preview: {
            title: 'Unsaved draft title',
            description: 'Preview only',
          },
        })}
      />
    );
    expect(screen.getByText('Unsaved draft title')).toBeTruthy();
    expect(
      screen.queryByText('https://monkeys.com/blog/clear-title')
    ).toBeNull();
  });

  it('has a usable no-content state and no field actions when the parent has no focus callback', () => {
    show({ state: 'idle', report: null });
    expect(screen.getByText(/add content.*check readiness/i)).toBeTruthy();
    expect(screen.queryByRole('button', { name: /go to field/i })).toBeNull();
  });

  it('returns focus to an external opener on keyboard close', async () => {
    const user = userEvent.setup();
    function Host() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <button type='button' onClick={() => setOpen(true)}>
            Check readiness
          </button>
          {open && (
            <ReadinessPanel
              open={open}
              onOpenChange={setOpen}
              state='current'
              report={report()}
              onCheckAgain={() => {}}
            />
          )}
        </>
      );
    }
    render(<Host />);
    const opener = screen.getByRole('button', { name: 'Check readiness' });
    await user.click(opener);
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(document.activeElement).toBe(
      screen.getByRole('button', { name: 'Close readiness report' })
    );
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(opener));
  });

  it('closes before handing focus to an existing field without modifying its value', async () => {
    const user = userEvent.setup();
    const keys: string[] = [];
    function Host() {
      const [open, setOpen] = useState(false);
      const field = useRef<HTMLInputElement>(null);
      return (
        <>
          <button type='button' onClick={() => setOpen(true)}>
            Check readiness
          </button>
          <input
            ref={field}
            aria-label='Topics'
            defaultValue='Untouched topic'
          />
          {open && (
            <ReadinessPanel
              open={open}
              onOpenChange={setOpen}
              state='current'
              report={report()}
              onCheckAgain={() => {}}
              onGoToField={(key) => {
                keys.push(key);
                field.current?.focus();
              }}
            />
          )}
        </>
      );
    }
    render(<Host />);
    await user.click(screen.getByRole('button', { name: 'Check readiness' }));
    screen.getByRole('button', { name: 'Go to field: Topics' }).focus();
    await user.keyboard('{Enter}');
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByRole('textbox', { name: 'Topics' })
      )
    );
    expect(keys).toEqual(['topics']);
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe(
      'Untouched topic'
    );
  });

  it('uses bounded dynamic-viewport scrolling and 44px non-submitting controls', () => {
    show({ onGoToField: vi.fn() });
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('dvh');
    expect(dialog.querySelector('.overflow-y-auto')).toBeTruthy();
    for (const button of within(dialog).getAllByRole('button')) {
      expect(button.className).toContain('min-h-11');
      expect(button.className).toContain('min-w-11');
      expect(button.getAttribute('type')).toBe('button');
    }
  });
});
