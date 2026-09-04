'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useRouter } from 'next/navigation';

import { copyBlobToClipboard } from '@/components/CopyImageButton';
import useAuth from '@/hooks/auth/useAuth';
import useGetAuthUserProfile from '@/hooks/user/useGetAuthUserProfile';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@the-monkeys/ui/atoms/accordion';

import { useCardEditor } from '../hooks/useCardEditor';
import { useCardQr } from '../hooks/useCardQr';
import { useExportCard } from '../hooks/useExportCard';
import { saveCard } from '../lib/cardsRemote';
import { buildProfilePrefill, fetchProfileAvatarDataUrl } from '../lib/prefill';
import { clearDraft, loadDraft, saveDraft } from '../lib/storage';
import { downloadVCard } from '../lib/vcard';
import { getTemplateById } from '../registry';
import { CardState } from '../types';
import { CardPreview } from './CardPreview';
import { CardTemplatePicker } from './CardTemplatePicker';
import { CardThemePicker } from './CardThemePicker';
import { ContactFields } from './ContactFields';
import { CustomizationPanel } from './CustomizationPanel';
import { ExportMenu } from './ExportMenu';
import { ImageUploader } from './ImageUploader';
import { PrivateAddressPicker } from './PrivateAddressPicker';
import { SocialLinkEditor } from './SocialLinkEditor';

export interface CardStudioProps {
  /** Existing card ID for edit mode, null for new card. */
  cardId?: string | null;
  /** Initial state (from storage or defaults). */
  initial?: Partial<CardState>;
}

export const CardStudio = ({ cardId = null, initial }: CardStudioProps) => {
  // For a brand-new card, restore any unsaved draft so a refresh never wipes work.
  const draftInitial = useMemo(
    () => (initial || cardId ? undefined : loadDraft()),
    [initial, cardId]
  );
  const resolvedInitial = initial ?? draftInitial;

  const {
    state,
    updateContact,
    updateInput,
    setSocialLinks,
    setTemplate,
    setTheme,
    updateCustomization,
  } = useCardEditor({ initial: resolvedInitial });

  const [savedId, setSavedId] = useState<string | null>(cardId ?? null);
  const [saveStatus, setSaveStatus] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');
  const router = useRouter();

  // Prefill a pristine new card from the signed-in user's profile.
  const { data: session } = useAuth();
  const { data: profile } = useGetAuthUserProfile(session?.username);
  const prefilledRef = useRef(false);
  const avatarPrefilledRef = useRef(false);
  const shouldPrefill = !cardId && !initial && !draftInitial;

  useEffect(() => {
    if (!shouldPrefill || prefilledRef.current) return;
    if (!session && !profile) return;
    const c = state.input.contact;
    const pristine =
      !c.firstName && !c.lastName && !c.email && !c.phone && !c.address;
    if (!pristine) {
      prefilledRef.current = true;
      return;
    }
    const { contact, socialLinks } = buildProfilePrefill(session, profile);
    if (Object.keys(contact).length) updateContact(contact);
    if (socialLinks.length && !state.input.socialLinks.length) {
      setSocialLinks(socialLinks);
    }
    prefilledRef.current = true;
  }, [
    shouldPrefill,
    session,
    profile,
    state.input.contact,
    state.input.socialLinks.length,
    updateContact,
    setSocialLinks,
  ]);

  // Prefill the card avatar from the user's profile picture (once per mount).
  // Runs for any new card (even one restored from a draft) as long as no
  // avatar is set yet, so the default profile photo is always applied.
  useEffect(() => {
    if (cardId || avatarPrefilledRef.current) return;
    const username = session?.username;
    if (!username) return;
    avatarPrefilledRef.current = true;
    if (state.input.avatarUrl) return;
    let active = true;
    void (async () => {
      const dataUrl = await fetchProfileAvatarDataUrl(username);
      if (active && dataUrl) updateInput({ avatarUrl: dataUrl });
    })();
    return () => {
      active = false;
    };
  }, [cardId, session?.username, state.input.avatarUrl, updateInput]);

  // Persist the working draft on every change (new cards only).
  useEffect(() => {
    if (cardId) return;
    saveDraft(state);
  }, [state, cardId]);

  const template = getTemplateById(state.templateId);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const qrDataUrl = useCardQr(state.input, state.customization.showQr);

  const { exportImage, isExporting, error } = useExportCard(cardRef, {
    width: template.width,
    height: template.height,
  });

  const handleSave = useCallback(async () => {
    setSaveStatus('saving');
    try {
      const card = await saveCard(savedId, state);
      // Once persisted server-side, drop the local working draft.
      clearDraft();
      setSaveStatus('saved');
      if (savedId) {
        setTimeout(() => setSaveStatus('idle'), 2000);
        return;
      }
      // New card: move to its canonical edit URL so a refresh reloads the
      // persisted document instead of starting a blank studio.
      setSavedId(card.id);
      router.replace(`/cards/${card.id}`);
    } catch {
      setSaveStatus('error');
    }
  }, [savedId, state, router]);

  const handleVCard = useCallback(() => {
    downloadVCard(state.input.contact, state.input.socialLinks);
  }, [state.input.contact, state.input.socialLinks]);

  const filename =
    `${state.input.contact.firstName}-${state.input.contact.lastName}-card`
      .replace(/[^a-zA-Z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase() || 'business-card';

  const hasName = state.input.contact.firstName || state.input.contact.lastName;

  const [copied, setCopied] = useState(false);
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async () => {
    if (!hasName) return;
    setIsCopying(true);
    try {
      const blob = await exportImage({
        format: 'png',
        pixelRatio: 3,
        filename,
        download: false,
      });
      if (blob) {
        await copyBlobToClipboard(blob);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className='flex flex-col gap-6 lg:flex-row lg:gap-8'>
      {/* Preview column */}
      <div className='flex flex-col gap-4 lg:sticky lg:top-20 lg:w-[520px] lg:self-start xl:w-[600px]'>
        <CardPreview
          ref={cardRef}
          input={state.input}
          templateId={state.templateId}
          themeId={state.themeId}
          customization={state.customization}
          qrDataUrl={qrDataUrl}
          className='rounded-xl border border-foreground/10 bg-foreground/5 p-4'
        />

        {error && <p className='text-sm text-destructive'>{error.message}</p>}

        <ExportMenu
          isExporting={isExporting}
          onExport={exportImage}
          onCopy={handleCopy}
          copying={isCopying}
          copied={copied}
          onDownloadVCard={handleVCard}
          filename={filename}
          disabled={!hasName}
        />
      </div>

      {/* Options column */}
      <div className='flex min-w-0 flex-1 flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <h2 className='font-newsreader text-xl font-semibold'>
            {savedId ? 'Edit Card' : 'New Card'}
          </h2>
          <button
            type='button'
            onClick={handleSave}
            className='rounded-md bg-brand-orange px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50'
            disabled={!hasName || saveStatus === 'saving'}
          >
            {saveStatus === 'saved'
              ? '✓ Saved'
              : saveStatus === 'saving'
                ? 'Saving…'
                : saveStatus === 'error'
                  ? '⚠ Retry save'
                  : 'Save'}
          </button>
        </div>

        <Accordion
          type='multiple'
          defaultValue={['contact', 'template', 'appearance']}
          className='w-full'
        >
          {/* Contact Info */}
          <AccordionItem value='contact'>
            <AccordionTrigger className='text-sm font-semibold'>
              Contact Information
            </AccordionTrigger>
            <AccordionContent>
              <ContactFields
                contact={state.input.contact}
                onChange={updateContact}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Address */}
          <AccordionItem value='address'>
            <AccordionTrigger className='text-sm font-semibold'>
              Address
            </AccordionTrigger>
            <AccordionContent>
              <PrivateAddressPicker
                selected={state.input.contact.address}
                onSelect={(formatted) => updateContact({ address: formatted })}
                onClear={() => updateContact({ address: '' })}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Photos */}
          <AccordionItem value='photos'>
            <AccordionTrigger className='text-sm font-semibold'>
              Photo &amp; Logo
            </AccordionTrigger>
            <AccordionContent>
              <div className='flex flex-col gap-4'>
                <ImageUploader
                  label='Profile Photo'
                  value={state.input.avatarUrl}
                  maxSizeKb={5120}
                  onChange={(v) => updateInput({ avatarUrl: v })}
                />
                <ImageUploader
                  label='Company Logo'
                  value={state.input.logoUrl}
                  maxSizeKb={2048}
                  onChange={(v) => updateInput({ logoUrl: v })}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Social */}
          <AccordionItem value='social'>
            <AccordionTrigger className='text-sm font-semibold'>
              Social Links
            </AccordionTrigger>
            <AccordionContent>
              <SocialLinkEditor
                links={state.input.socialLinks}
                onChange={setSocialLinks}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Template */}
          <AccordionItem value='template'>
            <AccordionTrigger className='text-sm font-semibold'>
              Template &amp; Theme
            </AccordionTrigger>
            <AccordionContent>
              <div className='flex flex-col gap-4'>
                <CardTemplatePicker
                  value={state.templateId}
                  onChange={setTemplate}
                />
                <CardThemePicker value={state.themeId} onChange={setTheme} />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Customization */}
          <AccordionItem value='appearance'>
            <AccordionTrigger className='text-sm font-semibold'>
              Appearance
            </AccordionTrigger>
            <AccordionContent>
              <CustomizationPanel
                customization={state.customization}
                onChange={updateCustomization}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
