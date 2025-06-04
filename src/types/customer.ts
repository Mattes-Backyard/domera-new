
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
  units: string[];
}
