'use client';

import React, { FC, useEffect, useRef, useState } from 'react';

import { getEditorConfig } from '@/config/editor/monkeys_editor.config';
import MonkeysEditor, { OutputData } from '@themonkeys/monkeys-editor';

import { applyEditorDocument } from './postCanvas/applyEditorDocument';
import {
  dropEditorRoot,
  dropStaleEditorRoots,
  getEditorRoot,
} from './postCanvas/clearPostCanvasDocument';
import { createEditorHistorySession } from './postCanvas/editorHistorySession';
import { normalizePostDocument } from './postCanvas/normalizePostDocument';
import { preserveEditorSelection } from './postCanvas/preserveEditorSelection';
import { readEditorDocument } from './postCanvas/readEditorDocument';
import type { PostUndoHandle } from './postCanvas/types';
import { usePostCanvasShortcuts } from './postCanvas/usePostCanvasShortcuts';

export type { PostUndoHandle };
export type EditorProps = {
  blogId: string;
  data: OutputData;
  onChange: (data: OutputData) => void;
  onUndoHandleChange?: (handle: PostUndoHandle | null) => void;
};

const Editor: FC<EditorProps> = React.memo(function Editor({
  blogId,
  data,
  onChange,
  onUndoHandleChange,
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<ReturnType<
    typeof createEditorHistorySession
  > | null>(null);
  const localDataRef = useRef(data);
  const latest = useRef({ data, onChange, onUndoHandleChange });
  latest.current = { data, onChange, onUndoHandleChange };
  const [ready, setReady] = useState(false);
  const reportError = (error: unknown) =>
    console.warn('Editor operation failed', error);

  const run = (command: 'undo' | 'redo' | 'clear') => {
    void sessionRef.current?.[command]().catch(reportError);
  };
  usePostCanvasShortcuts({
    canvasRef,
    undo: ready ? { undo: () => run('undo'), redo: () => run('redo') } : null,
    clearDocument: ready ? () => run('clear') : null,
  });

  useEffect(() => {
    const holder = canvasRef.current;
    if (!holder) return;
    // The library destroys its entire holder. A late-ready StrictMode instance
    // must never share that holder with the next live editor.
    const instanceHolder = document.createElement('div');
    holder.append(instanceHolder);
    let disposed = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let session: ReturnType<typeof createEditorHistorySession> | null = null;
    const initial = normalizePostDocument(latest.current.data);
    localDataRef.current = initial;
    setReady(false);
    const editor = new MonkeysEditor({
      ...getEditorConfig(blogId),
      holder: instanceHolder,
      data: initial,
      onChange: () => {
        if (disposed || !session || session.isApplying()) return;
        clearTimeout(timer);
        timer = setTimeout(() => {
          void session?.capture().catch(reportError);
        }, 500);
      },
    });
    const publish = (doc: OutputData) => {
      if (disposed) return;
      localDataRef.current = doc;
      latest.current.onChange(doc);
      if (session)
        latest.current.onUndoHandleChange?.({
          undo: () => run('undo'),
          redo: () => run('redo'),
          canUndo: session.canUndo(),
          canRedo: session.canRedo(),
        });
    };
    void editor.isReady
      .then(async () => {
        if (disposed) {
          editor.destroy();
          dropEditorRoot(editor);
          return;
        }
        dropStaleEditorRoots(instanceHolder, getEditorRoot(editor));
        let baseline = initial;
        // Draft data may arrive while the library is initializing. Reconcile it
        // before publishing anything back to the parent or seeding undo history.
        while (!disposed) {
          const incoming = normalizePostDocument(latest.current.data);
          if (
            JSON.stringify(incoming.blocks) === JSON.stringify(baseline.blocks)
          )
            break;
          await editor.blocks.render(incoming);
          baseline = incoming;
        }
        if (disposed) {
          editor.destroy();
          return;
        }
        session = createEditorHistorySession(baseline, {
          read: async () => {
            clearTimeout(timer);
            return readEditorDocument(editor);
          },
          apply: async (from, to, focusTitle) => {
            if (disposed) return;
            clearTimeout(timer);
            await preserveEditorSelection(
              holder,
              async () => {
                await applyEditorDocument(editor.blocks, from, to);
              },
              focusTitle
            );
          },
          publish,
        });
        sessionRef.current = session;
        setReady(true);
        publish(baseline);
      })
      .catch(reportError);

    // Removed assets can still be referenced by undo snapshots. Reversible
    // document edits must not permanently delete uploaded files from storage.
    return () => {
      disposed = true;
      clearTimeout(timer);
      session?.dispose();
      if (sessionRef.current === session) sessionRef.current = null;
      latest.current.onUndoHandleChange?.(null);
      if (session) {
        editor.destroy();
        dropEditorRoot(editor);
      }
      instanceHolder.remove();
    };
  }, [blogId]);

  useEffect(() => {
    if (!ready || !sessionRef.current) return;
    const incoming = normalizePostDocument(data);
    if (
      JSON.stringify(incoming.blocks) ===
      JSON.stringify(localDataRef.current.blocks)
    )
      return;
    void sessionRef.current.replace(incoming).catch(reportError);
  }, [data, ready]);

  return (
    <div
      ref={canvasRef}
      className='w-full px-4 space-y-6 select-text'
      id='monkeys_editor_editor-container'
      data-post-canvas
    />
  );
});

export default Editor;
