'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Customer, Conversation, Message } from '@/types';

interface AppState {
  customers: Customer[];
  conversations: Conversation[];
  isLoadingCustomers: boolean;
  isLoadingConversations: boolean;
  selectedConversationId: string | null;
  automationSettings: { smartAutoReply: boolean; loyaltyAlert: boolean };
}

interface AppContextType extends AppState {
  // Customers
  fetchCustomers: () => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id' | 'joinDate' | 'sessions' | 'isActive' | 'avgSession'>) => Promise<Customer>;
  updateCustomer: (customer: Customer) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  // Messages
  fetchConversations: () => Promise<void>;
  selectConversation: (id: string) => void;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  // Automation
  toggleAutomation: (key: 'smartAutoReply' | 'loyaltyAlert') => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [automationSettings, setAutomationSettings] = useState({ smartAutoReply: true, loyaltyAlert: false });

  // Load automation settings from local preference
  useEffect(() => {
    const saved = localStorage.getItem('gp_automation');
    if (saved) setAutomationSettings(JSON.parse(saved));
  }, []);

  const fetchCustomers = useCallback(async () => {
    setIsLoadingCustomers(true);
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      setCustomers(data);
    } catch (e) { console.error('Failed to fetch customers', e); }
    finally { setIsLoadingCustomers(false); }
  }, []);

  const fetchConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      setConversations(data);
      if (data.length > 0 && !selectedConversationId) setSelectedConversationId(data[0].id);
    } catch (e) { console.error('Failed to fetch conversations', e); }
    finally { setIsLoadingConversations(false); }
  }, [selectedConversationId]);

  const addCustomer = async (customer: Omit<Customer, 'id' | 'joinDate' | 'sessions' | 'isActive' | 'avgSession'>): Promise<Customer> => {
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    if (!res.ok) throw new Error('Failed to add customer');
    const newCustomer = await res.json();
    setCustomers(prev => [newCustomer, ...prev]);
    return newCustomer;
  };

  const updateCustomer = async (customer: Customer) => {
    const res = await fetch(`/api/customers/${customer.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    if (!res.ok) throw new Error('Failed to update customer');
    const updated = await res.json();
    setCustomers(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const deleteCustomer = async (id: string) => {
    const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete customer');
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const selectConversation = (id: string) => {
    setSelectedConversationId(id);
    // Mark as read
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: false } : c));
  };

  const sendMessage = async (conversationId: string, content: string) => {
    const res = await fetch(`/api/messages/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) throw new Error('Failed to send message');
    const newMsg: Message = await res.json();
    setConversations(prev => prev.map(c =>
      c.id === conversationId
        ? { ...c, messages: [...c.messages, newMsg], lastMessage: content, lastMessageTime: newMsg.sentAt }
        : c
    ));
  };

  const toggleAutomation = (key: 'smartAutoReply' | 'loyaltyAlert') => {
    setAutomationSettings(prev => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem('gp_automation', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AppContext.Provider value={{
      customers, conversations, isLoadingCustomers, isLoadingConversations,
      selectedConversationId, automationSettings,
      fetchCustomers, fetchConversations, addCustomer, updateCustomer, deleteCustomer,
      selectConversation, sendMessage, toggleAutomation,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
