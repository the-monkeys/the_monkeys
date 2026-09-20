'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import PostActionsMenu from '@/features/studio/components/PostActionsMenu';
import type { SocialPlatform, SocialPost } from '@/features/studio/types';
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  parseISO,
  startOfWeek,
} from 'date-fns';

import {
  PlatformIcon,
  extractPlatforms,
  formatPostTime,
} from './CalendarPostChip';
import DesktopWeekTimeline from './DesktopWeekTimeline';
import MobileWeekView from './MobileWeekView';
import WeekPostCard from './WeekPostCard';

export interface WeekGridProps {
  currentDate: Date;
  posts: SocialPost[];
  onSelectDay?: (day: Date) => void;
  onActionComplete?: () => void;
  className?: string;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function formatHourAxis(hour: number): string {
  const d = new Date(2000, 0, 1, hour, 0, 0);
  return format(d, 'h a');
}

export function WeekGrid({
  currentDate,
  posts,
  onSelectDay,
  onActionComplete,
  className = '',
}: WeekGridProps) {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<Date>(
    () => currentDate || new Date()
  );
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    if (currentDate) {
      setSelectedDay(currentDate);
    }
  }, [currentDate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Live time position percentage in 24-hour day (0 - 100%)
  const currentTimePercent = useMemo(() => {
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    return (totalMinutes / (24 * 60)) * 100;
  }, [now]);

  // Compute 7 days of the active week (Monday start)
  const daysOfWeek = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  // O(1) Map for posts grouped by day and hour key: "yyyy-MM-dd-H"
  const postsByDateAndHour = useMemo(() => {
    const map = new Map<string, SocialPost[]>();
    for (const post of posts) {
      if (!post.scheduled_at) continue;
      try {
        const postDate =
          typeof post.scheduled_at === 'string'
            ? parseISO(post.scheduled_at)
            : new Date(post.scheduled_at);
        if (isNaN(postDate.getTime())) continue;
        const key = `${format(postDate, 'yyyy-MM-dd')}-${postDate.getHours()}`;
        const existing = map.get(key);
        if (existing) {
          existing.push(post);
        } else {
          map.set(key, [post]);
        }
      } catch {
        // ignore invalid dates
      }
    }
    return map;
  }, [posts]);

  // O(1) Map for posts grouped by day: "yyyy-MM-dd"
  const postsByDate = useMemo(() => {
    const map = new Map<string, SocialPost[]>();
    for (const post of posts) {
      if (!post.scheduled_at) continue;
      try {
        const postDate =
          typeof post.scheduled_at === 'string'
            ? parseISO(post.scheduled_at)
            : new Date(post.scheduled_at);
        if (isNaN(postDate.getTime())) continue;
        const key = format(postDate, 'yyyy-MM-dd');
        const existing = map.get(key);
        if (existing) {
          existing.push(post);
        } else {
          map.set(key, [post]);
        }
      } catch {
        // ignore invalid dates
      }
    }
    return map;
  }, [posts]);

  const getPostsForDayAndHour = useCallback(
    (day: Date, hour: number): SocialPost[] => {
      const key = `${format(day, 'yyyy-MM-dd')}-${hour}`;
      return postsByDateAndHour.get(key) || [];
    },
    [postsByDateAndHour]
  );

  const getPostsForDay = useCallback(
    (day: Date): SocialPost[] => {
      const key = format(day, 'yyyy-MM-dd');
      return postsByDate.get(key) || [];
    },
    [postsByDate]
  );

  const handleSelectDay = (day: Date) => {
    setSelectedDay(day);
    onSelectDay?.(day);
  };

  const handleEmptySlotClick = (day: Date, hour: number) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const paddedHour = String(hour).padStart(2, '0');
    router.push(`/studio/compose?date=${dateStr}T${paddedHour}:00:00`);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Desktop 7-Day Timeline (>= 768px) */}
      <DesktopWeekTimeline
        daysOfWeek={daysOfWeek}
        selectedDay={selectedDay}
        currentTimePercent={currentTimePercent}
        onSelectDay={handleSelectDay}
        getPostsForDayAndHour={getPostsForDayAndHour}
        handleEmptySlotClick={handleEmptySlotClick}
        onActionComplete={onActionComplete}
      />

      {/* Mobile Week Grid (< 768px) */}
      <MobileWeekView
        daysOfWeek={daysOfWeek}
        selectedDay={selectedDay}
        currentTimePercent={currentTimePercent}
        onSelectDay={handleSelectDay}
        getPostsForDay={getPostsForDay}
        getPostsForDayAndHour={getPostsForDayAndHour}
        handleEmptySlotClick={handleEmptySlotClick}
        onActionComplete={onActionComplete}
      />
    </div>
  );
}

export default WeekGrid;
