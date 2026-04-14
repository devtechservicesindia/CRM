import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/data/store';
import { Message } from '@/types';

/**
 * POST /api/messages/[id]/messages — Send a message in a conversation
 * FOR BACKEND DEVELOPER: Replace with DB insert into messages table
 */
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { content } = await request.json();
    const conv = store.conversations.find(c => c.id === params.id);
    if (!conv) return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      content,
      sentAt: new Date().toISOString(),
      isFromCustomer: false,
      read: true,
    };
    conv.messages.push(newMsg);
    conv.lastMessage = content;
    conv.lastMessageTime = newMsg.sentAt;
    return NextResponse.json(newMsg, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
