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
