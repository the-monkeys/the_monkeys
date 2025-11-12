import type { API, InlineTool } from '@editorjs/editorjs';

import { CopyIcon, ErrorIcon, HyperlinkIcon, SuccessIcon } from '../Utils/icon';
import './styles/style.css';

export default class HyperLinkTool implements InlineTool {
  private api: API;
  private button: HTMLButtonElement | null = null;
  private range: Range | null = null;
  private previewTooltip: HTMLElement | null = null;
  private previewTimeout: number | null = null;
  private copyTimeout: number | null = null;
  private mouseOverHandler: ((e: MouseEvent) => void) | null = null;
  private mouseOutHandler: ((e: MouseEvent) => void) | null = null;
  private resizeHandler: (() => void) | null = null;

  constructor({ api }: { api: API }) {
    this.api = api;
    this.initializeHoverPreview();
  }

  static get isInline(): boolean {
    return true;
  }

  static get isReadOnlySupported() {
    return true;
  }

  render(): HTMLElement {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.innerHTML = HyperlinkIcon;
    this.button.classList.add('custom-hyperlink-inline-tool');

    return this.button;
  }

  surround(range: Range): void {
    if (!range) return;

    this.range = range;
    const selectedText = range.toString().trim();

    if (!selectedText) {
      this.unwrap(range);
      return;
    }

    this.showLinkDialog(selectedText, range);
  }

  private showLinkDialog(selectedText: string, range: Range): void {
    const insertLinkTooltip = document.createElement('div');
    insertLinkTooltip.classList.add('hyperlink-insert-tooltip');

    insertLinkTooltip.innerHTML = `
      <div class='hyperlink-insert-input-wrapper'>
        <input 
          type='text'
          id='hyperlink-url'
          class='hyperlink-input'
          placeholder='https://example.com'
        />
      </div>
    `;

    document.body.appendChild(insertLinkTooltip);

    const urlInput =
      insertLinkTooltip.querySelector<HTMLInputElement>('#hyperlink-url');
    const textToInsert = selectedText;

    const cleanup = () => {
      insertLinkTooltip.remove();
    };

    const selectionRect = range.getBoundingClientRect() as DOMRect;
    if (selectionRect) {
      this.positionInsertLinkTooltip(selectionRect, insertLinkTooltip);
    }

    urlInput?.addEventListener('blur', (e) => {
      window.setTimeout(cleanup, 150);
    });

    urlInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const url = urlInput.value.trim();

        if (textToInsert && url) {
          this.insertLink(textToInsert, url, range);
        }
        cleanup();
      }
    });

    urlInput?.focus();
  }

  private insertLink(text: string, url: string, range: Range): void {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.textContent = text;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.classList.add('hyperlink-anchor-tag');

    anchor.setAttribute('link-text', text);

    range.deleteContents();
    range.insertNode(anchor);

    range.setStartAfter(anchor);
    range.setEndAfter(anchor);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  private unwrap(range: Range): void {
    const anchorElement = this.api.selection.findParentTag('A');

    if (anchorElement) {
      const text = document.createTextNode(anchorElement.textContent || '');
      anchorElement.parentNode?.replaceChild(text, anchorElement);
    }
  }

  checkState(): boolean {
    const anchorElement = this.api.selection.findParentTag('A');

    if (anchorElement && this.button) {
      this.button.classList.add('custom-hyperlink-inline-tool--active');
      return true;
    }

    if (this.button) {
      this.button.classList.remove('custom-hyperlink-inline-tool--active');
    }

    return false;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  private initializeHoverPreview(): void {
    this.mouseOverHandler = this.handleDocumentMouseOver.bind(this);
    this.mouseOutHandler = this.handleDocumentMouseOut.bind(this);

    document.addEventListener('mouseover', this.mouseOverHandler);
    document.addEventListener('mouseout', this.mouseOutHandler);

    this.resizeHandler = this.handleWindowResize.bind(this);
    window.addEventListener('resize', this.resizeHandler);
  }

  private handleWindowResize(): void {
    const insertLinkTooltip = document.querySelector(
      '.hyperlink-insert-tooltip'
    ) as HTMLElement;

    if (insertLinkTooltip && this.range) {
      const selectionRect = this.range.getBoundingClientRect() as DOMRect;

      if (selectionRect.width > 0 || selectionRect.height > 0) {
        this.positionInsertLinkTooltip(selectionRect, insertLinkTooltip);
      }
    }
  }

  private handleDocumentMouseOver = (e: MouseEvent): void => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('hyperlink-anchor-tag')) {
      this.handleMouseEnter(target as HTMLAnchorElement);
    }
  };

  private handleDocumentMouseOut = (e: MouseEvent): void => {
    const target = e.target as HTMLElement;
    const related = e.relatedTarget as HTMLElement | null;

    if (
      target.classList.contains('hyperlink-anchor-tag') &&
      (!related || !related.closest('.hyperlink-preview-tooltip'))
    ) {
      this.handleMouseLeave();
    }
  };

  private handleMouseEnter(anchor: HTMLAnchorElement): void {
    if (this.previewTimeout) {
      clearTimeout(this.previewTimeout);
    }

    this.previewTimeout = window.setTimeout(() => {
      this.showPreview(anchor);
    }, 300);
  }

  private handleMouseLeave(): void {
    if (this.previewTimeout) {
      clearTimeout(this.previewTimeout);
      this.previewTimeout = null;
    }

    if (this.previewTooltip) {
      this.previewTooltip.addEventListener('mouseenter', () => {
        if (this.previewTimeout) {
          clearTimeout(this.previewTimeout);
        }
      });

      this.previewTooltip.addEventListener('mouseleave', () => {
        this.hidePreview();
      });

      this.previewTimeout = window.setTimeout(() => {
        this.hidePreview();
      }, 300);
    }
  }

  private showPreview(anchor: HTMLAnchorElement): void {
    const url = anchor.href;
    const linkText =
      anchor.getAttribute('link-text') || anchor.textContent || '';

    this.hidePreview();

    this.previewTooltip = document.createElement('div');
    this.previewTooltip.classList.add('hyperlink-preview-tooltip');

    this.previewTooltip.innerHTML = `
      <div class="hyperlink-preview-left-div">
        <h3 class="hyperlink-preview-text-header truncate-text">${this.escapeHtml(linkText)}</h3>
        <span class="hyperlink-preview-url truncate-text">${this.escapeHtml(url)}</span>
      </div>

      <button class="hyperlink-preview-copyBtn" data-url="${this.escapeHtml(url)}" title="Copy link">
        ${CopyIcon}
      </button>
    `;

    document.body.appendChild(this.previewTooltip);

    this.positionTooltip(anchor, this.previewTooltip);

    // copy url
    const copyBtn = this.previewTooltip.querySelector(
      '.hyperlink-preview-copyBtn'
    );
    copyBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.copyToClipboard(url);
    });

    // show preview on mouse hover
    this.previewTooltip.addEventListener('mouseenter', () => {
      if (this.previewTimeout) {
        clearTimeout(this.previewTimeout);
      }
    });

    this.previewTooltip.addEventListener('mouseleave', () => {
      this.hidePreview();
    });
  }

  private hidePreview(): void {
    if (this.previewTooltip) {
      this.previewTooltip.remove();
      this.previewTooltip = null;
    }
  }

  /** To check position to show hover preview */
  private positionTooltip(anchor: HTMLElement, tooltip: HTMLElement): void {
    const anchorRect = anchor.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let top = anchorRect.bottom + window.scrollY + 8;
    let left = anchorRect.left + window.scrollX;

    if (left + tooltipRect.width > window.innerWidth) {
      left = window.innerWidth - tooltipRect.width - 16;
    }
    if (left < 16) {
      left = 16;
    }
    if (top + tooltipRect.height > window.innerHeight + window.scrollY) {
      top = anchorRect.top + window.scrollY - tooltipRect.height - 8;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }

  /** To check for position to show insert link input-box */
  private positionInsertLinkTooltip(
    selectionRect: DOMRect,
    tooltip: HTMLElement
  ): void {
    const scrollY = window.scrollY;

    let top = selectionRect.bottom + scrollY + 8;
    let left = selectionRect.left + window.scrollX;

    const tooltipRect = tooltip.getBoundingClientRect();

    // Horizontal Check
    if (left + tooltipRect.width > window.innerWidth) {
      left = window.innerWidth - tooltipRect.width - 16;
    }
    if (left < 16) {
      left = 16;
    }

    // Vertical Check
    if (top + tooltipRect.height > window.innerHeight + scrollY) {
      top = selectionRect.top + scrollY - tooltipRect.height - 8;

      if (top < scrollY) {
        top = selectionRect.bottom + scrollY + 8;
      }
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }

  private async copyToClipboard(text: string): Promise<void> {
    const copyBtn = this.previewTooltip?.querySelector<HTMLButtonElement>(
      '.hyperlink-preview-copyBtn'
    );
    if (!copyBtn) {
      return;
    }

    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout);
      this.copyTimeout = null;
    }

    try {
      await navigator.clipboard.writeText(text);
      copyBtn.innerHTML = SuccessIcon;

      this.copyTimeout = window.setTimeout(() => {
        copyBtn.innerHTML = CopyIcon;
        this.copyTimeout = null;
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      copyBtn.innerHTML = ErrorIcon;

      this.copyTimeout = window.setTimeout(() => {
        copyBtn.innerHTML = CopyIcon;
        this.copyTimeout = null;
      }, 2000);
    }
  }

  // Event listeners cleanup
  private removeEventListeners(): void {
    if (this.mouseOverHandler) {
      document.removeEventListener('mouseover', this.mouseOverHandler);
    }
    if (this.mouseOutHandler) {
      document.removeEventListener('mouseout', this.mouseOutHandler);
    }
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }

    this.hidePreview();
  }

  public destroy(): void {
    this.removeEventListeners();

    if (this.copyTimeout) {
      clearTimeout(this.copyTimeout);
    }
  }

  static get sanitize() {
    return {
      a: {
        href: true,
        target: true,
        rel: true,
        class: true,
        'link-text': true,
      },
    };
  }
}
