'use client';

import React, { FC, useEffect, useMemo, useRef, useState } from 'react';

import { getEditorConfig } from '@/config/editor/monkeys_editor.config';
import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import MonkeysEditor, { OutputData } from '@themonkeys/monkeys-editor';

import { attachEditorUndo } from './postCanvas/attachEditorUndo';
import {
  clearPostCanvasDocument,
  dropEditorRoot,
  dropStaleEditorRoots,
  getEditorRoot,
} from './postCanvas/clearPostCanvasDocument';
import type { PostUndoController, PostUndoHandle } from './postCanvas/types';
import { usePostCanvasShortcuts } from './postCanvas/usePostCanvasShortcuts';
import { withFirstBlockTitleId } from './postCanvas/withFirstBlockTitleId';

export type { PostUndoHandle };

export type EditorProps = {
  blogId: string;
  data: OutputData;
  onChange: (data: OutputData) => void;
  onUndoHandleChange?: (handle: PostUndoHandle | null) => void;
};

// Extract all file URLs from MonkeysEditor blocks that have data.file.url
function extractFileUrls(blocks: OutputData['blocks']): Set<string> {
  const urls = new Set<string>();
  for (const block of blocks) {
    const url = block?.data?.file?.url;
    if (typeof url === 'string' && url.length > 0) {
      urls.add(url);
    }
  }
  return urls;
}

// Delete an orphaned file from v2 storage.
function deleteOrphanedFile(url: string) {
  const v2Prefix = '/api/v2';
  const path = url.startsWith(v2Prefix) ? url.slice(v2Prefix.length) : url;

  axiosInstanceV2.delete(path).catch((err) => {
    console.warn('Failed to delete orphaned file:', path, err);
  });
}

function abandonEditor(editor: MonkeysEditor | null) {
  try {
    editor?.destroy?.();
  } catch (err) {
    console.warn('editor destroy failed', err);
  }
  dropEditorRoot(editor);
}

const Editor: FC<EditorProps> = React.memo(function Editor({
  blogId,
  data,
  onChange,
  onUndoHandleChange,
}) {
  const editorInstance = useRef<MonkeysEditor | null>(null);
  const prevFileUrls = useRef<Set<string>>(extractFileUrls(data?.blocks || []));
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const localDataRef = useRef<OutputData | null>(data);
  const canvasRef = useRef<HTMLDivElement>(null);
  const undoControllerRef = useRef<PostUndoController | null>(null);
  const detachUndoRef = useRef<(() => void) | null>(null);
  const undoAttachGen = useRef(0);
  const [undoReady, setUndoReady] = useState(false);

  // Pre-calculate the config based on the blogId
  const editorConfig = useMemo(() => getEditorConfig(blogId), [blogId]);

  usePostCanvasShortcuts({
    canvasRef,
    undo: undoReady
      ? {
          undo: () => {
            undoControllerRef.current?.undo();
            dropStaleEditorRoots(
              canvasRef.current,
              getEditorRoot(editorInstance.current)
            );
          },
          redo: () => {
            undoControllerRef.current?.redo();
            dropStaleEditorRoots(
              canvasRef.current,
              getEditorRoot(editorInstance.current)
            );
          },
        }
      : null,
    clearDocument: () => {
      const editor = editorInstance.current;
      if (!editor) return;
      void clearPostCanvasDocument({
        editor,
        holder: canvasRef.current,
        onCleared: (empty) => {
          localDataRef.current = empty as OutputData;
          onChange(empty as OutputData);
        },
      }).catch((err) => {
        console.warn('post canvas clear failed', err);
      });
    },
  });

  useEffect(() => {
    const attachGen = ++undoAttachGen.current;
    let cancelled = false;

    const previous = editorInstance.current;
    editorInstance.current = null;
    abandonEditor(previous);
    canvasRef.current?.replaceChildren();

    editorInstance.current = new MonkeysEditor({
      ...editorConfig,
      data: data,
      onChange: (api) => {
        // Debounce the save operation to prevent UI jank during typing
        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(async () => {
          if (!onChange) return;
          try {
            const savedData = await api.saver.save();
            const nextData = {
              ...savedData,
              blocks: withFirstBlockTitleId(savedData.blocks),
            };
            localDataRef.current = nextData;

            // Detect removed file blocks and delete their files from storage.
            const currentUrls = extractFileUrls(savedData.blocks);
            Array.from(prevFileUrls.current).forEach((url) => {
              if (!currentUrls.has(url)) {
                deleteOrphanedFile(url);
              }
            });
            prevFileUrls.current = currentUrls;

            onChange(nextData);
          } catch (err) {
            console.warn('editor save failed', err);
          }
        }, 500); // 500ms debounce
      },
    });

    const editor = editorInstance.current;
    void editor.isReady.then(
      () => {
        if (cancelled || undoAttachGen.current !== attachGen) {
          // Do not destroy(): EditorJS destroy empties the shared holder and
          // would wipe the live remount. Only drop this instance's wrapper.
          dropEditorRoot(editor);
          return;
        }
        dropStaleEditorRoots(canvasRef.current, getEditorRoot(editor));
      },
      () => {
        if (cancelled || undoAttachGen.current !== attachGen) {
          dropEditorRoot(editor);
        }
      }
    );
    void attachEditorUndo({
      editor,
      initialData: data,
      onHandleChange: (handle) => {
        if (cancelled || undoAttachGen.current !== attachGen) return;
        undoControllerRef.current = handle
          ? { undo: handle.undo, redo: handle.redo }
          : null;
        setUndoReady(Boolean(handle));
        onUndoHandleChange?.(handle);
      },
    }).then((detach) => {
      if (cancelled || undoAttachGen.current !== attachGen) {
        detach();
        return;
      }
      detachUndoRef.current = detach;
    });

    return () => {
      cancelled = true;
      undoAttachGen.current += 1;
      detachUndoRef.current?.();
      detachUndoRef.current = null;
      undoControllerRef.current = null;
      setUndoReady(false);
      onUndoHandleChange?.(null);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      const editorToDestroy = editorInstance.current;
      editorInstance.current = null;
      abandonEditor(editorToDestroy);
      canvasRef.current?.replaceChildren();
    };
  }, [blogId, editorConfig, onChange, onUndoHandleChange]);

  // Sync editor data if updated from outside (e.g. from PublishBlogDrawer)
  useEffect(() => {
    if (!editorInstance.current || !data) return;

    const isDifferent =
      !localDataRef.current ||
      JSON.stringify(data.blocks) !==
        JSON.stringify(localDataRef.current.blocks);

    if (isDifferent) {
      editorInstance.current.isReady.then(() => {
        if (!editorInstance.current) return;
        editorInstance.current.render(data);
        localDataRef.current = data;
      });
    }
  }, [data]);

  return (
    <div
      ref={canvasRef}
      className='w-full px-4 space-y-6 select-text'
      id='monkeys_editor_editor-container'
      data-post-canvas
    ></div>
  );
});

export default Editor;
