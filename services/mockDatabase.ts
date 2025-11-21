import { Package, Partner, Lead, User } from '../types';

// --- SEED DATA ---
const SEED_PARTNERS: Partner[] = [
  { id: 'p1', name: 'Himalayan Adventures', email: 'himalaya@partner.com', phone: '+919876543210', isActive: true, joinedAt: new Date().toISOString() },
  { id: 'p2', name: 'Tropical Getaways', email: 'tropical@partner.com', phone: '+13055550199', isActive: true, joinedAt: new Date().toISOString() },
];

const SEED_PACKAGES: Package[] = [
  {
    id: 'pkg1',
    title: 'Majestic Manali Escape',
    region: 'Himachal',
    priceFrom: 299,
    durationDays: 5,
    thumbnailUrl: 'https://picsum.photos/id/10/800/600',
    images: ['https://picsum.photos/id/10/800/600', 'https://picsum.photos/id/11/800/600'],
    itinerary: 'Day 1: Arrival in Manali. Day 2: Solang Valley. Day 3: Rohtang Pass. Day 4: Local Sightseeing. Day 5: Departure.',
    inclusions: ['Accommodation', 'Breakfast & Dinner', 'Private Cab', 'Welcome Drink'],
    exclusions: ['Flights', 'Lunch', 'Personal Expenses'],
    partnerId: 'p1'
  },
  {
    id: 'pkg2',
    title: 'Goa Beach Party Week',
    region: 'Goa',
    priceFrom: 499,
    durationDays: 4,
    thumbnailUrl: 'https://picsum.photos/id/14/800/600',
    images: ['https://picsum.photos/id/14/800/600', 'https://picsum.photos/id/15/800/600'],
    itinerary: 'Day 1: North Goa Beaches. Day 2: Water Sports. Day 3: South Goa Historic Tour. Day 4: Departure.',
    inclusions: ['Resort Stay', 'Airport Pickup', 'Breakfast'],
    exclusions: ['Flights', 'Water Sports Fees', 'Alcohol'],
    partnerId: 'p2'
  },
  {
    id: 'pkg3',
    title: 'Kerala Backwater Bliss',
    region: 'Kerala',
    priceFrom: 350,
    durationDays: 6,
    thumbnailUrl: 'https://picsum.photos/id/28/800/600',
    images: ['https://picsum.photos/id/28/800/600', 'https://picsum.photos/id/29/800/600'],
    itinerary: 'Day 1: Cochin arrival. Day 2: Munnar. Day 3: Thekkady. Day 4: Alleppey Houseboat. Day 5: Kovalam. Day 6: Departure.',
    inclusions: ['Houseboat Stay', 'All Meals on Houseboat', 'AC Car'],
    exclusions: ['Airfare', 'Entry Fees'],
    partnerId: 'p2'
  },
    {
    id: 'pkg4',
    title: 'Rajasthan Royal Heritage',
    region: 'Rajasthan',
    priceFrom: 600,
    durationDays: 7,
    thumbnailUrl: 'https://picsum.photos/id/42/800/600',
    images: ['https://picsum.photos/id/42/800/600'],
    itinerary: 'Jaipur -> Jodhpur -> Udaipur tour.',
    inclusions: ['Heritage Hotels', 'Camel Ride', 'Guide'],
    exclusions: ['Tips', 'Shopping'],
    partnerId: 'p1'
  }
];

const SEED_LEADS: Lead[] = [
  {
    id: 'l1',
    packageId: 'pkg1',
    partnerId: 'p1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '555-0123',
    travelers: 2,
    travelDate: '2023-12-01',
    specialRequirements: 'Vegetarian food only',
    status: 'New',
    commissionReceived: false,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'l2',
    packageId: 'pkg2',
    partnerId: 'p2',
    customerName: 'Alice Smith',
    customerEmail: 'alice@example.com',
    customerPhone: '555-0987',
    travelers: 4,
    travelDate: '2024-01-15',
    specialRequirements: 'Honeymoon suite',
    status: 'Converted',
    commissionReceived: true,
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

// --- MOCK SERVICE ---

const LS_KEYS = {
  PACKAGES: 'wanderlust_packages',
  PARTNERS: 'wanderlust_partners',
  LEADS: 'wanderlust_leads',
  USER: 'wanderlust_user'
};

const initializeData = () => {
  if (!localStorage.getItem(LS_KEYS.PACKAGES)) localStorage.setItem(LS_KEYS.PACKAGES, JSON.stringify(SEED_PACKAGES));
  if (!localStorage.getItem(LS_KEYS.PARTNERS)) localStorage.setItem(LS_KEYS.PARTNERS, JSON.stringify(SEED_PARTNERS));
  if (!localStorage.getItem(LS_KEYS.LEADS)) localStorage.setItem(LS_KEYS.LEADS, JSON.stringify(SEED_LEADS));
};

// Call immediately
initializeData();

export const mockDb = {
  // PACKAGES
  getPackages: (): Package[] => JSON.parse(localStorage.getItem(LS_KEYS.PACKAGES) || '[]'),
  getPackage: (id: string): Package | undefined => {
    const pkgs = mockDb.getPackages();
    return pkgs.find(p => p.id === id);
  },
  savePackage: (pkg: Package) => {
    const pkgs = mockDb.getPackages();
    const idx = pkgs.findIndex(p => p.id === pkg.id);
    if (idx >= 0) pkgs[idx] = pkg;
    else pkgs.push({ ...pkg, id: Math.random().toString(36).substr(2, 9) });
    localStorage.setItem(LS_KEYS.PACKAGES, JSON.stringify(pkgs));
  },
  deletePackage: (id: string) => {
    const pkgs = mockDb.getPackages().filter(p => p.id !== id);
    localStorage.setItem(LS_KEYS.PACKAGES, JSON.stringify(pkgs));
  },

  // PARTNERS
  getPartners: (): Partner[] => JSON.parse(localStorage.getItem(LS_KEYS.PARTNERS) || '[]'),
  
  // LEADS
  getLeads: (): Lead[] => JSON.parse(localStorage.getItem(LS_KEYS.LEADS) || '[]'),
  createLead: (leadData: Omit<Lead, 'id' | 'status' | 'commissionReceived' | 'createdAt'>) => {
    const leads = mockDb.getLeads();
    const newLead: Lead = {
      ...leadData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'New',
      commissionReceived: false,
      createdAt: new Date().toISOString()
    };
    leads.unshift(newLead);
    localStorage.setItem(LS_KEYS.LEADS, JSON.stringify(leads));
    return newLead;
  },
  updateLead: (id: string, updates: Partial<Lead>) => {
    const leads = mockDb.getLeads();
    const idx = leads.findIndex(l => l.id === id);
    if (idx >= 0) {
      leads[idx] = { ...leads[idx], ...updates };
      localStorage.setItem(LS_KEYS.LEADS, JSON.stringify(leads));
    }
  },

  // AUTH (Simplified)
  login: async (email: string, password: string): Promise<User | null> => {
    // Mock Auth Logic
    if (email === 'admin@wanderlust.com' && password === 'admin') {
      return { id: 'admin1', name: 'Super Admin', email, role: 'admin', token: 'mock-jwt-admin' };
    }
    const partners = mockDb.getPartners();
    const partner = partners.find(p => p.email === email);
    // In a real app, check password hash. Here we accept any password for demo partners if email matches
    if (partner) {
      return { id: partner.id, name: partner.name, email, role: 'partner', token: 'mock-jwt-partner' };
    }
    return null;
  }
};
