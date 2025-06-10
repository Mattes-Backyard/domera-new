import { UnitGrid } from "@/components/units/UnitGrid";
import { CustomerList } from "@/components/customers/CustomerList";
import { UnitDetailsPage } from "@/components/units/UnitDetailsPage";
import { CustomerDetailsPage } from "@/components/customers/CustomerDetailsPage";
import { ReportsDashboard } from "@/components/reports/ReportsDashboard";
import { TasksView } from "@/components/tasks/TasksView";
import { BillingView } from "@/components/billing/BillingView";
import { OperationsView } from "@/components/operations/OperationsView";
import { FloorPlanView } from "@/components/floor-plan/FloorPlanView";
import { AdminInterface } from "@/components/admin/AdminInterface";
import { IntegrationsView } from "@/components/integrations/IntegrationsView";
import { Customer, DatabaseCustomer, transformCustomerToDatabaseCustomer, CustomerDetails } from "@/types/customer";
import type { Unit } from "@/hooks/useAppState";

interface Facility {
  id: string;
  name: string;
}

interface ContentRendererProps {
  activeView: string;
  searchQuery: string;
  selectedUnitId: string | null;
  selectedCustomerId: string | null;
  viewingUnitDetails: Unit | null;
  viewingTenantDetails: DatabaseCustomer | null;
  showFloorPlan: boolean;
  units: Unit[];
  customers: Customer[];
  facilities: Facility[];
  onUnitSelect: (unit: Unit) => void;
  onUnitUpdate: (unit: Unit) => void;
  onUnitAdd: (unit: Unit) => void;
  onCustomerAdd: (customer: DatabaseCustomer) => void;
  onTenantClick: (tenantId: string) => void;
  onClearUnitSelection: () => void;
  onClearCustomerSelection: () => void;
  onBackFromUnit: () => void;
  onBackFromTenant: () => void;
  onBackFromFloorPlan: () => void;
  onQuickAddUnit: () => void;
  selectedSites: string[];
  onCustomerClick: (customerId: string) => void;
  customerUnits?: Record<string, string[]>;
}

// Transform Unit from useAppState to FloorPlanView Unit interface
const transformUnitForFloorPlan = (unit: Unit) => {
  console.log('Transforming unit for floor plan:', unit);
  
  if (!unit) {
    console.error('Unit is null or undefined');
    return null;
  }

  try {
    return {
      id: unit.id || '',
      size: unit.size || '',
      type: unit.type || 'Standard',
      status: unit.status || 'available',
      tenant: unit.tenant?.name || null,
      tenantId: unit.tenant?.id || null,
      rate: unit.monthly_rate || 0,
      climate: unit.climate_controlled || false,
      site: unit.facility_id || ''
    };
  } catch (error) {
    console.error('Error transforming unit for floor plan:', error, unit);
    return null;
  }
};

// Transform Unit from useAppState to UnitDetailsPage Unit interface
const transformUnitForDetails = (unit: Unit) => {
  console.log('Transforming unit for details:', unit);
  
  if (!unit) {
    console.error('Unit is null or undefined');
    return null;
  }

  try {
    return {
      id: unit.id || '',
      size: unit.size || '',
      type: unit.type || 'Standard',
      status: unit.status || 'available',
      tenant: unit.tenant?.name || null,
      tenantId: unit.tenant?.id || null,
      rate: unit.monthly_rate || 0,
      climate: unit.climate_controlled || false,
      site: unit.facility_id || ''
    };
  } catch (error) {
    console.error('Error transforming unit for details:', error, unit);
    return null;
  }
};

// Transform database customer to CustomerDetails format
const transformCustomerToCustomerDetails = (customer: DatabaseCustomer): CustomerDetails => {
  if (!customer) {
    console.error('Customer is null or undefined');
    return {
      id: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      ssn: '',
      status: 'active',
      joinDate: '',
      units: []
    };
  }

  try {
    return {
      id: customer.id || '',
      name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Unknown',
      email: customer.email || '',
      phone: customer.phone || '',
      address: `${customer.address || ''}, ${customer.city || ''}, ${customer.state || ''} ${customer.zip_code || ''}`.trim(),
      ssn: customer.ssn || '',
      status: customer.status || 'active',
      joinDate: customer.move_in_date || customer.join_date || new Date().toISOString().split('T')[0],
      units: []
    };
  } catch (error) {
    console.error('Error transforming customer to CustomerDetails:', error, customer);
    return {
      id: customer.id || '',
      name: 'Error',
      email: '',
      phone: '',
      address: '',
      ssn: '',
      status: 'active',
      joinDate: '',
      units: []
    };
  }
};

export const ContentRenderer = ({
  activeView,
  searchQuery,
  selectedUnitId,
  selectedCustomerId,
  viewingUnitDetails,
  viewingTenantDetails,
  showFloorPlan,
  units,
  customers,
  facilities,
  onUnitSelect,
  onUnitUpdate,
  onUnitAdd,
  onCustomerAdd,
  onTenantClick,
  onClearUnitSelection,
  onClearCustomerSelection,
  onBackFromUnit,
  onBackFromTenant,
  onBackFromFloorPlan,
  onQuickAddUnit,
  selectedSites,
  onCustomerClick,
  customerUnits = {},
}: ContentRendererProps) => {
  console.log('ContentRenderer rendering with activeView:', activeView);
  console.log('Units data:', units);
  console.log('Facilities data:', facilities);

  // Safely transform Customer[] to DatabaseCustomer[] for CustomerList
  const databaseCustomers = customers?.map?.(transformCustomerToDatabaseCustomer) || [];

  // Safely transform units for floor plan view
  const transformedUnitsForFloorPlan = (units || [])
    .map(transformUnitForFloorPlan)
    .filter(unit => unit !== null);

  // Show floor plan if requested
  if (showFloorPlan) {
    return (
      <div className="h-full overflow-auto">
        <FloorPlanView 
          units={transformedUnitsForFloorPlan}
          onBack={onBackFromFloorPlan}
          onUnitClick={(unit) => {
            console.log('Floor plan unit clicked:', unit);
            const originalUnit = units?.find?.(u => u.id === unit.id);
            if (originalUnit) {
              onUnitSelect(originalUnit);
            }
          }}
          onUnitUpdate={(updatedUnit) => {
            console.log('Floor plan unit updated:', updatedUnit);
            const originalUnit = units?.find?.(u => u.id === updatedUnit.id);
            if (originalUnit) {
              const transformedUnit = {
                ...originalUnit,
                monthly_rate: updatedUnit.rate,
                climate_controlled: updatedUnit.climate,
                status: updatedUnit.status as any
              };
              onUnitUpdate(transformedUnit);
            }
          }}
        />
      </div>
    );
  }

  // Show unit details if viewing a specific unit
  if (viewingUnitDetails) {
    const transformedUnit = transformUnitForDetails(viewingUnitDetails);
    if (!transformedUnit) {
      return (
        <div className="h-full overflow-auto p-6">
          <div className="text-center">
            <p className="text-red-600">Error loading unit details</p>
            <button onClick={onBackFromUnit} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
              Go Back
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full overflow-auto">
        <UnitDetailsPage
          unit={transformedUnit}
          onBack={onBackFromUnit}
          onUnitUpdate={(updatedUnit) => {
            console.log('Unit details updated:', updatedUnit);
            const transformedBack = {
              ...viewingUnitDetails,
              monthly_rate: updatedUnit.rate,
              climate_controlled: updatedUnit.climate,
              status: updatedUnit.status as any
            };
            onUnitUpdate(transformedBack);
          }}
          customers={databaseCustomers}
          facilities={facilities}
        />
      </div>
    );
  }

  // Show customer details if viewing a specific customer
  if (viewingTenantDetails) {
    const transformedCustomer = transformCustomerToCustomerDetails(viewingTenantDetails);
    return (
      <div className="h-full overflow-auto">
        <CustomerDetailsPage
          customer={transformedCustomer}
          onBack={onBackFromTenant}
        />
      </div>
    );
  }

  // Regular view rendering with proper scrolling containers and error handling
  try {
    switch (activeView) {
      case "dashboard":
        return (
          <div className="h-full overflow-auto">
            <ReportsDashboard />
          </div>
        );
      case "units":
        console.log('Rendering units view with:', { units: units?.length, facilities: facilities?.length });
        return (
          <div className="h-full overflow-auto">
            <UnitGrid
              searchQuery={searchQuery}
              selectedUnitId={selectedUnitId}
              onClearSelection={onClearUnitSelection}
              units={transformedUnitsForFloorPlan}
              onUnitSelect={(unit) => {
                console.log('Unit grid unit selected:', unit);
                const originalUnit = units?.find?.(u => u.id === unit.id);
                if (originalUnit) {
                  onUnitSelect(originalUnit);
                }
              }}
              onUnitAdd={(newUnit) => {
                console.log('Unit grid unit added:', newUnit);
                try {
                  const transformedBack = {
                    id: newUnit.id,
                    unit_number: newUnit.id,
                    size: newUnit.size,
                    monthly_rate: newUnit.rate,
                    status: newUnit.status as any,
                    type: newUnit.type,
                    climate_controlled: newUnit.climate,
                    facility_id: newUnit.site,
                    tenant: newUnit.tenant ? {
                      id: newUnit.tenantId || '',
                      name: newUnit.tenant,
                      phone: '',
                      email: ''
                    } : undefined
                  };
                  onUnitAdd(transformedBack);
                } catch (error) {
                  console.error('Error adding unit:', error);
                }
              }}
              onTenantClick={onTenantClick}
              facilities={facilities || []}
            />
          </div>
        );
      case "customers":
        return (
          <div className="h-full overflow-auto">
            <CustomerList
              searchQuery={searchQuery}
              selectedCustomerId={selectedCustomerId}
              onClearSelection={onClearCustomerSelection}
              customers={databaseCustomers}
              onCustomerAdd={onCustomerAdd}
              onCustomerClick={onCustomerClick}
              customerUnits={customerUnits}
              facilities={facilities}
            />
          </div>
        );
      case "reports":
        return (
          <div className="h-full overflow-auto">
            <ReportsDashboard />
          </div>
        );
      case "tasks":
        return (
          <div className="h-full overflow-auto">
            <TasksView />
          </div>
        );
      case "billing":
        return (
          <div className="h-full overflow-auto">
            <BillingView />
          </div>
        );
      case "operations":
        return (
          <div className="h-full overflow-auto">
            <OperationsView
              units={transformedUnitsForFloorPlan}
              onTenantClick={onTenantClick}
              selectedSites={selectedSites}
            />
          </div>
        );
      case "admin":
        return (
          <div className="h-full overflow-auto">
            <AdminInterface />
          </div>
        );
      case "integrations":
        return (
          <div className="h-full overflow-auto">
            <IntegrationsView />
          </div>
        );
      default:
        return (
          <div className="h-full overflow-auto">
            <ReportsDashboard />
          </div>
        );
    }
  } catch (error) {
    console.error('Error rendering content:', error);
    return (
      <div className="h-full overflow-auto p-6">
        <div className="text-center">
          <p className="text-red-600">An error occurred while loading this view</p>
          <p className="text-gray-600 mt-2">Please try refreshing the page</p>
        </div>
      </div>
    );
  }
};
