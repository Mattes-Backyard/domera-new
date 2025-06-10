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
  ssn: string;
  status: string;
  join_date: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  move_in_date?: string;
  lease_end_date?: string;
  security_deposit?: number;
  balance?: number;
  notes?: string;
  facility_id: string;
  user_id?: string;
  active_units?: Array<{
    unit_number: string;
    size: string;
    monthly_rate: number;
    type: string;
    start_date: string;
    rental_id: string;
  }>;
}

// Transformed Customer type (used in UI)
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  ssn: string;
  units: string[];
  balance: number;
  status: string;
  moveInDate?: string;
  joinDate?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

// Customer type for CustomerDetailsPage (replacing Tenant)
export interface CustomerDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  ssn: string;
  status: string;
  joinDate: string;
  units: CustomerUnit[];
}

// CustomerUnit type for CustomerDetailsPage
export interface CustomerUnit {
  unitId: string;
  unitNumber: string;
  status: "good" | "overdue" | "pending";
  monthlyRate: number;
  leaseStart: string;
  leaseEnd?: string;
  balance: number;
}

// Helper function to transform DatabaseCustomer to Customer
export const transformDatabaseCustomerToCustomer = (dbCustomer: DatabaseCustomer, units: string[] = []): Customer => {
  return {
    id: dbCustomer.id,
    name: `${dbCustomer.first_name} ${dbCustomer.last_name}`.trim(),
    email: dbCustomer.email,
    phone: dbCustomer.phone,
    address: `${dbCustomer.address}, ${dbCustomer.city}, ${dbCustomer.state} ${dbCustomer.zip_code}`,
    ssn: dbCustomer.ssn,
    units,
    balance: dbCustomer.balance || 0,
    status: dbCustomer.status || 'active',
    moveInDate: dbCustomer.move_in_date,
    joinDate: dbCustomer.join_date,
    emergencyContact: dbCustomer.emergency_contact_name,
    emergencyPhone: dbCustomer.emergency_contact_phone
  };
};

// Helper function to transform Customer to DatabaseCustomer
export const transformCustomerToDatabaseCustomer = (customer: Customer): DatabaseCustomer => {
  const nameParts = customer.name.split(' ');
  const addressParts = customer.address.split(', ');
  return {
    id: customer.id,
    first_name: nameParts[0] || '',
    last_name: nameParts.slice(1).join(' ') || '',
    email: customer.email,
    phone: customer.phone,
    address: addressParts[0] || customer.address,
    city: addressParts[1] || '',
    state: addressParts[2]?.split(' ')[0] || '',
    zip_code: addressParts[2]?.split(' ')[1] || '',
    ssn: customer.ssn,
    status: customer.status,
    join_date: customer.joinDate || '',
    emergency_contact_name: customer.emergencyContact,
    emergency_contact_phone: customer.emergencyPhone,
    move_in_date: customer.moveInDate,
    balance: customer.balance,
    facility_id: '', // Not available in Customer type
    user_id: customer.id
  };
};
