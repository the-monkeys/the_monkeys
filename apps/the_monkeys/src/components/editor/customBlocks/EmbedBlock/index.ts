import {
  API,
  BlockAPI,
  BlockTool,
  ToolboxConfig,
} from '@themonkeys/monkeys-editor';

import './style.css';
import {
  renderFacebookEmbed,
  renderInstagramEmbed,
  renderTwitterEmbed,
  renderUnsupportedEmbed,
  renderYouTubeEmbed,
} from './utils/embed-function';
import type { EmbedConstructorArgs, EmbedData } from './utils/types';

export default class CustomEmbed implements BlockTool {
  private data: EmbedData;
  private api: API;
  private config: any;
  private block: BlockAPI | any;
  private wrapper: HTMLElement;
  private readOnly: boolean;
  private backspaceTimeout: number | null = null;
  private inputEl: HTMLInputElement | null = null;
  private formEl: HTMLFormElement | null = null;

  private static readonly EMBED_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="7 7 3 12 7 17" /><line x1="13" y1="7" x2="11" y2="17" /><polyline points="17 7 21 12 17 17" /></svg>`;

  constructor({ data, config, api, readOnly, block }: EmbedConstructorArgs) {
    this.api = api;
    this.readOnly = !!readOnly;
    this.config = config ?? {};
    this.block = block;
    this.data = data || { url: '', service: '' };
    this.wrapper = document.createElement('div');
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get toolbox(): ToolboxConfig {
    return {
      title: 'Embed',
      icon: CustomEmbed.EMBED_ICON,
    };
  }

  static get sanitize() {
    return {
      url: false,
      service: false,
      ogTitle: false,
      ogImage: false,
      ogDescription: false,
    };
  }

  render() {
    this.removeInputListeners();
    this.wrapper.innerHTML = '';

    if (this.data.url) {
      this.showPreview();
      return this.wrapper;
    }

    if (this.readOnly) {
      return this.wrapper;
    }

    const form = document.createElement('form');
    form.className = 'embed-input-container';
    const input = document.createElement('input');

    form.appendChild(input);
    input.placeholder = 'Paste URL (Twitter, YouTube, Instagram, Facebook)';
    input.value = this.data.url || '';
    input.className = 'embed-input';
    input.id = 'embed-input-id';
    input.autocomplete = 'off';
    input.autocapitalize = 'off';
    input.spellcheck = false;

    input.addEventListener('paste', this.handleInputPaste);
    input.addEventListener('keydown', this.onKeyDown);
    form.addEventListener('submit', this.handleSubmit);

    this.inputEl = input;
    this.formEl = form;

    this.wrapper.appendChild(form);

    return this.wrapper;
  }

  destroy() {
    this.removeInputListeners();

    if (this.backspaceTimeout) {
      clearTimeout(this.backspaceTimeout);
      this.backspaceTimeout = null;
    }
  }

  private removeInputListeners() {
    if (this.inputEl) {
      this.inputEl.removeEventListener('paste', this.handleInputPaste);
      this.inputEl.removeEventListener('keydown', this.onKeyDown);
      this.inputEl = null;
    }

    if (this.formEl) {
      this.formEl.removeEventListener('submit', this.handleSubmit);
      this.formEl = null;
    }
  }

  save() {
    return this.data;
  }

  detectService(url: string): { service: string } {
    if (!url || typeof url !== 'string') {
      return { service: 'unknown' };
    }

    const patterns: Record<string, RegExp> = {
      youtube:
        /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com|youtu\.be)(?:\/|$)/i,
      twitter:
        /^(?:https?:\/\/)?(?:www\.|mobile\.)?(?:x\.com|twitter\.com)(?:\/|$)/i,
      instagram: /^(?:https?:\/\/)?(?:www\.|m\.)?instagram\.com(?:\/|$)/i,
      facebook: /^(?:https?:\/\/)?(?:www\.|m\.)?facebook\.com(?:\/|$)/i,
    };

    const sanitizedUrl = url.trim().replace(/\s+/g, '').replace(/\/+$/, '');

    for (const [service, regex] of Object.entries(patterns)) {
      if (regex.test(sanitizedUrl)) {
        return { service };
      }
    }

    return { service: 'unknown' };
  }

  private embedUrl(url: string) {
    const trimmed = url.trim();
    if (!trimmed) return;

    const { service } = this.detectService(trimmed);
    this.data = { url: trimmed, service };
    this.showPreview();
    this.insertParagraphAfter();
  }

  private handleInputPaste = (e: ClipboardEvent) => {
    const pastedUrl = e.clipboardData?.getData('text');
    if (pastedUrl) {
      e.preventDefault();
      this.embedUrl(pastedUrl);
    }
  };

  private handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (this.inputEl) {
      this.embedUrl(this.inputEl.value);
    }
  };

  async showPreview() {
    this.removeInputListeners();
    this.wrapper.innerHTML = '';

    const { url, service } = this.data;
    if (!url) return;

    switch (service) {
      case 'youtube':
        renderYouTubeEmbed(this.wrapper, url);
        break;

      case 'twitter':
        renderTwitterEmbed(this.wrapper, url);
        break;

      case 'instagram':
        renderInstagramEmbed(this.wrapper, url);
        break;

      case 'facebook':
        renderFacebookEmbed(this.wrapper, url);
        break;

      default:
        renderUnsupportedEmbed(this.wrapper, url);
    }
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (this.readOnly) return;

    switch (event.key) {
      case 'Backspace':
        this.handleBackspace(event);
        break;
    }
  };

  /**
   * If the block is empty, pressing Backspace converts this block into a paragraph block.
   */
  private handleBackspace(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    const isEmpty = !this.data.url && input.value.trim() === '';
    if (!isEmpty) return;

    if (input.selectionStart !== 0 || input.selectionEnd !== 0) return;

    event.preventDefault();
    this.convertToParagraph();
  }

  /**
   * After a URL is embedded, paragraph block is created below it.
   */
  private insertParagraphAfter() {
    const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();
    const nextIndex = currentBlockIndex + 1;
    const blocksCount = this.api.blocks.getBlocksCount();

    const nextBlock =
      nextIndex < blocksCount
        ? this.api.blocks.getBlockByIndex(nextIndex)
        : null;

    if (!nextBlock || nextBlock.name !== 'paragraph') {
      this.api.blocks.insert('paragraph', { text: '' }, {}, nextIndex, false);
    }

    if (this.backspaceTimeout) {
      clearTimeout(this.backspaceTimeout);
    }

    this.backspaceTimeout = window.setTimeout(() => {
      this.api.caret.setToBlock(nextIndex);
      this.backspaceTimeout = null;
    }, 200);
  }

  private convertToParagraph() {
    const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();

    if (this.backspaceTimeout) {
      clearTimeout(this.backspaceTimeout);
    }

    this.api.blocks.insert(
      'paragraph',
      { text: '' },
      {},
      currentBlockIndex,
      false
    );
    this.api.blocks.delete(currentBlockIndex + 1);

    this.backspaceTimeout = window.setTimeout(() => {
      this.api.caret.setToBlock(currentBlockIndex);
      this.backspaceTimeout = null;
    }, 10);
  }
}
