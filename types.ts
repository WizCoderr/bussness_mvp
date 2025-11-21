export type UserRole = 'admin' | 'partner' | 'public';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token?: string;
}

export interface Partner {
  id: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  joinedAt: string;
}

export interface Package {
  id: string;
  title: string;
  region: string;
  priceFrom: number;
  durationDays: number;
  thumbnailUrl: string;
  images: string[];
  itinerary: string;
  inclusions: string[];
  exclusions: string[];
  partnerId: string; // Assigned partner
}

export type LeadStatus = 'New' | 'Contacted' | 'Not Interested' | 'Converted';

export interface Lead {
  id: string;
  packageId: string;
  partnerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  travelers: number;
  travelDate: string;
  specialRequirements: string;
  status: LeadStatus;
  commissionReceived: boolean;
  createdAt: string;
}

// Stats for dashboard
export interface DashboardStats {
  totalLeads: number;
  totalRevenue: number; // Simulated based on conversions
  conversionRate: number;
}
