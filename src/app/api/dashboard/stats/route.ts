import { NextResponse } from 'next/server';
import { store } from '@/data/store';
import { mockWeeklyRevenue, mockRecentActivity } from '@/data/mockData';
import { DashboardStats } from '@/types';

/**
 * GET /api/dashboard/stats — Returns all data needed for the dashboard page
 * FOR BACKEND DEVELOPER:
 * - totalRevenue: SUM of all sessions revenue from sessions table (last 30 days)
 * - activePlayers: COUNT of active sessions RIGHT NOW
 * - pcOccupancy: % of stations with status='occupied'
 * - monthlyGrowth: ((this month customers - last month) / last month) * 100
 */
export async function GET() {
  const customers = store.customers;
  const stations = store.stations;

  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const goldMembers = customers.filter(c => c.level === 'Gold' || c.level === 'Platinum').length;
  const activePlayers = customers.filter(c => c.isActive).length;
  const occupied = stations.filter(s => s.status === 'occupied').length;
  const pcOccupancy = Math.round((occupied / stations.length) * 100);

  const stats: DashboardStats = {
    totalRevenue,
    totalRevenuePrevMonth: Math.round(totalRevenue * 0.87),
    activePlayers,
    pcOccupancy,
    monthlyGrowth: 24.3,
    totalCustomers: customers.length,
    goldMembers,
    newCustomersThisWeek: 3,
    revenueData: mockWeeklyRevenue,
    recentActivity: mockRecentActivity,
    stations: {
      available: stations.filter(s => s.status === 'available').length,
      occupied: stations.filter(s => s.status === 'occupied').length,
      maintenance: stations.filter(s => s.status === 'maintenance').length,
      reserved: stations.filter(s => s.status === 'reserved').length,
    },
  };

  return NextResponse.json(stats);
}
