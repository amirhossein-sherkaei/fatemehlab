'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Loader2, Send, ShieldCheck, X, ImagePlus, Clock,
  ArrowDown, Lock, Sparkles, MessageCircle, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const STATUS: Record<string, { label: string; cls: string; dot: string }> = {
  open: { label: 'باز', cls: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  answered: { label: 'پاسخ داده شده', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  closed: { label: 'بسته', cls: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
};

function formatDateLabel(d: Date | string) {
  const date = new Date(d);
  const today = new Date();
  const yest = new Date();
  yest.setDate(yest.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'امروز';
  if (date.toDateString() === yest.toDateString()) return 'دیروز';
  return date.toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(d: Date | string) {
  return new Date(d).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatClient({ ticket, initialMessages, currentUserName }: { ticket: any; initialMessages: any[]; currentUserName: string }) {
  const [messages, setMessages] = useState<any[]>(initialMessages);
  const [status, setStatus] = useState<string>(ticket.status);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const messageCount = messages.length;
  const signature = useMemo(() => messages.map(m => m.id).join('|'), [messages]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/support/tickets/' + ticket.id, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && Array.isArray(data.messages) && data.messages.length !== messageCount) {
          setMessages(data.messages);
          setStatus(data.ticket.status);
        }
      } catch {}
    }, 4000);
    return () => clearInterval(interval);
  }, [ticket.id, messageCount]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [signature]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    setShowScrollBtn(!near);
  };

  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('حجم حداکثر ۵ مگابایت'); return; }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/support/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok && data.url) { setAttachmentUrl(data.url); toast.success('عکس پیوست شد'); }
      else toast.error(data.message || 'خطا');
    } catch { toast.error('خطا در آپلود'); }
    finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const handleSend = async () => {
    if ((newMessage.trim().length === 0 && !attachmentUrl) || sending) return;
    setSending(true);
    try {
      const res = await fetch('/api/support/tickets/' + ticket.id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage.trim() || 'عکس ارسال شد', attachmentUrl }),
      });
      if (res.ok) {
        setNewMessage(''); setAttachmentUrl(null);
        const refresh = await fetch('/api/support/tickets/' + ticket.id, { cache: 'no-store' });
        const data = await refresh.json();
        if (data.success) { setMessages(data.messages); setStatus(data.ticket.status); }
      } else { const data = await res.json(); toast.error(data.message || 'خطا'); }
    } catch { toast.error('خطا در ارسال'); }
    finally { setSending(false); }
  };

  const statusInfo = STATUS[status] || STATUS.open;

  const grouped = useMemo(() => {
    const groups: { label: string; messages: any[] }[] = [];
    let currentLabel = '';
    for (const m of messages) {
      const label = formatDateLabel(m.createdAt);
      if (label !== currentLabel) {
        groups.push({ label, messages: [m] });
        currentLabel = label;
      } else {
        groups[groups.length - 1].messages.push(m);
      }
    }
    return groups;
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100dvh-160px)] md:h-[calc(100dvh-120px)] bg-gradient-to-b from-[#fafafc] to-[#f8f7fa] rounded-[2rem] border border-[#e9e5eb] shadow-xl shadow-[#c61d70]/5 overflow-hidden relative">

      {/* ========= HEADER ========= */}
      <div className="shrink-0 relative overflow-hidden border-b border-[#f2d7e5] bg-gradient-to-br from-[#fff0f7] via-[#fce5f0] to-white">
        <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#c61d70]/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[#c61d70]/10 blur-2xl" />
        <div className="relative px-3 md:px-5 py-3 md:py-4 flex items-center gap-3">
          <Link href="/account/support" className="p-2.5 rounded-2xl bg-white/80 backdrop-blur text-[#77717b] hover:bg-white hover:text-[#c61d70] transition-all shadow-sm shrink-0" aria-label="بازگشت">
            <ArrowRight size={18} />
          </Link>
          <div className="relative shrink-0">
            <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-br from-[#c61d70] to-[#e84e9e] flex items-center justify-center text-white shadow-lg shadow-[#c61d70]/30">
              <MessageCircle size={20} />
            </div>
            <span className={'absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full ring-2 ring-white ' + statusInfo.dot} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm md:text-base font-black text-[#28242b] truncate leading-tight">{ticket.subject}</h1>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className={'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold ' + statusInfo.cls}>
                <span className={'h-1 w-1 rounded-full ' + statusInfo.dot} />{statusInfo.label}
              </span>
              <span className="text-[9px] text-[#918a95] font-mono" dir="ltr">#{String(ticket.id).slice(0, 8)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========= MESSAGES ========= */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 md:px-6 py-4 md:py-6 space-y-1 relative"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(198,29,112,0.03) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(198,29,112,0.03) 0%, transparent 40%)' }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="relative mb-5">
              <div className="absolute inset-0 rounded-full bg-[#fff0f7] animate-ping" style={{ animationDuration: '2.5s' }} />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#c61d70] to-[#e84e9e] flex items-center justify-center shadow-xl shadow-[#c61d70]/30">
                <Sparkles size={36} className="text-white" />
              </div>
            </div>
            <h3 className="text-lg font-black text-[#28242b] mb-2">گفتگو رو شروع کن</h3>
            <p className="text-sm text-[#77717b] max-w-xs leading-relaxed">اولین پیامت رو بفرست تا تیم پشتیبانی پاسخ بده.</p>
          </div>
        ) : (
          grouped.map((group, gi) => (
            <div key={gi}>
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#e9e5eb] to-transparent" />
                <span className="shrink-0 px-3 py-1 rounded-full bg-white border border-[#e9e5eb] text-[10px] font-bold text-[#77717b] shadow-sm">
                  {group.label}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#e9e5eb] to-transparent" />
              </div>
              {group.messages.map((msg, mi) => {
                const isAdmin = msg.senderType === 'admin';
                const prevMsg = group.messages[mi - 1];
                const showAvatar = !prevMsg || prevMsg.senderType !== msg.senderType;
                return (
                  <div
                    key={msg.id}
                    className={'flex gap-2 mt-1 ' + (isAdmin ? 'flex-row' : 'flex-row-reverse') + ' animate-in fade-in slide-in-from-bottom-2 duration-300'}
                    style={{ animationDelay: (mi * 30) + 'ms' }}
                  >
                    <div className={'shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-md ' + (isAdmin ? 'bg-gradient-to-br from-[#c61d70] to-[#e84e9e]' : 'bg-gradient-to-br from-[#28242b] to-[#5a535e]') + (showAvatar ? '' : ' opacity-0')}>
                      {isAdmin ? <ShieldCheck size={14} /> : currentUserName.charAt(0)}
                    </div>
                    <div className={'max-w-[78%] md:max-w-[70%] flex flex-col ' + (isAdmin ? 'items-start' : 'items-end')}>
                      {showAvatar && (
                        <span className="text-[9px] font-bold text-[#918a95] mb-1 px-1">
                          {isAdmin ? 'تیم پشتیبانی' : 'شما'}
                        </span>
                      )}
                      <div className={'relative rounded-2xl overflow-hidden text-[13px] md:text-sm leading-relaxed shadow-sm ' + (isAdmin ? 'bg-white border border-[#e9e5eb] text-[#28242b] rounded-tr-sm' : 'bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-white rounded-tl-sm shadow-[#c61d70]/20')}>
                        {msg.attachmentUrl && (
                          <button
                            onClick={() => setLightbox(msg.attachmentUrl)}
                            className="block w-full max-w-[260px] cursor-zoom-in hover:opacity-95 transition-opacity"
                          >
                            <img src={msg.attachmentUrl} alt="پیوست" className="w-full h-auto object-cover" loading="lazy" />
                          </button>
                        )}
                        {msg.message && msg.message !== 'عکس ارسال شد' && (
                          <div className="px-4 py-2.5 whitespace-pre-wrap break-words">{msg.message}</div>
                        )}
                      </div>
                      <span className={'text-[9px] text-[#918a95] mt-1 px-1 flex items-center gap-1 ' + (isAdmin ? '' : '')}>
                        <Clock size={9} /> {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Scroll to bottom FAB */}
      {showScrollBtn && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 left-4 md:bottom-28 md:left-6 z-20 w-10 h-10 rounded-full bg-[#c61d70] text-white shadow-xl shadow-[#c61d70]/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-2"
          aria-label="پرش به آخر"
        >
          <ArrowDown size={18} />
        </button>
      )}

      {/* ========= COMPOSER ========= */}
      <div className="shrink-0 border-t border-[#e9e5eb] bg-white/95 backdrop-blur-xl p-3 md:p-4" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        {status === 'closed' ? (
          <div className="text-center py-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700">
              <Lock size={14} /> این تیکت بسته شده
            </div>
            <Link href="/account/support" className="block mt-3 text-xs font-bold text-[#c61d70] hover:underline">
              ایجاد تیکت جدید ←
            </Link>
          </div>
        ) : (
          <div>
            {attachmentUrl && (
              <div className="mb-3 relative inline-block group">
                <img src={attachmentUrl} alt="پیش‌نمایش" className="h-20 w-auto rounded-xl border-2 border-[#f2d7e5] shadow-sm" />
                <button
                  onClick={() => setAttachmentUrl(null)}
                  className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 shadow-md transition-colors"
                  aria-label="حذف عکس"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            <div className="flex items-end gap-2">
              <div className="flex-1 flex items-end bg-[#f8f7fa] border-2 border-[#e9e5eb] rounded-2xl focus-within:border-[#c61d70] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#c61d70]/10 transition-all overflow-hidden">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="p-3 text-[#918a95] hover:text-[#c61d70] transition-colors shrink-0 disabled:opacity-50"
                  aria-label="پیوست عکس"
                >
                  {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="پیام خود را بنویسید..."
                  rows={1}
                  className="flex-1 py-3 px-1 bg-transparent text-sm outline-none resize-none max-h-32 scrollbar-hide"
                  style={{ minHeight: '48px' }}
                  maxLength={2000}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={sending || (newMessage.trim().length === 0 && !attachmentUrl)}
                className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-white flex items-center justify-center shadow-lg shadow-[#c61d70]/30 hover:shadow-xl hover:shadow-[#c61d70]/40 hover:-translate-y-0.5 disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0 transition-all"
                aria-label="ارسال"
              >
                {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========= LIGHTBOX ========= */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            aria-label="بستن"
          >
            <X size={20} />
          </button>
          <img
            src={lightbox}
            alt="پیوست"
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}