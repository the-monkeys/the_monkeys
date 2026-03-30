// Legacy notification shape (gateway gRPC/Postgres)
export interface Notification {
  id: number;
  user_id: string;
  message: string;
  status: string;
  seen?: boolean;
}

export interface WSNotification {
  notification: Notification[];
}

export interface allNotificationsResponse {
  notifications: {
    notification: Notification[];
  };
}

// FreeRangeNotify notification content (nested inside notification)
export interface FRNNotificationContent {
  title: string;
  body: string;
  data: Record<string, unknown>;
}

// FreeRangeNotify notification payload (API list + SSE event)
export interface FRNNotification {
  notification_id: string;
  app_id?: string;
  user_id?: string;
  channel: string;
  priority: string;
  status: string;
  content: FRNNotificationContent;
  category?: string;
  template_id?: string;
  created_at: string;
  updated_at?: string;
}

// FreeRangeNotify list response (GET /v1/notifications/)
export interface FRNNotificationListResponse {
  notifications: FRNNotification[] | null;
  total: number;
  page: number;
  page_size: number;
}

// FreeRangeNotify unread count response
export interface FRNUnreadCountResponse {
  count: number;
}

/**
 * Resolve template placeholders in a notification body.
 * FRN stores the raw template (e.g. "{{follower_name}} started following you")
 * and passes variable values in content.data. This function substitutes them.
 */
export function resolveBody(notif: FRNNotification): string {
  const body = notif.content?.body || notif.content?.title || '';
  const data = notif.content?.data;
  if (!data || !body) return body;
  return body.replace(/\{\{\s*\.?\s*(\w+)\s*\}\}/g, (_, key: string) => {
    const val = data[key];
    return val != null ? String(val) : '';
  });
}
