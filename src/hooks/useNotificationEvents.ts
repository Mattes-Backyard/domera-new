
import { useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
import type { Unit } from '@/hooks/useAppState';
import type { Customer } from '@/types/customer';

export const useNotificationEvents = () => {
  const { addNotification } = useNotifications();

  const notifyUnitStatusChange = (unit: Unit, previousStatus: string) => {
    if (previousStatus !== unit.status) {
      let priority: 'low' | 'medium' | 'high' = 'medium';
      
      if (unit.status === 'maintenance') priority = 'high';
      if (unit.status === 'available' && previousStatus === 'occupied') priority = 'medium';
      if (unit.status === 'occupied' && previousStatus === 'available') priority = 'low';

      addNotification({
        type: 'unit_status_change',
        title: `Unit ${unit.id} Status Changed`,
        description: `Status changed from ${previousStatus} to ${unit.status}${unit.tenant ? ` (${unit.tenant})` : ''}`,
        priority,
        relatedId: unit.id,
      });
    }
  };

  const notifyNewLead = (customer: Customer) => {
    addNotification({
      type: 'new_lead',
      title: 'New Customer Lead',
      description: `${customer.name} (${customer.email}) has joined as a new lead`,
      priority: 'medium',
      relatedId: customer.id,
    });
  };

  const notifyPaymentOverdue = (customer: Customer) => {
    if (customer.balance > 0) {
      addNotification({
        type: 'payment_overdue',
        title: 'Payment Overdue',
        description: `${customer.name} has an overdue balance of $${customer.balance}`,
        priority: 'high',
        relatedId: customer.id,
      });
    }
  };

  const notifyMaintenanceRequest = (unitId: string) => {
    addNotification({
      type: 'maintenance_request',
      title: 'Maintenance Request',
      description: `Maintenance request submitted for unit ${unitId}`,
      priority: 'high',
      relatedId: unitId,
    });
  };

  const notifyLeaseExpiring = (customer: Customer, unitId: string) => {
    addNotification({
      type: 'lease_expiring',
      title: 'Lease Expiring Soon',
      description: `${customer.name}'s lease for unit ${unitId} is expiring soon`,
      priority: 'medium',
      relatedId: customer.id,
    });
  };

  return {
    notifyUnitStatusChange,
    notifyNewLead,
    notifyPaymentOverdue,
    notifyMaintenanceRequest,
    notifyLeaseExpiring,
  };
};
