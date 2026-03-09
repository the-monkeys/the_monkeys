'use client';

import React, { FC, useEffect, useRef } from 'react';

import axiosInstanceV2 from '@/services/api/axiosInstanceV2';
import EditorJS, { EditorConfig, OutputData } from '@editorjs/editorjs';

export type EditorProps = {
  data: OutputData;
  onChange: (data: OutputData) => void;
  config: EditorConfig;
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
// URL format: /api/v2/storage/posts/{blogId}/{fileName}
// axiosInstanceV2 baseURL is /api/v2, so we strip that prefix.
function deleteOrphanedFile(url: string) {
  // Relative path: "/api/v2/storage/posts/{id}/{file}"
  // Strip "/api/v2" to get "/storage/posts/{id}/{file}" for axiosInstanceV2
  const v2Prefix = '/api/v2';
  const path = url.startsWith(v2Prefix) ? url.slice(v2Prefix.length) : url;

  axiosInstanceV2.delete(path).catch((err) => {
    // Best-effort cleanup — don't block the editor on failure.
    console.warn('Failed to delete orphaned file:', path, err);
  });
}

const Editor: FC<EditorProps> = React.memo(function Editor({
  data,
  onChange,
  config,
}) {
  const editorInstance = useRef<EditorJS | null>(null);
  const prevFileUrls = useRef<Set<string>>(extractFileUrls(data?.blocks || []));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!editorInstance.current) {
      editorInstance.current = new EditorJS({
        ...config,
        data: data,
        onChange: async (api, event: any) => {
          if (onChange) {
            const savedData = await api.saver.save();

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
        },
      });
    }

    return () => {
      if (editorInstance.current && editorInstance.current.destroy) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, []);

  return (
    <div className='w-full px-4 space-y-6' id='editorjs_editor-container'></div>
  );
});

export default Editor;
