import {
  API,
  BlockTool,
  BlockToolData,
  SanitizerConfig,
  ToolboxConfig,
} from '@editorjs/editorjs';
import hljs from 'highlight.js';
import 'highlight.js';

// import 'highlight.js/styles/github.css';
import './styles/codeblock.css';

interface CodeBlockData extends BlockToolData {
  code?: string;
  language?: string;
}

export default class CodeBlockTool implements BlockTool {
  private data: CodeBlockData;
  private api: API;
  private wrapper: HTMLElement | null = null;

  constructor({ data, api }: { data?: CodeBlockData; api: API }) {
    this.data = data || { code: '', language: 'plaintext' };
    this.api = api;
  }

  public static get toolbox(): ToolboxConfig {
    return {
      icon: '🖥️',
      title: 'Code Block',
    };
  }

  render(): HTMLElement {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('code-block-container');

    // Language selector
    const languageSelect = this.createLanguageSelector();

    // Code textarea
    const textarea = document.createElement('textarea');
    textarea.classList.add('code-block-input');
    textarea.placeholder = 'Enter your code here...';
    textarea.value = this.data.code || '';

    // Preformatted block for syntax highlighting
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.classList.add(`language-${this.data.language || 'plaintext'}`);
    pre.appendChild(code);

    // Copy button
    const copyButton = this.createCopyButton(code);

    // Handle text input and highlight updates
    textarea.addEventListener('input', () => {
      code.textContent = textarea.value;
      this.highlightCode(code);
    });

    // Handle language change
    languageSelect.addEventListener('change', () => {
      const selectedLanguage = languageSelect.value;
      code.className = `language-${selectedLanguage}`;
      this.data.language = selectedLanguage;
      this.highlightCode(code);
    });

    // Append elements
    this.wrapper.append(languageSelect, textarea, pre, copyButton);

    // Initialize highlight.js
    if (this.data.code) {
      code.textContent = this.data.code;
      this.highlightCode(code);
    }

    return this.wrapper;
  }

  public static get isReadOnlySupported(): boolean {
    return true;
  }

  public static get sanitize(): SanitizerConfig {
    return {
      code: true,
    };
  }

  private createLanguageSelector(): HTMLSelectElement {
    const select = document.createElement('select');
    select.classList.add('language-select');

    const languages = [
      'javascript',
      'typescript',
      'python',
      'html',
      'css',
      'java',
      'plaintext',
    ];

    languages.forEach((lang) => {
      const option = document.createElement('option');
      option.value = lang;
      option.textContent = lang.toUpperCase();
      if (lang === this.data.language) option.selected = true;
      select.appendChild(option);
    });

    return select;
  }

  private createCopyButton(codeElement: HTMLElement): HTMLButtonElement {
    const button = document.createElement('button');
    button.classList.add('copy-button');
    button.textContent = 'Copy';

    button.addEventListener('click', () => {
      navigator.clipboard.writeText(codeElement.textContent || '').then(() => {
        button.textContent = 'Copied!';
        setTimeout(() => {
          button.textContent = 'Copy';
        }, 2000);
      });
    });

    return button;
  }

  private highlightCode(codeElement: HTMLElement): void {
    hljs.highlightElement(codeElement);
  }

  save(blockContent: HTMLElement): CodeBlockData {
    const textarea = blockContent.querySelector(
      '.code-block-input'
    ) as HTMLTextAreaElement;
    const languageSelect = blockContent.querySelector(
      '.language-select'
    ) as HTMLSelectElement;

    return {
      code: textarea.value,
      language: languageSelect.value || 'plaintext',
    };
  }
}
