import DOMPurify from 'isomorphic-dompurify';

export const purifyHTMLString = (dirtyString: string) => {
  if (typeof dirtyString !== 'string') {
    throw new Error('Input must be a string');
  }

  const cleanString = DOMPurify.sanitize(dirtyString, {
    USE_PROFILES: { html: false },
  });

  return cleanString;
};
