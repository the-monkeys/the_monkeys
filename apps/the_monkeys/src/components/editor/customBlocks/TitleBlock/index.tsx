import {
  API,
  BlockTool,
  BlockToolData,
  ToolboxConfig,
} from '@editorjs/editorjs';

import './styles/titleBlock.css';

interface TitleBlockData extends BlockToolData {
  text: string;
}

export default class TitleBlockTool implements BlockTool {
  private data: TitleBlockData;
  private api: API;
  private input: HTMLHeadingElement | null = null;

  constructor({ data, api }: { data?: TitleBlockData; api: API }) {
    this.data = data || { text: '' };
    this.api = api;
  }

  public static get toolbox(): ToolboxConfig {
    return {
      title: 'Title',
      icon: '<svg width="17px" height="17px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm-3 3h2v2h-2V6zm-3 0h2v2h-2V6zM4 19v-9h16.001l.001 9H4z"/></svg>',
    };
  }

  render(): HTMLElement {
    this.input = document.createElement('div');
    this.input.className = 'title-block-input';
    this.input.contentEditable = 'true';
    this.input.innerText = this.data.text || '';

    // to prevent backspace or delete from removing block
    // this.input.addEventListener('keydown', (e) => {
    //   if (e.key === 'Backspace' || e.key === 'Delete') {
    //     e.stopPropagation();
    //   }
    // });

    return this.input;
  }

  save(blockContent: HTMLElement): TitleBlockData {
    return {
      text: blockContent?.innerText,
    };
  }

  public static get isReadOnlySupported(): boolean {
    return true;
  }
}
