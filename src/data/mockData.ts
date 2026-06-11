import { Property, Tenant, Payment, Maintenance, DashboardStats } from '../types';

export const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Appartement Parisien Centre',
    address: '15 Rue de Rivoli, 75001 Paris',
    type: 'apartment',
    rooms: 3,
    area: 75,
    rent: 2500,
    status: 'occupied',
    images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'],
    description: 'Magnifique appartement au cœur de Paris avec vue sur les Tuileries.',
    amenities: ['Balcon', 'Parking', 'Ascenseur', 'Cuisine équipée']
  },
  {
    id: '2',
    name: 'Studio Montmartre',
    address: '8 Place du Tertre, 75018 Paris',
    type: 'studio',
    rooms: 1,
    area: 35,
    rent: 1200,
    status: 'vacant',
    images: ['https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg'],
    description: 'Charmant studio dans le quartier artistique de Montmartre.',
    amenities: ['Vue panoramique', 'Cuisine équipée', 'Internet haut débit']
  },
  {
    id: '3',
    name: 'Maison Familiale Banlieue',
    address: '42 Avenue des Lilas, 94100 Saint-Maur',
    type: 'house',
    rooms: 5,
    area: 120,
    rent: 3200,
    status: 'occupied',
    images: ['https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg'],
    description: 'Belle maison familiale avec jardin dans un quartier calme.',
    amenities: ['Jardin', 'Garage', 'Terrasse', 'Cave']
  },
  {
    id: '4',
    name: 'Loft Commercial',
    address: '25 Rue du Commerce, 75015 Paris',
    type: 'commercial',
    rooms: 2,
    area: 90,
    rent: 4500,
    status: 'maintenance',
    images: ['https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg'],
    description: 'Espace commercial moderne idéal pour bureaux ou showroom.',
    amenities: ['Vitrine', 'Climatisation', 'Fibre optique', 'Alarme']
  }
];

export const mockTenants: Tenant[] = [
  {
    id: '1',
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie.dupont@email.com',
    phone: '06 12 34 56 78',
    leaseStart: '2024-01-01',
    leaseEnd: '2024-12-31',
    monthlyRent: 2500,
    deposit: 5000,
    status: 'active'
  },
  {
    id: '2',
    firstName: 'Pierre',
    lastName: 'Martin',
    email: 'pierre.martin@email.com',
    phone: '06 87 65 43 21',
    leaseStart: '2024-03-01',
    leaseEnd: '2025-02-28',
    monthlyRent: 3200,
    deposit: 6400,
    status: 'active'
  }
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    tenantId: '1',
    propertyId: '1',
    amount: 2500,
    dueDate: '2024-12-01',
    paidDate: '2024-12-01',
    status: 'paid',
    type: 'rent'
  },
  {
    id: '2',
    tenantId: '2',
    propertyId: '3',
    amount: 3200,
    dueDate: '2024-12-01',
    status: 'pending',
    type: 'rent'
  },
  {
    id: '3',
    tenantId: '1',
    propertyId: '1',
    amount: 2500,
    dueDate: '2025-01-01',
    status: 'pending',
    type: 'rent'
  }
];

export const mockMaintenance: Maintenance[] = [
  {
    id: '1',
    propertyId: '1',
    title: 'Fuite dans la salle de bain',
    description: 'Une fuite d\'eau a été signalée au niveau du lavabo.',
    priority: 'high',
    status: 'in-progress',
    reportedDate: '2024-11-28',
    cost: 150,
    assignedTo: 'Plombier Express'
  },
  {
    id: '2',
    propertyId: '4',
    title: 'Rénovation complète',
    description: 'Rénovation de l\'espace commercial avant nouvelle location.',
    priority: 'medium',
    status: 'in-progress',
    reportedDate: '2024-11-15',
    cost: 15000,
    assignedTo: 'Entreprise Réno+'
  },
  {
    id: '3',
    propertyId: '2',
    title: 'Changement de serrure',
    description: 'Remplacement de la serrure d\'entrée pour nouveau locataire.',
    priority: 'low',
    status: 'completed',
    reportedDate: '2024-11-20',
    completedDate: '2024-11-22',
    cost: 80,
    assignedTo: 'Serrurier Pro'
  }
];

export const dashboardStats: DashboardStats = {
  totalProperties: 4,
  occupiedProperties: 2,
  vacantProperties: 1,
  totalTenants: 2,
  monthlyRevenue: 5700,
  pendingPayments: 2,
  maintenanceRequests: 2,
  occupancyRate: 50
};