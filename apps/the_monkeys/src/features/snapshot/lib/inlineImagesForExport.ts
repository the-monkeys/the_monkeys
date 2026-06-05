/**
 * Rewrites <img> sources under a node to same-origin data URLs so
 * html-to-image can embed avatars and tweet media without canvas taint.
 */
export const inlineImagesForExport = async (
  root: HTMLElement
): Promise<void> => {
  const imgs = Array.from(root.querySelectorAll('img'));
  await Promise.all(
    imgs.map(async (img) => {
      const src = img.getAttribute('src');
      if (!src || src.startsWith('data:')) return;

      const fetchUrl = /^https?:\/\//i.test(src)
        ? `/api/proxy-image?url=${encodeURIComponent(src)}`
        : src;

      try {
        const res = await fetch(fetchUrl);
        if (!res.ok) return;
        const blob = await res.blob();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(String(reader.result));
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(blob);
        });
        img.setAttribute('src', dataUrl);
        if (!img.getAttribute('crossorigin')) {
          img.setAttribute('crossorigin', 'anonymous');
        }
      } catch {
        /* keep original src if proxy fails */
      }
    })
  );
};
