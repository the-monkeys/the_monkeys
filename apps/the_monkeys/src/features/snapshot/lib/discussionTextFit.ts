function glyphWidth(char: string): number {
  const code = char.codePointAt(0) ?? 0;
  if (
    (code >= 0x2e80 && code <= 0x9fff) ||
    (code >= 0xac00 && code <= 0xd7af) ||
    (code >= 0xf900 && code <= 0xffef) ||
    code >= 0x1f000
  )
    return 1.1;
  if (code > 0x7f || /[A-Zmw@%]/.test(char)) return 1.1;
  if (char === ' ') return 0.35;
  return 0.72;
}

/** Conservative width estimates for a fixed export canvas, including wide CJK glyphs. */
export function estimateDiscussionLines(
  text: string,
  font: number,
  width: number
): number {
  let lines = 1;
  let used = 0;
  for (const word of text.trim().split(/\s+/)) {
    const size = Array.from(word).reduce(
      (sum, char) => sum + glyphWidth(char) * font,
      0
    );
    const space = used ? font * 0.35 : 0;
    if (used && used + space + size > width) {
      lines++;
      used = 0;
    }
    if (size > width) {
      lines += Math.ceil(size / width) - 1;
      used = size % width || width;
    } else {
      used += (used ? space : 0) + size;
    }
  }
  return lines;
}

export function discussionQuoteFontSize(
  text: string,
  width: number,
  height: number,
  max = 68
): number {
  for (let font = max; font >= 18; font--) {
    if (estimateDiscussionLines(text, font, width) * font * 1.2 <= height)
      return font;
  }
  return 18;
}
