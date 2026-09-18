'use client';

import React, { useEffect, useState } from 'react';

import type { SocialPost } from '@/features/studio/types';
import { useSocialPostMutations } from '@/hooks/studio/useSocialPosts';
import { toast } from '@the-monkeys/ui/hooks/use-toast';

import QueueItem from './QueueItem';

export interface SortableQueueListProps {
  items: SocialPost[];
  onActionComplete?: () => void;
  className?: string;
}

export default function SortableQueueList({
  items,
  onActionComplete,
  className = '',
}: SortableQueueListProps) {
  const [localItems, setLocalItems] = useState<SocialPost[]>(items);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const [isLocalReordering, setIsLocalReordering] = useState(false);

  const mutations = useSocialPostMutations();
  const reorderQueue = mutations?.reorderQueue;
  const isReordering = Boolean(isLocalReordering || reorderQueue?.isPending);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const performReorder = async (fromIndex: number, toIndex: number) => {
    if (isReordering) return;
    if (
      fromIndex < 0 ||
      fromIndex >= localItems.length ||
      toIndex < 0 ||
      toIndex >= localItems.length ||
      fromIndex === toIndex
    ) {
      return;
    }

    const previousItems = [...localItems];
    const newItems = [...localItems];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);

    // Optimistically update local order
    setLocalItems(newItems);

    const newIds = newItems.map((item) => item.id);
    setIsLocalReordering(true);
    try {
      await reorderQueue?.mutateAsync(newIds);
      onActionComplete?.();
    } catch {
      // Rollback to original order
      setLocalItems(previousItems);
      toast({
        variant: 'destructive',
        title: 'Reorder failed',
        description:
          'Unable to update queue order. Changes have been rolled back.',
      });
    } finally {
      setIsLocalReordering(false);
    }
  };

  const handleMoveUp = (index: number) => {
    void performReorder(index, index - 1);
  };

  const handleMoveDown = (index: number) => {
    void performReorder(index, index + 1);
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    setDraggedIndex(index);
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    _index: number
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dropIndex: number
  ) => {
    e.preventDefault();
    const dataIndexStr = e.dataTransfer.getData('text/plain');
    const fromIndex =
      dataIndexStr !== '' ? parseInt(dataIndexStr, 10) : draggedIndex;
    setDraggedIndex(null);
    if (fromIndex !== null && !isNaN(fromIndex) && fromIndex !== dropIndex) {
      void performReorder(fromIndex, dropIndex);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {localItems.map((post, index) => (
        <QueueItem
          key={post.id}
          post={post}
          index={index}
          total={localItems.length}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onActionComplete={onActionComplete}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          isDragging={draggedIndex === index}
          isReordering={isReordering}
        />
      ))}
    </div>
  );
}
