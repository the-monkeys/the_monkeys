import DOMPurify from 'isomorphic-dompurify';

export const purifyHTMLString = (dirtyString: string) => {
  let cleanString = DOMPurify.sanitize(dirtyString, {
    USE_PROFILES: { html: false },
  });

  cleanString = cleanString.replace(/\\u0026/g, '&');

  cleanString = cleanString.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ');

  return cleanString;
};
