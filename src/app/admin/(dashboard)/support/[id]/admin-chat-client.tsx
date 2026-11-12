'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2, Send, ShieldCheck, X, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';

const STATUS: Record<string, { label: string; cls: string }> = {
  open: { label: 'باز', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  answered: { label: 'پاسخ داده شده', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  closed: { label: 'بسته', cls: 'bg-gray-50 text-gray-600 border-gray-200' },
};

export default function AdminChatClient({ ticket, customer, initialMessages }: { ticket: any; customer: { name: string; email: string }; initialMessages: any[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [status, setStatus] = useState(ticket.status);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/admin/support', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ticketId: ticket.id }) }).catch(() => {});
  }, [ticket.id]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/admin/support/${ticket.id}`);
        const data = await res.json();
        if (data.success && data.messages.length !== messages.length) {
          setMessages(data.messages); setStatus(data.ticket.status);
        }
      } catch {}
    }, 4000);
    return () => clearInterval(interval);
  }, [ticket.id, messages.length]);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('حجم حداکثر ۵ مگابایت'); return; }
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch('/api/support/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) { setAttachmentUrl(data.url); toast.success('عکس پیوست شد'); }
      else toast.error(data.message || 'خطا');
    } catch { toast.error('خطا در آپلود'); }
    finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const handleSend = async () => {
    if ((newMessage.trim().length === 0 && !attachmentUrl) || sending) return;
    setSending(true);
    try {
      const res = await fetch(`/api/admin/support/${ticket.id}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage.trim() || 'عکس ارسال شد', status: 'answered', attachmentUrl }),
      });
      if (res.ok) {
        setNewMessage(''); setAttachmentUrl(null); setStatus('answered');
        const refresh = await fetch(`/api/admin/support/${ticket.id}`);
        const data = await refresh.json();
        if (data.success) setMessages(data.messages);
        toast.success('پاسخ ارسال شد');
      } else { const data = await res.json(); toast.error(data.message || 'خطا'); }
    } catch { toast.error('خطا'); }
    finally { setSending(false); }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/support/${ticket.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) });
      if (res.ok) { setStatus(newStatus); toast.success('وضعیت به‌روزرسانی شد'); }
    } catch { toast.error('خطا'); }
  };

  const statusInfo = STATUS[status] || STATUS.open;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white/90 backdrop-blur-md rounded-3xl border border-[#e9e5eb] shadow-sm overflow-hidden">
      <div className="shrink-0 px-4 md:px-6 py-4 border-b border-[#e9e5eb] bg-gradient-to-br from-[#fff8fc] to-white">
        <div className="flex items-center gap-3 flex-wrap">
          <Link href="/admin/support" className="p-2 rounded-xl hover:bg-[#f8f7fa] text-[#77717b]"><ArrowRight size={18} /></Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm md:text-base font-black text-[#28242b] truncate">{ticket.subject}</h1>
            <div className="flex items-center gap-2 text-[10px] text-[#77717b] mt-1">
              <span className="font-bold">{customer.name}</span>
              <span>·</span>
              <span dir="ltr" className="truncate">{customer.email}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusInfo.cls}`}>{statusInfo.label}</span>
            <select value={status} onChange={(e) => updateStatus(e.target.value)} className="text-[10px] font-bold rounded-lg border border-[#e9e5eb] px-2 py-1.5 outline-none bg-white cursor-pointer">
              <option value="open">باز</option>
              <option value="answered">پاسخ داده</option>
              <option value="closed">بسته</option>
            </select>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4 bg-[#fafafc]">
        {messages.map((msg) => {
          const isAdmin = msg.senderType === 'admin';
          return (
            <div key={msg.id} className={`flex gap-2 ${isAdmin ? 'flex-row-reverse' : ''}`}>
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm ${isAdmin ? 'bg-gradient-to-br from-[#c61d70] to-[#e84e9e]' : 'bg-gradient-to-br from-[#28242b] to-[#5a535e]'}`}>
                {isAdmin ? <ShieldCheck size={14} /> : customer.name.charAt(0)}
              </div>
              <div className={`max-w-[75%] ${isAdmin ? 'items-end' : ''}`}>
                <div className="text-[10px] font-bold text-[#918a95] mb-1 px-1">{isAdmin ? 'شما (پشتیبانی)' : customer.name}</div>
                <div className={`rounded-2xl overflow-hidden text-sm leading-relaxed shadow-sm ${isAdmin ? 'bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-white rounded-tl-md' : 'bg-white border border-[#e9e5eb] text-[#28242b] rounded-tr-md'}`}>
                  {msg.attachmentUrl && (
                    <div className="relative w-full max-w-[250px]">
                      <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer">
                        <img src={msg.attachmentUrl} alt="پیوست" className="w-full h-auto object-cover" />
                      </a>
                    </div>
                  )}
                  <div className="px-4 py-2.5">{msg.message}</div>
                </div>
                <div className={`text-[9px] text-[#918a95] mt-1 px-1 ${isAdmin ? 'text-left' : ''}`}>
                  {new Date(msg.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="shrink-0 border-t border-[#e9e5eb] bg-white p-3 md:p-4">
        {status === 'closed' ? (
          <div className="text-center py-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600"><X size={14} /> تیکت بسته شده</div>
          </div>
        ) : (
          <div>
            {attachmentUrl && (
              <div className="mb-3 relative inline-block">
                <img src={attachmentUrl} alt="پیش‌نمایش" className="h-20 w-auto rounded-lg border border-[#e9e5eb]" />
                <button onClick={() => setAttachmentUrl(null)} className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-md"><X size={12} /></button>
              </div>
            )}
            <div className="flex items-end gap-2">
              <div className="flex-1 flex items-center bg-[#f8f7fa] border border-[#e9e5eb] rounded-2xl focus-within:border-[#c61d70] transition-all overflow-hidden">
                <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="p-3 text-[#918a95] hover:text-[#c61d70] shrink-0">
                  {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="پاسخ خود را بنویسید..." rows={1} className="flex-1 py-3 px-1 bg-transparent text-sm outline-none resize-none max-h-32" style={{ minHeight: '48px' }} maxLength={2000} />
              </div>
              <button onClick={handleSend} disabled={sending || (newMessage.trim().length === 0 && !attachmentUrl)} className="h-12 w-12 shrink-0 rounded-2xl bg-[#c61d70] text-white flex items-center justify-center shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] disabled:opacity-40 transition-all">
                {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}