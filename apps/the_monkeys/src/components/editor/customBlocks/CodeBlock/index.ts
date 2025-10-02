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

  static get sanitize() {
    return {
      code: true,
      language: true,
    };
  }
  constructor({
    data = {},
    api,
    // config, // todo: add configuration
    readOnly = false,
  }: {
    data?: { code?: string; language?: string };
    api: any;
    // config?: any;
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

    const pre = document.createElement('pre');
    const code = document.createElement('code');

    this.codeEl = code as HTMLDivElement;
    code.className = `custom-code-editor language-${this.data.language}`;
    code.textContent = this.data.code;

    if (!this.readOnly) {
      Object.assign(code, {
        contentEditable: 'true',
        spellcheck: 'false',
      });
      code.setAttribute('data-placeholder', 'Write your code here...');
      code.setAttribute('tabindex', '0');
      code.setAttribute('role', 'textbox');

      code.addEventListener('input', () => {
        this.data.code = code.textContent || '';
      });

      code.addEventListener('paste', (e) => this._handlePaste(e));
    }

    pre.appendChild(code);

    const copyButton = document.createElement('button');
    copyButton.setAttribute('aria-label', 'Copy code to clipboard');
    const copyIcon = document.createElement('img');
    copyButton.className = 'code-copy-button';

    copyIcon.src = this.COPY_ICON;

    copyIcon.className = 'copy-icon';
    const copyLabel = document.createElement('span');
    copyLabel.className = 'copy-label';
    copyLabel.textContent = 'Copy';

    // Use a DocumentFragment to group copy icon and label before appending
    const fragment = document.createDocumentFragment();
    copyButton.append(copyIcon, copyLabel);
    // Append grouped elements to the copy button
    copyButton.append(fragment);

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

  // helper function - when user paste code inside the code wrapper
  _handlePaste(e: ClipboardEvent) {
    e.preventDefault();
    e.stopPropagation();

    const clipboardText = e.clipboardData?.getData('text/plain');
    if (!clipboardText) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const insertedNode = document.createTextNode(clipboardText);
    range.insertNode(insertedNode);

    // Move caret to immediately after the inserted text
    range.setStartAfter(insertedNode);
    range.setEndAfter(insertedNode);
    selection.removeAllRanges();
    selection.addRange(range);

    // Sync internal model with UI
    this.data.code = this.codeEl.textContent || '';
  }

  // helper function - handle copy button logic and also show ui feedback
  async _handleCopy(copyButton: HTMLButtonElement) {
    const textToCopy = this.codeEl?.innerText || '';

    const label = copyButton.querySelector(
      '.copy-label'
    ) as HTMLSpanElement | null;
    const icon = copyButton.querySelector(
      '.copy-icon'
    ) as HTMLImageElement | null;

    if (!label || !icon) {
      console.warn('Copy button label or icon missing');
      return;
    }

    const defaultText = 'Copy';
    const copiedText = 'Copied!';
    const errorText = 'Error';

    const successIcon =
      'https://raw.githubusercontent.com/Remix-Design/RemixIcon/master/icons/System/checkbox-circle-line.svg';
    const errorIcon =
      'https://raw.githubusercontent.com/Remix-Design/RemixIcon/master/icons/System/error-warning-line.svg';

    const setFeedback = (text: string, iconUrl: string) => {
      label.textContent = text;
      icon.src = iconUrl;

      setTimeout(() => {
        label.textContent = defaultText;
        icon.src = this.COPY_ICON;
      }, 1500);
    };

    try {
      await navigator.clipboard.writeText(textToCopy);
      setFeedback(copiedText, successIcon);
    } catch (err) {
      console.error('Failed to copy code:', err);
      setFeedback(errorText, errorIcon);
    }
  }
}
