export async function copyDiscussionSnap(
  url: string
): Promise<{ copied: boolean; blob?: Blob }> {
  const png = fetch(url, { credentials: 'omit', cache: 'no-store' }).then(
    async (response) => {
      if (
        !response.ok ||
        !response.headers.get('content-type')?.startsWith('image/png')
      ) {
        throw new Error('The discussion image could not be loaded.');
      }
      return response.blob();
    }
  );

  if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
    try {
      // Start write synchronously with the click; Safari accepts a promised Blob.
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': png }),
      ]);
      return { copied: true };
    } catch {
      // The browser may deny clipboard permission. Keep the image for download.
    }
  }
  return { copied: false, blob: await png };
}
