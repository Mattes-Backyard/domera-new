
export interface Notification {
  id: string;
  type: 'unit_status_change' | 'new_lead' | 'payment_overdue' | 'maintenance_request' | 'lease_expiring';
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  relatedId?: string; // unit ID, customer ID, etc.
  priority: 'low' | 'medium' | 'high';
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotification: (notificationId: string) => void;
  unreadCount: number;
}
