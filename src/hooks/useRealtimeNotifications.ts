
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from './useAuth';

export const useRealtimeNotifications = () => {
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    let channels = [];

    const setupNotificationChannels = () => {
      // Clean up existing channels first
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
      channels = [];

      try {
        // Real-time notifications for units
        const unitsChannel = supabase
          .channel('units-notifications')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'units'
            },
            (payload) => {
              const { old: oldRecord, new: newRecord } = payload;
              
              if (oldRecord.status !== newRecord.status) {
                addNotification({
                  type: 'unit_status_change',
                  title: `Unit ${newRecord.unit_number} Status Changed`,
                  description: `Status changed from ${oldRecord.status} to ${newRecord.status}`,
                  priority: newRecord.status === 'maintenance' ? 'high' : 'medium',
                  relatedId: newRecord.unit_number,
                });
              }
            }
          )
          .subscribe((status) => {
            if (status === 'CHANNEL_ERROR') {
              console.log('Units notification channel error, retrying...');
              setTimeout(setupNotificationChannels, 5000);
            }
          });

        // Real-time notifications for new customers
        const customersChannel = supabase
          .channel('customers-notifications')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'customers'
            },
            (payload) => {
              addNotification({
                type: 'new_lead',
                title: 'New Customer Added',
                description: 'A new customer has been added to the system',
                priority: 'medium',
                relatedId: payload.new.id,
              });
            }
          )
          .subscribe((status) => {
            if (status === 'CHANNEL_ERROR') {
              console.log('Customers notification channel error, retrying...');
              setTimeout(setupNotificationChannels, 5000);
            }
          });

        // Real-time notifications for payment updates
        const paymentsChannel = supabase
          .channel('payments-notifications')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'payments'
            },
            (payload) => {
              const payment = payload.new;
              addNotification({
                type: 'payment_received',
                title: 'Payment Received',
                description: `Payment of $${payment.amount} has been processed`,
                priority: 'low',
                relatedId: payment.customer_id,
              });
            }
          )
          .subscribe((status) => {
            if (status === 'CHANNEL_ERROR') {
              console.log('Payments notification channel error, retrying...');
              setTimeout(setupNotificationChannels, 5000);
            }
          });

        // Real-time notifications for maintenance requests
        const maintenanceChannel = supabase
          .channel('maintenance-notifications')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'maintenance_requests'
            },
            (payload) => {
              const request = payload.new;
              addNotification({
                type: 'maintenance_request',
                title: 'New Maintenance Request',
                description: `${request.title} - Priority: ${request.priority}`,
                priority: 'high',
                relatedId: request.unit_id,
              });
            }
          )
          .subscribe((status) => {
            if (status === 'CHANNEL_ERROR') {
              console.log('Maintenance notification channel error, retrying...');
              setTimeout(setupNotificationChannels, 5000);
            }
          });

        // Real-time notifications for task updates
        const tasksChannel = supabase
          .channel('tasks-notifications')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'tasks'
            },
            (payload) => {
              const { old: oldRecord, new: newRecord } = payload;
              
              if (oldRecord.status !== newRecord.status && newRecord.status === 'completed') {
                addNotification({
                  type: 'task_completed',
                  title: 'Task Completed',
                  description: `${newRecord.title} has been marked as completed`,
                  priority: 'low',
                  relatedId: newRecord.id,
                });
              }
            }
          )
          .subscribe((status) => {
            if (status === 'CHANNEL_ERROR') {
              console.log('Tasks notification channel error, retrying...');
              setTimeout(setupNotificationChannels, 5000);
            }
          });

        channels = [unitsChannel, customersChannel, paymentsChannel, maintenanceChannel, tasksChannel];
      } catch (error) {
        console.error('Error setting up notification channels:', error);
        setTimeout(setupNotificationChannels, 10000);
      }
    };

    setupNotificationChannels();

    // Cleanup subscriptions on unmount
    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [user, addNotification]);
};
