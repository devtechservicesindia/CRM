import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/data/store';
import { Customer } from '@/types';

/**
 * GET /api/customers — List all customers
 * POST /api/customers — Create a new customer
 * 
 * FOR BACKEND DEVELOPER:
 * GET: Replace `store.customers` with `await prisma.customer.findMany()`
 * POST: Replace store mutation with `await prisma.customer.create({ data: body })`
 */

export async function GET() {
  try {
    return NextResponse.json(store.customers);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newCustomer: Customer = {
      id: `c-${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone,
      totalSpent: Number(body.totalSpent) || 0,
      level: body.level || 'Bronze',
      lastVisit: new Date().toISOString(),
      sessions: 0,
      joinDate: new Date().toISOString(),
      isActive: false,
      avgSession: 0,
      avatar: body.avatar || '',
    };
    store.customers.unshift(newCustomer);
    return NextResponse.json(newCustomer, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}
