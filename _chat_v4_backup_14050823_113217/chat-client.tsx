'use client';

import { useState, useEffect, useRef, useMemo, Fragment } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Loader2, Send, ShieldCheck, X, ImagePlus, Clock,
  ArrowDown, Lock, Sparkles, MessageCircle, Check, CheckCheck,
  Search, Smile, Copy, Volume2, VolumeX, ChevronLeft
} from 'lucide-react';
import { toast } from 'sonner';

const STATUS: Record<string, { label: string; cls: string; dot: string; bar: string }> = {
  open: { label: 'باز', cls: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', bar: 'from-blue-500 to-blue-600' },
  answered: { label: 'پاسخ داده شده', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', bar: 'from-emerald-500 to-emerald-600' },
  closed: { label: 'بسته', cls: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400', bar: 'from-gray-400 to-gray-500' },
};

const EMOJIS = ['😀','😂','❤️','👍','🙏','🔥','✨','🎉','😍','😊','🤔','😢','💯','👌','🙌','💖'];

function formatDateLabel(d: Date | string) {
  const date = new Date(d);
  const today = new Date();
  const yest = new Date(); yest.setDate(yest.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'امروز';
  if (date.toDateString() === yest.toDateString()) return 'دیروز';
  return date.toLocaleDateString('fa-IR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function formatTime(d: Date | string) {
  return new Date(d).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
}

function playBeep() {
  try {
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.25);
  } catch {}
}

function renderText(text: string, query: string) {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline font-bold hover:opacity-80 break-all">
          {part}
        </a>
      );
    }
    if (query) {
      const segments = part.split(new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'));
      return (
        <Fragment key={i}>
          {segments.map((s, j) =>
            s.toLowerCase() === query.toLowerCase()
              ? <mark key={j} className="bg-yellow-300/70 rounded px-0.5">{s}</mark>
              : <Fragment key={j}>{s}</Fragment>
          )}
        </Fragment>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
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
  const [showEmoji, setShowEmoji] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [soundOn, setSoundOn] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('chat-sound') !== 'off';
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const seenIds = useRef<Set<string>>(new Set(initialMessages.map(m => m.id)));
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
    const newMsgs = messages.filter(m => !seenIds.current.has(m.id));
    if (newMsgs.length > 0) {
      const hasIncoming = newMsgs.some(m => m.senderType === 'admin');
      if (hasIncoming && soundOn) playBeep();
      newMsgs.forEach(m => seenIds.current.add(m.id));
    }
  }, [messages, soundOn]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [signature]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 128) + 'px';
  }, [newMessage]);

  useEffect(() => {
    localStorage.setItem('chat-sound', soundOn ? 'on' : 'off');
  }, [soundOn]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 120);
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('حجم حداکثر ۵ مگابایت'); return; }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
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
        setNewMessage(''); setAttachmentUrl(null); setShowEmoji(false);
        const refresh = await fetch('/api/support/tickets/' + ticket.id, { cache: 'no-store' });
        const data = await refresh.json();
        if (data.success) { setMessages(data.messages); setStatus(data.ticket.status); }
      } else { const d = await res.json(); toast.error(d.message || 'خطا'); }
    } catch { toast.error('خطا در ارسال'); }
    finally { setSending(false); }
  };

  const copyMsg = (text: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success('کپی شد')).catch(() => toast.error('خطا'));
  };

  const insertEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    textareaRef.current?.focus();
  };

  const statusInfo = STATUS[status] || STATUS.open;

  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const q = searchQuery.toLowerCase();
    return messages.filter(m => (m.message || '').toLowerCase().includes(q));
  }, [messages, searchQuery]);

  const grouped = useMemo(() => {
    const groups: { label: string; messages: any[] }[] = [];
    let currentLabel = '';
    for (const m of filteredMessages) {
      const label = formatDateLabel(m.createdAt);
      if (label !== currentLabel) { groups.push({ label, messages: [m] }); currentLabel = label; }
      else groups[groups.length - 1].messages.push(m);
    }
    return groups;
  }, [filteredMessages]);

  return (
    <div className="relative flex flex-col h-[calc(100dvh-160px)] md:h-[calc(100dvh-120px)] bg-[#fafafc] rounded-[2rem] border border-[#e9e5eb] shadow-2xl shadow-[#c61d70]/10 overflow-hidden">
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#c61d70]/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#c61d70]/5 blur-3xl" />

      {/* HEADER */}
      <div className="relative shrink-0 border-b border-[#f2d7e5] bg-gradient-to-br from-[#fff0f7] via-[#fce5f0] to-white">
        <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#c61d70]/10 blur-2xl" />
        <div className="relative px-3 md:px-5 py-3 md:py-4 flex items-center gap-3">
          <Link href="/account/support" className="p-2.5 rounded-2xl bg-white/80 backdrop-blur text-[#77717b] hover:bg-white hover:text-[#c61d70] transition-all shadow-sm shrink-0" aria-label="بازگشت">
            <ArrowRight size={18} />
          </Link>
          <div className="relative shrink-0">
            <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-[#c61d70] to-[#e84e9e] flex items-center justify-center text-white shadow-lg shadow-[#c61d70]/30 ring-2 ring-white">
              <MessageCircle size={22} />
            </div>
            <span className={'absolute -bottom-0.5 -left-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-white ' + statusInfo.dot + ' animate-pulse'} />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm md:text-base font-black text-[#28242b] truncate leading-tight">{ticket.subject}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold ' + statusInfo.cls}>
                <span className={'h-1 w-1 rounded-full ' + statusInfo.dot} />{statusInfo.label}
              </span>
              <span className="text-[9px] text-[#918a95] font-mono" dir="ltr">#{String(ticket.id).slice(0, 8)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => { setSearchMode(!searchMode); setSearchQuery(''); }} className={'p-2 rounded-xl transition-all ' + (searchMode ? 'bg-[#c61d70] text-white shadow-md' : 'bg-white/70 text-[#77717b] hover:bg-white hover:text-[#c61d70]')} aria-label="جستجو">
              <Search size={16} />
            </button>
            <button onClick={() => setSoundOn(!soundOn)} className="p-2 rounded-xl bg-white/70 text-[#77717b] hover:bg-white hover:text-[#c61d70] transition-all" aria-label="صدا">
              {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
          </div>
        </div>
        {searchMode && (
          <div className="relative px-3 md:px-5 pb-3 animate-in slide-in-from-top-2">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95]" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در پیام‌ها..."
                className="w-full pr-10 pl-10 py-2.5 bg-white border-2 border-[#e9e5eb] rounded-xl text-xs outline-none focus:border-[#c61d70] transition-all"
              />
              {searchQuery && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#c61d70]">
                  {filteredMessages.length.toLocaleString('fa-IR')} یافت
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MESSAGES */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="chat-scroll flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 md:px-6 py-4 md:py-6 relative"
      >
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="relative mb-5">
              <div className="absolute inset-0 rounded-full bg-[#fff0f7] animate-ping" style={{ animationDuration: '2.5s' }} />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#c61d70] to-[#e84e9e] flex items-center justify-center shadow-xl shadow-[#c61d70]/30">
                <Sparkles size={36} className="text-white" />
              </div>
            </div>
            <h3 className="text-lg font-black text-[#28242b] mb-2">{searchQuery ? 'پیامی پیدا نشد' : 'گفتگو رو شروع کن'}</h3>
            <p className="text-sm text-[#77717b] max-w-xs leading-relaxed">{searchQuery ? 'عبارت جستجو رو تغییر بده.' : 'اولین پیامت رو بفرست تا تیم پشتیبانی پاسخ بده.'}</p>
          </div>
        ) : (
          grouped.map((group, gi) => (
            <div key={gi}>
              <div className="sticky top-0 z-10 -mx-3 md:-mx-6 px-3 md:px-6 py-2 bg-[#fafafc]/95 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#e9e5eb] to-transparent" />
                  <span className="shrink-0 px-3 py-1 rounded-full bg-white border border-[#e9e5eb] text-[10px] font-bold text-[#77717b] shadow-sm">{group.label}</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#e9e5eb] to-transparent" />
                </div>
              </div>
              {group.messages.map((msg, mi) => {
                const isAdmin = msg.senderType === 'admin';
                const prevMsg = group.messages[mi - 1];
                const showAvatar = !prevMsg || prevMsg.senderType !== msg.senderType;
                const isOwn = !isAdmin;
                return (
                  <div
                    key={msg.id}
                    className={'group flex gap-2 mt-1.5 ' + (isAdmin ? 'flex-row' : 'flex-row-reverse') + ' animate-in fade-in slide-in-from-bottom-2 duration-300'}
                    style={{ animationDelay: (mi * 30) + 'ms' }}
                  >
                    <div className={'shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-md ' + (isAdmin ? 'bg-gradient-to-br from-[#c61d70] to-[#e84e9e] ring-2 ring-white' : 'bg-gradient-to-br from-[#28242b] to-[#5a535e]') + (showAvatar ? '' : ' opacity-0')}>
                      {isAdmin ? <ShieldCheck size={14} /> : currentUserName.charAt(0)}
                    </div>
                    <div className={'max-w-[78%] md:max-w-[70%] flex flex-col ' + (isAdmin ? 'items-start' : 'items-end')}>
                      {showAvatar && (
                        <span className="text-[9px] font-bold text-[#918a95] mb-1 px-1">
                          {isAdmin ? 'تیم پشتیبانی' : 'شما'}
                        </span>
                      )}
                      <div className={'relative rounded-2xl overflow-hidden text-[13px] md:text-sm leading-relaxed shadow-sm ' + (isAdmin ? 'bg-white border border-[#e9e5eb] text-[#28242b] rounded-tr-sm' : 'bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-white rounded-tl-sm shadow-[#c61d70]/25')}>
                        {msg.attachmentUrl && (
                          <button onClick={() => setLightbox(msg.attachmentUrl)} className="block w-full max-w-[260px] cursor-zoom-in hover:opacity-95 transition-opacity">
                            <img src={msg.attachmentUrl} alt="پیوست" className="w-full h-auto object-cover" loading="lazy" />
                          </button>
                        )}
                        {msg.message && msg.message !== 'عکس ارسال شد' && (
                          <div className="px-4 py-2.5 whitespace-pre-wrap break-words">
                            {renderText(msg.message, searchMode ? searchQuery : '')}
                          </div>
                        )}
                      </div>
                      <div className={'flex items-center gap-1.5 mt-1 px-1 ' + (isAdmin ? '' : 'flex-row-reverse')}>
                        <span className="text-[9px] text-[#918a95] flex items-center gap-1">
                          <Clock size={9} /> {formatTime(msg.createdAt)}
                        </span>
                        {msg.message && msg.message !== 'عکس ارسال شد' && (
                          <button onClick={() => copyMsg(msg.message)} className="opacity-0 group-hover:opacity-100 max-md:opacity-40 text-[#918a95] hover:text-[#c61d70] transition-all" aria-label="کپی">
                            <Copy size={10} />
                          </button>
                        )}
                        {isOwn && (
                          <span className={'flex items-center ' + (msg.isRead ? 'text-blue-500' : 'text-[#918a95]')}>
                            {msg.isRead ? <CheckCheck size={12} /> : <Check size={12} />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>

      {showScrollBtn && (
        <button onClick={scrollToBottom} className="absolute bottom-24 left-4 md:bottom-28 md:left-6 z-20 w-10 h-10 rounded-full bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-white shadow-xl shadow-[#c61d70]/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-2" aria-label="پرش به آخر">
          <ArrowDown size={18} />
        </button>
      )}

      {/* COMPOSER */}
      <div className="shrink-0 border-t border-[#e9e5eb] bg-white/95 backdrop-blur-xl p-3 md:p-4" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        {status === 'closed' ? (
          <div className="text-center py-3">
            <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 text-xs font-bold text-amber-700 shadow-sm">
              <Lock size={14} /> این تیکت بسته شده
            </div>
            <Link href="/account/support" className="block mt-3 text-xs font-black text-[#c61d70] hover:underline">
              ایجاد تیکت جدید ←
            </Link>
          </div>
        ) : (
          <div>
            {attachmentUrl && (
              <div className="mb-3 relative inline-block group">
                <img src={attachmentUrl} alt="پیش‌نمایش" className="h-20 w-auto rounded-xl border-2 border-[#f2d7e5] shadow-sm" />
                <button onClick={() => setAttachmentUrl(null)} className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 shadow-md transition-colors" aria-label="حذف عکس">
                  <X size={12} />
                </button>
              </div>
            )}
            {showEmoji && (
              <div className="mb-2 p-2 rounded-2xl bg-white border border-[#e9e5eb] shadow-lg animate-in slide-in-from-bottom-2 flex flex-wrap gap-1 max-w-md">
                {EMOJIS.map((e, i) => (
                  <button key={i} onClick={() => insertEmoji(e)} className="w-9 h-9 rounded-xl hover:bg-[#fff0f7] text-xl transition-colors">{e}</button>
                ))}
              </div>
            )}
            <div className="flex items-end gap-2">
              <div className="flex-1 flex items-end bg-[#f8f7fa] border-2 border-[#e9e5eb] rounded-2xl focus-within:border-[#c61d70] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#c61d70]/10 transition-all overflow-hidden">
                <button onClick={() => setShowEmoji(!showEmoji)} className={'p-3 transition-colors shrink-0 ' + (showEmoji ? 'text-[#c61d70]' : 'text-[#918a95] hover:text-[#c61d70]')} aria-label="ایموجی">
                  <Smile size={20} />
                </button>
                <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="p-3 text-[#918a95] hover:text-[#c61d70] transition-colors shrink-0 disabled:opacity-50" aria-label="پیوست">
                  {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                <textarea
                  ref={textareaRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="پیام خود را بنویسید..."
                  rows={1}
                  className="flex-1 py-3 px-1 bg-transparent text-sm outline-none resize-none max-h-32 chat-scroll-hide"
                  style={{ minHeight: '48px' }}
                  maxLength={2000}
                />
              </div>
              <button onClick={handleSend} disabled={sending || (newMessage.trim().length === 0 && !attachmentUrl)} className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-white flex items-center justify-center shadow-lg shadow-[#c61d70]/30 hover:shadow-xl hover:shadow-[#c61d70]/40 hover:-translate-y-0.5 disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0 transition-all" aria-label="ارسال">
                {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        )}
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors" aria-label="بستن">
            <X size={20} />
          </button>
          <img src={lightbox} alt="پیوست" className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}