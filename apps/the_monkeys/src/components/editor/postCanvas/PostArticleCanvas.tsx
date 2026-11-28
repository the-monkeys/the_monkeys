'use client';

import { useRef } from 'react';

import { twMerge } from 'tailwind-merge';

import { usePostCanvasShortcuts } from './usePostCanvasShortcuts';

export function PostArticleCanvas({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);
  usePostCanvasShortcuts({ canvasRef, undo: null });

  return (
    <div
      ref={canvasRef}
      data-post-canvas
      className={twMerge('select-text', className)}
    >
      {children}
    </div>
  );
}
