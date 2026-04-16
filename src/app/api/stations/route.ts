import { NextResponse } from 'next/server';
import { store } from '@/data/store';

export async function GET() {
  return NextResponse.json(store.stations);
}
