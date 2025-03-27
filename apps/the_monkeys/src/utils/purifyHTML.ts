import DOMPurify from 'isomorphic-dompurify';

export const purifyHTMLString = (dirtyString: string) => {
  const cleanString = DOMPurify.sanitize(dirtyString, {
    USE_PROFILES: { html: false },
  });

  return cleanString;
};
