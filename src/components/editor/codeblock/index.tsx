import {
  API,
  BlockTool,
  BlockToolData,
  SanitizerConfig,
  ToolboxConfig,
} from '@editorjs/editorjs';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

import './styles/codeBlock.css';

interface CodeBlockData extends BlockToolData {
  code?: string;
  language?: string; // Add language property
}

export default class CodeBlockTool implements BlockTool {
  private data: CodeBlockData;
  private api: API;
  private wrapper: HTMLElement | null = null;

  constructor({ data, api }: { data?: CodeBlockData; api: API }) {
    this.data = data || { code: '', language: 'plaintext' }; // Default to plaintext
    this.api = api;
  }

  public static get toolbox(): ToolboxConfig {
    return {
      icon: '',
      title: 'Code',
    };
  }

  render(): HTMLElement {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('code-block-container');

    // Create a textarea for raw code input
    const textarea = document.createElement('textarea');
    textarea.classList.add('code-block-input');
    textarea.placeholder = 'Enter your code here...';
    textarea.value = this.data.code || '';

    // Create a pre element for syntax-highlighted output
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.classList.add(`language-${this.data.language || 'plaintext'}`); // Set initial language
    pre.appendChild(code);

    // Create a language label
    const languageLabel = document.createElement('div');
    languageLabel.classList.add('language-label');
    languageLabel.textContent = this.data.language || 'plaintext'; // Set initial label

    // Create a dropdown for manual language selection
    const languageSelect = document.createElement('select');
    languageSelect.classList.add('language-select');
    ['JavaScript', 'Python', 'HTML', 'CSS', 'Java', 'Plain Text'].forEach(
      (lang) => {
        const option = document.createElement('option');
        option.value = lang.toLowerCase();
        option.textContent = lang;
        if (lang.toLowerCase() === this.data.language) {
          option.selected = true; // Set selected option
        }
        languageSelect.appendChild(option);
      }
    );

    // Create a copy button
    const copyButton = document.createElement('button');
    copyButton.classList.add('copy-button');
    copyButton.textContent = 'Copy';
    copyButton.addEventListener('click', () => this.copyCode(code.innerText));

    // Update highlighted code and language when textarea changes
    textarea.addEventListener('input', () => {
      const codeText = textarea.value;
      code.textContent = codeText;

      // Detect language using highlight.js
      const detectedLanguage =
        hljs.highlightAuto(codeText).language || 'plaintext';
      languageLabel.textContent = detectedLanguage;
      code.className = `language-${detectedLanguage}`; // Update code element class
      hljs.highlightBlock(code);
    });

    // Update language on dropdown change
    languageSelect.addEventListener('change', () => {
      const selectedLanguage = languageSelect.value;
      languageLabel.textContent = selectedLanguage;
      code.className = `language-${selectedLanguage}`;
      hljs.highlightBlock(code);
    });

    // Append elements to the wrapper
    this.wrapper.appendChild(languageLabel);
    this.wrapper.appendChild(languageSelect);
    this.wrapper.appendChild(textarea);
    this.wrapper.appendChild(pre);
    this.wrapper.appendChild(copyButton);

    // Highlight initial code (if any)
    if (this.data.code) {
      code.textContent = this.data.code;
      hljs.highlightBlock(code);
    }

    return this.wrapper;
  }

  public static get isReadOnlySupported(): boolean {
    return true;
  }

  public static get sanitize(): SanitizerConfig {
    return {
      code: true, // Allow HTML tags
    };
  }

  private copyCode(text: string): void {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        const copyButton = this.wrapper?.querySelector(
          '.copy-button'
        ) as HTMLButtonElement;
        if (copyButton) {
          copyButton.textContent = 'Copied!';
          setTimeout(() => {
            copyButton.textContent = 'Copy';
          }, 2000);
        }
      })
      .catch((err) => {
        console.error('Failed to copy code: ', err);
      });
  }

  save(blockContent: HTMLElement): CodeBlockData {
    const textarea = blockContent.querySelector(
      '.code-block-input'
    ) as HTMLTextAreaElement;
    const languageLabel = blockContent.querySelector(
      '.language-label'
    ) as HTMLDivElement;
    return {
      code: textarea.value,
      language: languageLabel.textContent || 'plaintext', // Save the detected language
    };
  }
}
