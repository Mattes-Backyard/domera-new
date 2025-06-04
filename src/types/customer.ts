
// Unified customer types for the application

// Database Customer type (from Supabase)
export interface DatabaseCustomer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  move_in_date?: string;
  lease_end_date?: string;
  security_deposit?: number;
  balance?: number;
  notes?: string;
  facility_id: string;
  user_id?: string;
}

// Transformed Customer type (used in UI)
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  units: string[];
  balance: number;
  status: string;
  moveInDate?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  joinDate?: string;
}

// TenantUnit type for TenantDetailsPage
export interface TenantUnit {
  unitId: string;
  unitNumber: string;
  status: "good" | "overdue" | "pending";
  monthlyRate: number;
  leaseStart: string;
  leaseEnd?: string;
  balance: number;
}

// Tenant type for TenantDetailsPage
export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  ssn: string;
  status: string;
  joinDate: string;
  units: TenantUnit[];
}

// Helper function to transform DatabaseCustomer to Customer
export const transformDatabaseCustomerToCustomer = (dbCustomer: DatabaseCustomer, units: string[] = []): Customer => {
  return {
    id: dbCustomer.id,
    name: `${dbCustomer.first_name} ${dbCustomer.last_name}`.trim(),
    email: dbCustomer.email,
    phone: dbCustomer.phone,
    units,
    balance: dbCustomer.balance || 0,
    status: (dbCustomer.balance || 0) > 0 ? 'overdue' : 'good',
    moveInDate: dbCustomer.move_in_date,
    emergencyContact: dbCustomer.emergency_contact_name,
    emergencyPhone: dbCustomer.emergency_contact_phone,
    joinDate: dbCustomer.move_in_date
  };
};

// Helper function to transform Customer to DatabaseCustomer
export const transformCustomerToDatabaseCustomer = (customer: Customer): DatabaseCustomer => {
  const nameParts = customer.name.split(' ');
  return {
    id: customer.id,
    first_name: nameParts[0] || '',
    last_name: nameParts.slice(1).join(' ') || '',
    email: customer.email,
    phone: customer.phone,
    address: '', // Not available in Customer type
    city: '', // Not available in Customer type
    state: '', // Not available in Customer type
    zip_code: '', // Not available in Customer type
    emergency_contact_name: customer.emergencyContact,
    emergency_contact_phone: customer.emergencyPhone,
    move_in_date: customer.moveInDate,
    balance: customer.balance,
    facility_id: '', // Not available in Customer type
    user_id: customer.id
  };
};
