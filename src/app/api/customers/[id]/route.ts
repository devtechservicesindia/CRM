import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/data/store';

/**
 * GET /api/customers/[id] — Get one customer
 * PUT /api/customers/[id] — Update a customer
 * DELETE /api/customers/[id] — Delete a customer
 * 
 * FOR BACKEND DEVELOPER:
 * GET: `await prisma.customer.findUnique({ where: { id } })`
 * PUT: `await prisma.customer.update({ where: { id }, data: body })`
 * DELETE: `await prisma.customer.delete({ where: { id } })`
 */

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const customer = store.customers.find(c => c.id === params.id);
  if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  return NextResponse.json(customer);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const idx = store.customers.findIndex(c => c.id === params.id);
    if (idx === -1) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    store.customers[idx] = { ...store.customers[idx], ...body };
    return NextResponse.json(store.customers[idx]);
  } catch {
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const idx = store.customers.findIndex(c => c.id === params.id);
  if (idx === -1) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  store.customers.splice(idx, 1);
  return NextResponse.json({ success: true });
}
