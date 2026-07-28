import { API, InlineTool } from '@editorjs/editorjs';

import MentionHandler from './utils/mentionHandler';

export default class MentionUserTool implements InlineTool {
  private api: API;

  constructor({ api }: { api: API }) {
    this.api = api;
    MentionHandler.instance.attach();
  }

  static get isInline(): boolean {
    return true;
  }

  static get title(): string {
    return 'Tag User';
  }

  static get shortcut(): string {
    return 'CMD+M';
  }

  static get sanitize() {
    return {
      a: {
        class: true,
        'data-username': true,
        'data-id': true,
        href: true,
        contenteditable: true,
      },
      span: {
        class: true,
      },
      img: {
        src: true,
        class: true,
        alt: true,
      },
    };
  }

  render(): HTMLElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.innerText = '@';
    button.classList.add(
      this.api.styles.inlineToolButton,
      'ce-inline-tool--tag-user'
    );
    button.setAttribute('aria-label', 'Tag user');
    return button;
  }

  surround(range: Range): void {
    MentionHandler.instance.triggerFromRange(range);
  }

  checkState(_selection: Selection): boolean {
    return false;
  }
}
