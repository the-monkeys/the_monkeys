'use client';

import { useEffect, useRef } from 'react';

import {
  isChromeEditableField,
  isChromeShortcutTarget,
  isPostCanvasFullySelected,
  selectPostCanvas,
  shortcutKind,
  shouldHandleClearDocument,
  shouldHandleRedo,
  shouldHandleSelectAll,
  shouldHandleUndo,
} from './shortcuts';
import type { PostUndoController } from './types';

export function usePostCanvasShortcuts(opts: {
  canvasRef: React.RefObject<HTMLElement | null>;
  undo?: PostUndoController | null;
  clearDocument?: (() => void) | null;
}): void {
  const undoRef = useRef(opts.undo);
  undoRef.current = opts.undo;
  const clearDocumentRef = useRef(opts.clearDocument);
  clearDocumentRef.current = opts.clearDocument;
  const canvasRef = opts.canvasRef;
  const documentSelectedRef = useRef(false);

  useEffect(() => {
    let ignoreSelectionSync = false;

    const syncDocumentSelection = () => {
      if (ignoreSelectionSync) return;
      const canvas = canvasRef.current;
      documentSelectedRef.current = canvas
        ? isPostCanvasFullySelected(canvas)
        : false;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      try {
        const isChrome = isChromeShortcutTarget(event.target);
        const canvas = canvasRef.current;
        const isFullySelected =
          documentSelectedRef.current ||
          Boolean(canvas && isPostCanvasFullySelected(canvas));

        if (
          canvas &&
          shouldHandleClearDocument(event, {
            isChrome,
            hasClear: Boolean(clearDocumentRef.current),
            isFullySelected,
          })
        ) {
          event.preventDefault();
          event.stopPropagation();
          documentSelectedRef.current = false;
          try {
            clearDocumentRef.current?.();
          } catch (err) {
            console.warn('post canvas clear failed', err);
          }
          return;
        }

        const kind = shortcutKind(event);
        if (!kind) return;

        const chromeField = isChromeEditableField(event.target);

        if (canvas && shouldHandleSelectAll(event, { isChrome: chromeField })) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          ignoreSelectionSync = true;
          selectPostCanvas(canvas);
          documentSelectedRef.current = true;
          requestAnimationFrame(() => {
            ignoreSelectionSync = false;
          });
          return;
        }

        if (isChrome) {
          event.stopPropagation();
          return;
        }

        if (!canvas) return;

        const hasUndo = Boolean(undoRef.current);

        if (shouldHandleUndo(event, { isChrome, hasUndo })) {
          event.preventDefault();
          event.stopPropagation();
          try {
            undoRef.current?.undo();
          } catch (err) {
            console.warn('post canvas undo failed', err);
          }
          return;
        }

        if (shouldHandleRedo(event, { isChrome, hasUndo })) {
          event.preventDefault();
          event.stopPropagation();
          try {
            undoRef.current?.redo();
          } catch (err) {
            console.warn('post canvas redo failed', err);
          }
        }
      } catch (err) {
        console.warn('post canvas shortcut failed', err);
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('selectionchange', syncDocumentSelection);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('selectionchange', syncDocumentSelection);
    };
  }, [canvasRef]);
}
