export function decodeEntities(value: string): string {
  return value.replace(
    /&(?:#(x[\da-f]+|\d+)|(amp|quot|apos|lt|gt|nbsp|colon|tab|newline));/gi,
    (whole, numeric: string | undefined, named: string | undefined) => {
      if (numeric) {
        const n =
          numeric[0].toLowerCase() === 'x'
            ? parseInt(numeric.slice(1), 16)
            : Number(numeric);
        return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : '\ufffd';
      }
      return (
        (
          {
            amp: '&',
            quot: '"',
            apos: "'",
            lt: '<',
            gt: '>',
            nbsp: ' ',
            colon: ':',
            tab: '\t',
            newline: '\n',
          } as Record<string, string>
        )[named!.toLowerCase()] ?? whole
      );
    }
  );
}

const cleanText = (value: string) =>
  decodeEntities(value).replace(/\s+/g, ' ').trim();

/** A forward-only tokenizer, not an HTML parser. A nested opener or unfinished
 * tag makes coverage partial. No regex searches repeatedly for a missing `>`.
 * Its output is text only, including when decoded entities contain markup. */
export function tokenizeMarkup(
  value: string,
  joinInline = false,
  decodeText: (text: string) => string = decodeEntities
) {
  const text: string[] = [];
  const links: { href: string; label: string }[] = [];
  const images: { source: string; description: string }[] = [];
  let cursor = 0;
  let malformed = false;
  let suppressed = '';
  let anchor: { href: string; text: string[] } | undefined;
  const emit = (part: string) => {
    if (suppressed || !part) return;
    text.push(part);
    anchor?.text.push(part);
  };
  const finishAnchor = () => {
    if (!anchor) return;
    links.push({
      href: decodeEntities(anchor.href).trim(),
      label: cleanText(anchor.text.join('')),
    });
    anchor = undefined;
  };
  while (cursor < value.length) {
    const open = value.indexOf('<', cursor);
    if (open < 0) {
      emit(value.slice(cursor));
      break;
    }
    emit(value.slice(cursor, open));
    if (value.startsWith('<!--', open)) {
      const end = value.indexOf('-->', open + 4);
      if (end < 0) {
        malformed = true;
        break;
      }
      if (!joinInline) emit(' ');
      cursor = end + 3;
      continue;
    }
    let end = open + 1;
    let quote = '';
    for (; end < value.length; end++) {
      const character = value[end];
      // Conservatively reject '<' inside attributes too. The next iteration
      // starts here, so every character is inspected at most a constant times.
      if (character === '<') break;
      if (quote) {
        if (character === quote) quote = '';
      } else if (character === '"' || character === "'") quote = character;
      else if (character === '>') break;
    }
    if (end === value.length || value[end] === '<') {
      malformed = true;
      emit(value.slice(open, end));
      cursor = end;
      continue;
    }
    const token = value.slice(open + 1, end);
    const match = /^(\/?)([a-z][a-z0-9:-]*)\b/i.exec(token);
    if (!match) {
      malformed = true;
      emit(' ');
      cursor = end + 1;
      continue;
    }
    const closing = !!match[1];
    const name = match[2].toLowerCase();
    if (suppressed) {
      if (closing && name === suppressed) {
        suppressed = '';
        if (joinInline) emit(' ');
      }
    } else if (!closing && (name === 'script' || name === 'style')) {
      suppressed = name;
    } else if (name === 'a') {
      if (closing) finishAnchor();
      else {
        if (anchor) {
          malformed = true;
          finishAnchor();
        }
        anchor = {
          href: attributes(token, match[0].length).href ?? '',
          text: [],
        };
      }
    } else if (!closing && name === 'img') {
      const attrs = attributes(token, match[0].length);
      images.push({
        source: decodeEntities(attrs.src ?? '').trim(),
        description: cleanText(attrs.alt ?? ''),
      });
    }
    if (
      !joinInline ||
      /^(?:p|div|br|hr|h[1-6]|li|ul|ol|blockquote|table|tr|td|th|pre)$/.test(
        name
      )
    )
      emit(' ');
    cursor = end + 1;
  }
  if (anchor) {
    malformed = true;
    finishAnchor();
  }
  if (suppressed) malformed = true;
  return {
    text: decodeText(text.join('')).replace(/\s+/g, ' ').trim(),
    links,
    images,
    malformed,
  };
}

/** Each attribute is consumed once; arbitrary embedded payloads are not read. */
function attributes(token: string, offset: number): Record<string, string> {
  const result: Record<string, string> = {};
  let cursor = offset;
  while (cursor < token.length) {
    while (cursor < token.length && /[\s/]/.test(token[cursor])) cursor++;
    const start = cursor;
    while (cursor < token.length && !/[\s=/>]/.test(token[cursor])) cursor++;
    const name = token.slice(start, cursor).toLowerCase();
    while (cursor < token.length && /\s/.test(token[cursor])) cursor++;
    if (token[cursor] !== '=') {
      if (cursor === start) cursor++;
      continue;
    }
    cursor++;
    while (cursor < token.length && /\s/.test(token[cursor])) cursor++;
    const quote =
      token[cursor] === '"' || token[cursor] === "'" ? token[cursor++] : '';
    const valueStart = cursor;
    while (
      cursor < token.length &&
      (quote ? token[cursor] !== quote : !/\s/.test(token[cursor]))
    )
      cursor++;
    if (name === 'href' || name === 'src' || name === 'alt')
      result[name] = token.slice(valueStart, cursor);
    if (quote) cursor++;
  }
  return result;
}

export function plainText(value: string): string {
  return tokenizeMarkup(value).text;
}
