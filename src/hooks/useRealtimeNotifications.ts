
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from './useAuth';

export const useRealtimeNotifications = () => {
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const channelsRef = useRef<any[]>([]);
  const setupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user) {
      // Clean up any existing channels when user logs out
      channelsRef.current.forEach(channel => {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.log('Error removing channel:', error);
        }
      });
      channelsRef.current = [];
      return;
    }

    const setupNotificationChannels = () => {
      // Clear any existing timeout
      if (setupTimeoutRef.current) {
        clearTimeout(setupTimeoutRef.current);
        setupTimeoutRef.current = null;
      }

      // Clean up existing channels first
      channelsRef.current.forEach(channel => {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.log('Error removing channel:', error);
        }
      });
      channelsRef.current = [];

      try {
        // Create unique channel names to avoid conflicts
        const timestamp = Date.now();
        
        // Real-time notifications for units
        const unitsChannel = supabase
          .channel(`units-notifications-${timestamp}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'units'
            },
            (payload) => {
              const { old: oldRecord, new: newRecord } = payload;
              
              if (oldRecord?.status !== newRecord?.status) {
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
            console.log('Units notification channel status:', status);
            if (status === 'CHANNEL_ERROR') {
              console.log('Units notification channel error, retrying in 10 seconds...');
              setupTimeoutRef.current = setTimeout(setupNotificationChannels, 10000);
            }
          });

        // Real-time notifications for new customers
        const customersChannel = supabase
          .channel(`customers-notifications-${timestamp}`)
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
                relatedId: payload.new?.id,
              });
            }
          )
          .subscribe((status) => {
            console.log('Customers notification channel status:', status);
            if (status === 'CHANNEL_ERROR') {
              console.log('Customers notification channel error, retrying in 10 seconds...');
              setupTimeoutRef.current = setTimeout(setupNotificationChannels, 10000);
            }
          });

        // Real-time notifications for payment updates
        const paymentsChannel = supabase
          .channel(`payments-notifications-${timestamp}`)
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
                description: `Payment of $${payment?.amount || 0} has been processed`,
                priority: 'low',
                relatedId: payment?.customer_id,
              });
            }
          )
          .subscribe((status) => {
            console.log('Payments notification channel status:', status);
            if (status === 'CHANNEL_ERROR') {
              console.log('Payments notification channel error, retrying in 10 seconds...');
              setupTimeoutRef.current = setTimeout(setupNotificationChannels, 10000);
            }
          });

        // Real-time notifications for maintenance requests
        const maintenanceChannel = supabase
          .channel(`maintenance-notifications-${timestamp}`)
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
                description: `${request?.title || 'Maintenance request'} - Priority: ${request?.priority || 'medium'}`,
                priority: 'high',
                relatedId: request?.unit_id,
              });
            }
          )
          .subscribe((status) => {
            console.log('Maintenance notification channel status:', status);
            if (status === 'CHANNEL_ERROR') {
              console.log('Maintenance notification channel error, retrying in 10 seconds...');
              setupTimeoutRef.current = setTimeout(setupNotificationChannels, 10000);
            }
          });

        // Real-time notifications for task updates
        const tasksChannel = supabase
          .channel(`tasks-notifications-${timestamp}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'tasks'
            },
            (payload) => {
              const { old: oldRecord, new: newRecord } = payload;
              
              if (oldRecord?.status !== newRecord?.status && newRecord?.status === 'completed') {
                addNotification({
                  type: 'task_completed',
                  title: 'Task Completed',
                  description: `${newRecord.title || 'Task'} has been marked as completed`,
                  priority: 'low',
                  relatedId: newRecord.id,
                });
              }
            }
          )
          .subscribe((status) => {
            console.log('Tasks notification channel status:', status);
            if (status === 'CHANNEL_ERROR') {
              console.log('Tasks notification channel error, retrying in 10 seconds...');
              setupTimeoutRef.current = setTimeout(setupNotificationChannels, 10000);
            }
          });

        channelsRef.current = [unitsChannel, customersChannel, paymentsChannel, maintenanceChannel, tasksChannel];
        console.log('Notification channels set up successfully');
      } catch (error) {
        console.error('Error setting up notification channels:', error);
        setupTimeoutRef.current = setTimeout(setupNotificationChannels, 15000);
      }
    };

    // Small delay to ensure user context is fully set up
    const initTimeout = setTimeout(setupNotificationChannels, 1000);

    // Cleanup function
    return () => {
      clearTimeout(initTimeout);
      if (setupTimeoutRef.current) {
        clearTimeout(setupTimeoutRef.current);
        setupTimeoutRef.current = null;
      }
      
      channelsRef.current.forEach(channel => {
        try {
          supabase.removeChannel(channel);
        } catch (error) {
          console.log('Error removing channel on cleanup:', error);
        }
      });
      channelsRef.current = [];
    };
  }, [user?.id, addNotification]); // Only depend on user.id to prevent unnecessary re-runs
};
