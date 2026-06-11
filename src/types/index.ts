export interface Property {
  id: string;
  name: string;
  address: string;
  type: 'apartment' | 'house' | 'studio' | 'commercial';
  rooms: number;
  area: number;
  rent: number;
  status: 'occupied' | 'vacant' | 'maintenance';
  tenant?: Tenant;
  images: string[];
  description: string;
  amenities: string[];
}

export interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  leaseStart: string;
  leaseEnd: string;
  monthlyRent: number;
  deposit: number;
  status: 'active' | 'inactive' | 'pending';
}

export interface Payment {
  id: string;
  tenantId: string;
  propertyId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  type: 'rent' | 'deposit' | 'utilities' | 'other';
}

export interface Maintenance {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'reported' | 'in-progress' | 'completed' | 'cancelled';
  reportedDate: string;
  completedDate?: string;
  cost?: number;
  assignedTo?: string;
}

export interface DashboardStats {
  totalProperties: number;
  occupiedProperties: number;
  vacantProperties: number;
  totalTenants: number;
  monthlyRevenue: number;
  pendingPayments: number;
  maintenanceRequests: number;
  occupancyRate: number;
}