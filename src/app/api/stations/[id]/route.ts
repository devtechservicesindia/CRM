import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/data/store';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const idNum = parseInt(params.id, 10);
    const idx = store.stations.findIndex(s => s.id === idNum);
    if (idx === -1) return NextResponse.json({ error: 'Station not found' }, { status: 404 });
    store.stations[idx] = { ...store.stations[idx], ...body };
    return NextResponse.json(store.stations[idx]);
  } catch {
    return NextResponse.json({ error: 'Failed to update station' }, { status: 500 });
  }
}
