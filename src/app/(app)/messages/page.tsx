'use client';

import { useEffect, useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { Conversation } from '@/types';

type FilterCategory = 'all' | 'unread' | 'vip' | 'support';

const QUICK_REPLIES = [
  { icon: 'check_circle', text: "Got it! I'll check the booking and confirm shortly. 🎮" },
  { icon: 'local_offer', text: "Happy Hours coming up! 30% off all sessions 2PM–6PM 🔥" },
  { icon: 'stars', text: "Your Gold membership is now active! Enjoy 15% off all sessions 🌟" },
  { icon: 'build', text: "Sorry for the inconvenience, we're looking into it right now 🛠️" },
];

function formatTime(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function formatMsgTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function Avatar({ name, src, online, size = 10 }: { name: string; src?: string; online?: boolean; size?: number }) {
  return (
    <div className={`relative flex-shrink-0 w-${size} h-${size}`}>
      <div className={`w-full h-full rounded-full bg-primary-fixed flex items-center justify-center overflow-hidden`}>
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-manrope font-bold text-primary text-sm">{name[0]}</span>
        )}
      </div>
      {online !== undefined && (
        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${online ? 'bg-emerald-500 shadow-[0_0_6px_#10b981]' : 'bg-slate-300'}`} />
      )}
    </div>
  );
}

export default function MessagesPage() {
  const { conversations, isLoadingConversations, fetchConversations, selectedConversationId, selectConversation, sendMessage, automationSettings, toggleAutomation } = useApp();
  const [filter, setFilter] = useState<FilterCategory>('all');
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConversationId, conversations]);

  const filtered = conversations.filter(c => {
    if (filter === 'unread') return c.unread;
    if (filter === 'vip') return c.category === 'vip';
    if (filter === 'support') return c.category === 'support';
    return true;
  });

  const selected: Conversation | undefined = conversations.find(c => c.id === selectedConversationId);

  const handleSend = async () => {
    if (!input.trim() || !selectedConversationId) return;
    const content = input.trim();
    setInput('');
    setSending(true);
    try { await sendMessage(selectedConversationId, content); }
    finally { setSending(false); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const unreadCount = conversations.filter(c => c.unread).length;

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Left: Conversation List */}
      <div className="w-80 flex-shrink-0 bg-surface-container-lowest rounded-2xl shadow-[0px_20px_40px_rgba(0,36,81,0.06)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-manrope font-bold text-lg text-primary">Messages</h4>
            {unreadCount > 0 && (
              <span className="bg-error text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{unreadCount} new</span>
            )}
          </div>
          {/* Filter tabs */}
          <div className="flex gap-1 flex-wrap">
            {(['all', 'unread', 'vip', 'support'] as FilterCategory[]).map(f => (
              <button
                key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${filter === f ? 'bg-secondary text-white shadow-md shadow-secondary/20' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
              >
                {f === 'all' ? 'All Chats' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-surface-container">
          {isLoadingConversations ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-on-surface-variant p-6 text-center">
              <span className="material-symbols-outlined text-4xl mb-2 opacity-30">mail_off</span>
              <p className="text-sm">No conversations in this category.</p>
            </div>
          ) : filtered.map(conv => {
            const isActive = conv.id === selectedConversationId;
            return (
              <button
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className={`w-full text-left px-4 py-4 flex gap-3 items-start transition-all hover:bg-surface-container-low ${isActive ? 'bg-secondary/5 border-l-4 border-secondary' : ''}`}
              >
                <Avatar name={conv.customerName} src={conv.customerAvatar} online={conv.online} size={10} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className={`font-manrope text-sm truncate ${isActive ? 'font-bold text-secondary' : 'font-semibold text-primary'}`}>{conv.customerName}</p>
                    <span className="text-[10px] text-on-surface-variant flex-shrink-0">{formatTime(conv.lastMessageTime)}</span>
                  </div>
                  <p className={`text-xs truncate ${conv.unread ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}>{conv.lastMessage}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {conv.category === 'vip' && <span className="text-[10px] font-bold px-1.5 py-0.5 bg-on-tertiary-container/10 text-on-tertiary-container rounded">VIP</span>}
                    {conv.category === 'support' && <span className="text-[10px] font-bold px-1.5 py-0.5 bg-error-container text-error rounded">SUPPORT</span>}
                    {conv.unread && <span className="w-2 h-2 bg-secondary rounded-full ml-auto flex-shrink-0" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Middle: Chat View */}
      <div className="flex-1 flex flex-col bg-surface-container-lowest rounded-2xl shadow-[0px_20px_40px_rgba(0,36,81,0.06)] overflow-hidden min-w-0">
        {selected ? (
          <>
            {/* Chat Header */}
            <div className="px-8 py-5 border-b border-surface-container-low flex items-center justify-between flex-shrink-0 bg-white/60 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <Avatar name={selected.customerName} src={selected.customerAvatar} online={selected.online} size={10} />
                <div>
                  <p className="font-manrope font-bold text-primary">{selected.customerName}</p>
                  <p className="text-[10px] text-on-surface-variant font-medium">{selected.online ? '🟢 Online now' : '⚫ Offline'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selected.category === 'vip' && <span className="px-2 py-1 bg-on-tertiary-container/10 text-on-tertiary-container text-[10px] font-bold uppercase tracking-widest rounded-lg">VIP Player</span>}
                <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container transition-all text-on-surface-variant">
                  <span className="material-symbols-outlined text-xl">more_vert</span>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-6">
              {selected.messages.map((msg, i) => {
                const isFirst = i === 0 || selected.messages[i - 1].isFromCustomer !== msg.isFromCustomer;
                return (
                  <div key={msg.id} className={`flex gap-3 ${msg.isFromCustomer ? 'justify-start' : 'justify-end'} ${!isFirst ? (msg.isFromCustomer ? 'pl-12' : 'pr-0') : ''}`}>
                    {msg.isFromCustomer && isFirst && (
                      <Avatar name={selected.customerName} src={selected.customerAvatar} size={9} />
                    )}
                    <div className={`max-w-[70%] ${!msg.isFromCustomer ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.isFromCustomer
                          ? 'bg-surface-container rounded-tl-sm text-on-surface'
                          : 'bg-gradient-to-br from-secondary to-secondary-container text-white rounded-tr-sm shadow-lg shadow-secondary/20'
                      }`}>
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-on-surface-variant px-1">{formatMsgTime(msg.sentAt)}</span>
                    </div>
                    {!msg.isFromCustomer && isFirst && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold font-manrope text-xs flex-shrink-0">A</div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-6 py-3 border-t border-surface-container-low flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0 bg-surface-container-low/30">
              {QUICK_REPLIES.map((qr, i) => (
                <button
                  key={i}
                  onClick={() => setInput(qr.text)}
                  className="flex-shrink-0 flex items-center gap-1.5 bg-white hover:bg-surface-container-low border border-outline-variant/20 text-on-surface-variant text-xs font-medium px-3 py-2 rounded-full transition-all hover:border-secondary hover:text-secondary shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">{qr.icon}</span>
                  <span className="max-w-[120px] truncate">{qr.text.slice(0, 20)}…</span>
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="px-6 py-5 border-t border-surface-container-low flex-shrink-0">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative bg-surface-container rounded-2xl border border-outline-variant/20 focus-within:border-secondary/50 focus-within:ring-2 focus-within:ring-secondary/10 transition-all">
                  <textarea
                    value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                    placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
                    rows={1}
                    className="w-full resize-none bg-transparent px-5 py-3.5 text-sm text-on-surface outline-none placeholder:text-outline/60 max-h-36"
                    style={{ lineHeight: '1.5' }}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-container text-white rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/30 hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                  {sending ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-20 h-20 bg-secondary-fixed rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-4xl text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
            </div>
            <h4 className="font-manrope font-bold text-xl text-primary mb-2">Select a Conversation</h4>
            <p className="text-on-surface-variant text-sm">Choose a customer chat from the left panel to start responding.</p>
          </div>
        )}
      </div>

      {/* Right: Automation Panel */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-6">
        {/* Customer Info */}
        {selected && (
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_20px_40px_rgba(0,36,81,0.06)]">
            <div className="flex flex-col items-center text-center mb-4">
              <Avatar name={selected.customerName} src={selected.customerAvatar} online={selected.online} size={16} />
              <h5 className="font-manrope font-bold text-primary mt-3">{selected.customerName}</h5>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full mt-1 ${selected.category === 'vip' ? 'bg-on-tertiary-container/10 text-on-tertiary-container' : selected.category === 'support' ? 'bg-error-container text-error' : 'bg-secondary-fixed text-secondary'}`}>
                {selected.category.toUpperCase()}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-surface-container">
                <span className="text-xs text-on-surface-variant">Messages in thread</span>
                <span className="font-bold text-primary text-sm">{selected.messages.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-surface-container">
                <span className="text-xs text-on-surface-variant">Last active</span>
                <span className="font-bold text-primary text-sm">{formatTime(selected.lastMessageTime)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-xs text-on-surface-variant">Online now</span>
                <span className={`font-bold text-sm ${selected.online ? 'text-emerald-600' : 'text-on-surface-variant'}`}>{selected.online ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Automation */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_20px_40px_rgba(0,36,81,0.06)] flex-1">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-secondary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            <h5 className="font-manrope font-bold text-primary">Automation</h5>
          </div>
          <div className="space-y-5">
            {[
              { key: 'smartAutoReply' as const, label: 'Smart Auto-Reply', desc: 'AI suggests responses based on context', icon: 'psychology' },
              { key: 'loyaltyAlert' as const, label: 'Loyalty Alerts', desc: 'Notify when points thresholds are reached', icon: 'notifications_active' },
            ].map(setting => (
              <div key={setting.key} className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${automationSettings[setting.key] ? 'bg-secondary/10 text-secondary' : 'bg-surface-container text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined text-xl" style={automationSettings[setting.key] ? { fontVariationSettings: "'FILL' 1" } : {}}>{setting.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-primary">{setting.label}</p>
                    <button
                      onClick={() => toggleAutomation(setting.key)}
                      className={`relative w-10 h-5 rounded-full transition-all ${automationSettings[setting.key] ? 'bg-secondary' : 'bg-surface-container-high'} flex-shrink-0`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${automationSettings[setting.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  <p className="text-[10px] text-on-surface-variant mt-0.5 leading-relaxed">{setting.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-surface-container">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">Broadcast</p>
            <button className="w-full py-3 bg-primary text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
              Send Promotion
            </button>
            <p className="text-[10px] text-on-surface-variant text-center mt-2">Sends to all {conversations.length} active contacts</p>
          </div>
        </div>
      </div>
    </div>
  );
}
