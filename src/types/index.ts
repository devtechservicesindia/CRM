// All TypeScript types for the GP CRM application
// These types are shared between frontend components and API routes

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalSpent: number;
  lastVisit: string; // ISO string
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  sessions: number;
  joinDate: string; // ISO string
  avatar?: string;
  isActive: boolean;
  avgSession: number; // hours
}

export interface Message {
  id: string;
  content: string;
  sentAt: string; // ISO string
  isFromCustomer: boolean;
  read: boolean;
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  lastMessage: string;
  lastMessageTime: string; // ISO string
  unread: boolean;
  online: boolean;
  category: 'general' | 'vip' | 'support';
  messages: Message[];
}

export interface Station {
  id: number;
  name: string;
  type: 'RTX 4090' | 'PS5 Pro' | 'Sim Racing' | 'VR';
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  currentCustomer?: string;
  zone: 'A' | 'B' | 'C';
}

export interface RevenueDataPoint {
  label: string;
  revenue: number;
  sessions: number;
}

export interface ActivityEvent {
  id: string;
  type: 'session_start' | 'session_end' | 'purchase' | 'tournament' | 'alert' | 'redemption';
  title: string;
  description: string;
  timestamp: string; // ISO string
  customerName?: string;
  customerAvatar?: string;
  severity?: 'info' | 'warning' | 'error';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  avatar?: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalRevenuePrevMonth: number;
  activePlayers: number;
  pcOccupancy: number;
  monthlyGrowth: number;
  totalCustomers: number;
  goldMembers: number;
  newCustomersThisWeek: number;
  revenueData: RevenueDataPoint[];
  recentActivity: ActivityEvent[];
  stations: {
    available: number;
    occupied: number;
    maintenance: number;
    reserved: number;
  };
}

export interface AnalyticsData {
  hourlyRevenue: RevenueDataPoint[];
  dailyRevenue: RevenueDataPoint[];
  customerClusters: {
    whales: number;
    grinders: number;
    casuals: number;
  };
  deviceAllocation: {
    rtx4090: number;
    ps5Pro: number;
    simRacing: number;
    vr: number;
  };
  retentionRate: number;
  avgSession: number;
  totalRevenue: number;
  ecosystemScore: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
