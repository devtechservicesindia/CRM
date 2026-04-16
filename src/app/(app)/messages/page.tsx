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
    <div className={`relative flex-shrink-0`} style={{ width: `${size * 4}px`, height: `${size * 4}px` }}>
      <div className="w-full h-full rounded-full bg-[#e8f5ee] flex items-center justify-center overflow-hidden">
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-manrope font-black text-[#1a5c38] text-sm">{name[0]}</span>
        )}
      </div>
      {online !== undefined && (
        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${online ? 'bg-emerald-500 shadow-[0_0_6px_#10b981]' : 'bg-gray-300'}`} />
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

  const CATEGORY_BADGE: Record<string, string> = {
    vip: 'bg-amber-50 text-amber-700 border border-amber-200',
    support: 'bg-red-50 text-red-600 border border-red-200',
    general: 'bg-gray-100 text-gray-500 border border-gray-200',
  };

  return (
    <div className="flex gap-5 h-[calc(100vh-8rem)]">

      {/* ────────────── Left: Conversation List ────────────── */}
      <div className="w-72 flex-shrink-0 bg-white border border-gray-100 rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-manrope font-black text-gray-900 text-base">Messages</h4>
            {unreadCount > 0 && (
              <span className="bg-[#1a5c38] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">{unreadCount} new</span>
            )}
          </div>
          {/* Filter tabs */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {(['all', 'unread', 'vip', 'support'] as FilterCategory[]).map(f => (
              <button
                key={f} onClick={() => setFilter(f)}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all capitalize ${filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-gray-50">
          {isLoadingConversations ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-6 h-6 border-4 border-[#1a5c38]/20 border-t-[#1a5c38] rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 p-6 text-center">
              <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">mail_off</span>
              <p className="text-sm text-gray-400">No conversations here.</p>
            </div>
          ) : filtered.map(conv => {
            const isActive = conv.id === selectedConversationId;
            return (
              <button
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className={`w-full text-left px-4 py-4 flex gap-3 items-start transition-all hover:bg-gray-50 ${isActive ? 'bg-[#e8f5ee] border-l-4 border-[#1a5c38]' : ''}`}
              >
                <Avatar name={conv.customerName} src={conv.customerAvatar} online={conv.online} size={10} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className={`font-manrope text-sm truncate ${isActive ? 'font-black text-[#1a5c38]' : 'font-semibold text-gray-800'}`}>{conv.customerName}</p>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">{formatTime(conv.lastMessageTime)}</span>
                  </div>
                  <p className={`text-xs truncate ${conv.unread ? 'text-gray-800 font-semibold' : 'text-gray-400'}`}>{conv.lastMessage}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${CATEGORY_BADGE[conv.category]}`}>
                      {conv.category.toUpperCase()}
                    </span>
                    {conv.unread && <span className="w-2 h-2 bg-[#1a5c38] rounded-full ml-auto flex-shrink-0" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ────────────── Middle: Chat View ────────────── */}
      <div className="flex-1 flex flex-col bg-white border border-gray-100 rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] overflow-hidden min-w-0">
        {selected ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <Avatar name={selected.customerName} src={selected.customerAvatar} online={selected.online} size={10} />
                <div>
                  <p className="font-manrope font-black text-gray-900">{selected.customerName}</p>
                  <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                    {selected.online ? (
                      <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Online now</span>
                    ) : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {selected.category === 'vip' && (
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase tracking-widest rounded-lg">VIP Player</span>
                )}
                <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-all text-gray-400">
                  <span className="material-symbols-outlined text-xl">more_vert</span>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-5 bg-gray-50/50">
              {selected.messages.map((msg, i) => {
                const isFirst = i === 0 || selected.messages[i - 1].isFromCustomer !== msg.isFromCustomer;
                return (
                  <div key={msg.id} className={`flex gap-3 ${msg.isFromCustomer ? 'justify-start' : 'justify-end'} ${!isFirst ? (msg.isFromCustomer ? 'pl-[52px]' : 'pr-0') : ''}`}>
                    {msg.isFromCustomer && isFirst && (
                      <Avatar name={selected.customerName} src={selected.customerAvatar} size={9} />
                    )}
                    <div className={`max-w-[68%] flex flex-col gap-1 ${!msg.isFromCustomer ? 'items-end' : 'items-start'}`}>
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.isFromCustomer
                          ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                          : 'bg-[#1a5c38] text-white rounded-tr-sm shadow-md shadow-[#1a5c38]/20'
                      }`}>
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-gray-400 px-1">{formatMsgTime(msg.sentAt)}</span>
                    </div>
                    {!msg.isFromCustomer && isFirst && (
                      <div className="w-8 h-8 rounded-full bg-[#1a5c38] flex items-center justify-center text-white font-black font-manrope text-xs flex-shrink-0 shadow-sm shadow-[#1a5c38]/30">A</div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-5 py-3 border-t border-gray-100 flex gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
              {QUICK_REPLIES.map((qr, i) => (
                <button
                  key={i}
                  onClick={() => setInput(qr.text)}
                  className="flex-shrink-0 flex items-center gap-1.5 bg-gray-50 hover:bg-[#e8f5ee] border border-gray-200 hover:border-[#1a5c38]/30 text-gray-500 hover:text-[#1a5c38] text-xs font-medium px-3 py-2 rounded-full transition-all"
                >
                  <span className="material-symbols-outlined text-sm">{qr.icon}</span>
                  <span className="max-w-[110px] truncate">{qr.text.slice(0, 22)}…</span>
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
              <div className="flex gap-3 items-end">
                <div className="flex-1 relative bg-gray-50 border border-gray-200 rounded-2xl focus-within:border-[#1a5c38]/40 focus-within:ring-2 focus-within:ring-[#1a5c38]/10 transition-all">
                  <textarea
                    value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                    placeholder="Type a message… (Enter to send)"
                    rows={1}
                    className="w-full resize-none bg-transparent px-5 py-3.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 max-h-36"
                    style={{ lineHeight: '1.5' }}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className="w-11 h-11 bg-[#1a5c38] hover:bg-[#22753f] text-white rounded-xl flex items-center justify-center shadow-md shadow-[#1a5c38]/25 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
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
            <div className="w-20 h-20 bg-[#e8f5ee] rounded-2xl flex items-center justify-center mb-5">
              <span className="material-symbols-outlined text-4xl text-[#1a5c38]" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
            </div>
            <h4 className="font-manrope font-black text-gray-900 text-xl mb-2">Select a Conversation</h4>
            <p className="text-gray-400 text-sm">Choose a customer chat from the left panel to start responding.</p>
          </div>
        )}
      </div>

      {/* ────────────── Right: Info + Automation ────────────── */}
      <div className="w-64 flex-shrink-0 flex flex-col gap-4">

        {/* Customer Info */}
        {selected && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-5">
            <div className="flex flex-col items-center text-center mb-4">
              <Avatar name={selected.customerName} src={selected.customerAvatar} online={selected.online} size={14} />
              <h5 className="font-manrope font-black text-gray-900 mt-3 text-sm">{selected.customerName}</h5>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full mt-1.5 ${CATEGORY_BADGE[selected.category]}`}>
                {selected.category.toUpperCase()}
              </span>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Messages', val: selected.messages.length },
                { label: 'Last active', val: formatTime(selected.lastMessageTime) },
                { label: 'Online', val: selected.online ? 'Yes' : 'No', green: selected.online },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-400">{r.label}</span>
                  <span className={`font-bold text-sm ${r.green ? 'text-emerald-600' : 'text-gray-800'}`}>{r.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Automation */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)] p-5 flex-1">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-[#e8f5ee] rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-[#1a5c38] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            </div>
            <h5 className="font-manrope font-black text-gray-900 text-sm">Automation</h5>
          </div>

          <div className="space-y-4">
            {[
              { key: 'smartAutoReply' as const, label: 'Smart Auto-Reply', desc: 'AI suggests responses based on context', icon: 'psychology' },
              { key: 'loyaltyAlert' as const, label: 'Loyalty Alerts', desc: 'Notify when points thresholds are reached', icon: 'notifications_active' },
            ].map(setting => (
              <div key={setting.key} className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${automationSettings[setting.key] ? 'bg-[#e8f5ee] text-[#1a5c38]' : 'bg-gray-100 text-gray-400'}`}>
                  <span className="material-symbols-outlined text-[18px]" style={automationSettings[setting.key] ? { fontVariationSettings: "'FILL' 1" } : {}}>{setting.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-gray-800">{setting.label}</p>
                    <button
                      onClick={() => toggleAutomation(setting.key)}
                      className={`relative w-9 h-5 rounded-full transition-all flex-shrink-0 ${automationSettings[setting.key] ? 'bg-[#1a5c38]' : 'bg-gray-200'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${automationSettings[setting.key] ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{setting.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Broadcast</p>
            <button className="w-full py-2.5 bg-[#1a5c38] hover:bg-[#22753f] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md shadow-[#1a5c38]/20">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
              Send Promotion
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-2">Sends to all {conversations.length} active contacts</p>
          </div>
        </div>
      </div>
    </div>
  );
}
