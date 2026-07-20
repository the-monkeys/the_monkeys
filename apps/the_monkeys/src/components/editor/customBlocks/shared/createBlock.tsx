import React from 'react';

import type {
  BlockTool,
  BlockToolConstructable,
  SanitizerConfig,
  ToolboxConfig,
} from '@editorjs/editorjs';
import { type Root, createRoot } from 'react-dom/client';

import type { BlockConstructorArgs } from './types';

/* ------------------------------------------------------------------ */
/*  createBlock — factory that wraps a React component as an EditorJS  */
/*  block tool.                                                        */
/*                                                                     */
/*  The factory handles the EditorJS lifecycle (render/save/destroy)   */
/*  and mounts a React component via createRoot. Each component is     */
/*  responsible for its own internal state management using the        */
/*  useState + useRef pattern to avoid stale closure bugs.             */
/*                                                                     */
/*  Usage:                                                             */
/*    const MyBlock = createBlock({                                    */
/*      toolbox: { title: 'Chart', icon: '...' },                     */
/*      defaultData: { ... },                                          */
/*      sanitize: { ... },                                             */
/*      Component: MyReactComponent,                                   */
/*    });                                                              */
/* ------------------------------------------------------------------ */

interface CreateBlockOptions<T> {
  toolbox: ToolboxConfig;
  defaultData: T;
  sanitize: SanitizerConfig;
  Component: React.ComponentType<{
    data: T;
    readOnly: boolean;
    onChange: (data: T) => void;
    api?: any;
  }>;
  normalizeData?: (data: Partial<T> | undefined) => T;
}

/* ---- Bridge that connects EditorJS (imperative) to React (declarative) ---- */
interface BridgeProps<T> {
  initialData: T;
  readOnly: boolean;
  onSave: (data: T) => void;
  Component: React.ComponentType<{
    data: T;
    readOnly: boolean;
    onChange: (data: T) => void;
    api?: any;
  }>;
  api?: any;
  /** Incremented on each render() call to force React remount */
  renderKey: number;
}

function BlockBridge<T>({
  initialData,
  readOnly,
  onSave,
  Component,
  api,
  renderKey,
}: BridgeProps<T>) {
  // Pass data through; the component handles its own internal state.
  // renderKey forces a full remount when EditorJS calls render() again.
  return (
    <Component
      key={renderKey}
      data={initialData}
      readOnly={readOnly}
      onChange={onSave}
      api={api}
    />
  );
}

export function createBlock<T>(
  options: CreateBlockOptions<T>
): BlockToolConstructable {
  const { toolbox, defaultData, sanitize, Component, normalizeData } = options;
  return class implements BlockTool {
    private api: any;
    private data: T;
    private readOnly: boolean;
    private wrapper!: HTMLElement;
    private root: Root | null = null;
    private renderCount = 0;

    static get toolbox(): ToolboxConfig {
      return toolbox;
    }

    static get isReadOnlySupported(): boolean {
      return true;
    }

    static get sanitize(): SanitizerConfig {
      return sanitize;
    }

    constructor({ data, api, readOnly = false }: BlockConstructorArgs<T>) {
      this.api = api;
      this.readOnly = readOnly;
      this.data = normalizeData
        ? normalizeData(data)
        : ({ ...defaultData, ...(data as Partial<T>) } as T);
    }

    render(): HTMLElement {
      this.wrapper = document.createElement('div');
      this.wrapper.setAttribute('data-block-root', '');
      this.renderReact();
      return this.wrapper;
    }

    save(): T {
      return this.data;
    }

    destroy(): void {
      if (this.root) {
        this.root.unmount();
        this.root = null;
      }
    }

    private renderReact(): void {
      if (!this.wrapper) return;
      if (this.root) this.root.unmount();
      this.root = createRoot(this.wrapper);

      const key = ++this.renderCount;

      this.root.render(
        <BlockBridge
          initialData={this.data}
          readOnly={this.readOnly}
          onSave={(newData: T) => {
            this.data = newData;
          }}
          Component={Component}
          api={this.api}
          renderKey={key}
        />
      );
    }
  };
}
