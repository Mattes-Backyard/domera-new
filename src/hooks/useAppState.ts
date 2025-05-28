import { useState } from "react";
import { useNotificationEvents } from "./useNotificationEvents";

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
  
  // Building A - Additional units
  { id: "A-104", size: "5x5", type: "Standard", status: "available", tenant: null, tenantId: null, rate: 85, climate: true },
  { id: "A-105", size: "5x5", type: "Standard", status: "occupied", tenant: "Lisa Brown", tenantId: "lisa-brown", rate: 85, climate: true },
  { id: "A-106", size: "5x10", type: "Standard", status: "available", tenant: null, tenantId: null, rate: 120, climate: true },
  { id: "A-107", size: "5x10", type: "Standard", status: "reserved", tenant: "David Chen", tenantId: "david-chen", rate: 120, climate: true },
  { id: "A-108", size: "8x10", type: "Premium", status: "available", tenant: null, tenantId: null, rate: 150, climate: true },
  
  // Building B - Additional units
  { id: "B-203", size: "10x10", type: "Premium", status: "occupied", tenant: "Maria Garcia", tenantId: "maria-garcia", rate: 180, climate: true },
  { id: "B-204", size: "10x10", type: "Premium", status: "available", tenant: null, tenantId: null, rate: 180, climate: true },
  { id: "B-205", size: "10x15", type: "Premium", status: "maintenance", tenant: null, tenantId: null, rate: 220, climate: true },
  { id: "B-206", size: "12x12", type: "Large", status: "occupied", tenant: "Robert Taylor", tenantId: "robert-taylor", rate: 250, climate: true },
  { id: "B-207", size: "8x8", type: "Premium", status: "available", tenant: null, tenantId: null, rate: 140, climate: true },
  
  // Building C - Additional units
  { id: "C-302", size: "10x20", type: "Large", status: "occupied", tenant: "Jennifer White", tenantId: "jennifer-white", rate: 280, climate: false },
  { id: "C-303", size: "15x20", type: "Extra Large", status: "available", tenant: null, tenantId: null, rate: 380, climate: false },
  { id: "C-304", size: "12x15", type: "Large", status: "reserved", tenant: "Thomas Anderson", tenantId: "thomas-anderson", rate: 300, climate: false },
  { id: "C-305", size: "10x20", type: "Large", status: "available", tenant: null, tenantId: null, rate: 280, climate: false },
  
  // Building D - New building
  { id: "D-401", size: "5x5", type: "Standard", status: "available", tenant: null, tenantId: null, rate: 85, climate: true },
  { id: "D-402", size: "5x5", type: "Standard", status: "occupied", tenant: "Amanda Rodriguez", tenantId: "amanda-rodriguez", rate: 85, climate: true },
  { id: "D-403", size: "8x10", type: "Premium", status: "available", tenant: null, tenantId: null, rate: 150, climate: true },
  { id: "D-404", size: "10x10", type: "Premium", status: "maintenance", tenant: null, tenantId: null, rate: 180, climate: true },
  { id: "D-405", size: "12x20", type: "Large", status: "occupied", tenant: "Kevin O'Connor", tenantId: "kevin-oconnor", rate: 320, climate: false },
  { id: "D-406", size: "15x25", type: "Extra Large", status: "available", tenant: null, tenantId: null, rate: 450, climate: false },
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
  {
    id: "lisa-brown",
    name: "Lisa Brown",
    email: "lisa.brown@email.com",
    phone: "(555) 567-8901",
    units: ["A-105"],
    status: "active",
    joinDate: "2024-03-10",
    balance: 0,
  },
  {
    id: "david-chen",
    name: "David Chen",
    email: "david.chen@email.com",
    phone: "(555) 678-9012",
    units: ["A-107"],
    status: "reserved",
    joinDate: "2024-06-01",
    balance: 120,
  },
  {
    id: "maria-garcia",
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    phone: "(555) 789-0123",
    units: ["B-203"],
    status: "active",
    joinDate: "2024-02-14",
    balance: 0,
  },
  {
    id: "robert-taylor",
    name: "Robert Taylor",
    email: "robert.taylor@email.com",
    phone: "(555) 890-1234",
    units: ["B-206"],
    status: "active",
    joinDate: "2023-12-05",
    balance: 0,
  },
  {
    id: "jennifer-white",
    name: "Jennifer White",
    email: "jennifer.white@email.com",
    phone: "(555) 901-2345",
    units: ["C-302"],
    status: "active",
    joinDate: "2024-04-18",
    balance: 0,
  },
  {
    id: "thomas-anderson",
    name: "Thomas Anderson",
    email: "thomas.anderson@email.com",
    phone: "(555) 012-3456",
    units: ["C-304"],
    status: "reserved",
    joinDate: "2024-06-15",
    balance: 300,
  },
  {
    id: "amanda-rodriguez",
    name: "Amanda Rodriguez",
    email: "amanda.rodriguez@email.com",
    phone: "(555) 123-0987",
    units: ["D-402"],
    status: "active",
    joinDate: "2024-01-28",
    balance: 0,
  },
  {
    id: "kevin-oconnor",
    name: "Kevin O'Connor",
    email: "kevin.oconnor@email.com",
    phone: "(555) 234-1098",
    units: ["D-405"],
    status: "active",
    joinDate: "2023-10-12",
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

  const { notifyUnitStatusChange, notifyNewLead, notifyPaymentOverdue } = useNotificationEvents();

  const updateUnit = (updatedUnit: Unit) => {
    setUnits(prev => {
      const previousUnit = prev.find(u => u.id === updatedUnit.id);
      const updatedUnits = prev.map(unit => 
        unit.id === updatedUnit.id ? updatedUnit : unit
      );
      
      // Trigger notification if status changed
      if (previousUnit && previousUnit.status !== updatedUnit.status) {
        notifyUnitStatusChange(updatedUnit, previousUnit.status);
      }
      
      return updatedUnits;
    });
  };

  const addCustomer = (newCustomer: Customer) => {
    setCustomers(prev => {
      const updatedCustomers = [...prev, newCustomer];
      
      // Trigger notification for new lead
      notifyNewLead(newCustomer);
      
      // Check for overdue payments
      if (newCustomer.balance > 0) {
        notifyPaymentOverdue(newCustomer);
      }
      
      return updatedCustomers;
    });
  };

  const addUnit = (newUnit: Unit) => {
    setUnits(prev => [...prev, newUnit]);
  };

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
    setUnits: updateUnit,
    customers,
    setCustomers,
    showAddUnitDialog,
    setShowAddUnitDialog,
    addCustomer,
    addUnit,
  };
};

export type { Unit, Customer };
