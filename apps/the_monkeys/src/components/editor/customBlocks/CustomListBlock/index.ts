import { API, BlockTool, ToolboxConfig } from '@editorjs/editorjs';

import './style.css';
import { ConstructorArgs, ListItemData, ListToolData } from './utils/interface';

export default class CustomList implements BlockTool {
  private api: API;
  private data: ListToolData;
  private readOnly: boolean;
  private wrapper!: HTMLElement;
  private maxLevel: number = 3;
  private backspaceTimeout: number | null = null;

  private static readonly ICONS = {
    UNORDERED:
      '<svg width="18" height="18" viewBox="0 0 24 24"><path d="M4 6h2v2H4zM8 6h12v2H8zM4 11h2v2H4zM8 11h12v2H8zM4 16h2v2H4zM8 16h12v2H8z"/></svg>',
    ORDERED:
      '<svg width="18" height="18" viewBox="0 0 24 24"><path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/></svg>',
  };

  constructor({ data, api, readOnly }: ConstructorArgs) {
    this.api = api;
    this.readOnly = !!readOnly;

    const incomingItems = data && Array.isArray(data.items) ? data.items : [];

    // Data Normalization
    const normalizedItems: ListItemData[] = incomingItems.map((item) => {
      if (typeof item === 'string') {
        return { content: item, items: [] };
      }
      if (typeof item === 'object' && item !== null) {
        return {
          content: item.content || '',
          items: Array.isArray(item.items) ? item.items : [],
        };
      }
      return { content: '', items: [] };
    });

    // block is never completely empty on initialization
    if (normalizedItems.length === 0 && !this.readOnly) {
      normalizedItems.push({ content: '', items: [] });
    }

    this.data = {
      style:
        data && (data.style === 'ordered' || data.style === 'unordered')
          ? data.style
          : 'unordered',
      items: normalizedItems,
    };
  }

  static get sanitize() {
    return {
      style: false,
      items: {
        content: true,
        items: true,
      },
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get enableLineBreaks() {
    return true;
  }

  static get toolbox(): ToolboxConfig {
    return [
      {
        title: 'Unordered List',
        icon: CustomList.ICONS.UNORDERED,
        data: { style: 'unordered' },
      },
      {
        title: 'Ordered List',
        icon: CustomList.ICONS.ORDERED,
        data: { style: 'ordered' },
      },
    ];
  }

  destroy() {
    this.removeEvents();
  }

  save(root: HTMLElement): ListToolData {
    return {
      style: root.tagName === 'OL' ? 'ordered' : 'unordered',
      items: this.retrieveItems(Array.from(root.children)),
    };
  }

  /**
   * Allows toggling between Ordered and Unordered lists dynamically.
   */
  renderSettings() {
    return [
      {
        name: 'unordered',
        label: 'Unordered',
        icon: CustomList.ICONS.UNORDERED,
        closeOnActivate: true,
        isActive: this.data.style === 'unordered',
        onActivate: () => this.toggleTune('unordered'),
      },
      {
        name: 'ordered',
        label: 'Ordered',
        icon: CustomList.ICONS.ORDERED,
        closeOnActivate: true,
        isActive: this.data.style === 'ordered',
        onActivate: () => this.toggleTune('ordered'),
      },
    ];
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (this.readOnly) return;

    switch (event.key) {
      case 'Enter':
        this.handleEnter(event);
        break;
      case 'Backspace':
        this.handleBackspace(event);
        break;
      case 'Tab':
        this.handleTab(event);
        break;
    }
  };

  private onClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const listItem = target.closest('.cdx-list__item') as HTMLElement;

    if (listItem) {
      const content = listItem.querySelector(
        '.cdx-list__item-content'
      ) as HTMLElement;
      if (content && target !== content && !content.contains(target)) {
        this.focusItem(listItem);
      }
    }
  };

  private removeEvents() {
    if (this.wrapper) {
      this.wrapper.removeEventListener('keydown', this.onKeyDown);
      this.wrapper.removeEventListener('click', this.onClick);
    }
    if (this.backspaceTimeout) {
      clearTimeout(this.backspaceTimeout);
      this.backspaceTimeout = null;
    }
  }

  private bindEvents() {
    if (this.wrapper && !this.readOnly) {
      this.wrapper.addEventListener('keydown', this.onKeyDown);
      this.wrapper.addEventListener('click', this.onClick);
    }
  }

  /**
   * Switches the list style (UL <-> OL).
   */
  private toggleTune(style: 'ordered' | 'unordered') {
    if (this.data.style === style) return;

    this.removeEvents();

    this.data.style = style;
    const newTag = style === 'ordered' ? 'ol' : 'ul';
    const newWrapper = document.createElement(newTag);
    newWrapper.className = 'cdx-list';

    // Move existing children to the new wrapper
    const fragment = document.createDocumentFragment();
    while (this.wrapper.firstChild) {
      fragment.appendChild(this.wrapper.firstChild);
    }
    newWrapper.appendChild(fragment);

    this.wrapper.parentNode?.replaceChild(newWrapper, this.wrapper);
    this.wrapper = newWrapper;

    this.bindEvents();

    // update nested lists
    this.updateSublistsStyles(this.wrapper, newTag);
  }

  private updateSublistsStyles(parent: HTMLElement, newTag: string) {
    const sublists = parent.querySelectorAll('.cdx-list__sublist');

    sublists.forEach((oldSublist) => {
      const newSublist = document.createElement(newTag);
      newSublist.className = 'cdx-list__sublist';

      const fragment = document.createDocumentFragment();
      while (oldSublist.firstChild) {
        fragment.appendChild(oldSublist.firstChild);
      }
      newSublist.appendChild(fragment);

      oldSublist.parentNode?.replaceChild(newSublist, oldSublist);
    });
  }

  /**
   * Creates the DOM structure.
   */
  render(): HTMLElement {
    this.wrapper = document.createElement(
      this.data.style === 'ordered' ? 'ol' : 'ul'
    );
    this.wrapper.className = 'cdx-list';

    const fragment = document.createDocumentFragment();
    this.data.items.forEach((item) => {
      if (typeof item === 'string') {
        fragment.appendChild(this.createListItem(item));
      } else {
        fragment.appendChild(this.renderItem(item));
      }
    });
    this.wrapper.appendChild(fragment);

    this.bindEvents();
    return this.wrapper;
  }

  private createListItem(contentHTML: string = ''): HTMLLIElement {
    const li = document.createElement('li');
    li.className = 'cdx-list__item';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'cdx-list__item-content';
    contentDiv.contentEditable = String(!this.readOnly);
    contentDiv.innerHTML = contentHTML;

    li.appendChild(contentDiv);
    return li;
  }

  private renderItem(item: ListItemData | string): HTMLLIElement {
    if (typeof item === 'string') {
      return this.createListItem(item);
    }

    const li = this.createListItem(item.content);

    if (item.items && item.items.length > 0) {
      const sublist = document.createElement(
        this.data.style === 'ordered' ? 'ol' : 'ul'
      );
      sublist.className = 'cdx-list__sublist';
      item.items.forEach((subItem) => {
        sublist.appendChild(this.renderItem(subItem));
      });
      li.appendChild(sublist);
    }

    return li;
  }

  /**
   * Calculates nesting depth.
   */
  private getLevel(element: HTMLElement): number {
    let level = 1;
    let parent = element.parentElement;
    let safetyCounter = 0;

    while (parent && parent !== this.wrapper && safetyCounter < 10) {
      if (parent.classList.contains('cdx-list__sublist')) {
        level++;
      }
      parent = parent.parentElement;
      safetyCounter++;
    }
    return level;
  }

  private handleEnter(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('cdx-list__item-content')) return;

    event.preventDefault();
    event.stopPropagation();

    const currentItem = target.closest('.cdx-list__item') as HTMLElement;

    const content = target.innerHTML.trim();
    const isEmpty =
      !target.textContent?.trim() && (content === '' || content === '<br>');

    if (isEmpty) {
      const parent = currentItem.parentElement as HTMLElement;

      if (parent.classList.contains('cdx-list__sublist')) {
        this.outdentItem(currentItem);
        return;
      }

      this.breakOutOfList(currentItem);
      return;
    }

    const newItem = this.createListItem('');
    const sublist = currentItem.querySelector('.cdx-list__sublist');

    if (sublist) {
      sublist.insertBefore(newItem, sublist.firstChild);
    } else {
      if (currentItem.nextSibling) {
        currentItem.parentNode?.insertBefore(newItem, currentItem.nextSibling);
      } else {
        currentItem.parentNode?.appendChild(newItem);
      }
    }

    this.focusItem(newItem);
  }

  /**
   * Outdent if nested.
   * Merge with previous item if at root level.
   * Convert to Paragraph if list is empty.
   */
  private handleBackspace(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('cdx-list__item-content')) return;

    const selection = window.getSelection();
    // Only act if cursor is at the very beginning of the item, and no range is selected
    if (selection && (selection.anchorOffset !== 0 || !selection.isCollapsed))
      return;

    const currentItem = target.closest('.cdx-list__item') as HTMLElement;
    const parent = currentItem.parentElement as HTMLElement;
    const previousItem = currentItem.previousElementSibling as HTMLElement;

    if (parent.classList.contains('cdx-list__sublist')) {
      event.preventDefault();
      event.stopPropagation();
      this.outdentItem(currentItem);
      return;
    }

    // Break out of list if empty root item
    const content = target.innerHTML.trim();
    const textContent = target.textContent?.trim() || '';

    // Check if visually empty
    if (textContent === '' && (content === '' || content === '<br>')) {
      event.preventDefault();
      this.breakOutOfList(currentItem);
      return;
    }

    // Merge with Previous Item
    if (previousItem) {
      event.preventDefault();
      event.stopPropagation();

      const previousContent = previousItem.querySelector(
        '.cdx-list__item-content'
      ) as HTMLElement;
      const currentHTML = target.innerHTML;

      // Append current text to previous item
      if (currentHTML !== '' && currentHTML !== '<br>') {
        previousContent.innerHTML += currentHTML;
      }

      // Move sublists from current to previous
      const currentSublist = currentItem.querySelector('.cdx-list__sublist');
      if (currentSublist) {
        const previousSublist =
          previousItem.querySelector('.cdx-list__sublist');

        if (!previousSublist) {
          previousItem.appendChild(currentSublist);
        } else {
          const fragment = document.createDocumentFragment();
          while (currentSublist.firstChild) {
            fragment.appendChild(currentSublist.firstChild);
          }
          previousSublist.appendChild(fragment);
        }
      }

      currentItem.remove();
      this.focusItem(previousItem, true);
    }
  }

  private handleTab(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('cdx-list__item-content')) return;

    event.preventDefault();
    event.stopPropagation();

    const currentItem = target.closest('.cdx-list__item') as HTMLElement;

    if (event.shiftKey) {
      this.outdentItem(currentItem);
      return;
    }

    const currentLevel = this.getLevel(currentItem);
    if (currentLevel >= this.maxLevel) {
      return;
    }

    const previousItem = currentItem.previousElementSibling as HTMLElement;
    if (previousItem) {
      let sublist = previousItem.querySelector('.cdx-list__sublist');
      if (!sublist) {
        sublist = document.createElement(
          this.data.style === 'ordered' ? 'ol' : 'ul'
        );
        sublist.className = 'cdx-list__sublist';
        previousItem.appendChild(sublist);
      }
      sublist.appendChild(currentItem);
      this.focusItem(currentItem);
    }
  }

  private outdentItem(item: HTMLElement) {
    const parent = item.parentElement as HTMLElement;

    if (parent.classList.contains('cdx-list__sublist')) {
      const parentLi = parent.parentElement as HTMLElement;
      const grandParent = parentLi.parentElement as HTMLElement;

      const nextSiblings = [];
      let next = item.nextElementSibling;
      while (next) {
        nextSiblings.push(next);
        next = next.nextElementSibling;
      }

      if (nextSiblings.length > 0) {
        let itemSublist = item.querySelector('.cdx-list__sublist');
        if (!itemSublist) {
          itemSublist = document.createElement(parent.tagName);
          itemSublist.className = 'cdx-list__sublist';
          item.appendChild(itemSublist);
        }

        const fragment = document.createDocumentFragment();
        nextSiblings.forEach((sibling) => {
          fragment.appendChild(sibling);
        });
        itemSublist!.appendChild(fragment);
      }

      if (parentLi.nextSibling) {
        grandParent.insertBefore(item, parentLi.nextSibling);
      } else {
        grandParent.appendChild(item);
      }

      if (parent.children.length === 0) {
        parent.remove();
      }

      this.focusItem(item);
    }
  }

  private focusItem(item: HTMLElement, atEnd: boolean = false) {
    const content = item.querySelector(
      '.cdx-list__item-content'
    ) as HTMLElement;
    if (content) {
      content.focus();

      if (
        typeof window.getSelection !== 'undefined' &&
        typeof document.createRange !== 'undefined'
      ) {
        const range = document.createRange();
        range.selectNodeContents(content);
        range.collapse(!atEnd);

        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }

  /**
   * Universal method to extract data from a list of LI elements
   */
  private retrieveItems(items: Element[]): ListItemData[] {
    const data: ListItemData[] = [];

    items.forEach((item) => {
      // Ensure we only process List Items
      if (item.tagName !== 'LI') return;

      const contentEl = item.querySelector(':scope > .cdx-list__item-content');
      const sublist = item.querySelector(':scope > .cdx-list__sublist');

      data.push({
        content: contentEl ? contentEl.innerHTML : '',
        // Recursion: Pass the sublist's children back to this same method
        items: sublist ? this.retrieveItems(Array.from(sublist.children)) : [],
      });
    });

    return data;
  }

  private breakOutOfList(currentItem: HTMLElement) {
    const currentBlockIndex = this.api.blocks.getCurrentBlockIndex();
    const nextSiblings: Element[] = [];
    let next = currentItem.nextElementSibling;
    while (next) {
      nextSiblings.push(next);
      next = next.nextElementSibling;
    }

    const prevSibling = currentItem.previousElementSibling;
    const itemsAfter = this.retrieveItems(nextSiblings);

    // Remove from DOM
    currentItem.remove();
    nextSiblings.forEach((el) => el.remove());

    let newParagraphIndex = -1;

    if (!prevSibling) {
      newParagraphIndex = currentBlockIndex;
      this.api.blocks.insert(
        'paragraph',
        { text: '' },
        {},
        currentBlockIndex,
        false
      );

      if (itemsAfter.length > 0) {
        this.api.blocks.insert(
          'list',
          { style: this.data.style, items: itemsAfter },
          {},
          currentBlockIndex + 1,
          false
        );
      }

      const originalBlockNewIndex =
        currentBlockIndex + (itemsAfter.length > 0 ? 2 : 1);
      this.api.blocks.delete(originalBlockNewIndex);
    } else {
      newParagraphIndex = currentBlockIndex + 1;
      this.api.blocks.insert(
        'paragraph',
        { text: '' },
        {},
        currentBlockIndex + 1,
        false
      );

      if (itemsAfter.length > 0) {
        this.api.blocks.insert(
          'list',
          { style: this.data.style, items: itemsAfter },
          {},
          currentBlockIndex + 2,
          false
        );
      }
    }

    if (this.backspaceTimeout) {
      clearTimeout(this.backspaceTimeout);
    }

    this.backspaceTimeout = window.setTimeout(() => {
      this.api.caret.setToBlock(newParagraphIndex);
    }, 10);
  }
}
