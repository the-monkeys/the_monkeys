'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { DEFAULT_TEMPLATE_ID } from '../registry';
import { ACCENT_PALETTE, DEFAULT_THEME_ID } from '../themes';
import { SnapshotInput, SnapshotState } from '../types';

export interface UseSnapshotStateOpts {
  initialInput: SnapshotInput;
  initialTemplateId?: string;
  initialThemeId?: string;
  initialAccent?: string;
}

export const useSnapshotState = ({
  initialInput,
  initialTemplateId = DEFAULT_TEMPLATE_ID,
  initialThemeId = DEFAULT_THEME_ID,
  initialAccent = ACCENT_PALETTE[0],
}: UseSnapshotStateOpts) => {
  const [state, setState] = useState<SnapshotState>({
    input: initialInput,
    templateId: initialTemplateId,
    themeId: initialThemeId,
    accent: initialAccent,
  });

  // Author is resolved asynchronously (session, profile, avatar). Capture
  // the first paint as-is, then overwrite the byline when it arrives so a
  // logged-in user is never stuck as "Anonymous User".
  useEffect(() => {
    const next = initialInput.author;
    if (!next) return;
    setState((s) => {
      const cur = s.input.author;
      if (
        cur?.username === next.username &&
        cur?.displayName === next.displayName &&
        cur?.avatarUrl === next.avatarUrl
      ) {
        return s;
      }
      return { ...s, input: { ...s.input, author: next } };
    });
  }, [initialInput.author]);

  const updateInput = useCallback((patch: Partial<SnapshotInput>) => {
    setState((s) => ({ ...s, input: { ...s.input, ...patch } }));
  }, []);

  const setTemplate = useCallback((templateId: string) => {
    setState((s) => ({ ...s, templateId }));
  }, []);

  const setTheme = useCallback((themeId: string) => {
    setState((s) => ({ ...s, themeId }));
  }, []);

  const setAccent = useCallback((accent: string) => {
    setState((s) => ({ ...s, accent }));
  }, []);

  const resetInput = useCallback((next: SnapshotInput) => {
    setState((s) => ({ ...s, input: next }));
  }, []);

  return useMemo(
    () => ({
      state,
      updateInput,
      setTemplate,
      setTheme,
      setAccent,
      resetInput,
    }),
    [state, updateInput, setTemplate, setTheme, setAccent, resetInput]
  );
};
