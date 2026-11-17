import { copyDiscussionSnap } from '@/features/snapshot/lib/discussionClipboard';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(() => vi.unstubAllGlobals());

function setup(write?: ReturnType<typeof vi.fn>) {
  const fetchMock = vi.fn().mockResolvedValue(
    new Response(new Blob(['png'], { type: 'image/png' }), {
      headers: { 'Content-Type': 'image/png' },
    })
  );
  vi.stubGlobal('fetch', fetchMock);
  vi.stubGlobal('navigator', { clipboard: write ? { write } : undefined });
  vi.stubGlobal(
    'ClipboardItem',
    class {
      constructor(public data: Record<string, Promise<Blob>>) {}
    }
  );
  return fetchMock;
}

describe('discussion image clipboard', () => {
  it('starts clipboard write during the click with a PNG promise, preserving Safari user activation', async () => {
    const write = vi.fn().mockResolvedValue(undefined);
    const fetchMock = setup(write);
    const pending = copyDiscussionSnap(
      '/discussions/abc/image?variant=snapshot'
    );
    expect(write).toHaveBeenCalledOnce();
    expect(write.mock.calls[0][0][0].data['image/png']).toBeInstanceOf(Promise);
    expect((await pending).copied).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      '/discussions/abc/image?variant=snapshot',
      { credentials: 'omit', cache: 'no-store' }
    );
  });
  it('offers the downloaded image when clipboard access is denied or missing', async () => {
    setup(vi.fn().mockRejectedValue(new Error('NotAllowed')));
    const result = await copyDiscussionSnap('/image');
    expect(result.copied).toBe(false);
    expect(result.blob?.type).toBe('image/png');
    setup();
    expect((await copyDiscussionSnap('/image')).copied).toBe(false);
  });
  it('does not copy an error page as an image', async () => {
    setup();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('Not found', { status: 404 }))
    );
    await expect(copyDiscussionSnap('/image')).rejects.toThrow();
  });
});
