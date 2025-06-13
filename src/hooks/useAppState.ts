
import { useState } from "react";
import { DatabaseCustomer } from "@/types/customer";
import type { Database } from "@/integrations/supabase/types";

export interface Unit {
  id: string;
  unit_number: string;
  size: string;
  monthly_rate: number;
  status: Database["public"]["Enums"]["unit_status"];
  type?: string;
  floor_level?: number;
  climate_controlled?: boolean;
  description?: string;
  facility_id: string;
  tenant?: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  created_at?: string;
  updated_at?: string;
}

export const useAppState = () => {
  const [activeView, setActiveView] = useState("dashboard"); // Changed default from "units" to "dashboard"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [viewingUnitDetails, setViewingUnitDetails] = useState<Unit | null>(null);
  const [viewingTenantDetails, setViewingTenantDetails] = useState<DatabaseCustomer | null>(null);
  const [showFloorPlan, setShowFloorPlan] = useState(false);
  const [selectedSites, setSelectedSites] = useState<string[]>([]);

  return {
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    selectedUnitId,
    setSelectedUnitId,
    selectedCustomerId,
    setSelectedCustomerId,
    viewingUnitDetails,
    setViewingUnitDetails,
    viewingTenantDetails,
    setViewingTenantDetails,
    showFloorPlan,
    setShowFloorPlan,
    selectedSites,
    setSelectedSites,
  };
};
