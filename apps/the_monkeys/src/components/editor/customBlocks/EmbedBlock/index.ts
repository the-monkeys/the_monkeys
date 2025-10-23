import './style.css';
import {  renderInstagramEmbed, renderTwitterEmbed, renderUnsupportedEmbed, renderYouTubeEmbed } from './utils/function';

type EmbedData = {
  url: string;
  service: string;
  ogTitle?: string;
  ogImage?: string;
  ogDescription?: string
};

export default class CustomEmbed {
  data: EmbedData;
  api: any;
  config?: any;
  block?: any;
  wrapper: HTMLElement;
  readonly?: boolean;

  constructor({
    data,
    config,
    api,
    block,
  }: {
    data?: EmbedData;
    config?: any;
    api: any;
    block?: any;
  }) {
    this.api = api;
    this.config = config;
    this.block = block;
    this.data = data || { url: '', service: '' };
    this.wrapper = document.createElement('div');
  }

  static get isReadOnlySupported() {
    return true;
  }
  static get toolbox() {
    return {
      title: 'Embed',
      icon: '<svg width="14" height="14"><path d="M2 7h10M7 2v10"/></svg>',
    };
  }

  render() {
    if (this.readonly) {
      if (this.data.url) {
        this.showPreview();
      }
    }
const container = document.createElement('form');
container.className = "embed-input-container"
    const input = document.createElement('input');

    container.appendChild(input)
    input.placeholder = 'Paste URL (Twitter, YouTube, Instagram)';
    input.value = this.data.url || '';
    input.className = 'embed-input';
    input.id = 'embed-input-id'
    input.autocomplete = 'off';
    input.autocapitalize = 'off';
    input.spellcheck = false;


    input.addEventListener('paste', (e: ClipboardEvent) => {
      const pastedUrl = e.clipboardData?.getData('text');
      if (pastedUrl) {
        const { service } = this.detectService(pastedUrl);
        this.data = { url: pastedUrl, service };
        this.showPreview();
      }
    });

    this.wrapper.innerHTML = ''; // clear existing
    this.wrapper.appendChild(container);

    if (this.data.url) {
      this.showPreview();
    }

    return this.wrapper;
  }

  save() {
    return this.data;
  }

detectService(url: string): { service: string } {
  if (!url || typeof url !== 'string') {
    return { service: 'unknown' };
  }

  const patterns: Record<string, RegExp> = {
    youtube: /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com|youtu\.be)(?:\/|$)/i,
    twitter: /^(?:https?:\/\/)?(?:www\.|mobile\.)?(?:x\.com|twitter\.com)(?:\/|$)/i,
    instagram: /^(?:https?:\/\/)?(?:www\.|m\.)?instagram\.com(?:\/|$)/i,
    // facebook: /^(?:https?:\/\/)?(?:www\.|m\.)?facebook\.com(?:\/|$)/i,
    linkedin: /^(?:https?:\/\/)?(?:[a-z]{2,3}\.)?linkedin\.com(?:\/|$)/i,
  };


  const sanitizedUrl = url.trim().replace(/\s+/g, '').replace(/\/+$/, '');

  for (const [service, regex] of Object.entries(patterns)) {
    if (regex.test(sanitizedUrl)) {
      return { service };
    }
  }

  return { service: 'unknown' };
}


  async showPreview() {
    this.wrapper.innerHTML = ''; // clear previous

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

      // case 'facebook':
      //   renderFacebookEmbed(this.wrapper, url);
      //   break;

      default:
        renderUnsupportedEmbed(this.wrapper);
    }
  }
}