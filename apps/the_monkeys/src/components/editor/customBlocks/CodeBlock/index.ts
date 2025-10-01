require('./style.css');

export default class CustomCodeTool {
  data: { code: string; language: string };
  api: any;
  codeEl: HTMLDivElement;
  readOnly: boolean;
  COPY_ICON: string;
  static get toolbox() {
    return {
      title: 'Code',
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    };
  }
  static get enableLineBreaks() {
    return true;
  }
  static get isReadOnlySupported() {
    return true;
  }
  constructor({
    data = {},
    api,
    config, // todo: add configuration
    readOnly = false,
  }: {
    data?: { code?: string; language?: string };
    api: any;
    config?: any;
    readOnly?: boolean;
  }) {
    this.api = api;
    this.readOnly = readOnly;
    this.COPY_ICON =
      'https://raw.githubusercontent.com/Remix-Design/RemixIcon/master/icons/Document/file-copy-line.svg';
    this.data = {
      code: data?.code || '',
      language: data?.language || 'plaintext',
    };
    this.codeEl = document.createElement('div');
  }
  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-code-wrapper';

    // Code block
    const pre = document.createElement('pre');
    const code = document.createElement('code');

    this.codeEl = code as HTMLDivElement;
    code.className = `custom-code-editor language-${this.data.language}`;
    code.textContent = this.data.code;
    if (!this.readOnly) {
      code.setAttribute('contenteditable', 'true');
      code.setAttribute('spellcheck', 'false');
      code.setAttribute('data-placeholder', 'Write your code here...');
      code.setAttribute('tab-index', '0');
      code.setAttribute('role', 'textbox');

      code.addEventListener('input', () => {
        this.data.code = code.innerText;
      });

      code.addEventListener('paste', (e) => this._handlePaste(e));
    }

    pre.appendChild(code);

    // Copy button
    const copyButton = document.createElement('button');
    const copyIcon = document.createElement('img');
    copyButton.className = 'code-copy-button';
    // Use a valid image URL or SVG data string for the icon
    copyIcon.src = this.COPY_ICON;

    copyIcon.className = 'copy-icon';
    const copyLabel = document.createElement('span');
    copyLabel.className = 'copy-label';
    copyLabel.textContent = 'Copy';
    const fragment = document.createDocumentFragment();
    fragment.appendChild(copyIcon);
    fragment.appendChild(copyLabel);
    copyButton.append(fragment);

    // copyButton.innerText = 'Copy';
    copyButton.addEventListener('click', () => this._handleCopy(copyButton));
    wrapper.appendChild(copyButton);
    wrapper.appendChild(pre);
    return wrapper;
  }

  save(): { code: string; language: string } {
    return {
      code: this.codeEl.innerText,
      language: this.data.language,
    };
  }

  static get sanitize() {
    return {
      code: true,
      language: true,
    };
  }

  _handlePaste(e: ClipboardEvent) {
    e.preventDefault();
    e.stopPropagation();

    const text = e.clipboardData?.getData('text/plain') || '';

    //  Insert plain text at caret using DOM Range API
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);

    // Move cursor after inserted text
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);

    // Update internal data and re-highlight
    this.data.code = this.codeEl.innerText;
    // setTimeout(() => this._highlightCode(), 0);
  }

  async _handleCopy(copyButton: HTMLButtonElement) {
    const textToCopy = this.codeEl?.innerText || '';
    const label = copyButton.querySelector('.copy-label') as HTMLSpanElement;
    const icon = copyButton.querySelector('.copy-icon') as HTMLImageElement;
    const defaultText = 'Copy';
    const copiedText = 'Copied!';
    const errorText = 'Error';
    const successIcon =
      'https://raw.githubusercontent.com/Remix-Design/RemixIcon/master/icons/System/checkbox-circle-line.svg'; // check box svg
    // cross check box
    const errorIcon =
      'https://raw.githubusercontent.com/Remix-Design/RemixIcon/master/icons/System/error-warning-line.svg'; // warning svg

    const resetButton = () => {
      label.textContent = defaultText;
      icon.src = this.COPY_ICON;
    };
    try {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          label.textContent = copiedText;
          icon.src = successIcon;
          setTimeout(resetButton, 1500);
        })
        .catch((err) => {
          console.log('error:', err);
          label.textContent = errorText;
          icon.src = errorIcon;
          setTimeout(resetButton, 1500);
        });
    } catch (err) {
      console.log('error:', err);
      label.textContent = errorText;
      icon.src = errorIcon;
      setTimeout(resetButton, 1500);
    }
  }
}
