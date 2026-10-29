import EditPage from '@/app/edit/[blogId]/page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  search: new URLSearchParams(),
  draft: { blog: undefined as any, isLoading: false, isError: false },
  getGroup: vi.fn(),
  publish: vi.fn(),
  schedule: vi.fn(),
}));
vi.mock('next/navigation', () => ({
  useSearchParams: () => state.search,
  usePathname: () => '/edit/draft1',
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock('next/dynamic', () => ({
  default:
    () =>
    ({ data, onChange }: any) => (
      <button
        onClick={() =>
          onChange({
            ...data,
            blocks: [
              ...data.blocks,
              { type: 'paragraph', data: { text: 'Changed' } },
            ],
          })
        }
      >
        Edit content
      </button>
    ),
}));
vi.mock('@/hooks/auth/useAuth', () => ({
  default: () => ({ data: { account_id: 'author', username: 'ada' } }),
}));
vi.mock('@/hooks/blog/useGetDraftBlogDetail', () => ({
  default: () => state.draft,
  DRAFT_BLOG_DETAIL_QUERY_KEY: 'draft-blog-detail',
}));
vi.mock('@/hooks/blog/useGetPublishedBlogDetailByBlogId', () => ({
  BLOG_DETAIL_QUERY_KEY: 'blog-detail',
}));
vi.mock('@/lib/store/useFileUpload', () => ({
  useIsImageUploading: () => false,
}));
vi.mock('@/constants/api', () => ({ WSS_URL_V2: 'ws://unused.invalid' }));
vi.mock('@/services/api/axiosInstance', () => ({
  default: { get: async () => ({ data: { token: 'test' } }) },
}));
vi.mock('@/services/groups/groupsApi', () => ({
  getGroup: (...args: any[]) => state.getGroup(...args),
}));
vi.mock('@/services/blog/blogApi', () => ({
  publishBlog: (...args: any[]) => state.publish(...args),
  scheduleBlog: (...args: any[]) => state.schedule(...args),
  getPublishedBlog: async () => ({}),
}));
vi.mock('@/components/blog/getBlogContent', () => ({
  isDocumentTitleBlock: () => true,
}));
vi.mock('@/components/editor/BlogPreview', () => ({ default: () => null }));
vi.mock('@/components/icon', () => ({ default: () => null }));
vi.mock('@the-monkeys/ui/hooks/use-toast', () => ({ toast: vi.fn() }));
// Exercise editor state and real draft writes; the drawer has separate UI tests.
vi.mock('@/components/blog/actions/PublishBlogDrawer', () => ({
  PublishBlogDrawer: (props: any) => (
    <>
      <button
        onClick={() =>
          props.onPublicationChange?.({ group: null, audience: 'public' })
        }
      >
        Remove group
      </button>
      <button
        onClick={() =>
          props.handlePublish(
            props.publication ?? { group: null, audience: 'public' }
          )
        }
      >
        Submit post
      </button>
      <button
        onClick={() =>
          props.handleSchedule(
            '2026-12-01T10:00:00Z',
            'Asia/Calcutta',
            props.publication ?? { group: null, audience: 'public' }
          )
        }
      >
        Submit schedule
      </button>
    </>
  ),
}));

class DraftSocket {
  static OPEN = 1;
  static instances: DraftSocket[] = [];
  readyState = 1;
  onopen?: () => void;
  onmessage?: (event: any) => void;
  onclose?: (event: any) => void;
  onerror?: () => void;
  messages: any[] = [];
  constructor() {
    DraftSocket.instances.push(this);
  }
  send(value: string) {
    this.messages.push(JSON.parse(value));
  }
  close() {}
}
const content = {
  time: 1,
  blocks: [
    { id: 'title', type: 'header', data: { text: 'Private draft', level: 1 } },
    { type: 'paragraph', data: { text: 'One' } },
    { type: 'paragraph', data: { text: 'Two' } },
  ],
};
function mount() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <EditPage params={{ blogId: 'draft1' }} />
    </QueryClientProvider>
  );
}
async function openSocket() {
  await waitFor(() => expect(DraftSocket.instances.length).toBeGreaterThan(0));
  const socket = DraftSocket.instances.at(-1)!;
  act(() => socket.onopen?.());
  return socket;
}

describe('group draft publication', () => {
  beforeEach(() => {
    state.search = new URLSearchParams();
    state.draft = { blog: undefined, isLoading: false, isError: false };
    state.getGroup.mockReset().mockResolvedValue({
      group: {
        id: 1,
        slug: 'secret',
        name: 'Secret',
        visibility: 'private',
        status: 'published',
        viewer_member_status: 'active',
      },
    });
    state.publish.mockReset().mockResolvedValue({});
    state.schedule.mockReset().mockResolvedValue({});
    DraftSocket.instances = [];
    vi.stubGlobal('WebSocket', DraftSocket);
    window.history.replaceState(null, '', '/edit/draft1');
  });
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('keeps group intent in the refresh URL and every new-draft write', async () => {
    state.search = new URLSearchParams('isNew=true&group=secret');
    window.history.replaceState(
      null,
      '',
      '/edit/draft1?isNew=true&group=secret'
    );
    mount();
    const socket = await openSocket();
    expect(new URLSearchParams(window.location.search).get('group')).toBe(
      'secret'
    );
    fireEvent.click(screen.getByText('Edit content'));
    await waitFor(() => expect(socket.messages.length).toBeGreaterThan(1));
    for (const payload of socket.messages)
      expect(payload).toMatchObject({
        group_slug: 'secret',
        audience: 'group_only',
      });
  });

  it('hydrates saved scope before autosave and retains it on reconnect', async () => {
    state.draft = {
      blog: {
        blog: content,
        tags: [],
        group_slug: 'secret',
        audience: 'group_only',
      },
      isLoading: false,
      isError: false,
    };
    mount();
    const socket = await openSocket();
    expect(socket.messages.at(-1)).toMatchObject({
      group_slug: 'secret',
      audience: 'group_only',
    });
    socket.messages = [];
    act(() => socket.onopen?.());
    expect(socket.messages.at(-1)).toMatchObject({
      group_slug: 'secret',
      audience: 'group_only',
    });
    fireEvent.click(screen.getByText('Remove group'));
    await waitFor(() =>
      expect(socket.messages.at(-1)).toMatchObject({
        group_slug: '',
        audience: 'public',
      })
    );
  });

  it('restores an explicit removal even if an old group query remains', async () => {
    state.search = new URLSearchParams('group=secret');
    state.draft = {
      blog: { blog: content, tags: [], group_slug: '', audience: 'public' },
      isLoading: false,
      isError: false,
    };
    mount();
    const socket = await openSocket();
    expect(socket.messages.at(-1)).toMatchObject({
      group_slug: '',
      audience: 'public',
    });
  });

  it('keeps legacy drafts public without attaching a group', async () => {
    state.draft = {
      blog: { blog: content, tags: [] },
      isLoading: false,
      isError: false,
    };
    mount();
    const socket = await openSocket();
    expect(socket.messages.at(-1)).toMatchObject({
      group_slug: '',
      audience: 'public',
    });
  });

  it('cannot publish or schedule while the intended group is unresolved', async () => {
    state.getGroup.mockReturnValue(new Promise(() => {}));
    state.draft = {
      blog: {
        blog: content,
        tags: [],
        group_slug: 'secret',
        audience: 'group_only',
      },
      isLoading: false,
      isError: false,
    };
    mount();
    await openSocket();
    fireEvent.click(screen.getByText('Submit post'));
    fireEvent.click(screen.getByText('Submit schedule'));
    expect(state.publish).not.toHaveBeenCalled();
    expect(state.schedule).not.toHaveBeenCalled();
  });

  it('resolves the exact saved group and publishes its scope without listing memberships', async () => {
    state.draft = {
      blog: {
        blog: content,
        tags: [],
        group_slug: 'secret',
        audience: 'group_only',
      },
      isLoading: false,
      isError: false,
    };
    mount();
    await openSocket();
    await waitFor(() => expect(state.getGroup).toHaveBeenCalledWith('secret'));
    fireEvent.click(screen.getByText('Submit post'));
    await waitFor(() =>
      expect(state.publish).toHaveBeenCalledWith(
        'draft1',
        expect.objectContaining({
          group_slug: 'secret',
          audience: 'group_only',
        })
      )
    );
  });

  it.each(['pending', 'left', 'removed', 'banned', ''])(
    'refuses an organizer without active membership (%s)',
    async (status) => {
      state.getGroup.mockResolvedValue({
        group: {
          id: 1,
          slug: 'secret',
          name: 'Secret',
          visibility: 'public',
          status: 'published',
          viewer_role: 'organizer',
          viewer_member_status: status,
        },
      });
      state.draft = {
        blog: {
          blog: content,
          tags: [],
          group_slug: 'secret',
          audience: 'group_only',
        },
        isLoading: false,
        isError: false,
      };
      mount();
      await openSocket();
      await waitFor(() => expect(state.getGroup).toHaveBeenCalled());
      fireEvent.click(screen.getByText('Submit post'));
      fireEvent.click(screen.getByText('Submit schedule'));
      expect(state.publish).not.toHaveBeenCalled();
      expect(state.schedule).not.toHaveBeenCalled();
    }
  );

  it('retains scope after a failed lookup until the author explicitly removes it', async () => {
    state.getGroup.mockRejectedValue(new Error('offline'));
    state.draft = {
      blog: {
        blog: content,
        tags: [],
        group_slug: 'secret',
        audience: 'group_only',
      },
      isLoading: false,
      isError: false,
    };
    mount();
    const socket = await openSocket();
    await waitFor(() => expect(state.getGroup).toHaveBeenCalled());
    fireEvent.click(screen.getByText('Submit post'));
    expect(state.publish).not.toHaveBeenCalled();
    expect(socket.messages.at(-1)).toMatchObject({
      group_slug: 'secret',
      audience: 'group_only',
    });
    fireEvent.click(screen.getByText('Remove group'));
    await waitFor(() =>
      expect(socket.messages.at(-1)).toMatchObject({
        group_slug: '',
        audience: 'public',
      })
    );
    fireEvent.click(screen.getByText('Submit post'));
    await waitFor(() =>
      expect(state.publish).toHaveBeenCalledWith(
        'draft1',
        expect.objectContaining({ tags: [] })
      )
    );
    expect(state.publish.mock.calls.at(-1)![1].group_slug).toBeUndefined();
  });

  it('does not overwrite a draft when its scope could not be loaded', async () => {
    state.draft = { blog: undefined, isLoading: false, isError: true };
    mount();
    const socket = await openSocket();
    expect(socket.messages).toEqual([]);
  });
});
