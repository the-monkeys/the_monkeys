import Header from '@editorjs/header';
import type { API } from '@themonkeys/monkeys-editor';

type HeaderData = { text: string; level: number };
type HeaderOptions = {
  data?: HeaderData;
  config?: Record<string, unknown>;
  api: API;
  readOnly?: boolean;
  block?: { id: string };
};

/** Keep the existing header wire format, including inline HTML formatting. */
export default class TitleAwareHeader extends Header {
  private readonly isTitle: boolean;

  constructor(options: HeaderOptions) {
    const isTitle = options.block?.id === 'title';
    super(
      isTitle
        ? {
            ...options,
            data: { ...options.data, level: 1 },
            config: {
              ...options.config,
              levels: [1],
              defaultLevel: 1,
              placeholder: 'Title',
            },
          }
        : options
    );
    this.isTitle = isTitle;
  }

  validate(data: HeaderData): boolean {
    return this.isTitle || super.validate(data);
  }

  render(): HTMLHeadingElement {
    return super.render();
  }

  save(element: HTMLHeadingElement): HeaderData {
    return super.save(element);
  }

  renderSettings() {
    return this.isTitle ? [] : super.renderSettings();
  }
}
