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
