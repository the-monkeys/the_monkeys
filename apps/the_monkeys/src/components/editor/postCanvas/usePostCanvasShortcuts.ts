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

  useEffect(() => {
    const isExternalField = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      const editable = target.closest(
        '[contenteditable]:not([contenteditable="false"])'
      );
      return Boolean(
        target.closest('input,textarea,select') ||
          (editable && !canvasRef.current?.contains(editable))
      );
    };

    const onKeyDown = (event: KeyboardEvent) => {
      try {
        if (isExternalField(event.target)) return;
        const isChrome =
          isChromeShortcutTarget(event.target) || isExternalField(event.target);
        const canvas = canvasRef.current;
        const kind = shortcutKind(event);

        if (
          canvas &&
          shouldHandleClearDocument(event, {
            isChrome,
            hasClear: Boolean(clearDocumentRef.current),
            isFullySelected: isPostCanvasFullySelected(canvas),
          })
        ) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          try {
            clearDocumentRef.current?.();
          } catch (err) {
            console.warn('post canvas clear failed', err);
          }
          return;
        }

        if (!kind) return;

        const chromeField =
          isChromeEditableField(event.target) || isExternalField(event.target);

        if (canvas && shouldHandleSelectAll(event, { isChrome: chromeField })) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          selectPostCanvas(canvas);
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

    const onBeforeInput = (event: InputEvent) => {
      const canvas = canvasRef.current;
      if (
        !event.cancelable ||
        event.isComposing ||
        !event.inputType.startsWith('delete')
      )
        return;
      if (
        !canvas ||
        !clearDocumentRef.current ||
        isChromeShortcutTarget(event.target) ||
        isExternalField(event.target)
      )
        return;
      if (!isPostCanvasFullySelected(canvas)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      clearDocumentRef.current();
    };
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('beforeinput', onBeforeInput, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('beforeinput', onBeforeInput, true);
    };
  }, [canvasRef]);
}
