import { MutableRefObject, useEffect } from 'react';

import MonkeysEditor from '@themonkeys/monkeys-editor';

// Selection point position within a block node
type Point = {
  node: Node;
  offset: number;
  block: HTMLElement;
};

// Helper to stop event propagation
const stopEvent = (e: Event) => {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
};

// Standalone helper to handle Backspace/Delete keypress for marquee block selection and multi-block text selection
export function handleBackspaceDelete(
  event: KeyboardEvent,
  editorRef: MutableRefObject<MonkeysEditor | null>,
  container: HTMLElement,
  state: {
    hasMarqueeSelection: boolean;
    start: Point | null;
    end: Point | null;
  },
  clearOverlay: () => void,
  createRange?: (start: Point, end: Point) => Range
) {
  if (event.key !== 'Backspace' && event.key !== 'Delete') return;

  const blocks = editorRef.current?.blocks;
  if (!blocks) return;

  // Flow 1: Marquee Box Selection Deletion
  if (state.hasMarqueeSelection) {
    stopEvent(event);

    const indexes = Array.from(container.querySelectorAll('.ce-block'))
      .map((el, i) => (el.classList.contains('ce-block--selected') ? i : -1))
      .filter((i) => i >= 0)
      .reverse();

    if (!indexes.length) return;

    indexes.forEach((i) => {
      try {
        blocks.delete(i);
      } catch {}
    });

    if (blocks.getBlocksCount() === 0) blocks.insert('paragraph');

    state.hasMarqueeSelection = false;
    container
      .querySelectorAll('.ce-block--selected')
      .forEach((el) => el.classList.remove('ce-block--selected'));
    clearOverlay();
    return;
  }

  // Flow 2: Multi-Block Text Range Selection Deletion
  if (
    state.start &&
    state.end &&
    state.start.block !== state.end.block &&
    createRange
  ) {
    stopEvent(event);

    const range = createRange(state.start, state.end);
    const allBlocks = Array.from(
      container.querySelectorAll('.ce-block')
    ) as HTMLElement[];
    const startIdx = allBlocks.indexOf(
      range.startContainer.parentElement?.closest('.ce-block') as HTMLElement
    );
    const endIdx = allBlocks.indexOf(
      range.endContainer.parentElement?.closest('.ce-block') as HTMLElement
    );

    if (startIdx !== -1 && endIdx !== -1 && startIdx < endIdx) {
      const startEl = (allBlocks[startIdx].querySelector(
        '[contenteditable="true"]'
      ) || allBlocks[startIdx]) as HTMLElement;
      const endEl = (allBlocks[endIdx].querySelector(
        '[contenteditable="true"]'
      ) || allBlocks[endIdx]) as HTMLElement;

      const prefixRange = document.createRange();
      prefixRange.setStart(startEl, 0);
      prefixRange.setEnd(range.startContainer, range.startOffset);

      const suffixRange = document.createRange();
      suffixRange.setStart(range.endContainer, range.endOffset);
      suffixRange.setEnd(endEl, endEl.childNodes.length);

      const prefixLen = prefixRange.toString().length;
      const div = document.createElement('div');
      div.appendChild(prefixRange.cloneContents());
      div.appendChild(suffixRange.cloneContents());

      startEl.innerHTML = div.innerHTML;

      for (let i = endIdx; i > startIdx; i--) {
        try {
          blocks.delete(i);
        } catch {}
      }

      // Position caret at merge boundary
      const walker = document.createTreeWalker(startEl, NodeFilter.SHOW_TEXT);
      let curr = 0;
      let node: Text | null;
      while ((node = walker.nextNode() as Text | null)) {
        const len = node.textContent?.length || 0;
        if (curr + len >= prefixLen) {
          const sel = window.getSelection();
          if (sel) {
            const r = document.createRange();
            r.setStart(node, Math.min(prefixLen - curr, len));
            r.collapse(true);
            sel.removeAllRanges();
            sel.addRange(r);
          }
          break;
        }
        curr += len;
      }
    }

    state.start = null;
    state.end = null;
    clearOverlay();
  }
}

// Main hook for cross-block selection, marquee selection, and custom copy/delete handling
export function useCrossBlockSelection(
  editorRef: MutableRefObject<MonkeysEditor | null>,
  containerId = 'editorjs_editor-container'
) {
  useEffect(() => {
    // --- Initial Setup ---
    const container = document.getElementById(containerId);
    if (!container) return;

    const state = {
      selecting: false,
      start: null as Point | null,
      end: null as Point | null,
      isMarquee: false,
      marqueeStart: { x: 0, y: 0 },
      hasMarqueeSelection: false,
    };

    let overlay = document.getElementById('ce-cross-selection-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'ce-cross-selection-overlay';
      overlay.style.cssText =
        'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10;';
      container.style.position = 'relative';
      container.appendChild(overlay);
    }

    const clearOverlay = () => {
      if (overlay) overlay.innerHTML = '';
    };

    // --- FEATURE 1: Multi-Block Text Selection ---

    // Find the text position under the mouse
    const resolvePoint = (x: number, y: number): Point | null => {
      let r: Range | null = null;
      const doc = document as any;
      if (doc.caretRangeFromPoint) {
        r = doc.caretRangeFromPoint(x, y);
      } else if (doc.caretPositionFromPoint) {
        const p = doc.caretPositionFromPoint(x, y);
        if (p) {
          r = document.createRange();
          r.setStart(p.offsetNode, p.offset);
        }
      }
      if (!r) return null;

      const containerNode =
        r.startContainer instanceof HTMLElement
          ? r.startContainer
          : r.startContainer.parentElement;
      const block = containerNode?.closest('.ce-block') as HTMLElement | null;
      if (!block) return null;

      let targetNode: Node = r.startContainer;
      let targetOffset: number = r.startOffset;

      if (targetNode.nodeType === Node.ELEMENT_NODE) {
        const el = targetNode as HTMLElement;
        const textNodes: Text[] = [];
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        let textNode: Text | null;
        while ((textNode = walker.nextNode() as Text | null))
          textNodes.push(textNode);

        if (textNodes.length > 0) {
          if (targetOffset >= el.childNodes.length) {
            const lastText = textNodes[textNodes.length - 1];
            targetNode = lastText;
            targetOffset = lastText.textContent?.length || 0;
          } else {
            const childAtOffset = el.childNodes[targetOffset];
            targetNode =
              childAtOffset && childAtOffset.nodeType === Node.TEXT_NODE
                ? childAtOffset
                : textNodes[0];
            targetOffset = 0;
          }
        }
      }

      return { node: targetNode, offset: targetOffset, block };
    };

    // Build a text range between two points
    const createRange = (start: Point, end: Point): Range => {
      const range = document.createRange();
      const isReversed =
        Boolean(
          start.node.compareDocumentPosition(end.node) &
            Node.DOCUMENT_POSITION_PRECEDING
        ) ||
        (start.node === end.node && start.offset > end.offset);

      const [s, e] = isReversed ? [end, start] : [start, end];
      range.setStart(s.node, s.offset);
      range.setEnd(e.node, e.offset);
      return range;
    };

    // Draw the blue highlight over selected text
    const renderOverlay = (range: Range) => {
      clearOverlay();
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }

      const cRect = container.getBoundingClientRect();
      Array.from(range.getClientRects()).forEach((r) => {
        if (!r.width || !r.height) return;
        const box = document.createElement('div');
        box.className = 'ce-selection-highlight-rect';
        box.style.cssText = `position:absolute;top:${r.top - cRect.top + container.scrollTop}px;left:${r.left - cRect.left + container.scrollLeft}px;width:${r.width}px;height:${r.height}px;background-color:rgba(37,99,235,0.35);pointer-events:none;border-radius:2px;`;
        overlay?.appendChild(box);
      });
    };

    let mouseDownPos = { x: 0, y: 0 };
    let mouseDownTarget: HTMLElement | null = null;

    // Start selection on mouse press
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      clearOverlay();
      state.hasMarqueeSelection = false;
      state.start = state.end = null;
      mouseDownTarget = e.target as HTMLElement | null;
      mouseDownPos = { x: e.clientX, y: e.clientY };

      const point = mouseDownTarget?.closest('[contenteditable="true"]')
        ? resolvePoint(e.clientX, e.clientY)
        : null;

      if (point) {
        container
          .querySelectorAll('.ce-block--selected')
          .forEach((el) => el.classList.remove('ce-block--selected'));
        state.selecting = true;
        state.start = state.end = point;
      } else {
        state.isMarquee = true;
        state.marqueeStart = { x: e.clientX, y: e.clientY };
      }
    };

    // Update the active selection while dragging
    const onMouseMove = (e: MouseEvent) => {
      if (state.isMarquee) {
        renderMarquee(
          state.marqueeStart.x,
          state.marqueeStart.y,
          e.clientX,
          e.clientY
        );
        highlightTouchedBlocks(
          state.marqueeStart.x,
          state.marqueeStart.y,
          e.clientX,
          e.clientY
        );
        return;
      }

      if (!state.selecting || !state.start) return;

      const point = resolvePoint(e.clientX, e.clientY);
      if (point) {
        state.end = point;
        if (state.start.block !== point.block)
          renderOverlay(createRange(state.start, point));
        else clearOverlay();
      }
    };

    // End selection on mouse release
    const onMouseUp = (e: MouseEvent) => {
      const isDrag =
        Math.hypot(e.clientX - mouseDownPos.x, e.clientY - mouseDownPos.y) > 5;

      // Handle simple clicks outside contenteditable, on table margins or below redactor
      if (!isDrag && mouseDownTarget) {
        const tableWrap =
          mouseDownTarget.closest('.tc-wrap') ||
          mouseDownTarget.closest('.ce-block')?.querySelector('.tc-table');
        const isBelowRedactor =
          mouseDownTarget.classList.contains('codex-editor__redactor') ||
          mouseDownTarget.id === containerId;

        if (tableWrap || isBelowRedactor) {
          const allBlocks = Array.from(
            container.querySelectorAll('.ce-block')
          ) as HTMLElement[];
          let targetBlockIdx = -1;

          if (tableWrap) {
            const blockEl = tableWrap.closest('.ce-block') as HTMLElement;
            targetBlockIdx = allBlocks.indexOf(blockEl);
          } else if (isBelowRedactor) {
            targetBlockIdx = allBlocks.length - 1;
          }

          if (targetBlockIdx !== -1 && editorRef.current) {
            const totalBlocks = editorRef.current.blocks.getBlocksCount();
            if (targetBlockIdx + 1 < totalBlocks) {
              editorRef.current.caret.setToBlock(targetBlockIdx + 1, 'start');
            } else {
              editorRef.current.blocks.insert(
                'paragraph',
                {},
                {},
                targetBlockIdx + 1,
                true
              );
            }
          }
        }
      }

      state.selecting = false;
      state.isMarquee = false;
    };

    // --- FEATURE 2: Marquee Block Selection ---

    // Draw the marquee selection box
    const renderMarquee = (x1: number, y1: number, x2: number, y2: number) => {
      clearOverlay();
      const cRect = container.getBoundingClientRect();
      const left = Math.min(x1, x2) - cRect.left + container.scrollLeft;
      const top = Math.min(y1, y2) - cRect.top + container.scrollTop;
      const w = Math.abs(x2 - x1);
      const h = Math.abs(y2 - y1);
      if (!w || !h) return;

      const marquee = document.createElement('div');
      marquee.className = 'ce-selection-marquee-box';
      marquee.style.cssText = `position:absolute;top:${top}px;left:${left}px;width:${w}px;height:${h}px;background-color:rgba(37,99,235,0.15);border:1px solid rgba(37,99,235,0.5);pointer-events:none;border-radius:4px;`;
      overlay?.appendChild(marquee);
    };

    // Highlight blocks inside the marquee box
    const highlightTouchedBlocks = (
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ) => {
      const mL = Math.min(x1, x2);
      const mR = Math.max(x1, x2);
      const mT = Math.min(y1, y2);
      const mB = Math.max(y1, y2);

      let touchedCount = 0;
      container.querySelectorAll('.ce-block').forEach((block) => {
        const contentEl = block.querySelector(
          '.ce-block__content'
        ) as HTMLElement;
        const r = (contentEl || block).getBoundingClientRect();
        const isTouched = !(
          r.right < mL ||
          r.left > mR ||
          r.bottom < mT ||
          r.top > mB
        );
        block.classList.toggle('ce-block--selected', isTouched);
        if (isTouched) touchedCount++;
      });
      state.hasMarqueeSelection = touchedCount > 0;
    };

    // --- FEATURE 3: Copy ---

    // Format selected text into plain text and HTML
    const getClipboardData = (
      range: Range
    ): { text: string; html: string } | null => {
      try {
        const div = document.createElement('div');
        div.appendChild(range.cloneContents());

        const items = Array.from(div.querySelectorAll('li, .cdx-list__item'));
        if (items.length && !div.querySelector('ul, ol')) {
          const parentList =
            range.commonAncestorContainer.parentElement?.closest(
              '.cdx-list, ul, ol'
            );
          const isOrdered =
            parentList?.tagName === 'OL' ||
            parentList?.classList.contains('cdx-list--ordered');
          const tag = isOrdered ? 'ol' : 'ul';
          div.innerHTML = `<${tag}>${items.map((i) => `<li>${i.innerHTML || i.textContent || ''}</li>`).join('')}</${tag}>`;
        }

        // Transform Editor.js block divs into semantic <p> tags so Editor.js paste module creates separate blocks
        div.querySelectorAll('.ce-paragraph, .cdx-block').forEach((el) => {
          const p = document.createElement('p');
          p.innerHTML = el.innerHTML;
          el.replaceWith(p);
        });

        const blockTags = new Set([
          'P',
          'DIV',
          'LI',
          'H1',
          'H2',
          'H3',
          'H4',
          'H5',
          'H6',
        ]);

        const getTextWithBreaks = (element: HTMLElement): string =>
          Array.from(element.childNodes)
            .map((node) => {
              if (node.nodeType === Node.TEXT_NODE)
                return node.textContent || '';
              if (node.nodeType !== Node.ELEMENT_NODE) return '';
              const el = node as HTMLElement;
              return el.tagName === 'BR'
                ? '\n'
                : getTextWithBreaks(el) +
                    (blockTags.has(el.tagName) ? '\n' : '');
            })
            .join('');

        const text = getTextWithBreaks(div).trim();
        return text ? { text, html: div.innerHTML } : null;
      } catch {
        return null;
      }
    };

    // Copy either selected text or selected blocks
    const handleCopy = (e: Event) => {
      if (e instanceof KeyboardEvent) return;

      let data: { text: string; html: string } | null = null;

      if (state.hasMarqueeSelection) {
        // Flow 2: Marquee Block Selection Copy
        const selected = Array.from(
          container.querySelectorAll('.ce-block--selected')
        ) as HTMLElement[];
        if (selected.length > 0) {
          const textParts: string[] = [];
          const htmlParts: string[] = [];

          selected.forEach((block) => {
            const tbl = block.querySelector('.tc-table, table');
            const img = block.querySelector('img');
            const list = block.querySelector('.cdx-list, ul, ol');
            const hdr = block.querySelector('h1, h2, h3, h4, h5, h6');

            if (tbl) {
              const rows = Array.from(
                tbl.querySelectorAll('.tc-row, tr'),
                (r) =>
                  Array.from(r.querySelectorAll('.tc-cell, td, th'), (c) =>
                    (c.textContent || '').trim()
                  ).filter(Boolean)
              ).filter((r) => r.length);
              if (rows.length) {
                textParts.push(rows.map((r) => r.join('\t')).join('\n'));
                htmlParts.push(
                  `<table border="1">${rows.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('')}</table>`
                );
                return;
              }
            }

            if (img) {
              const alt = (
                block.querySelector('.cdx-input, figcaption, [contenteditable]')
                  ?.textContent || ''
              ).trim();
              textParts.push(img.src);
              htmlParts.push(`<img src="${img.src}" alt="${alt}" />`);
              return;
            }

            if (list) {
              const isOrdered =
                list.tagName === 'OL' ||
                list.classList.contains('cdx-list--ordered');
              const items = Array.from(
                list.querySelectorAll('li, .cdx-list__item'),
                (i) => ({
                  t: (i.textContent || '').trim(),
                  h: (i.innerHTML || i.textContent || '').trim(),
                })
              ).filter((i) => i.t);
              if (items.length) {
                const tag = isOrdered ? 'ol' : 'ul';
                textParts.push(
                  items
                    .map(
                      (i, idx) => `${isOrdered ? `${idx + 1}. ` : '• '}${i.t}`
                    )
                    .join('\n')
                );
                htmlParts.push(
                  `<${tag}>${items.map((i) => `<li>${i.h}</li>`).join('')}</${tag}>`
                );
                return;
              }
            }

            const el =
              hdr ||
              block.querySelector('[contenteditable], .ce-block__content') ||
              block;
            const tag = hdr ? hdr.tagName.toLowerCase() : 'p';
            const txt = (el.textContent || '').trim();
            const html = (el.innerHTML || txt).trim();
            textParts.push(txt);
            htmlParts.push(`<${tag}>${html}</${tag}>`);
          });

          data = {
            text: textParts.filter(Boolean).join('\n\n'),
            html: htmlParts.filter(Boolean).join('<br/><br/>'),
          };
        }
      } else {
        // Flow 1: Character-level Text Range Copy
        const sel = window.getSelection();
        const range =
          state.start && state.end
            ? createRange(state.start, state.end)
            : sel && !sel.isCollapsed
              ? sel.getRangeAt(0)
              : null;
        if (range) data = getClipboardData(range);
      }

      if (!data || (!data.text && !data.html)) return;
      stopEvent(e);

      if (e instanceof ClipboardEvent && e.clipboardData) {
        e.clipboardData.setData('text/plain', data.text);
        if (data.html) e.clipboardData.setData('text/html', data.html);
      }
    };

    // Delete selected text or selected blocks, or handle navigation out of tables
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'Down') {
        const activeEl = document.activeElement as HTMLElement | null;
        const cell = activeEl?.closest('.tc-cell');
        if (cell) {
          const row = cell.closest('.tc-row');
          const table = cell.closest('.tc-table');
          if (row && table) {
            const rows = Array.from(table.querySelectorAll('.tc-row'));
            const isLastRow = rows.length > 0 && rows[rows.length - 1] === row;

            if (isLastRow) {
              const sel = window.getSelection();
              let isAtEnd = true;
              if (sel && sel.rangeCount > 0) {
                const range = sel.getRangeAt(0);
                const dummyRange = range.cloneRange();
                dummyRange.selectNodeContents(cell);
                dummyRange.setStart(range.endContainer, range.endOffset);
                isAtEnd = dummyRange.toString().trim() === '';
              }

              if (isAtEnd) {
                const blockEl = table.closest(
                  '.ce-block'
                ) as HTMLElement | null;
                if (blockEl && editorRef.current) {
                  const allBlocks = Array.from(
                    container.querySelectorAll('.ce-block')
                  ) as HTMLElement[];
                  const tableIdx = allBlocks.indexOf(blockEl);
                  if (tableIdx !== -1) {
                    const totalBlocks =
                      editorRef.current.blocks.getBlocksCount();
                    if (tableIdx + 1 < totalBlocks) {
                      editorRef.current.caret.setToBlock(tableIdx + 1, 'start');
                    } else {
                      editorRef.current.blocks.insert(
                        'paragraph',
                        {},
                        {},
                        tableIdx + 1,
                        true
                      );
                    }
                  }
                }
              }
            }
          }
        }
      }

      handleBackspaceDelete(
        e,
        editorRef,
        container,
        state,
        clearOverlay,
        createRange
      );
    };

    // --- Event Registration & Cleanup ---
    const listeners: [EventTarget, string, EventListener, boolean?][] = [
      [window, 'mousedown', onMouseDown as EventListener],
      [window, 'mousemove', onMouseMove as EventListener],
      [window, 'mouseup', onMouseUp as EventListener],
      [document, 'keydown', onKeyDown as EventListener, true],
      [document, 'copy', handleCopy as EventListener, true],
    ];

    listeners.forEach(([target, type, listener, capture]) =>
      target.addEventListener(
        type,
        listener,
        capture ? { capture: true } : undefined
      )
    );

    return () => {
      listeners.forEach(([target, type, listener, capture]) =>
        target.removeEventListener(
          type,
          listener,
          capture ? { capture: true } : undefined
        )
      );
      clearOverlay();
    };
  }, [containerId, editorRef]);
}
