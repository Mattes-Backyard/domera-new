
export type NotificationType = 
  | 'unit_status_change'
  | 'new_lead'
  | 'payment_overdue'
  | 'payment_received'
  | 'maintenance_request'
  | 'lease_expiring'
  | 'task_completed';

export type NotificationPriority = 'low' | 'medium' | 'high';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  priority: NotificationPriority;
  isRead: boolean;
  timestamp: Date;
  relatedId?: string;
  actionUrl?: string;
}
