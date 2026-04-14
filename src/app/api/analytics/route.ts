import { NextResponse } from 'next/server';
import { store } from '@/data/store';
import { mockHourlyRevenue, mockDailyRevenue } from '@/data/mockData';
import { AnalyticsData } from '@/types';

/**
 * GET /api/analytics — Returns all analytics data
 * FOR BACKEND DEVELOPER: Replace with aggregation queries
 * - hourlyRevenue: GROUP BY HOUR for today
 * - dailyRevenue: GROUP BY DAY for last 30 days
 * - retentionRate: customers with >2 sessions / total customers
 */
export async function GET() {
  const customers = store.customers;
  const stations = store.stations;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  const whales = customers.filter(c => c.totalSpent > 10000).length;
  const grinders = customers.filter(c => c.totalSpent >= 5000 && c.totalSpent <= 10000).length;
  const casuals = customers.filter(c => c.totalSpent < 5000).length;
  const total = customers.length || 1;

  const rtx4090 = stations.filter(s => s.type === 'RTX 4090');
  const ps5 = stations.filter(s => s.type === 'PS5 Pro');
  const sim = stations.filter(s => s.type === 'Sim Racing');
  const occupied = (arr: typeof stations) => Math.round(arr.filter(s => s.status === 'occupied').length / (arr.length || 1) * 100);

  const analytics: AnalyticsData = {
    hourlyRevenue: mockHourlyRevenue,
    dailyRevenue: mockDailyRevenue.slice(-30),
    customerClusters: {
      whales: Math.round(whales / total * 100),
      grinders: Math.round(grinders / total * 100),
      casuals: Math.round(casuals / total * 100),
    },
    deviceAllocation: {
      rtx4090: occupied(rtx4090),
      ps5Pro: occupied(ps5),
      simRacing: occupied(sim),
      vr: 60,
    },
    retentionRate: 84.2,
    avgSession: parseFloat((customers.reduce((s, c) => s + c.avgSession, 0) / total).toFixed(1)),
    totalRevenue,
    ecosystemScore: 80,
  };

  return NextResponse.json(analytics);
}
