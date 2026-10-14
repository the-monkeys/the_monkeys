'use client';

import { useCallback, useMemo, useState } from 'react';

import { createDefaultState } from '../defaults';
import {
  CardContact,
  CardCustomization,
  CardInput,
  CardState,
  SocialLink,
} from '../types';

export interface UseCardEditorOpts {
  initial?: Partial<CardState>;
}

export const useCardEditor = ({ initial }: UseCardEditorOpts = {}) => {
  const [state, setState] = useState<CardState>(() =>
    createDefaultState(initial)
  );

  const updateContact = useCallback((patch: Partial<CardContact>) => {
    setState((s) => ({
      ...s,
      input: {
        ...s.input,
        contact: { ...s.input.contact, ...patch },
      },
    }));
  }, []);

  const updateInput = useCallback((patch: Partial<CardInput>) => {
    setState((s) => ({
      ...s,
      input: { ...s.input, ...patch },
    }));
  }, []);

  const setSocialLinks = useCallback((links: SocialLink[]) => {
    setState((s) => ({
      ...s,
      input: { ...s.input, socialLinks: links },
    }));
  }, []);

  const setTemplate = useCallback((templateId: string) => {
    setState((s) => ({ ...s, templateId }));
  }, []);

  const setTheme = useCallback((themeId: string) => {
    setState((s) => ({ ...s, themeId }));
  }, []);

  const updateCustomization = useCallback(
    (patch: Partial<CardCustomization>) => {
      setState((s) => ({
        ...s,
        customization: { ...s.customization, ...patch },
      }));
    },
    []
  );

  return useMemo(
    () => ({
      state,
      updateContact,
      updateInput,
      setSocialLinks,
      setTemplate,
      setTheme,
      updateCustomization,
    }),
    [
      state,
      updateContact,
      updateInput,
      setSocialLinks,
      setTemplate,
      setTheme,
      updateCustomization,
    ]
  );
};
