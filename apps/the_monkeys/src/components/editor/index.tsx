'use client';

import React, { FC, useEffect, useMemo, useRef } from 'react';

import { getEditorConfig } from '@/config/editor/editorjs.config';
import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import EditorJS, { OutputData } from '@editorjs/editorjs';

export type EditorProps = {
  blogId: string;
  data: OutputData;
  onChange: (data: OutputData) => void;
};

// Extract all file URLs from EditorJS blocks that have data.file.url
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

const Editor: FC<EditorProps> = React.memo(function Editor({
  blogId,
  data,
  onChange,
}) {
  const editorInstance = useRef<EditorJS | null>(null);
  const prevFileUrls = useRef<Set<string>>(extractFileUrls(data?.blocks || []));
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const localDataRef = useRef<OutputData | null>(data);

  // Pre-calculate the config based on the blogId
  const editorConfig = useMemo(() => getEditorConfig(blogId), [blogId]);

  useEffect(() => {
    if (!editorInstance.current) {
      editorInstance.current = new EditorJS({
        ...editorConfig,
        data: data,
        onChange: (api) => {
          // Debounce the save operation to prevent UI jank during typing
          if (debounceTimer.current) clearTimeout(debounceTimer.current);

          debounceTimer.current = setTimeout(async () => {
            if (onChange) {
              const savedData = await api.saver.save();
              localDataRef.current = savedData;

              // Detect removed file blocks and delete their files from storage.
              const currentUrls = extractFileUrls(savedData.blocks);
              Array.from(prevFileUrls.current).forEach((url) => {
                if (!currentUrls.has(url)) {
                  deleteOrphanedFile(url);
                }
              });
              prevFileUrls.current = currentUrls;

              onChange(savedData);
            }
          }, 500); // 500ms debounce
        },
      });
    }

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (editorInstance.current && editorInstance.current.destroy) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [blogId, editorConfig, onChange]);

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
    <div className='w-full px-4 space-y-6' id='editorjs_editor-container'></div>
  );
});

export default Editor;
