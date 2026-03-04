export default class PdfTool {
  data: { url: string; title: string; fileName?: string };
  api: any;
  config: any;
  wrapper: HTMLElement;
  readOnly: boolean;

  constructor({
    data,
    config,
    api,
    readOnly,
  }: {
    data?: { url: string; title: string; fileName?: string };
    config?: any;
    api: any;
    readOnly?: boolean;
  }) {
    this.api = api;
    this.config = config;
    this.data = data || { url: '', title: '', fileName: '' };
    this.readOnly = !!readOnly;
    this.wrapper = document.createElement('div');
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get toolbox() {
    return {
      title: 'PDF Viewer',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M10 13a2 2 0 0 0-4 0v2a2 2 0 0 0 4 0"/><path d="M13 13v4"/><path d="M13 13h2"/><path d="M13 15h2"/><path d="M18 13h2a2 2 0 0 0-2-2v4a2 2 0 0 0 2-2"/></svg>',
    };
  }

  render() {
    this.wrapper.classList.add('pdf-tool-wrapper');
    this.wrapper.style.margin = '20px 0';

    if (this.data.url) {
      this.showViewer();
    } else if (!this.readOnly) {
      this.showInput();
    } else {
      this.wrapper.innerHTML = `
                <div style="padding: 40px; text-align: center; color: #888; border: 1px dashed #ddd; border-radius: 12px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 12px; opacity: 0.5;"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <p>No PDF provided</p>
                </div>
            `;
    }

    return this.wrapper;
  }

  showInput() {
    this.wrapper.innerHTML = '';
    const container = document.createElement('div');
    container.style.padding = '20px';
    container.style.border = '1px dashed #ccc';
    container.style.textAlign = 'center';

    const button = document.createElement('button');
    button.innerText = 'Upload PDF or Paste URL';
    button.classList.add('cdx-button');

    button.onclick = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/pdf';
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (file && this.config.uploader) {
          button.innerText = 'Uploading...';
          try {
            const result = await this.config.uploader(file);
            if (result.success) {
              this.data = {
                url: result.file.url,
                title: file.name,
                fileName: result.file.name,
              };
              this.showViewer();
            }
          } catch (err) {
            button.innerText = 'Upload Failed';
          }
        }
      };
      input.click();
    };

    container.appendChild(button);
    this.wrapper.appendChild(container);
  }

  async showViewer() {
    this.wrapper.innerHTML = '';
    if (!this.data.url) return;

    let finalUrl = this.data.url;

    // Auto-resolve if it's a Storage V2 proxy URL
    if (finalUrl.includes('/storage/posts/') && finalUrl.endsWith('/url')) {
      try {
        const res = await fetch(finalUrl);
        const data = await res.json();
        if (data && data.url) {
          finalUrl = data.url;
        }
      } catch (err) {
        console.error('Failed to resolve PDF URL:', err);
      }
    }

    const readerUrl = `/read/pdf?url=${encodeURIComponent(finalUrl)}&title=${encodeURIComponent(this.data.title || '')}`;

    const iframe = document.createElement('iframe');
    iframe.src = readerUrl;
    iframe.style.width = '100%';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';
    iframe.title = this.data.title || 'PDF Viewer';

    this.wrapper.appendChild(iframe);
  }

  save() {
    return this.data;
  }

  removed() {
    if (this.data.fileName && this.config.onRemove) {
      this.config.onRemove(this.data.fileName).catch((err: any) => {
        console.error('Failed to remove PDF from storage:', err);
      });
    }
  }
}
