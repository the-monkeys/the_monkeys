import './style.css';
import { Facebook, Instagram, Twitter, Youtube } from './utils/function';

type EmbedData = {
  url: string;
  service: string;
  // optionally you can store ogTitle, ogImage etc for fallback
  ogTitle?: string;
  ogImage?: string;
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

    const input = document.createElement('input');
    input.placeholder = 'Paste URL (Twitter, YouTube, Instagram, Facebook)';
    input.value = this.data.url || '';
    input.className = 'custom-embed-input';

    input.addEventListener('paste', (e: ClipboardEvent) => {
      const pastedUrl = e.clipboardData?.getData('text');
      if (pastedUrl) {
        const { service } = this.detectService(pastedUrl);
        this.data = { url: pastedUrl, service };
        this.showPreview();
      }
    });

    this.wrapper.innerHTML = ''; // clear existing
    this.wrapper.appendChild(input);

    if (this.data.url) {
      this.showPreview();
    }

    return this.wrapper;
  }

  save() {
    return this.data;
  }

  detectService(url: string): { service: string } {
    if (url.includes('youtube.com') || url.includes('youtu.be'))
      return { service: 'youtube' };
    if (url.includes('x.com') || url.includes('twitter.com'))
      return { service: 'twitter' };
    if (url.includes('instagram.com')) return { service: 'instagram' };
    if (url.includes('facebook.com')) return { service: 'facebook' };
    return { service: 'unknown' };
  }

  async showPreview() {
    this.wrapper.innerHTML = ''; // clear previous

    const { url, service } = this.data;
    if (!url) return;

    switch (service) {
      case 'youtube':
        Youtube(this.wrapper, url);
        break;

      case 'twitter':
        Twitter(this.wrapper, url);
        break;

      case 'instagram':
        Instagram(this.wrapper, url);
        break;

      case 'facebook':
        Facebook(this.wrapper, url);
        break;

      default:
        console.log('Service not supported');
    }
  }
}
