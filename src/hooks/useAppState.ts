
import { useState } from "react";

interface Unit {
  id: string;
  size: string;
  type: string;
  status: string;
  tenant: string | null;
  tenantId: string | null;
  rate: number;
  climate: boolean;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  units: string[];
  status: string;
  joinDate: string;
  balance: number;
}

const initialUnits: Unit[] = [
  { id: "A-101", size: "5x5", type: "Standard", status: "occupied", tenant: "John Smith", tenantId: "john-smith", rate: 85, climate: true },
  { id: "A-102", size: "5x5", type: "Standard", status: "available", tenant: null, tenantId: null, rate: 85, climate: true },
  { id: "A-103", size: "5x10", type: "Standard", status: "reserved", tenant: "Sarah Johnson", tenantId: "sarah-johnson", rate: 120, climate: true },
  { id: "B-201", size: "10x10", type: "Premium", status: "occupied", tenant: "Mike Wilson", tenantId: "mike-wilson", rate: 180, climate: true },
  { id: "B-202", size: "10x10", type: "Premium", status: "maintenance", tenant: null, tenantId: null, rate: 180, climate: true },
  { id: "C-301", size: "10x20", type: "Large", status: "available", tenant: null, tenantId: null, rate: 280, climate: false },
];

const initialCustomers: Customer[] = [
  {
    id: "john-smith",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    units: ["A-101"],
    status: "active",
    joinDate: "2024-01-15",
    balance: 0,
  },
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "(555) 234-5678",
    units: ["A-103"],
    status: "reserved",
    joinDate: "2024-05-20",
    balance: 120,
  },
  {
    id: "mike-wilson",
    name: "Mike Wilson",
    email: "mike.wilson@email.com",
    phone: "(555) 345-6789",
    units: ["B-201"],
    status: "active",
    joinDate: "2023-11-08",
    balance: -85,
  },
  {
    id: "emily-davis",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "(555) 456-7890",
    units: [],
    status: "former",
    joinDate: "2023-06-12",
    balance: 0,
  },
];

export const useAppState = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [viewingUnitDetails, setViewingUnitDetails] = useState<Unit | null>(null);
  const [viewingTenantDetails, setViewingTenantDetails] = useState<Customer | null>(null);
  const [showFloorPlan, setShowFloorPlan] = useState(false);
  const [units, setUnits] = useState<Unit[]>(initialUnits);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [showAddUnitDialog, setShowAddUnitDialog] = useState(false);

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
    units,
    setUnits,
    customers,
    setCustomers,
    showAddUnitDialog,
    setShowAddUnitDialog,
  };
};

export type { Unit, Customer };
