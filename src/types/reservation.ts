
export interface Reservation {
  id: string;
  unitId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  startDate: string;
  endDate?: string;
  status: "pending" | "confirmed" | "cancelled" | "expired";
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod?: "stripe" | "paypal" | "manual";
  accessCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PricingRule {
  id: string;
  siteId?: string;
  unitType?: string;
  basePrice: number;
  occupancyMultiplier: number;
  demandMultiplier: number;
  seasonalMultiplier: number;
  minimumPrice: number;
  maximumPrice: number;
  effectiveFrom: string;
  effectiveTo?: string;
}
