'use client';

import { ContentReportDialog } from '@/components/moderation/ContentReportDialog';
import type { ContentTarget } from '@/services/moderation/moderationTypes';

export function DiscussionReportDialog(props: {
  target: ContentTarget;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return <ContentReportDialog {...props} />;
}
