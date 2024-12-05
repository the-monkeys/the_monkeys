export interface Notification {
  id: number;
  user_id: string;
  message: string;
  status: string;
  seen?: boolean;
}

export interface allNotificationsResponse {
  notifications: {
    notification: Notification[];
  };
}
