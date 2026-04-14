import { NextResponse } from 'next/server';
import { store } from '@/data/store';

/**
 * GET /api/messages — List all conversations
 * FOR BACKEND DEVELOPER: Replace with DB query + join with messages table
 */
export async function GET() {
  return NextResponse.json(store.conversations);
}
