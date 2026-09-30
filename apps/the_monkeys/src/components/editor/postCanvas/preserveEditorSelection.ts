type Point = {
  id: string | null;
  blockIndex: number;
  fieldIndex: number;
  offset: number;
};
const fields = (root: Element) =>
  Array.from(
    root.querySelectorAll<HTMLElement>(
      '[contenteditable="true"],textarea,input'
    )
  );

function capturePoint(
  root: HTMLElement,
  node: Node | null,
  offset: number
): Point | null {
  if (!node || !root.contains(node)) return null;
  const element = node instanceof Element ? node : node.parentElement;
  const block = element?.closest('.ce-block');
  if (!block) return null;
  const field = fields(block).find((el) => el === node || el.contains(node));
  if (!field) return null;
  const range = document.createRange();
  range.selectNodeContents(field);
  range.setEnd(node, offset);
  return {
    id: block.getAttribute('data-id'),
    blockIndex: Array.from(root.querySelectorAll('.ce-block')).indexOf(block),
    fieldIndex: fields(block).indexOf(field),
    offset: range.toString().length,
  };
}

function resolvePoint(root: HTMLElement, point: Point) {
  const blocks = Array.from(root.querySelectorAll('.ce-block'));
  const block =
    blocks.find((el) => el.getAttribute('data-id') === point.id) ||
    blocks[Math.min(point.blockIndex, blocks.length - 1)];
  if (!block) return null;
  const field = fields(block)[point.fieldIndex] || fields(block)[0];
  if (!field) return null;
  const walker = document.createTreeWalker(field, NodeFilter.SHOW_TEXT);
  let remaining = point.offset;
  let last: Node | null = null;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    last = node;
    const length = node.textContent?.length || 0;
    if (remaining <= length) return { field, node, offset: remaining };
    remaining -= length;
  }
  return { field, node: last || field, offset: last?.textContent?.length || 0 };
}

/** Blocks.update replaces nodes; restore both selection direction and viewport. */
export async function preserveEditorSelection(
  root: HTMLElement,
  change: () => Promise<void>,
  focusTitle = false
) {
  const selection = window.getSelection();
  const anchor = capturePoint(
    root,
    selection?.anchorNode || null,
    selection?.anchorOffset || 0
  );
  const focus = capturePoint(
    root,
    selection?.focusNode || null,
    selection?.focusOffset || 0
  );
  const activeInCanvas = root.contains(document.activeElement);
  const scroll = { x: window.scrollX, y: window.scrollY };
  const ancestors: Array<{ element: HTMLElement; top: number; left: number }> =
    [];
  for (
    let element: HTMLElement | null = root;
    element;
    element = element.parentElement
  ) {
    ancestors.push({
      element,
      top: element.scrollTop,
      left: element.scrollLeft,
    });
  }
  const minHeight = root.style.minHeight;
  const overflowAnchor = root.style.overflowAnchor;
  root.style.minHeight = `${root.getBoundingClientRect().height}px`;
  root.style.overflowAnchor = 'none';
  try {
    await change();
  } finally {
    if (root.isConnected) {
      const titlePoint = {
        id: 'title',
        blockIndex: 0,
        fieldIndex: 0,
        offset: 0,
      };
      const start = resolvePoint(
        root,
        focusTitle ? titlePoint : anchor || titlePoint
      );
      const end = resolvePoint(
        root,
        focusTitle ? titlePoint : focus || anchor || titlePoint
      );
      if ((activeInCanvas || anchor || focusTitle) && start && end) {
        start.field.focus({ preventScroll: true });
        selection?.setBaseAndExtent(
          start.node,
          start.offset,
          end.node,
          end.offset
        );
      }
      root.style.minHeight = minHeight;
      root.style.overflowAnchor = overflowAnchor;
      ancestors.forEach(({ element, top, left }) => {
        element.scrollTop = top;
        element.scrollLeft = left;
      });
      if (window.scrollX !== scroll.x || window.scrollY !== scroll.y)
        window.scrollTo(scroll.x, scroll.y);
    }
  }
}
