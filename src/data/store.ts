/**
 * SERVER-SIDE IN-MEMORY DATA STORE
 * 
 * This file acts as an in-memory database for the mock implementation.
 * 
 * ──────────────────────────────────────────────────────────────────────
 * FOR BACKEND DEVELOPER:
 * Replace this store with your actual database client (Prisma, TypeORM, etc.)
 * Each function in api routes currently calls these arrays directly.
 * Replace with: `await prisma.customer.findMany()` etc.
 * ──────────────────────────────────────────────────────────────────────
 */
import { Customer, Conversation, Station } from '@/types';
import { mockCustomers, mockConversations, mockStations } from './mockData';

// Mutable in-memory collections (simulate DB tables)
export const store = {
  customers: [...mockCustomers] as Customer[],
  conversations: [...mockConversations] as Conversation[],
  stations: [...mockStations] as Station[],
};
