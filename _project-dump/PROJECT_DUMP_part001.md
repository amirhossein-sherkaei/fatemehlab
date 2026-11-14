# PROJECT DUMP
Generated : 1405-08-23 18:36:20
Root      : C:\Users\AmirHossien\Desktop\fatemehlab
Mode      : source
Files     : 255

==========================================================================================
FILE [1/255] next.config.ts
SIZE 1048 bytes
==========================================================================================
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  compress: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: '*.vercel-storage.com' },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/36668862.txt',
          destination: '/36668862.txt',
        },
      ],
    };
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;


==========================================================================================
FILE [2/255] package.json
SIZE 1679 bytes
==========================================================================================
{
  "name": "fatemehlab",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "@tiptap/extension-color": "2.10.3",
    "@tiptap/extension-highlight": "2.10.3",
    "@tiptap/extension-image": "2.10.3",
    "@tiptap/extension-link": "2.10.3",
    "@tiptap/extension-text-align": "2.10.3",
    "@tiptap/extension-text-style": "2.10.3",
    "@tiptap/extension-underline": "2.10.3",
    "@tiptap/pm": "2.10.3",
    "@tiptap/react": "2.10.3",
    "@tiptap/starter-kit": "2.10.3",
    "@upstash/ratelimit": "^2.2.0",
    "@upstash/redis": "^1.41.0",
    "@vercel/blob": "^2.8.2",
    "argon2": "^0.45.2",
    "drizzle-orm": "^0.45.4",
    "jose": "^6.2.15",
    "lucide-react": "^1.70.0",
    "next": "16.4.5",
    "next-safe-action": "^8.7.3",
    "next-themes": "^0.4.6",
    "postgres": "^4.1.0",
    "react": "19.3.0",
    "react-barcode": "^1.6.1",
    "react-date-object": "^2.1.9",
    "react-dom": "19.3.0",
    "react-multi-date-picker": "^4.5.2",
    "recharts": "^3.10.1",
    "sms-typescript": "^2.0.3",
    "sonner": "^2.0.8",
    "zarinpal-node-sdk": "^2.2.0",
    "zod": "^4.6.7",
    "zustand": "^5.1.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.3.5",
    "@tailwindcss/turbopack": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "babel-plugin-react-compiler": "1.0.0",
    "dotenv": "^18.0.9",
    "drizzle-kit": "^0.31.11",
    "tailwindcss": "^4",
    "tsx": "^4.23.15",
    "typescript": "^5"
  },
  "packageManager": "pnpm@12.18.0"
}



==========================================================================================
FILE [3/255] postcss.config.mjs
SIZE 76 bytes
==========================================================================================
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};


==========================================================================================
FILE [4/255] tsconfig.json
SIZE 704 bytes
==========================================================================================
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}



==========================================================================================
FILE [5/255] _chat_backup_14050823_000401\admin-chat-client.tsx
SIZE 9871 bytes
==========================================================================================
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


==========================================================================================
FILE [6/255] _chat_backup_14050823_000401\chat-client.tsx
SIZE 8849 bytes
==========================================================================================
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

export default function ChatClient({ ticket, initialMessages, currentUserName }: { ticket: any; initialMessages: any[]; currentUserName: string }) {
  const [messages, setMessages] = useState(initialMessages);
  const [status, setStatus] = useState(ticket.status);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/support/tickets/${ticket.id}`);
        const data = await res.json();
        if (data.success && data.messages.length !== messages.length) {
          setMessages(data.messages);
          setStatus(data.ticket.status);
        }
      } catch {}
    }, 4000);
    return () => clearInterval(interval);
  }, [ticket.id, messages.length]);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
      const res = await fetch(`/api/support/tickets/${ticket.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage.trim() || 'عکس ارسال شد', attachmentUrl }),
      });
      if (res.ok) {
        setNewMessage(''); setAttachmentUrl(null);
        const refresh = await fetch(`/api/support/tickets/${ticket.id}`);
        const data = await refresh.json();
        if (data.success) { setMessages(data.messages); setStatus(data.ticket.status); }
      } else { const data = await res.json(); toast.error(data.message || 'خطا'); }
    } catch { toast.error('خطا در ارسال'); }
    finally { setSending(false); }
  };

  const statusInfo = STATUS[status] || STATUS.open;

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-120px)] bg-white/90 backdrop-blur-md rounded-3xl border border-[#e9e5eb] shadow-sm overflow-hidden">
      <div className="shrink-0 px-4 md:px-6 py-4 border-b border-[#e9e5eb] bg-gradient-to-br from-[#fff8fc] to-white">
        <div className="flex items-center gap-3">
          <Link href="/account/support" className="p-2 rounded-xl hover:bg-[#f8f7fa] text-[#77717b]"><ArrowRight size={18} /></Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm md:text-base font-black text-[#28242b] truncate">{ticket.subject}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold ${statusInfo.cls}`}>{statusInfo.label}</span>
              <span className="text-[10px] text-[#918a95]">#{ticket.id.slice(0, 8)}</span>
            </div>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4 bg-[#fafafc]">
        {messages.map((msg) => {
          const isAdmin = msg.senderType === 'admin';
          return (
            <div key={msg.id} className={`flex gap-2 ${isAdmin ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm ${isAdmin ? 'bg-gradient-to-br from-[#c61d70] to-[#e84e9e]' : 'bg-gradient-to-br from-[#28242b] to-[#5a535e]'}`}>
                {isAdmin ? <ShieldCheck size={14} /> : currentUserName.charAt(0)}
              </div>
              <div className={`max-w-[75%] ${isAdmin ? '' : 'items-end'}`}>
                <div className="text-[10px] font-bold text-[#918a95] mb-1 px-1">{isAdmin ? 'تیم پشتیبانی' : 'شما'}</div>
                <div className={`rounded-2xl overflow-hidden text-sm leading-relaxed shadow-sm ${isAdmin ? 'bg-white border border-[#e9e5eb] text-[#28242b] rounded-tr-md' : 'bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-white rounded-tl-md'}`}>
                  {msg.attachmentUrl && (
                    <div className="relative w-full max-w-[250px]">
                      <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer">
                        <img src={msg.attachmentUrl} alt="پیوست" className="w-full h-auto object-cover" />
                      </a>
                    </div>
                  )}
                  <div className="px-4 py-2.5">{msg.message}</div>
                </div>
                <div className={`text-[9px] text-[#918a95] mt-1 px-1 ${isAdmin ? '' : 'text-left'}`}>
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700"><X size={14} /> تیکت بسته شده</div>
            <Link href="/account/support" className="block mt-3 text-xs font-bold text-[#c61d70] hover:underline">ایجاد تیکت جدید</Link>
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
                <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="پیام خود را بنویسید..." rows={1} className="flex-1 py-3 px-1 bg-transparent text-sm outline-none resize-none max-h-32" style={{ minHeight: '48px' }} maxLength={2000} />
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


==========================================================================================
FILE [7/255] _chat_backup_14050823_000434\admin-chat-client.tsx
SIZE 25351 bytes
==========================================================================================
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Loader2, Send, ShieldCheck, X, ImagePlus, Clock,
  ArrowDown, Lock, MessageCircle, Mail, User, Sparkles, CheckCircle2,
  Zap, CircleDot
} from 'lucide-react';
import { toast } from 'sonner';
import { formatPersianDate } from '@/lib/format';

const STATUS: Record<string, { label: string; cls: string; dot: string; bg: string }> = {
  open: { label: 'باز', cls: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', bg: 'from-blue-500 to-blue-600' },
  answered: { label: 'پاسخ داده شده', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', bg: 'from-emerald-500 to-emerald-600' },
  closed: { label: 'بسته', cls: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400', bg: 'from-gray-400 to-gray-500' },
};

const QUICK_REPLIES = [
  { label: 'خوش‌آمد', text: 'سلام! ممنون از پیامتون. چطور می‌تونیم کمکتون کنیم؟' },
  { label: 'در حال بررسی', text: 'در حال بررسی موضوع هستیم و در اولین فرصت پاسخ کامل خدمتتون ارائه می‌شه.' },
  { label: 'پیگیری سفارش', text: 'سفارش شما در حال آماده‌سازیه و به‌محض ارسال، کد رهگیری خدمتتون اعلام می‌شه.' },
  { label: 'تشکر', text: 'از صبر و همراهی شما سپاسگزاریم.' },
  { label: 'بستن تیکت', text: 'اگر مشکل حل شده، لطفاً تیکت رو ببندید. در خدمتتون هستیم.' },
];

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

export default function AdminChatClient({ ticket, customer, initialMessages }: { ticket: any; customer: { name: string; email: string }; initialMessages: any[] }) {
  const [messages, setMessages] = useState<any[]>(initialMessages);
  const [status, setStatus] = useState<string>(ticket.status);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [showQuick, setShowQuick] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const messageCount = messages.length;
  const signature = useMemo(() => messages.map(m => m.id).join('|'), [messages]);

  useEffect(() => {
    fetch('/api/admin/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId: ticket.id }),
    }).catch(() => {});
  }, [ticket.id]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/admin/support/' + ticket.id, { cache: 'no-store' });
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
      const res = await fetch('/api/admin/support/' + ticket.id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage.trim() || 'عکس ارسال شد', status: 'answered', attachmentUrl }),
      });
      if (res.ok) {
        setNewMessage(''); setAttachmentUrl(null); setStatus('answered');
        const refresh = await fetch('/api/admin/support/' + ticket.id, { cache: 'no-store' });
        const data = await refresh.json();
        if (data.success) setMessages(data.messages);
        toast.success('پاسخ ارسال شد');
      } else { const data = await res.json(); toast.error(data.message || 'خطا'); }
    } catch { toast.error('خطا'); }
    finally { setSending(false); }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const res = await fetch('/api/admin/support/' + ticket.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) { setStatus(newStatus); toast.success('وضعیت به‌روزرسانی شد'); }
    } catch { toast.error('خطا'); }
  };

  const applyQuickReply = (text: string) => {
    setNewMessage(text);
    setShowQuick(false);
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
    <div className="flex h-[calc(100dvh-120px)] md:h-[calc(100dvh-100px)] gap-4">

      {/* ========= MAIN CHAT ========= */}
      <div className="flex-1 min-w-0 flex flex-col bg-gradient-to-b from-[#fafafc] to-[#f8f7fa] rounded-[2rem] border border-[#e9e5eb] shadow-xl shadow-[#c61d70]/5 overflow-hidden relative">

        {/* HEADER */}
        <div className="shrink-0 relative overflow-hidden border-b border-[#f2d7e5] bg-gradient-to-br from-[#fff0f7] via-[#fce5f0] to-white">
          <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#c61d70]/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[#c61d70]/10 blur-2xl" />
          <div className="relative px-3 md:px-5 py-3 md:py-4 flex items-center gap-3">
            <Link href="/admin/support" className="p-2.5 rounded-2xl bg-white/80 backdrop-blur text-[#77717b] hover:bg-white hover:text-[#c61d70] transition-all shadow-sm shrink-0" aria-label="بازگشت">
              <ArrowRight size={18} />
            </Link>
            <div className="relative shrink-0">
              <div className={'w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-br ' + statusInfo.bg + ' flex items-center justify-center text-white shadow-lg'}>
                <span className="text-sm font-black">{(customer.name || 'ک').charAt(0)}</span>
              </div>
              <span className={'absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full ring-2 ring-white ' + statusInfo.dot} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm md:text-base font-black text-[#28242b] truncate leading-tight">{customer.name || 'کاربر'}</h1>
              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#77717b]">
                <Mail size={10} className="shrink-0" />
                <span dir="ltr" className="truncate">{customer.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={status}
                onChange={(e) => updateStatus(e.target.value)}
                className={'text-[10px] md:text-[11px] font-black rounded-xl border-2 px-2.5 py-1.5 outline-none bg-white cursor-pointer transition-all hover:shadow-sm ' + statusInfo.cls}
              >
                <option value="open">باز</option>
                <option value="answered">پاسخ داده</option>
                <option value="closed">بسته</option>
              </select>
            </div>
          </div>
          <div className="relative px-3 md:px-5 pb-2 md:pb-3">
            <div className="inline-flex items-center gap-1.5 text-[10px] md:text-[11px] font-bold text-[#77717b]">
              <MessageCircle size={11} className="text-[#c61d70]" />
              <span className="truncate">موضوع: <span className="text-[#28242b]">{ticket.subject}</span></span>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 md:px-6 py-4 md:py-6"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(198,29,112,0.03) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(198,29,112,0.03) 0%, transparent 40%)' }}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="w-16 h-16 rounded-full bg-white border border-[#e9e5eb] flex items-center justify-center mb-4 shadow-sm">
                <MessageCircle size={28} className="text-[#c61d70]/40" />
              </div>
              <h3 className="text-base font-black text-[#28242b] mb-1">هنوز پیامی نیست</h3>
              <p className="text-xs text-[#77717b]">اولین پاسخ را بفرست تا گفتگو شروع شود.</p>
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
                      className={'flex gap-2 mt-1 ' + (isAdmin ? 'flex-row-reverse' : '') + ' animate-in fade-in slide-in-from-bottom-2 duration-300'}
                      style={{ animationDelay: (mi * 30) + 'ms' }}
                    >
                      <div className={'shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-md ' + (isAdmin ? 'bg-gradient-to-br from-[#c61d70] to-[#e84e9e]' : 'bg-gradient-to-br from-[#28242b] to-[#5a535e]') + (showAvatar ? '' : ' opacity-0')}>
                        {isAdmin ? <ShieldCheck size={14} /> : (customer.name || 'ک').charAt(0)}
                      </div>
                      <div className={'max-w-[78%] md:max-w-[70%] flex flex-col ' + (isAdmin ? 'items-end' : 'items-start')}>
                        {showAvatar && (
                          <span className="text-[9px] font-bold text-[#918a95] mb-1 px-1">
                            {isAdmin ? 'شما (پشتیبانی)' : customer.name}
                          </span>
                        )}
                        <div className={'relative rounded-2xl overflow-hidden text-[13px] md:text-sm leading-relaxed shadow-sm ' + (isAdmin ? 'bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-white rounded-tl-sm shadow-[#c61d70]/20' : 'bg-white border border-[#e9e5eb] text-[#28242b] rounded-tr-sm')}>
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
                        <span className={'text-[9px] text-[#918a95] mt-1 px-1 flex items-center gap-1 ' + (isAdmin ? '' : 'flex-row-reverse')}>
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

        {/* Scroll FAB */}
        {showScrollBtn && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-24 left-4 md:bottom-28 md:left-6 z-20 w-10 h-10 rounded-full bg-[#c61d70] text-white shadow-xl shadow-[#c61d70]/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-2"
            aria-label="پرش به آخر"
          >
            <ArrowDown size={18} />
          </button>
        )}

        {/* COMPOSER */}
        <div className="shrink-0 border-t border-[#e9e5eb] bg-white/95 backdrop-blur-xl p-3 md:p-4" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
          {status === 'closed' ? (
            <div className="text-center py-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600">
                <Lock size={14} /> تیکت بسته شده — برای پاسخ، وضعیت را باز کنید
              </div>
            </div>
          ) : (
            <div>
              {/* Quick Replies toggle */}
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setShowQuick(v => !v)}
                  className={'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ' + (showQuick ? 'bg-[#c61d70] text-white shadow-md shadow-[#c61d70]/20' : 'bg-[#f8f7fa] text-[#77717b] border border-[#e9e5eb] hover:border-[#c61d70]/30')}
                >
                  <Zap size={12} /> پاسخ سریع
                </button>
                <span className="text-[10px] text-[#918a95]">{newMessage.length.toLocaleString('fa-IR')} / ۲۰۰۰</span>
              </div>

              {/* Quick replies horizontal list */}
              {showQuick && (
                <div className="mb-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide animate-in fade-in slide-in-from-top-2">
                  {QUICK_REPLIES.map((qr, i) => (
                    <button
                      key={i}
                      onClick={() => applyQuickReply(qr.text)}
                      className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-[#e9e5eb] text-[10px] md:text-[11px] font-bold text-[#28242b] hover:border-[#c61d70]/40 hover:bg-[#fff0f7] hover:text-[#c61d70] transition-all"
                    >
                      {qr.label}
                    </button>
                  ))}
                </div>
              )}

              {attachmentUrl && (
                <div className="mb-3 relative inline-block">
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
                    placeholder="پاسخ خود را بنویسید..."
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
      </div>

      {/* ========= SIDEBAR (desktop only) ========= */}
      <aside className="hidden lg:flex flex-col w-80 shrink-0 gap-4">
        <div className="rounded-[2rem] border border-[#e9e5eb] bg-white shadow-sm overflow-hidden">
          <div className="relative p-5 bg-gradient-to-br from-[#fff0f7] via-[#fce5f0] to-white border-b border-[#f2d7e5]">
            <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-[#c61d70]/10 blur-2xl" />
            <div className="relative flex flex-col items-center text-center">
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#c61d70] to-[#e84e9e] flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-[#c61d70]/30 ring-4 ring-white">
                  {(customer.name || 'ک').charAt(0)}
                </div>
                <span className={'absolute -bottom-1 -right-1 h-4 w-4 rounded-full ring-2 ring-white ' + statusInfo.dot} />
              </div>
              <h3 className="text-base font-black text-[#28242b] mb-1">{customer.name || 'کاربر'}</h3>
              <p className="text-[11px] text-[#77717b] flex items-center gap-1" dir="ltr">
                <Mail size={11} /> {customer.email || '—'}
              </p>
            </div>
          </div>
          <div className="p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs py-2 border-b border-[#f5f0f2]">
              <span className="text-[#77717b] font-medium flex items-center gap-1.5"><CircleDot size={11} className={statusInfo.dot.replace('bg-', 'text-')} /> وضعیت</span>
              <span className={'px-2 py-0.5 rounded-full border text-[10px] font-bold ' + statusInfo.cls}>{statusInfo.label}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-2 border-b border-[#f5f0f2]">
              <span className="text-[#77717b] font-medium flex items-center gap-1.5"><Sparkles size={11} className="text-[#c61d70]" /> تعداد پیام‌ها</span>
              <span className="font-black text-[#28242b]">{messages.length.toLocaleString('fa-IR')}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-2 border-b border-[#f5f0f2]">
              <span className="text-[#77717b] font-medium flex items-center gap-1.5"><Clock size={11} className="text-[#c61d70]" /> ایجاد تیکت</span>
              <span className="font-bold text-[#28242b] text-[10px]">{formatPersianDate(ticket.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-2">
              <span className="text-[#77717b] font-medium flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-500" /> آخرین پیام</span>
              <span className="font-bold text-[#28242b] text-[10px]">{formatPersianDate(ticket.lastMessageAt)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#e9e5eb] bg-white shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#fff0f7] text-[#c61d70] flex items-center justify-center">
              <User size={16} />
            </div>
            <div>
              <p className="text-xs font-black text-[#28242b]">پاسخ‌های سریع</p>
              <p className="text-[10px] text-[#918a95]">روی هر کدام بزن تا در کادر قرار بگیرد</p>
            </div>
          </div>
          <div className="space-y-1.5 max-h-[280px] overflow-y-auto">
            {QUICK_REPLIES.map((qr, i) => (
              <button
                key={i}
                onClick={() => applyQuickReply(qr.text)}
                className="w-full text-right p-2.5 rounded-xl bg-[#f8f7fa] hover:bg-[#fff0f7] hover:border-[#c61d70]/30 border border-transparent transition-all group"
              >
                <p className="text-[11px] font-black text-[#28242b] group-hover:text-[#c61d70] mb-0.5">{qr.label}</p>
                <p className="text-[10px] text-[#918a95] line-clamp-2 leading-relaxed">{qr.text}</p>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* LIGHTBOX */}
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


==========================================================================================
FILE [8/255] _chat_backup_14050823_000434\chat-client.tsx
SIZE 16977 bytes
==========================================================================================
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


==========================================================================================
FILE [9/255] _chat_v3_backup_14050823_112706\admin-chat-client.tsx
SIZE 25351 bytes
==========================================================================================
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Loader2, Send, ShieldCheck, X, ImagePlus, Clock,
  ArrowDown, Lock, MessageCircle, Mail, User, Sparkles, CheckCircle2,
  Zap, CircleDot
} from 'lucide-react';
import { toast } from 'sonner';
import { formatPersianDate } from '@/lib/format';

const STATUS: Record<string, { label: string; cls: string; dot: string; bg: string }> = {
  open: { label: 'باز', cls: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', bg: 'from-blue-500 to-blue-600' },
  answered: { label: 'پاسخ داده شده', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', bg: 'from-emerald-500 to-emerald-600' },
  closed: { label: 'بسته', cls: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400', bg: 'from-gray-400 to-gray-500' },
};

const QUICK_REPLIES = [
  { label: 'خوش‌آمد', text: 'سلام! ممنون از پیامتون. چطور می‌تونیم کمکتون کنیم؟' },
  { label: 'در حال بررسی', text: 'در حال بررسی موضوع هستیم و در اولین فرصت پاسخ کامل خدمتتون ارائه می‌شه.' },
  { label: 'پیگیری سفارش', text: 'سفارش شما در حال آماده‌سازیه و به‌محض ارسال، کد رهگیری خدمتتون اعلام می‌شه.' },
  { label: 'تشکر', text: 'از صبر و همراهی شما سپاسگزاریم.' },
  { label: 'بستن تیکت', text: 'اگر مشکل حل شده، لطفاً تیکت رو ببندید. در خدمتتون هستیم.' },
];

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

export default function AdminChatClient({ ticket, customer, initialMessages }: { ticket: any; customer: { name: string; email: string }; initialMessages: any[] }) {
  const [messages, setMessages] = useState<any[]>(initialMessages);
  const [status, setStatus] = useState<string>(ticket.status);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [showQuick, setShowQuick] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const messageCount = messages.length;
  const signature = useMemo(() => messages.map(m => m.id).join('|'), [messages]);

  useEffect(() => {
    fetch('/api/admin/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId: ticket.id }),
    }).catch(() => {});
  }, [ticket.id]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/admin/support/' + ticket.id, { cache: 'no-store' });
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
      const res = await fetch('/api/admin/support/' + ticket.id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage.trim() || 'عکس ارسال شد', status: 'answered', attachmentUrl }),
      });
      if (res.ok) {
        setNewMessage(''); setAttachmentUrl(null); setStatus('answered');
        const refresh = await fetch('/api/admin/support/' + ticket.id, { cache: 'no-store' });
        const data = await refresh.json();
        if (data.success) setMessages(data.messages);
        toast.success('پاسخ ارسال شد');
      } else { const data = await res.json(); toast.error(data.message || 'خطا'); }
    } catch { toast.error('خطا'); }
    finally { setSending(false); }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const res = await fetch('/api/admin/support/' + ticket.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) { setStatus(newStatus); toast.success('وضعیت به‌روزرسانی شد'); }
    } catch { toast.error('خطا'); }
  };

  const applyQuickReply = (text: string) => {
    setNewMessage(text);
    setShowQuick(false);
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
    <div className="flex h-[calc(100dvh-120px)] md:h-[calc(100dvh-100px)] gap-4">

      {/* ========= MAIN CHAT ========= */}
      <div className="flex-1 min-w-0 flex flex-col bg-gradient-to-b from-[#fafafc] to-[#f8f7fa] rounded-[2rem] border border-[#e9e5eb] shadow-xl shadow-[#c61d70]/5 overflow-hidden relative">

        {/* HEADER */}
        <div className="shrink-0 relative overflow-hidden border-b border-[#f2d7e5] bg-gradient-to-br from-[#fff0f7] via-[#fce5f0] to-white">
          <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#c61d70]/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[#c61d70]/10 blur-2xl" />
          <div className="relative px-3 md:px-5 py-3 md:py-4 flex items-center gap-3">
            <Link href="/admin/support" className="p-2.5 rounded-2xl bg-white/80 backdrop-blur text-[#77717b] hover:bg-white hover:text-[#c61d70] transition-all shadow-sm shrink-0" aria-label="بازگشت">
              <ArrowRight size={18} />
            </Link>
            <div className="relative shrink-0">
              <div className={'w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-br ' + statusInfo.bg + ' flex items-center justify-center text-white shadow-lg'}>
                <span className="text-sm font-black">{(customer.name || 'ک').charAt(0)}</span>
              </div>
              <span className={'absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full ring-2 ring-white ' + statusInfo.dot} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm md:text-base font-black text-[#28242b] truncate leading-tight">{customer.name || 'کاربر'}</h1>
              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#77717b]">
                <Mail size={10} className="shrink-0" />
                <span dir="ltr" className="truncate">{customer.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={status}
                onChange={(e) => updateStatus(e.target.value)}
                className={'text-[10px] md:text-[11px] font-black rounded-xl border-2 px-2.5 py-1.5 outline-none bg-white cursor-pointer transition-all hover:shadow-sm ' + statusInfo.cls}
              >
                <option value="open">باز</option>
                <option value="answered">پاسخ داده</option>
                <option value="closed">بسته</option>
              </select>
            </div>
          </div>
          <div className="relative px-3 md:px-5 pb-2 md:pb-3">
            <div className="inline-flex items-center gap-1.5 text-[10px] md:text-[11px] font-bold text-[#77717b]">
              <MessageCircle size={11} className="text-[#c61d70]" />
              <span className="truncate">موضوع: <span className="text-[#28242b]">{ticket.subject}</span></span>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 md:px-6 py-4 md:py-6"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(198,29,112,0.03) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(198,29,112,0.03) 0%, transparent 40%)' }}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="w-16 h-16 rounded-full bg-white border border-[#e9e5eb] flex items-center justify-center mb-4 shadow-sm">
                <MessageCircle size={28} className="text-[#c61d70]/40" />
              </div>
              <h3 className="text-base font-black text-[#28242b] mb-1">هنوز پیامی نیست</h3>
              <p className="text-xs text-[#77717b]">اولین پاسخ را بفرست تا گفتگو شروع شود.</p>
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
                      className={'flex gap-2 mt-1 ' + (isAdmin ? 'flex-row-reverse' : '') + ' animate-in fade-in slide-in-from-bottom-2 duration-300'}
                      style={{ animationDelay: (mi * 30) + 'ms' }}
                    >
                      <div className={'shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-md ' + (isAdmin ? 'bg-gradient-to-br from-[#c61d70] to-[#e84e9e]' : 'bg-gradient-to-br from-[#28242b] to-[#5a535e]') + (showAvatar ? '' : ' opacity-0')}>
                        {isAdmin ? <ShieldCheck size={14} /> : (customer.name || 'ک').charAt(0)}
                      </div>
                      <div className={'max-w-[78%] md:max-w-[70%] flex flex-col ' + (isAdmin ? 'items-end' : 'items-start')}>
                        {showAvatar && (
                          <span className="text-[9px] font-bold text-[#918a95] mb-1 px-1">
                            {isAdmin ? 'شما (پشتیبانی)' : customer.name}
                          </span>
                        )}
                        <div className={'relative rounded-2xl overflow-hidden text-[13px] md:text-sm leading-relaxed shadow-sm ' + (isAdmin ? 'bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-white rounded-tl-sm shadow-[#c61d70]/20' : 'bg-white border border-[#e9e5eb] text-[#28242b] rounded-tr-sm')}>
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
                        <span className={'text-[9px] text-[#918a95] mt-1 px-1 flex items-center gap-1 ' + (isAdmin ? '' : 'flex-row-reverse')}>
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

        {/* Scroll FAB */}
        {showScrollBtn && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-24 left-4 md:bottom-28 md:left-6 z-20 w-10 h-10 rounded-full bg-[#c61d70] text-white shadow-xl shadow-[#c61d70]/30 flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-in fade-in slide-in-from-bottom-2"
            aria-label="پرش به آخر"
          >
            <ArrowDown size={18} />
          </button>
        )}

        {/* COMPOSER */}
        <div className="shrink-0 border-t border-[#e9e5eb] bg-white/95 backdrop-blur-xl p-3 md:p-4" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
          {status === 'closed' ? (
            <div className="text-center py-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600">
                <Lock size={14} /> تیکت بسته شده — برای پاسخ، وضعیت را باز کنید
              </div>
            </div>
          ) : (
            <div>
              {/* Quick Replies toggle */}
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => setShowQuick(v => !v)}
                  className={'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ' + (showQuick ? 'bg-[#c61d70] text-white shadow-md shadow-[#c61d70]/20' : 'bg-[#f8f7fa] text-[#77717b] border border-[#e9e5eb] hover:border-[#c61d70]/30')}
                >
                  <Zap size={12} /> پاسخ سریع
                </button>
                <span className="text-[10px] text-[#918a95]">{newMessage.length.toLocaleString('fa-IR')} / ۲۰۰۰</span>
              </div>

              {/* Quick replies horizontal list */}
              {showQuick && (
                <div className="mb-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide animate-in fade-in slide-in-from-top-2">
                  {QUICK_REPLIES.map((qr, i) => (
                    <button
                      key={i}
                      onClick={() => applyQuickReply(qr.text)}
                      className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-[#e9e5eb] text-[10px] md:text-[11px] font-bold text-[#28242b] hover:border-[#c61d70]/40 hover:bg-[#fff0f7] hover:text-[#c61d70] transition-all"
                    >
                      {qr.label}
                    </button>
                  ))}
                </div>
              )}

              {attachmentUrl && (
                <div className="mb-3 relative inline-block">
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
                    placeholder="پاسخ خود را بنویسید..."
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
      </div>

      {/* ========= SIDEBAR (desktop only) ========= */}
      <aside className="hidden lg:flex flex-col w-80 shrink-0 gap-4">
        <div className="rounded-[2rem] border border-[#e9e5eb] bg-white shadow-sm overflow-hidden">
          <div className="relative p-5 bg-gradient-to-br from-[#fff0f7] via-[#fce5f0] to-white border-b border-[#f2d7e5]">
            <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-[#c61d70]/10 blur-2xl" />
            <div className="relative flex flex-col items-center text-center">
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#c61d70] to-[#e84e9e] flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-[#c61d70]/30 ring-4 ring-white">
                  {(customer.name || 'ک').charAt(0)}
                </div>
                <span className={'absolute -bottom-1 -right-1 h-4 w-4 rounded-full ring-2 ring-white ' + statusInfo.dot} />
              </div>
              <h3 className="text-base font-black text-[#28242b] mb-1">{customer.name || 'کاربر'}</h3>
              <p className="text-[11px] text-[#77717b] flex items-center gap-1" dir="ltr">
                <Mail size={11} /> {customer.email || '—'}
              </p>
            </div>
          </div>
          <div className="p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs py-2 border-b border-[#f5f0f2]">
              <span className="text-[#77717b] font-medium flex items-center gap-1.5"><CircleDot size={11} className={statusInfo.dot.replace('bg-', 'text-')} /> وضعیت</span>
              <span className={'px-2 py-0.5 rounded-full border text-[10px] font-bold ' + statusInfo.cls}>{statusInfo.label}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-2 border-b border-[#f5f0f2]">
              <span className="text-[#77717b] font-medium flex items-center gap-1.5"><Sparkles size={11} className="text-[#c61d70]" /> تعداد پیام‌ها</span>
              <span className="font-black text-[#28242b]">{messages.length.toLocaleString('fa-IR')}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-2 border-b border-[#f5f0f2]">
              <span className="text-[#77717b] font-medium flex items-center gap-1.5"><Clock size={11} className="text-[#c61d70]" /> ایجاد تیکت</span>
              <span className="font-bold text-[#28242b] text-[10px]">{formatPersianDate(ticket.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-2">
              <span className="text-[#77717b] font-medium flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-500" /> آخرین پیام</span>
              <span className="font-bold text-[#28242b] text-[10px]">{formatPersianDate(ticket.lastMessageAt)}</span>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#e9e5eb] bg-white shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#fff0f7] text-[#c61d70] flex items-center justify-center">
              <User size={16} />
            </div>
            <div>
              <p className="text-xs font-black text-[#28242b]">پاسخ‌های سریع</p>
              <p className="text-[10px] text-[#918a95]">روی هر کدام بزن تا در کادر قرار بگیرد</p>
            </div>
          </div>
          <div className="space-y-1.5 max-h-[280px] overflow-y-auto">
            {QUICK_REPLIES.map((qr, i) => (
              <button
                key={i}
                onClick={() => applyQuickReply(qr.text)}
                className="w-full text-right p-2.5 rounded-xl bg-[#f8f7fa] hover:bg-[#fff0f7] hover:border-[#c61d70]/30 border border-transparent transition-all group"
              >
                <p className="text-[11px] font-black text-[#28242b] group-hover:text-[#c61d70] mb-0.5">{qr.label}</p>
                <p className="text-[10px] text-[#918a95] line-clamp-2 leading-relaxed">{qr.text}</p>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* LIGHTBOX */}
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


==========================================================================================
FILE [10/255] _chat_v3_backup_14050823_112706\chat-client.tsx
SIZE 16977 bytes
==========================================================================================
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


==========================================================================================
FILE [11/255] _chat_v4_backup_14050823_113217\admin-chat-client.tsx
SIZE 32483 bytes
==========================================================================================
'use client';

import { useState, useEffect, useRef, useMemo, Fragment } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Loader2, Send, ShieldCheck, X, ImagePlus, Clock,
  ArrowDown, Lock, MessageCircle, Mail, User, Sparkles, CheckCircle2,
  Zap, CircleDot, Search, Smile, Copy, Volume2, VolumeX, Check, CheckCheck,
  AlertTriangle, Timer, ChevronDown, Info
} from 'lucide-react';
import { toast } from 'sonner';
import { formatPersianDate } from '@/lib/format';

const STATUS: Record<string, { label: string; cls: string; dot: string; bar: string }> = {
  open: { label: 'باز', cls: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', bar: 'from-blue-500 to-blue-600' },
  answered: { label: 'پاسخ داده شده', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', bar: 'from-emerald-500 to-emerald-600' },
  closed: { label: 'بسته', cls: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400', bar: 'from-gray-400 to-gray-500' },
};

const EMOJIS = ['😀','😂','❤️','👍','🙏','🔥','✨','🎉','😍','😊','🤔','😢','💯','👌','🙌','💖'];

const QUICK_REPLIES = [
  { label: 'خوش‌آمد', text: 'سلام! ممنون از پیامتون. چطور می‌تونیم کمکتون کنیم؟' },
  { label: 'در حال بررسی', text: 'در حال بررسی موضوع هستیم و در اولین فرصت پاسخ کامل خدمتتون ارائه می‌شه.' },
  { label: 'پیگیری سفارش', text: 'سفارش شما در حال آماده‌سازیه و به‌محض ارسال، کد رهگیری خدمتتون اعلام می‌شه.' },
  { label: 'تشکر', text: 'از صبر و همراهی شما سپاسگزاریم.' },
  { label: 'بستن تیکت', text: 'اگر مشکل حل شده، لطفاً تیکت رو ببندید. در خدمتتون هستیم.' },
];

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
      return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline font-bold hover:opacity-80 break-all">{part}</a>;
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

function getSla(lastMessageAt: Date | string) {
  const mins = Math.floor((Date.now() - new Date(lastMessageAt).getTime()) / 60000);
  if (mins < 5) return { label: 'همین الان', color: 'text-emerald-600', bg: 'bg-emerald-50', urgency: 0 };
  if (mins < 30) return { label: mins + ' دقیقه پیش', color: 'text-emerald-600', bg: 'bg-emerald-50', urgency: 1 };
  if (mins < 120) return { label: Math.floor(mins/60) + ' ساعت پیش', color: 'text-amber-600', bg: 'bg-amber-50', urgency: 2 };
  if (mins < 1440) return { label: Math.floor(mins/60) + ' ساعت پیش', color: 'text-orange-600', bg: 'bg-orange-50', urgency: 3 };
  return { label: Math.floor(mins/1440) + ' روز پیش', color: 'text-rose-600', bg: 'bg-rose-50', urgency: 4 };
}

export default function AdminChatClient({ ticket, customer, initialMessages }: { ticket: any; customer: { name: string; email: string }; initialMessages: any[] }) {
  const [messages, setMessages] = useState<any[]>(initialMessages);
  const [status, setStatus] = useState<string>(ticket.status);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [showQuick, setShowQuick] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarTab, setSidebarTab] = useState<'info' | 'quick'>('info');
  const [soundOn, setSoundOn] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('admin-chat-sound') !== 'off';
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const seenIds = useRef<Set<string>>(new Set(initialMessages.map(m => m.id)));
  const messageCount = messages.length;
  const signature = useMemo(() => messages.map(m => m.id).join('|'), [messages]);
  const sla = getSla(ticket.lastMessageAt);

  useEffect(() => {
    fetch('/api/admin/support', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ticketId: ticket.id }) }).catch(() => {});
  }, [ticket.id]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/admin/support/' + ticket.id, { cache: 'no-store' });
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
      const hasIncoming = newMsgs.some(m => m.senderType === 'customer');
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
    localStorage.setItem('admin-chat-sound', soundOn ? 'on' : 'off');
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
      const res = await fetch('/api/admin/support/' + ticket.id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage.trim() || 'عکس ارسال شد', status: 'answered', attachmentUrl }),
      });
      if (res.ok) {
        setNewMessage(''); setAttachmentUrl(null); setStatus('answered'); setShowEmoji(false);
        const refresh = await fetch('/api/admin/support/' + ticket.id, { cache: 'no-store' });
        const data = await refresh.json();
        if (data.success) setMessages(data.messages);
        toast.success('پاسخ ارسال شد');
      } else { const d = await res.json(); toast.error(d.message || 'خطا'); }
    } catch { toast.error('خطا'); }
    finally { setSending(false); }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const res = await fetch('/api/admin/support/' + ticket.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) { setStatus(newStatus); toast.success('وضعیت به‌روزرسانی شد'); }
    } catch { toast.error('خطا'); }
  };

  const applyQuickReply = (text: string) => {
    setNewMessage(text);
    setShowQuick(false);
    textareaRef.current?.focus();
  };

  const insertEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    textareaRef.current?.focus();
  };

  const copyMsg = (text: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success('کپی شد')).catch(() => toast.error('خطا'));
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
    <div className="flex h-[calc(100dvh-100px)] md:h-[calc(100dvh-80px)] gap-4">
      {/* MAIN CHAT */}
      <div className="relative flex-1 min-w-0 flex flex-col bg-[#fafafc] rounded-[2rem] border border-[#e9e5eb] shadow-2xl shadow-[#c61d70]/10 overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#c61d70]/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#c61d70]/5 blur-3xl" />

        {/* HEADER */}
        <div className="relative shrink-0 border-b border-[#f2d7e5] bg-gradient-to-br from-[#fff0f7] via-[#fce5f0] to-white">
          <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#c61d70]/10 blur-2xl" />
          <div className="relative px-3 md:px-5 py-3 md:py-4 flex items-center gap-3 flex-wrap">
            <Link href="/admin/support" className="p-2.5 rounded-2xl bg-white/80 backdrop-blur text-[#77717b] hover:bg-white hover:text-[#c61d70] transition-all shadow-sm shrink-0" aria-label="بازگشت">
              <ArrowRight size={18} />
            </Link>
            <div className="relative shrink-0">
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-[#c61d70] to-[#e84e9e] flex items-center justify-center text-white text-lg font-black shadow-lg shadow-[#c61d70]/30 ring-2 ring-white">
                {(customer.name || 'ک').charAt(0)}
              </div>
              <span className={'absolute -bottom-0.5 -left-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-white ' + statusInfo.dot + ' animate-pulse'} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm md:text-base font-black text-[#28242b] truncate leading-tight">{customer.name || 'کاربر'}</h1>
              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#77717b]">
                <Mail size={10} className="shrink-0" />
                <span dir="ltr" className="truncate">{customer.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => { setSearchMode(!searchMode); setSearchQuery(''); }} className={'p-2 rounded-xl transition-all ' + (searchMode ? 'bg-[#c61d70] text-white shadow-md' : 'bg-white/70 text-[#77717b] hover:bg-white hover:text-[#c61d70]')} aria-label="جستجو">
                <Search size={16} />
              </button>
              <button onClick={() => setSoundOn(!soundOn)} className="p-2 rounded-xl bg-white/70 text-[#77717b] hover:bg-white hover:text-[#c61d70] transition-all" aria-label="صدا">
                {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <select value={status} onChange={(e) => updateStatus(e.target.value)} className={'text-[10px] md:text-[11px] font-black rounded-xl border-2 px-2.5 py-1.5 outline-none bg-white cursor-pointer transition-all hover:shadow-sm ' + statusInfo.cls}>
                <option value="open">باز</option>
                <option value="answered">پاسخ داده</option>
                <option value="closed">بسته</option>
              </select>
            </div>
          </div>
          <div className="relative px-3 md:px-5 pb-2 md:pb-3 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-[10px] md:text-[11px] font-bold text-[#77717b]">
              <MessageCircle size={11} className="text-[#c61d70]" />
              <span className="truncate">موضوع: <span className="text-[#28242b]">{ticket.subject}</span></span>
            </span>
            <span className={'inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ' + sla.bg + ' ' + sla.color}>
              {sla.urgency >= 3 ? <AlertTriangle size={10} /> : <Timer size={10} />}
              {sla.label}
            </span>
          </div>
          {searchMode && (
            <div className="relative px-3 md:px-5 pb-3 animate-in slide-in-from-top-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95]" />
                <input autoFocus type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="جستجو در پیام‌ها..." className="w-full pr-10 pl-10 py-2.5 bg-white border-2 border-[#e9e5eb] rounded-xl text-xs outline-none focus:border-[#c61d70] transition-all" />
                {searchQuery && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#c61d70]">{filteredMessages.length.toLocaleString('fa-IR')} یافت</span>}
              </div>
            </div>
          )}
        </div>

        {/* MESSAGES */}
        <div ref={scrollRef} onScroll={handleScroll} className="chat-scroll flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 md:px-6 py-4 md:py-6 relative">
          {filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="w-16 h-16 rounded-full bg-white border border-[#e9e5eb] flex items-center justify-center mb-4 shadow-sm">
                <MessageCircle size={28} className="text-[#c61d70]/40" />
              </div>
              <h3 className="text-base font-black text-[#28242b] mb-1">{searchQuery ? 'پیامی پیدا نشد' : 'هنوز پیامی نیست'}</h3>
              <p className="text-xs text-[#77717b]">{searchQuery ? 'عبارت جستجو را تغییر بده.' : 'اولین پاسخ را بفرست تا گفتگو شروع شود.'}</p>
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
                  const isOwn = isAdmin;
                  return (
                    <div key={msg.id} className={'group flex gap-2 mt-1.5 ' + (isAdmin ? 'flex-row-reverse' : '') + ' animate-in fade-in slide-in-from-bottom-2 duration-300'} style={{ animationDelay: (mi * 30) + 'ms' }}>
                      <div className={'shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-md ' + (isAdmin ? 'bg-gradient-to-br from-[#c61d70] to-[#e84e9e] ring-2 ring-white' : 'bg-gradient-to-br from-[#28242b] to-[#5a535e]') + (showAvatar ? '' : ' opacity-0')}>
                        {isAdmin ? <ShieldCheck size={14} /> : (customer.name || 'ک').charAt(0)}
                      </div>
                      <div className={'max-w-[78%] md:max-w-[70%] flex flex-col ' + (isAdmin ? 'items-end' : 'items-start')}>
                        {showAvatar && (
                          <span className="text-[9px] font-bold text-[#918a95] mb-1 px-1">{isAdmin ? 'شما (پشتیبانی)' : customer.name}</span>
                        )}
                        <div className={'relative rounded-2xl overflow-hidden text-[13px] md:text-sm leading-relaxed shadow-sm ' + (isAdmin ? 'bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-white rounded-tl-sm shadow-[#c61d70]/25' : 'bg-white border border-[#e9e5eb] text-[#28242b] rounded-tr-sm')}>
                          {msg.attachmentUrl && (
                            <button onClick={() => setLightbox(msg.attachmentUrl)} className="block w-full max-w-[260px] cursor-zoom-in hover:opacity-95 transition-opacity">
                              <img src={msg.attachmentUrl} alt="پیوست" className="w-full h-auto object-cover" loading="lazy" />
                            </button>
                          )}
                          {msg.message && msg.message !== 'عکس ارسال شد' && (
                            <div className="px-4 py-2.5 whitespace-pre-wrap break-words">{renderText(msg.message, searchMode ? searchQuery : '')}</div>
                          )}
                        </div>
                        <div className={'flex items-center gap-1.5 mt-1 px-1 ' + (isAdmin ? 'flex-row-reverse' : '')}>
                          <span className="text-[9px] text-[#918a95] flex items-center gap-1"><Clock size={9} /> {formatTime(msg.createdAt)}</span>
                          {msg.message && msg.message !== 'عکس ارسال شد' && (
                            <button onClick={() => copyMsg(msg.message)} className="opacity-0 group-hover:opacity-100 max-md:opacity-40 text-[#918a95] hover:text-[#c61d70] transition-all" aria-label="کپی"><Copy size={10} /></button>
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
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600 shadow-sm">
                <Lock size={14} /> تیکت بسته شده — برای پاسخ، وضعیت را باز کنید
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <button onClick={() => setShowQuick(!showQuick)} className={'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ' + (showQuick ? 'bg-[#c61d70] text-white shadow-md shadow-[#c61d70]/20' : 'bg-[#f8f7fa] text-[#77717b] border border-[#e9e5eb] hover:border-[#c61d70]/30')}>
                  <Zap size={12} /> پاسخ سریع
                </button>
                <span className="text-[10px] text-[#918a95]">{newMessage.length.toLocaleString('fa-IR')} / ۲۰۰۰</span>
              </div>
              {showQuick && (
                <div className="mb-2 flex gap-2 overflow-x-auto pb-1 chat-scroll-hide animate-in fade-in slide-in-from-top-2">
                  {QUICK_REPLIES.map((qr, i) => (
                    <button key={i} onClick={() => applyQuickReply(qr.text)} className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-[#e9e5eb] text-[10px] md:text-[11px] font-bold text-[#28242b] hover:border-[#c61d70]/40 hover:bg-[#fff0f7] hover:text-[#c61d70] transition-all">{qr.label}</button>
                  ))}
                </div>
              )}
              {attachmentUrl && (
                <div className="mb-3 relative inline-block">
                  <img src={attachmentUrl} alt="پیش‌نمایش" className="h-20 w-auto rounded-xl border-2 border-[#f2d7e5] shadow-sm" />
                  <button onClick={() => setAttachmentUrl(null)} className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 shadow-md transition-colors" aria-label="حذف عکس"><X size={12} /></button>
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
                  <button onClick={() => setShowEmoji(!showEmoji)} className={'p-3 transition-colors shrink-0 ' + (showEmoji ? 'text-[#c61d70]' : 'text-[#918a95] hover:text-[#c61d70]')} aria-label="ایموجی"><Smile size={20} /></button>
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="p-3 text-[#918a95] hover:text-[#c61d70] transition-colors shrink-0 disabled:opacity-50" aria-label="پیوست">
                    {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                  <textarea ref={textareaRef} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="پاسخ خود را بنویسید..." rows={1} className="flex-1 py-3 px-1 bg-transparent text-sm outline-none resize-none max-h-32 chat-scroll-hide" style={{ minHeight: '48px' }} maxLength={2000} />
                </div>
                <button onClick={handleSend} disabled={sending || (newMessage.trim().length === 0 && !attachmentUrl)} className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-white flex items-center justify-center shadow-lg shadow-[#c61d70]/30 hover:shadow-xl hover:shadow-[#c61d70]/40 hover:-translate-y-0.5 disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0 transition-all" aria-label="ارسال">
                  {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-80 shrink-0 gap-4">
        <div className="rounded-[2rem] border border-[#e9e5eb] bg-white shadow-sm overflow-hidden">
          <div className="relative p-5 bg-gradient-to-br from-[#fff0f7] via-[#fce5f0] to-white border-b border-[#f2d7e5]">
            <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-[#c61d70]/10 blur-2xl" />
            <div className="relative flex flex-col items-center text-center">
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#c61d70] to-[#e84e9e] flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-[#c61d70]/30 ring-4 ring-white">
                  {(customer.name || 'ک').charAt(0)}
                </div>
                <span className={'absolute -bottom-1 -right-1 h-4 w-4 rounded-full ring-2 ring-white ' + statusInfo.dot} />
              </div>
              <h3 className="text-base font-black text-[#28242b] mb-1">{customer.name || 'کاربر'}</h3>
              <p className="text-[11px] text-[#77717b] flex items-center gap-1" dir="ltr"><Mail size={11} /> {customer.email || '—'}</p>
            </div>
          </div>
          <div className="flex border-b border-[#e9e5eb]">
            <button onClick={() => setSidebarTab('info')} className={'flex-1 py-2.5 text-[11px] font-black transition-colors border-b-2 ' + (sidebarTab === 'info' ? 'text-[#c61d70] border-[#c61d70] bg-[#fff0f7]/50' : 'text-[#77717b] border-transparent hover:text-[#28242b]')}>
              <Info size={12} className="inline mb-0.5 ml-1" /> اطلاعات
            </button>
            <button onClick={() => setSidebarTab('quick')} className={'flex-1 py-2.5 text-[11px] font-black transition-colors border-b-2 ' + (sidebarTab === 'quick' ? 'text-[#c61d70] border-[#c61d70] bg-[#fff0f7]/50' : 'text-[#77717b] border-transparent hover:text-[#28242b]')}>
              <Zap size={12} className="inline mb-0.5 ml-1" /> پاسخ سریع
            </button>
          </div>
          <div className="p-4">
            {sidebarTab === 'info' ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs py-2 border-b border-[#f5f0f2]">
                  <span className="text-[#77717b] font-medium flex items-center gap-1.5"><CircleDot size={11} className={statusInfo.dot.replace('bg-', 'text-')} /> وضعیت</span>
                  <span className={'px-2 py-0.5 rounded-full border text-[10px] font-bold ' + statusInfo.cls}>{statusInfo.label}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-2 border-b border-[#f5f0f2]">
                  <span className="text-[#77717b] font-medium flex items-center gap-1.5"><Sparkles size={11} className="text-[#c61d70]" /> تعداد پیام‌ها</span>
                  <span className="font-black text-[#28242b]">{messages.length.toLocaleString('fa-IR')}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-2 border-b border-[#f5f0f2]">
                  <span className="text-[#77717b] font-medium flex items-center gap-1.5"><Clock size={11} className="text-[#c61d70]" /> ایجاد تیکت</span>
                  <span className="font-bold text-[#28242b] text-[10px]">{formatPersianDate(ticket.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-2 border-b border-[#f5f0f2]">
                  <span className="text-[#77717b] font-medium flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-500" /> آخرین پیام</span>
                  <span className="font-bold text-[#28242b] text-[10px]">{formatPersianDate(ticket.lastMessageAt)}</span>
                </div>
                <div className={'flex items-center justify-between text-xs py-2 px-3 rounded-xl ' + sla.bg}>
                  <span className={'font-bold flex items-center gap-1.5 ' + sla.color}>
                    {sla.urgency >= 3 ? <AlertTriangle size={11} /> : <Timer size={11} />} SLA
                  </span>
                  <span className={'font-black text-[10px] ' + sla.color}>{sla.label}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[280px] overflow-y-auto chat-scroll">
                {QUICK_REPLIES.map((qr, i) => (
                  <button key={i} onClick={() => applyQuickReply(qr.text)} className="w-full text-right p-2.5 rounded-xl bg-[#f8f7fa] hover:bg-[#fff0f7] hover:border-[#c61d70]/30 border border-transparent transition-all group">
                    <p className="text-[11px] font-black text-[#28242b] group-hover:text-[#c61d70] mb-0.5">{qr.label}</p>
                    <p className="text-[10px] text-[#918a95] line-clamp-2 leading-relaxed">{qr.text}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {lightbox && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors" aria-label="بستن"><X size={20} /></button>
          <img src={lightbox} alt="پیوست" className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}


==========================================================================================
FILE [12/255] _chat_v4_backup_14050823_113217\chat-client.tsx
SIZE 23382 bytes
==========================================================================================
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


==========================================================================================
FILE [13/255] drizzle.config.ts
SIZE 281 bytes
==========================================================================================
import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});



==========================================================================================
FILE [14/255] next-env.d.ts
SIZE 288 bytes
==========================================================================================
/// <reference types="next" />
/// <reference types="next/image-types/global" />
import "./.next/types/routes.d.ts";
import "./.next/types/root-params.d.ts";

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.



==========================================================================================
FILE [15/255] src\app\about\page.tsx
SIZE 7794 bytes
==========================================================================================
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { ArrowLeft, ClipboardCheck, Eye, Search, Heart, ShieldCheck, Users, Package } from 'lucide-react';

export const metadata: Metadata = {
  title: 'درباره فاطمه بیوتی لند',
  description: 'آشنایی با فروشگاه آنلاین فاطمه بیوتی لند، فلسفه انتخاب محصولات و شیوه بررسی اطلاعات.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Header />
      <main className="flex-1">
        <section className="fl-page-intro">
          <div className="container-custom">
            <span className="fl-eyebrow"><span className="fl-eyebrow-dot" />درباره فاطمه بیوتی لند</span>
            <h1 className="fl-page-title">درباره فاطمه بیوتی لند</h1>
            <p className="fl-page-description">فروشگاهی برای بررسی و خرید محصولات آرایشی و مراقبتی؛ با تمرکز بر نمایش روشن و شفاف اطلاعات هر محصول.</p>
          </div>
        </section>

        <section className="container-custom py-12 md:py-16">
          <div className="grid items-center gap-8 md:grid-cols-[.85fr_1.15fr] md:gap-14">
            <div className="relative grid min-h-[280px] place-items-center overflow-hidden rounded-[22px] border border-[#f1dce8] bg-[radial-gradient(circle_at_55%_40%,#ffffff_0_12%,transparent_38%),linear-gradient(145deg,#fff4f9,#f8e8f1)]">
              <div className="absolute h-44 w-44 rounded-full border border-[#d98ab2]/30 shadow-[0_0_0_24px_rgba(255,255,255,.28),0_0_0_52px_rgba(255,255,255,.18)]" />
              <span className="relative text-[12px] font-extrabold tracking-[.22em] text-[#ad3b76]">FATEMEH BEAUTY LAND</span>
            </div>
            <div className="max-w-xl">
              <span className="fl-section-kicker">داستان ما</span>
              <h2 className="mt-2 text-[22px] font-extrabold leading-[1.85] tracking-[-.025em] text-[#28242b]">زیبایی واقعی، از شناخت آغاز می‌شود.</h2>
              <p className="mt-4 text-[13px] leading-[2.2] text-[#77717b]">فاطمه بیوتی لند، روایتی است از مراقبت؛ جایی که هر محصول با اطلاعاتی روشن و هر انتخاب با آگاهی شکل می‌گیرد. ما بر این باوریم که زیبایی واقعی از شناخت آغاز می‌شود، و تلاش می‌کنیم تجربه‌ای ساده، شفاف و ماندگار از خرید محصولات مراقبتی برای شما بسازیم.</p>
              <p className="mt-3 text-[13px] leading-[2.2] text-[#77717b]">هنگام خرید آنلاین، امکان لمس یا بررسی حضوری محصول وجود ندارد. به همین دلیل، صفحه هر محصول در فاطمه بیوتی لند برای نمایش اطلاعات ثبت‌شده، تصاویر، قیمت و وضعیت موجودی در نظر گرفته شده است.</p>
            </div>
          </div>
        </section>

        <section className="container-custom pb-12 md:pb-16">
          <div className="mb-6">
            <span className="fl-section-kicker">اصول ما</span>
            <h2 className="fl-section-title">فلسفه انتخاب محصولات</h2>
            <p className="fl-section-note">چهار اصلی که تجربه فاطمه بیوتی لند را می‌سازند.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { icon: Eye, title: 'شفافیت اطلاعات', desc: 'هر محصول با مشخصات، ترکیبات و کاربرد ثبت‌شده نمایش داده می‌شود. هیچ وعده درمانی یا ادعای تأییدنشده‌ای در فروشگاه ارائه نمی‌شود.' },
              { icon: Search, title: 'بررسی آسان', desc: 'جست‌وجو، فیلتر و صفحه‌های محصول به گونه‌ای طراحی شده‌اند که کاربر بدون سردرگمی محصول مورد نیاز خود را پیدا کند.' },
              { icon: ShieldCheck, title: 'انتخاب آگاهانه', desc: 'به جای تشویق به خرید سریع، در فروشگاه اطلاعات دقیق درباره هر محصول ارائه می‌شود تا کاربر با اطمینان تصمیم بگیرد.' },
              { icon: ClipboardCheck, title: 'پیگیری سفارش', desc: 'پس از ثبت سفارش، کد رهگیری اختصاصی صادر می‌شود و کاربر می‌تواند وضعیت سفارش خود را پیگیری کند.' },
            ].map((item) => (
              <article key={item.title} className="rounded-2xl border border-[#eee9ef] bg-white p-6">
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-[#fff0f7] text-[#c61d70]"><item.icon size={20} /></span>
                <h3 className="text-[14px] font-extrabold text-[#28242b]">{item.title}</h3>
                <p className="mt-2 text-[11px] leading-[2.1] text-[#77717b]">{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="container-custom pb-12 md:pb-16">
          <div className="glass-panel rounded-2xl p-8 md:p-12">
            <div className="mb-6">
              <span className="fl-section-kicker">تعهد ما</span>
              <h2 className="fl-section-title">استانداردهای فروشگاه</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { icon: Users, title: 'پاسخگویی', desc: 'تیم فروشگاه در اولین فرصت پاسخگوی سوالات شماست.' },
                { icon: Package, title: 'بسته‌بندی ایمن', desc: 'محصولات با بسته‌بندی مناسب و محافظت‌شده ارسال می‌شوند.' },
                { icon: Heart, title: 'رضایت مشتری', desc: 'در صورت بروز مشکل در سفارش، تیم ما برای حل آن در کنار شماست.' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#fff0f7] text-[#c61d70]"><item.icon size={18} /></span>
                  <div>
                    <h3 className="mb-1 text-[12px] font-bold text-[#28242b]">{item.title}</h3>
                    <p className="text-[11px] leading-[2] text-[#77717b]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container-custom pb-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl border border-[#f0dce8] bg-[#fff8fc] p-8">
            <div>
              <h2 className="text-[18px] font-extrabold text-[#28242b]">سؤالی دارید؟</h2>
              <p className="mt-2 text-[12px] leading-[2] text-[#77717b]">تیم فاطمه بیوتی لند آماده پاسخگویی به سوالات شما درباره محصولات و سفارشات است.</p>
            </div>
            <Link href="/contact" className="btn-primary">تماس با ما <ArrowLeft size={15} /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


==========================================================================================
FILE [16/255] src\app\account\(protected)\addresses\address-form.tsx
SIZE 7483 bytes
==========================================================================================
'use client';

import { useState } from 'react';
import { X, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';


const PROVINCES = ['تهران', 'اصفهان', 'فارس', 'خراسان رضوی', 'البرز', 'آذربایجان شرقی', 'آذربایجان غربی', 'خوزستان', 'گیلان', 'مازندران', 'کرمان', 'یزد', 'قم', 'قزوین', 'مرکزی', 'همدان', 'کرمانشاه', 'گلستان', 'سیستان و بلوچستان', 'هرمزگان', 'بوشهر', 'اردبیل', 'زنجان', 'سمنان', 'کردستان', 'لرستان', 'چهارمحال و بختیاری', 'کهگیلویه و بویراحمد', 'ایلام', 'خراسان شمالی', 'خراسان جنوبی'];

export default function AddressForm({ initialData, onClose, onSuccess }: { initialData: any, onClose: () => void, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    phone: initialData?.phone || '',
    province: initialData?.province || 'تهران',
    city: initialData?.city || '',
    address: initialData?.address || '',
    postalCode: initialData?.postalCode || '',
    isDefault: initialData?.isDefault || false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = initialData ? `/api/account/addresses/${initialData.id}` : '/api/account/addresses';
      const method = initialData ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(initialData ? 'آدرس ویرایش شد' : 'آدرس افزوده شد');
        onSuccess();
      } else {
        toast.error(data.message || 'خطا');
      }
    } catch {
      toast.error('خطا در ارتباط');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg my-8">
        <div className="flex items-center justify-between p-5 border-b border-[#e9e5eb]">
          <h3 className="font-black text-lg">{initialData ? 'ویرایش آدرس' : 'افزودن آدرس جدید'}</h3>
          <button onClick={onClose} className="p-2 text-[#77717b] hover:bg-[#f8f7fa] rounded-lg"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-[#28242b] mb-1.5 block">عنوان آدرس (مثلاً خانه، محل کار) *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] outline-none text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#28242b] mb-1.5 block">نام *</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-4 py-2.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] outline-none text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold text-[#28242b] mb-1.5 block">نام خانوادگی *</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-4 py-2.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] outline-none text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-[#28242b] mb-1.5 block">شماره موبایل *</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required dir="ltr" className="w-full px-4 py-2.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] outline-none text-sm text-left" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#28242b] mb-1.5 block">استان *</label>
              <select name="province" value={formData.province} onChange={handleChange} className="w-full px-3 py-2.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] outline-none text-sm cursor-pointer">
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#28242b] mb-1.5 block">شهر *</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-2.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] outline-none text-sm" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-[#28242b] mb-1.5 block">آدرس کامل *</label>
            <textarea name="address" value={formData.address} onChange={handleChange} required rows={3} className="w-full px-4 py-2.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] outline-none text-sm resize-none"></textarea>
          </div>
          <div>
            <label className="text-xs font-bold text-[#28242b] mb-1.5 block">کد پستی *</label>
            <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required dir="ltr" maxLength={10} className="w-full px-4 py-2.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] outline-none text-sm text-left" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.isDefault} onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })} className="w-4 h-4 accent-[#c61d70]" />
            <span className="text-xs font-bold text-[#28242b]">این آدرس پیش‌فرض من باشد</span>
          </label>
          <div className="flex gap-2 pt-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-bold text-[#77717b] hover:bg-[#f8f7fa] rounded-xl">انصراف</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-[#c61d70] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} ذخیره
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


==========================================================================================
FILE [17/255] src\app\account\(protected)\addresses\address-list.tsx
SIZE 6157 bytes
==========================================================================================
'use client';

import { useState } from 'react';
import { Plus, MapPin, Edit, Trash2, Star, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import AddressForm from './address-form';


export default function AddressList({ initialAddresses }: { initialAddresses: any[] }) {
  const [addresses, setAddresses] = useState(initialAddresses);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این آدرس مطمئن هستید؟')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/account/addresses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAddresses(addresses.filter(a => a.id !== id));
        toast.success('آدرس حذف شد');
        router.refresh();
      } else toast.error('خطا در حذف');
    } catch { toast.error('خطا در ارتباط'); }
    finally { setDeletingId(null); }
  };

  const handleSetDefault = async (id: string) => {
    const addr = addresses.find(a => a.id === id);
    if (!addr) return;
    try {
      const res = await fetch(`/api/account/addresses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...addr, isDefault: true }),
      });
      if (res.ok) {
        setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
        toast.success('آدرس پیش‌فرض تغییر کرد');
        router.refresh();
      } else toast.error('خطا');
    } catch { toast.error('خطا'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#28242b] flex items-center gap-2">
            <MapPin className="text-[#c61d70]" /> آدرس‌های من
          </h1>
          <p className="text-sm text-[#77717b] mt-1">{addresses.length.toLocaleString('fa-IR')} آدرس ثبت شده</p>
        </div>
        <button onClick={() => { setEditingAddress(null); setFormOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-[#c61d70] text-white text-sm font-bold rounded-xl hover:bg-[#a9155d] transition-colors">
          <Plus size={16} /> آدرس جدید
        </button>
      </div>

      {formOpen && (
        <AddressForm
          initialData={editingAddress}
          onClose={() => { setFormOpen(false); setEditingAddress(null); }}
          onSuccess={() => { setFormOpen(false); setEditingAddress(null); router.refresh(); }}
        />
      )}

      {addresses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#e9e5eb] p-12 text-center">
          <div className="w-20 h-20 bg-[#fff0f7] rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin size={40} className="text-[#c61d70]/40" />
          </div>
          <h3 className="text-lg font-black text-[#28242b] mb-2">هنوز آدرسی ثبت نکرده‌اید</h3>
          <p className="text-sm text-[#77717b] mb-6">برای ارسال سریع‌تر سفارشات، آدرس خود را ذخیره کنید.</p>
          <button onClick={() => setFormOpen(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl">
            <Plus size={16} /> افزودن اولین آدرس
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div key={address.id} className={`bg-white rounded-2xl border-2 p-5 transition-all ${address.isDefault ? 'border-[#c61d70] shadow-lg shadow-[#c61d70]/10' : 'border-[#e9e5eb]'}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#28242b]">{address.title}</span>
                  {address.isDefault && (
                    <span className="text-[9px] font-bold bg-[#c61d70] text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star size={9} fill="currentColor" /> پیش‌فرض
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  {!address.isDefault && (
                    <button onClick={() => handleSetDefault(address.id)} className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg" title="انتخاب به عنوان پیش‌فرض">
                      <Star size={14} />
                    </button>
                  )}
                  <button onClick={() => { setEditingAddress(address); setFormOpen(true); }} className="p-1.5 text-[#c61d70] hover:bg-[#fff0f7] rounded-lg">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => handleDelete(address.id)} disabled={deletingId === address.id} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg disabled:opacity-50">
                    {deletingId === address.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
              <div className="text-xs text-[#77717b] leading-relaxed space-y-1">
                <p className="font-bold text-[#28242b]">{address.firstName} {address.lastName}</p>
                <p dir="ltr" className="font-mono">{address.phone}</p>
                <p>{address.province}، {address.city}</p>
                <p className="line-clamp-2">{address.address}</p>
                <p>کد پستی: <span dir="ltr" className="font-mono">{address.postalCode}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


==========================================================================================
FILE [18/255] src\app\account\(protected)\addresses\loading.tsx
SIZE 798 bytes
==========================================================================================
export default function AddressesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="w-48 h-8 bg-gray-200 rounded-lg" />
        <div className="w-32 h-10 bg-gray-200 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map(i => (
          <div key={i} className="h-[200px] bg-white/60 rounded-2xl border border-[#e9e5eb] p-5 space-y-3">
            <div className="w-24 h-5 bg-gray-200 rounded" />
            <div className="w-40 h-4 bg-gray-200 rounded" />
            <div className="w-full h-4 bg-gray-200 rounded" />
            <div className="w-full h-4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}


==========================================================================================
FILE [19/255] src\app\account\(protected)\addresses\page.tsx
SIZE 588 bytes
==========================================================================================
import { db } from '@/lib/db';
import { addresses } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import AddressList from './address-list';


export const instant = false;

export default async function AddressesPage() {
  const customer = await getCurrentCustomer();
  const list = await db
    .select()
    .from(addresses)
    .where(eq(addresses.customerId, customer!.id))
    .orderBy(desc(addresses.isDefault), desc(addresses.createdAt));

  return <AddressList initialAddresses={list} />;
}


==========================================================================================
FILE [20/255] src\app\account\(protected)\error.tsx
SIZE 1421 bytes
==========================================================================================
'use client';
import { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function AccountError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-rose-100 p-8 text-center shadow-xl">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="text-rose-500 w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-[#28242b] mb-2">خطای حساب کاربری</h2>
        <p className="text-sm text-[#77717b] mb-6">مشکلی در بارگذاری اطلاعات شما رخ داد.</p>
        <div className="flex flex-col gap-2">
          <button onClick={() => reset()} className="w-full py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2"><RotateCcw size={16} /> تلاش مجدد</button>
          <Link href="/" className="w-full py-3 bg-white border border-[#e9e5eb] text-[#28242b] text-sm font-bold rounded-xl flex items-center justify-center gap-2"><Home size={16} /> صفحه اصلی</Link>
        </div>
      </div>
    </div>
  );
}


==========================================================================================
FILE [21/255] src\app\account\(protected)\layout.tsx
SIZE 1493 bytes
==========================================================================================
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import AccountSidebar from '@/components/account/AccountSidebar';
import AccountBottomNav from '@/components/account/AccountBottomNav';
import AccountMobileHeader from '@/components/account/AccountMobileHeader';

export const instant = false;

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const current = await getCurrentCustomer();
  if (!current) redirect('/account/login');

  const [customer] = await db.select().from(customers).where(eq(customers.id, current.id)).limit(1);
  if (!customer) redirect('/account/login');

  return (
    <div className="min-h-screen bg-[#fafafc]">
      <Suspense fallback={null}>
        <AccountSidebar customer={{ name: customer.name, email: customer.email }} />
      </Suspense>

      <main className="md:mr-64 pb-24 md:pb-8">
        <Suspense fallback={null}>
          <AccountMobileHeader />
        </Suspense>

        <div className="max-w-5xl mx-auto p-4 md:p-8">
          <Suspense fallback={<div className="p-8 text-center text-gray-500">در حال بارگذاری...</div>}>
            {children}
          </Suspense>
        </div>
      </main>

      <Suspense fallback={null}>
        <AccountBottomNav />
      </Suspense>
    </div>
  );
}


==========================================================================================
FILE [22/255] src\app\account\(protected)\orders\[id]\page.tsx
SIZE 6948 bytes
==========================================================================================
import { formatPersianDate, formatPersianDateTime } from '@/lib/format';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Package, MapPin, User, Phone, CheckCircle2, Truck, Clock, XCircle, CreditCard } from 'lucide-react';
import { formatToman } from '@/lib/currency';
import { Printer } from 'lucide-react';


const steps = [
  { id: 'processing', title: 'در حال پردازش', icon: Package },
  { id: 'shipped', title: 'ارسال شده', icon: Truck },
  { id: 'delivered', title: 'تحویل شده', icon: CheckCircle2 },
];

export const instant = false;

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCurrentCustomer();
  
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, id), eq(orders.customerId, customer!.id)))
    .limit(1);

  if (!order) notFound();

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));

  const getStepIndex = (status: string) => {
    if (status === 'cancelled') return -1;
    return steps.findIndex((s) => s.id === status);
  };

  const currentStep = getStepIndex(order.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/account/orders/${order.id}/print`} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e9e5eb] text-[#28242b] text-sm font-bold rounded-xl shadow-sm hover:bg-[#f8f7fa]"><Printer size={16} /> پرینت فاکتور</Link>
        <Link href="/account/orders" className="p-2 bg-white border border-[#e9e5eb] rounded-xl hover:bg-[#f8f7fa] transition-colors">
          <ArrowRight size={18} />
        </Link>
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#28242b]">جزئیات سفارش</h1>
          <p className="text-sm text-[#77717b] font-mono" dir="ltr">{order.trackingCode}</p>
        </div>
      </div>

      {/* وضعیت و تایم‌لاین */}
      <div className="bg-white rounded-3xl border border-[#e9e5eb] p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#e9e5eb]">
          <div>
            <p className="text-xs text-[#77717b] mb-1">تاریخ ثبت</p>
            <p className="font-bold text-sm">{formatPersianDate(order.createdAt)}</p>
          </div>
          <div className="text-left">
            <p className="text-xs text-[#77717b] mb-1">مبلغ کل</p>
            <p className="font-black text-lg text-[#c61d70]">{formatToman(order.totalAmount)}</p>
          </div>
        </div>

        {order.status === 'cancelled' ? (
          <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700">
            <XCircle size={20} />
            <span className="font-bold text-sm">این سفارش لغو شده است</span>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute top-5 right-0 left-0 h-1 bg-[#f5f0f2] rounded-full -z-10"></div>
            <div
              className="absolute top-5 right-0 h-1 bg-[#c61d70] rounded-full transition-all duration-1000 -z-10"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>
            <div className="flex justify-between">
              {steps.map((step, index) => {
                const isCompleted = currentStep >= index;
                const isActive = currentStep === index;
                return (
                  <div key={step.id} className="flex flex-col items-center gap-2 w-1/3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-white transition-all ${isCompleted ? 'border-[#c61d70] text-[#c61d70] shadow-lg shadow-[#c61d70]/20' : 'border-[#e9e5eb] text-[#918a95]'}`}>
                      <step.icon size={18} />
                    </div>
                    <span className={`text-[10px] md:text-xs font-bold text-center ${isActive ? 'text-[#c61d70]' : isCompleted ? 'text-[#28242b]' : 'text-[#918a95]'}`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* محصولات */}
      <div className="bg-white rounded-3xl border border-[#e9e5eb] p-6 md:p-8 shadow-sm">
        <h2 className="font-black text-lg text-[#28242b] mb-4 flex items-center gap-2"><Package size={20} className="text-[#c61d70]" /> محصولات سفارش</h2>
        <div className="divide-y divide-[#e9e5eb]">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
        <Link href={`/account/orders/${order.id}/print`} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-white border border-[#e9e5eb] text-[#28242b] text-sm font-bold rounded-xl shadow-sm hover:bg-[#f8f7fa]"><Printer size={16} /> پرینت فاکتور</Link>
                <span className="w-10 h-10 rounded-lg bg-[#f8f7fa] border border-[#e9e5eb] flex items-center justify-center text-sm font-black">{item.quantity.toLocaleString('fa-IR')}×</span>
                <span className="font-bold text-sm text-[#28242b]">{item.productName}</span>
              </div>
              <span className="font-bold text-sm text-[#28242b]">{formatToman(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* اطلاعات گیرنده */}
      <div className="bg-white rounded-3xl border border-[#e9e5eb] p-6 md:p-8 shadow-sm">
        <h2 className="font-black text-lg text-[#28242b] mb-4 flex items-center gap-2"><MapPin size={20} className="text-[#c61d70]" /> اطلاعات ارسال</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2"><User size={16} className="text-[#918a95]" /> {order.firstName} {order.lastName}</div>
          <div className="flex items-center gap-2"><Phone size={16} className="text-[#918a95]" /> <span dir="ltr">{order.phone}</span></div>
          <div className="md:col-span-2 flex items-start gap-2 text-[#77717b] leading-relaxed">
            <MapPin size={16} className="text-[#918a95] mt-0.5 shrink-0" />
            <span>{order.city}، {order.address} (کد پستی: {order.postalCode})</span>
          </div>
        </div>
      </div>
    </div>
  );
}


==========================================================================================
FILE [23/255] src\app\account\(protected)\orders\[id]\print\page.tsx
SIZE 1408 bytes
==========================================================================================
import { db } from '@/lib/db';
import { orders, orderItems } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { notFound } from 'next/navigation';
import InvoiceTemplate from '@/components/shared/InvoiceTemplate';
import PrintButton from '@/components/shared/PrintButton';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function CustomerPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCurrentCustomer();
  
  const orderData = await db.select().from(orders).where(and(eq(orders.id, id), eq(orders.customerId, customer!.id))).limit(1);
  if (orderData.length === 0) notFound();

  const order = orderData[0];
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center no-print">
        <Link href={`/account/orders/${id}`} className="flex items-center gap-2 text-sm font-bold text-[#28242b] bg-white px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50">
          <ArrowRight size={16} /> بازگشت به سفارش
        </Link>
        <PrintButton />
      </div>
      <InvoiceTemplate order={order} items={items} />
    </div>
  );
}


==========================================================================================
FILE [24/255] src\app\account\(protected)\orders\loading.tsx
SIZE 906 bytes
==========================================================================================
export default function OrdersLoading() {
  return (
    <div className="space-y-6">
      <div className="w-48 h-8 bg-gray-200 rounded-lg animate-pulse" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/60 backdrop-blur-md rounded-2xl border border-[#e9e5eb] p-5 h-[120px] flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
              <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="flex justify-between items-center">
              <div className="w-40 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


==========================================================================================
FILE [25/255] src\app\account\(protected)\orders\page.tsx
SIZE 4403 bytes
==========================================================================================
import { formatPersianDate, formatPersianDateTime } from '@/lib/format';
import { db } from '@/lib/db';
import { orders } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import Link from 'next/link';
import { Package, ArrowLeft, Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';
import { formatToman } from '@/lib/currency';


export const instant = false;

const statusMap: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'در انتظار پرداخت', color: 'bg-amber-50 text-amber-700', icon: Clock },
  processing: { label: 'در حال پردازش', color: 'bg-blue-50 text-blue-700', icon: Package },
  shipped: { label: 'ارسال شده', color: 'bg-purple-50 text-purple-700', icon: Truck },
  delivered: { label: 'تحویل شده', color: 'bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
  cancelled: { label: 'لغو شده', color: 'bg-rose-50 text-rose-700', icon: XCircle },
};

export default async function CustomerOrdersPage() {
  const customer = await getCurrentCustomer();
  const myOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.customerId, customer!.id))
    .orderBy(desc(orders.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-[#28242b] flex items-center gap-2">
          <Package className="text-[#c61d70]" /> سفارشات من
        </h1>
        <p className="text-sm text-[#77717b] mt-1">{myOrders.length.toLocaleString('fa-IR')} سفارش ثبت شده</p>
      </div>

      {myOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#e9e5eb] p-12 text-center">
          <div className="w-20 h-20 bg-[#fff0f7] rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={40} className="text-[#c61d70]/40" />
          </div>
          <h3 className="text-lg font-black text-[#28242b] mb-2">هنوز سفارشی ثبت نکرده‌اید</h3>
          <p className="text-sm text-[#77717b] mb-6">با مرور محصولات، اولین سفارش خود را ثبت کنید.</p>
          <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl hover:bg-[#a9155d] transition-colors">
            شروع خرید <ArrowLeft size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {myOrders.map((order) => {
            const status = statusMap[order.status] || { label: order.status, color: 'bg-gray-50 text-gray-700', icon: Package };
            const StatusIcon = status.icon;
            return (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="group bg-white rounded-2xl border border-[#e9e5eb] p-5 hover:shadow-lg hover:border-[#c61d70]/30 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm md:text-base font-black text-[#28242b]" dir="ltr">
                        {order.trackingCode}
                      </span>
                      <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full font-bold ${status.color}`}>
                        <StatusIcon size={11} /> {status.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#77717b]">
                      <span>تاریخ: {formatPersianDate(order.createdAt)}</span>
                      <span>مبلغ: {formatToman(order.totalAmount)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#c61d70] font-bold text-sm group-hover:translate-x-1 transition-transform">
                    مشاهده جزئیات <ArrowLeft size={16} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}


==========================================================================================
FILE [26/255] src\app\account\(protected)\page.tsx
SIZE 10574 bytes
==========================================================================================
import { formatPersianDate, formatPersianDateTime } from '@/lib/format';
import { db } from '@/lib/db';
import { orders, wishlist, addresses, customers } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import Link from 'next/link';
import { Package, Heart, MapPin, ArrowLeft, Clock, Truck, ShoppingBag, Sparkles, CheckCircle2, ChevronLeft, X, ShieldAlert, Award, Calendar, Crown } from 'lucide-react';
import { formatToman } from '@/lib/currency';

export const instant = false;

const statusMap: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'در انتظار پرداخت', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  paid: { label: 'پرداخت شده', color: 'bg-sky-50 text-sky-700 border-sky-200', icon: CheckCircle2 },
  processing: { label: 'در حال پردازش', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Package },
  shipped: { label: 'ارسال شده', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Truck },
  delivered: { label: 'تحویل شده', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  cancelled: { label: 'لغو شده', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: X },
};

export default async function AccountDashboard() {
  const current = await getCurrentCustomer();
  const customerId = current!.id;

  const [customerData] = await db.select().from(customers).where(eq(customers.id, customerId)).limit(1);
  const isOtpUser = customerData?.email?.endsWith('@temp.fatemehlab.ir') || false;

  const myOrders = await db.select().from(orders).where(eq(orders.customerId, customerId)).orderBy(desc(orders.createdAt));
  const myWishlist = await db.select({ id: wishlist.id }).from(wishlist).where(eq(wishlist.customerId, customerId));
  const myAddresses = await db.select({ id: addresses.id }).from(addresses).where(eq(addresses.customerId, customerId));

  const recentOrders = myOrders.slice(0, 3);

  // محاسبه سابقه عضویت (روز)
  const daysSinceJoin = Math.max(0, Math.floor((Date.now() - new Date(customerData?.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24)));

  const stats = [
    { title: 'سفارشات', value: myOrders.length, icon: Package, href: '/account/orders', color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
    { title: 'علاقه‌مندی', value: myWishlist.length, icon: Heart, href: '/account/wishlist', color: 'from-rose-500 to-pink-600', bg: 'bg-rose-50' },
    { title: 'آدرس‌ها', value: myAddresses.length, icon: MapPin, href: '/account/addresses', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* هشدار تکمیل پروفایل */}
      {isOtpUser && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-xl shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div>
              <p className="font-bold text-amber-800 text-sm">پروفایل خود را تکمیل کنید</p>
              <p className="text-xs text-amber-600 mt-1">برای امنیت بیشتر، یک ایمیل و رمز عبور تنظیم کنید.</p>
            </div>
          </div>
          <Link href="/account/profile" className="whitespace-nowrap bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors shadow-sm">
            تکمیل پروفایل
          </Link>
        </div>
      )}

      {/* کارت خوش‌آمدگویی لوکس */}
      <div className="relative overflow-hidden rounded-[2rem] border border-[#f2d7e5] bg-gradient-to-br from-[#fff0f7] via-[#fce5f0] to-[#f8f7fa] p-6 md:p-10 shadow-sm">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#c61d70]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#c61d70]/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="mb-2 flex items-center gap-2 text-2xl font-black text-[#28242b] md:text-3xl">
              سلام {current!.name.split(' ')[0]} <Sparkles className="text-[#c61d70]" size={28} />
            </h1>
            <p className="text-sm leading-relaxed text-[#77717b]">
              به داشبورد اختصاصی خود خوش آمدید. از اینجا می‌توانید سفارشات، علاقه‌مندی‌ها و اطلاعات خود را مدیریت کنید.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/50 shadow-sm shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-md">
              <Crown size={20} />
            </div>
            <div>
              <p className="text-[10px] text-[#77717b] font-bold">سطح عضویت شما</p>
              <p className="text-sm font-black text-[#28242b]">کاربر ویژه</p>
            </div>
          </div>
        </div>
      </div>

      {/* کارت‌های آماری */}
      <div className="grid grid-cols-3 gap-3 md:gap-5">
        {stats.map((s) => (
          <Link
            key={s.title}
            href={s.href}
            className="group flex flex-col items-center justify-center rounded-3xl border border-[#e9e5eb] bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-[#c61d70]/30 hover:shadow-lg hover:shadow-[#c61d70]/5 md:p-6"
          >
            <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.color} text-white shadow-md transition-transform group-hover:scale-110 md:h-14 md:w-14`}>
              <s.icon size={24} className="md:w-7 md:h-7" />
            </div>
            <p className="text-2xl font-black text-[#28242b] md:text-3xl">{s.value.toLocaleString('fa-IR')}</p>
            <p className="mt-1.5 text-xs font-bold text-[#77717b] md:text-sm">{s.title}</p>
          </Link>
        ))}
      </div>

      {/* دکمه‌های عملیات سریع */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/track" className="flex items-center justify-center gap-2 rounded-2xl border border-[#e9e5eb] bg-white p-4 text-sm font-bold text-[#28242b] shadow-sm transition-all hover:border-[#c61d70]/30 hover:shadow-md">
          <Truck size={18} className="text-[#c61d70]" /> رهگیری سفارش
        </Link>
        <Link href="/products" className="flex items-center justify-center gap-2 rounded-2xl border border-[#e9e5eb] bg-white p-4 text-sm font-bold text-[#28242b] shadow-sm transition-all hover:border-[#c61d70]/30 hover:shadow-md">
          <ShoppingBag size={18} className="text-[#c61d70]" /> ادامه خرید
        </Link>
      </div>

      {/* لیست آخرین سفارشات */}
      <div className="overflow-hidden rounded-3xl border border-[#e9e5eb] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#e9e5eb] p-5 md:p-6 bg-[#fafafc]">
          <h2 className="flex items-center gap-2 text-base font-black text-[#28242b] md:text-lg">
            <Clock size={20} className="text-[#c61d70]" /> آخرین سفارشات
          </h2>
          <Link href="/account/orders" className="text-xs font-bold text-[#c61d70] hover:underline bg-[#fff0f7] px-3 py-1.5 rounded-lg transition-colors hover:bg-[#fce5f0]">
            مشاهده همه
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#fff0f7]">
              <Package size={36} className="text-[#c61d70]/50" />
            </div>
            <p className="mb-4 text-sm font-bold text-[#77717b]">هنوز سفارشی ثبت نکرده‌اید</p>
            <Link href="/products" className="inline-flex items-center gap-2 rounded-xl bg-[#c61d70] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#c61d70]/20 transition-colors hover:bg-[#a9155d]">
              شروع خرید <ArrowLeft size={14} />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#e9e5eb]">
            {recentOrders.map((order) => {
              const status = statusMap[order.status] || { label: order.status, color: 'bg-gray-50 text-gray-700 border-gray-200', icon: Package };
              const StatusIcon = status.icon;
              return (
                <Link key={order.id} href={`/account/orders/${order.id}`} className="group flex items-center justify-between p-4 md:p-5 transition-colors hover:bg-[#fafafc]">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <p className="font-mono text-xs font-bold text-[#28242b] md:text-sm bg-[#f8f7fa] px-2 py-0.5 rounded border border-[#e9e5eb]" dir="ltr">{order.trackingCode}</p>
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${status.color}`}>
                        <StatusIcon size={12} /> {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#918a95] md:text-xs">
                      <span className="flex items-center gap-1"><Calendar size={12}/> {formatPersianDate(order.createdAt)}</span>
                      <span className="w-1 h-1 rounded-full bg-[#e9e5eb]"></span>
                      <span className="font-black text-[#28242b]">{formatToman(order.totalAmount)}</span>
                    </div>
                  </div>
                  <ChevronLeft size={20} className="shrink-0 text-[#c61d70] opacity-50 transition-opacity group-hover:opacity-100" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


==========================================================================================
FILE [27/255] src\app\account\(protected)\profile\loading.tsx
SIZE 850 bytes
==========================================================================================
export default function ProfileLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-[250px] bg-white/60 backdrop-blur-md rounded-3xl border border-[#e9e5eb] p-8 flex items-center gap-6">
        <div className="w-32 h-32 rounded-full bg-gray-200 shrink-0" />
        <div className="space-y-3 flex-1">
          <div className="w-48 h-8 bg-gray-200 rounded-lg" />
          <div className="w-64 h-4 bg-gray-200 rounded" />
          <div className="w-32 h-6 bg-gray-200 rounded-full mt-4" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-white/60 rounded-2xl border border-[#e9e5eb]" />)}
      </div>
      <div className="h-[400px] bg-white/60 rounded-3xl border border-[#e9e5eb]" />
    </div>
  );
}


==========================================================================================
FILE [28/255] src\app\account\(protected)\profile\page.tsx
SIZE 1584 bytes
==========================================================================================
import { db } from '@/lib/db';
import { customers, orders, wishlist, addresses } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import ProfileClient from './profile-client';

export const instant = false;

export default async function ProfilePage() {
  const current = await getCurrentCustomer();
  const [customer] = await db.select().from(customers).where(eq(customers.id, current!.id)).limit(1);

  const myOrders = await db.select({ id: orders.id }).from(orders).where(eq(orders.customerId, current!.id));
  const myWishlist = await db.select({ id: wishlist.id }).from(wishlist).where(eq(wishlist.customerId, current!.id));
  const myAddresses = await db.select({ id: addresses.id }).from(addresses).where(eq(addresses.customerId, current!.id));

  const recentOrders = await db
    .select({
      id: orders.id,
      trackingCode: orders.trackingCode,
      totalAmount: orders.totalAmount,
      status: orders.status,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.customerId, current!.id))
    .orderBy(desc(orders.createdAt))
    .limit(3);

  const stats = {
    orders: myOrders.length,
    wishlist: myWishlist.length,
    addresses: myAddresses.length,
    memberSince: customer.createdAt,
    loyaltyPoints: customer.loyaltyPoints || 0,
    tier: customer.tier || 'bronze',
  };

  const isOtpUser = customer.email.endsWith('@temp.fatemehlab.ir');

  return <ProfileClient customer={customer} stats={stats} recentOrders={recentOrders} isOtpUser={isOtpUser} />;
}


==========================================================================================
FILE [29/255] src\app\account\(protected)\profile\profile-client.tsx
SIZE 38113 bytes
==========================================================================================
'use client';
import { formatPersianDate, formatPersianDateTime } from '@/lib/format';

import { useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Camera, User, Mail, Phone, Loader2, Save, ShieldCheck,
  Package, Heart, MapPin, Calendar, Lock, Eye, EyeOff, Check,
  ArrowLeft, Sparkles, Award, Clock, LogOut, AlertCircle,
  KeyRound, Crown, ChevronLeft, X, CheckCircle2, Truck, ListChecks
} from 'lucide-react';
import { toast } from 'sonner';
import { formatToman } from '@/lib/currency';

function normalizeDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

interface ProfileClientProps {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    createdAt: Date;
  };
  stats: {
    orders: number;
    wishlist: number;
    addresses: number;
    memberSince: Date;
    loyaltyPoints: number;
    tier: string;
  };
  recentOrders: Array<{
    id: string;
    trackingCode: string;
    totalAmount: number;
    status: string;
    createdAt: Date;
  }>;
  isOtpUser?: boolean;
}

const ORDER_STATUS: Record<string, { label: string; cls: string; icon: any }> = {
  pending: { label: 'در انتظار', cls: 'bg-amber-50 text-amber-700 border-amber-200', icon: Clock },
  paid: { label: 'پرداخت شده', cls: 'bg-sky-50 text-sky-700 border-sky-200', icon: CheckCircle2 },
  processing: { label: 'در حال پردازش', cls: 'bg-blue-50 text-blue-700 border-blue-200', icon: Package },
  shipped: { label: 'ارسال شده', cls: 'bg-purple-50 text-purple-700 border-purple-200', icon: Truck },
  delivered: { label: 'تحویل شده', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  cancelled: { label: 'لغو شده', cls: 'bg-rose-50 text-rose-700 border-rose-200', icon: X },
};

function computeMembership(points: number, currentTier: string) {
  const tiers = {
    bronze: { title: 'برنزی', next: 'نقره‌ای', min: 0, max: 500, color: 'orange', bg: 'from-orange-400 to-amber-600' },
    silver: { title: 'نقره‌ای', next: 'طلایی', min: 500, max: 1500, color: 'slate', bg: 'from-slate-400 to-gray-500' },
    gold: { title: 'طلایی', next: null, min: 1500, max: Infinity, color: 'amber', bg: 'from-amber-400 to-yellow-600' },
  };

  const current = tiers[currentTier as keyof typeof tiers] || tiers.bronze;
  
  if (points >= current.max) {
    return { points, title: 'کاربر طلایی', next: null, progress: 100, remaining: 0, bg: tiers.gold.bg, icon: Crown };
  }

  const nextTier = tiers[current.next === 'نقره‌ای' ? 'silver' : 'gold' as keyof typeof tiers];
  const progress = ((points - current.min) / (current.max - current.min)) * 100;
  const remaining = current.max - points;

  return { 
    points, 
    title: `کاربر ${current.title}`, 
    next: `کاربر ${current.next}`, 
    progress: Math.min(100, Math.max(0, progress)), 
    remaining, 
    bg: current.bg, 
    icon: currentTier === 'gold' ? Crown : Award
  };
}

function evaluatePassword(pwd: string) {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
  else if (/[a-zA-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;
  if (score <= 2) return { score: 1, label: 'ضعیف', color: 'rose' };
  if (score === 3) return { score: 2, label: 'متوسط', color: 'amber' };
  if (score === 4) return { score: 3, label: 'خوب', color: 'lime' };
  return { score: 4, label: 'قوی', color: 'emerald' };
}

export default function ProfileClient({ customer, stats, recentOrders, isOtpUser = false }: ProfileClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [avatar, setAvatar] = useState(customer.avatar);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: customer.name,
    phone: customer.phone || '',
    email: isOtpUser ? '' : customer.email,
  });
  const [saving, setSaving] = useState(false);
  const [phoneError, setPhoneError] = useState<string>('');
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState('');
  const [verifyingPhone, setVerifyingPhone] = useState(false);

  const [passwordData, setPasswordData] = useState({ current: '', newPass: '', confirm: '' });
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ current: false, newPass: false, confirm: false });

  const membership = useMemo(() => computeMembership(stats.loyaltyPoints, stats.tier), [stats.loyaltyPoints, stats.tier]);
  const pwdStrength = useMemo(() => evaluatePassword(passwordData.newPass), [passwordData.newPass]);
  const passwordsMatch = passwordData.confirm.length > 0 && passwordData.confirm === passwordData.newPass;

  const isDirty =
    formData.name !== customer.name ||
    (formData.phone || '') !== (customer.phone || '') ||
    (isOtpUser && formData.email !== '');

  const resetForm = () => {
    setFormData({ name: customer.name, phone: customer.phone || '', email: isOtpUser ? '' : customer.email });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('حجم عکس حداکثر ۲ مگابایت است'); return; }
    if (!file.type.startsWith('image/')) { toast.error('فقط فایل تصویری مجاز است'); return; }
    const reader = new FileReader();
    reader.onload = () => { setAvatarPreview(reader.result as string); setPendingFile(file); };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const cancelPreview = () => { setAvatarPreview(null); setPendingFile(null); };

  const confirmAvatarUpload = async () => {
    if (!pendingFile) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', pendingFile);
    try {
      const res = await fetch('/api/account/avatar', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        setAvatar(data.avatar);
        cancelPreview();
        toast.success('عکس پروفایل به‌روزرسانی شد');
        router.refresh();
      } else {
        toast.error(data.message || 'خطا در آپلود');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    setPhoneError('');
    let normalizedPhone = formData.phone;
    if (formData.phone && formData.phone.trim() !== '') {
      normalizedPhone = normalizeDigits(formData.phone).replace(/\s+/g, '');
      if (!/^0\d{10}$/.test(normalizedPhone)) {
        setPhoneError('شماره تماس باید ۱۱ رقم و با ۰ شروع شود');
        return;
      }
    }

    if (normalizedPhone !== (customer.phone || '')) {
      setSaving(true);
      try {
        const res = await fetch('/api/account/phone', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newPhone: normalizedPhone }),
        });
        if (res.ok) {
          toast.success('کد تایید به شماره جدید ارسال شد');
          setPhoneModalOpen(true);
        } else {
          const data = await res.json();
          toast.error(data.message || 'خطا در ارسال کد');
        }
      } catch {
        toast.error('خطا در ارتباط با سرور');
      } finally {
        setSaving(false);
      }
      return;
    }
    
    setSaving(true);
    try {
      const payload: any = { name: formData.name, phone: formData.phone };
      if (isOtpUser && formData.email) payload.email = formData.email;

      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('اطلاعات شما ذخیره شد');
        router.refresh();
      } else {
        toast.error(data.message || 'خطا');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    if (phoneOtp.length < 6) return;
    setVerifyingPhone(true);
    try {
      const res = await fetch('/api/account/phone/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPhone: normalizeDigits(formData.phone).replace(/\s+/g, ''), code: phoneOtp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (formData.name !== customer.name || (isOtpUser && formData.email)) {
        await fetch('/api/account/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, email: isOtpUser ? formData.email : undefined, phone: formData.phone }),
        });
      }

      toast.success('اطلاعات با موفقیت به‌روزرسانی شد');
      setPhoneModalOpen(false);
      setPhoneOtp('');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setVerifyingPhone(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) { toast.error('رمز جدید با تکرار آن یکسان نیست'); return; }
    if (passwordData.newPass.length < 6) { toast.error('رمز جدید باید حداقل ۶ حرف باشد'); return; }
    setChangingPassword(true);
    try {
      const payload: any = { newPassword: passwordData.newPass };
      if (!isOtpUser) payload.currentPassword = passwordData.current;

      const res = await fetch('/api/account/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('رمز عبور با موفقیت تنظیم شد');
        setPasswordData({ current: '', newPass: '', confirm: '' });
      } else {
        toast.error(data.message || 'خطا');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm('آیا از حساب کاربری خود خارج می‌شوید؟')) return;
    try {
      await fetch('/api/account/logout', { method: 'POST' });
      toast.success('با موفقیت خارج شدید');
      router.push('/');
      router.refresh();
    } catch {
      toast.error('خطا در خروج');
    }
  };

  const statCards = [
    { label: 'سفارشات', value: stats.orders, icon: Package, gradient: 'from-blue-500 to-blue-600', href: '/account/orders' },
    { label: 'علاقه‌مندی', value: stats.wishlist, icon: Heart, gradient: 'from-rose-500 to-pink-600', href: '/account/wishlist' },
    { label: 'آدرس‌ها', value: stats.addresses, icon: MapPin, gradient: 'from-amber-500 to-orange-600', href: '/account/addresses' },
    { label: 'امتیاز من', value: membership.points, icon: Award, gradient: 'from-emerald-500 to-teal-600', href: null },
  ];

  const passwordFields: Array<{ key: 'current' | 'newPass' | 'confirm'; label: string }> = [
    ...(isOtpUser ? [] : [{ key: 'current' as const, label: 'رمز عبور فعلی' }]),
    { key: 'newPass', label: isOtpUser ? 'تعیین رمز عبور جدید' : 'رمز عبور جدید' },
    { key: 'confirm', label: 'تکرار رمز جدید' },
  ];

  return (
    <div className="space-y-5 md:space-y-6 pb-8">
      <div className="relative overflow-hidden rounded-3xl border border-[#f2d7e5] bg-gradient-to-br from-[#fff0f7] via-[#fce5f0] to-[#f8f7fa] p-5 md:p-10">
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#c61d70]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#c61d70]/10 blur-3xl" />

        <div className="relative flex flex-col items-center gap-5 md:flex-row md:items-end md:gap-7">
          <div className="relative">
            <div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl md:h-36 md:w-36">
              {avatar ? (
                <Image src={avatar} alt={customer.name} width={144} height={144} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-5xl font-black text-white">
                  {customer.name.charAt(0)}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              aria-label="تغییر عکس پروفایل"
              className="absolute bottom-1 right-1 grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-[#c61d70] text-white shadow-lg transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
            </button>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileSelect} disabled={uploading} className="hidden" />
          </div>

          <div className="flex-1 text-center md:text-right">
            <h1 className="mb-1 text-xl font-black text-[#28242b] md:text-3xl">{customer.name}</h1>
            <p className="mb-3 text-xs text-[#77717b] md:text-sm" dir="ltr">{customer.email}</p>
            <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <span className="inline-flex items-center gap-1 rounded-full border border-[#f2d7e5] bg-white px-3 py-1 text-[10px] font-bold text-[#c61d70] md:text-xs">
                <Crown size={12} /> {membership.title}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-3 py-1 text-[10px] font-bold text-emerald-600 md:text-xs">
                <ShieldCheck size={12} /> حساب فعال
              </span>
              {customer.phone && (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#e9e5eb] bg-white px-3 py-1 text-[10px] font-bold text-[#77717b] md:text-xs" dir="ltr">
                  <Phone size={12} /> {customer.phone}
                </span>
              )}
            </div>
          </div>

          <Link href="/" className="hidden items-center gap-2 rounded-xl border border-[#e9e5eb] bg-white/80 px-4 py-2 text-xs font-bold text-[#28242b] transition-colors hover:bg-white md:inline-flex">
            <ArrowLeft size={14} /> بازگشت به فروشگاه
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {statCards.map((s) => {
          const Icon = s.icon;
          const content = (
            <div className="flex h-full flex-col items-center justify-center p-3 text-center md:p-4">
              <div className={`mb-2 grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${s.gradient} text-white shadow-md md:h-10 md:w-10`}>
                <Icon size={16} className="md:h-[18px] md:w-[18px]" />
              </div>
              <p className="text-lg font-black text-[#28242b] md:text-xl">{s.value.toLocaleString('fa-IR')}</p>
              <p className="mt-0.5 text-[10px] font-medium text-[#77717b]">{s.label}</p>
            </div>
          );
          if (s.href) {
            return (
              <Link key={s.label} href={s.href} className="rounded-2xl border border-[#e9e5eb] bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#c61d70]/40 hover:shadow-md">
                {content}
              </Link>
            );
          }
          return (
            <div key={s.label} className="rounded-2xl border border-[#e9e5eb] bg-white shadow-sm">
              {content}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 md:gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-[#e9e5eb] bg-white p-5 shadow-sm md:p-8">
          <div className="mb-5 flex items-center gap-3 border-b border-[#e9e5eb] pb-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#fff0f7]">
              <User size={20} className="text-[#c61d70]" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#28242b] md:text-lg">اطلاعات شخصی</h2>
              <p className="text-[11px] text-[#77717b] md:text-xs">{isOtpUser ? 'ایمیل خود را تکمیل کنید' : 'نام و شماره تماس خود را ویرایش کنید'}</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label htmlFor="profile-name" className="mb-2 block text-xs font-bold text-[#28242b] md:text-sm">نام و نام خانوادگی</label>
              <div className="relative">
                <User className="absolute right-4 top-3.5 h-5 w-5 text-[#918a95]" />
                <input id="profile-name" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] py-3 pr-12 pl-4 text-sm outline-none transition-all focus:border-[#c61d70] focus:bg-white focus:ring-2 focus:ring-[#c61d70]/20 md:py-3.5 md:text-base" />
              </div>
            </div>

            <div>
              <label htmlFor="profile-email" className="mb-2 block text-xs font-bold text-[#28242b] md:text-sm">{isOtpUser ? 'ایمیل واقعی خود را وارد کنید' : 'ایمیل (غیرقابل تغییر)'}</label>
              <div className="relative">
                <Mail className="absolute right-4 top-3.5 h-5 w-5 text-[#918a95]" />
                <input
                  id="profile-email"
                  type="email"
                  value={isOtpUser ? formData.email : customer.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isOtpUser}
                  required={isOtpUser}
                  dir="ltr"
                  placeholder={isOtpUser ? 'you@example.com' : ''}
                  className={`w-full rounded-xl border py-3 pr-12 pl-4 text-left text-sm outline-none transition-all md:py-3.5 md:text-base ${
                    isOtpUser
                      ? 'border-[#c61d70] bg-white focus:ring-2 focus:ring-[#c61d70]/20'
                      : 'cursor-not-allowed border-[#e9e5eb] bg-[#f8f7fa] text-[#918a95]'
                  }`}
                />
              </div>
            </div>

            <div>
              <label htmlFor="profile-phone" className="mb-2 block text-xs font-bold text-[#28242b] md:text-sm">شماره موبایل</label>
              <div className="relative">
                <Phone className="absolute right-4 top-3.5 h-5 w-5 text-[#918a95]" />
                <input id="profile-phone" type="tel" value={formData.phone} onChange={(e) => { setFormData({ ...formData, phone: e.target.value.replace(/[^\d۰-۹]/g, "").slice(0, 11) }); setPhoneError(""); }} dir="ltr" placeholder="09xxxxxxxxx" className="w-full rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] py-3 pr-12 pl-4 text-left text-sm outline-none transition-all focus:border-[#c61d70] focus:bg-white focus:ring-2 focus:ring-[#c61d70]/20 md:py-3.5 md:text-base" />
              </div>
            </div>

            <button type="submit" disabled={saving || !isDirty} className="hidden w-full items-center justify-center gap-2 rounded-xl bg-[#c61d70] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#c61d70]/30 transition-colors hover:bg-[#a9155d] disabled:opacity-40 md:flex">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-[#e9e5eb] bg-white p-5 shadow-sm md:p-8">
          <div className="mb-5 flex items-center gap-3 border-b border-[#e9e5eb] pb-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#fff0f7]">
              <KeyRound size={20} className="text-[#c61d70]" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#28242b] md:text-lg">{isOtpUser ? 'تعیین رمز عبور' : 'تغییر رمز عبور'}</h2>
              <p className="text-[11px] text-[#77717b] md:text-xs">{isOtpUser ? 'برای ورود بعدی با ایمیل، یک رمز تنظیم کنید' : 'رمز جدید باید حداقل ۶ حرف باشد'}</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {passwordFields.map((field) => (
              <div key={field.key}>
                <label htmlFor={`pwd-${field.key}`} className="mb-2 block text-xs font-bold text-[#28242b] md:text-sm">{field.label}</label>
                <div className="relative">
                  <Lock className="absolute right-4 top-3.5 h-5 w-5 text-[#918a95]" />
                  <input
                    id={`pwd-${field.key}`}
                    type={showPasswords[field.key] ? 'text' : 'password'}
                    value={passwordData[field.key]}
                    onChange={(e) => setPasswordData({ ...passwordData, [field.key]: e.target.value })}
                    required
                    dir="ltr"
                    placeholder="••••••••"
                    minLength={field.key === 'newPass' ? 6 : undefined}
                    className={`w-full rounded-xl border bg-[#f8f7fa] py-3 pr-12 pl-12 text-left text-sm outline-none transition-all focus:bg-white focus:ring-2 md:py-3.5 md:text-base ${
                      field.key === 'confirm' && passwordsMatch
                        ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/20'
                        : 'border-[#e9e5eb] focus:border-[#c61d70] focus:ring-[#c61d70]/20'
                    }`}
                  />
                  <button type="button" onClick={() => setShowPasswords({ ...showPasswords, [field.key]: !showPasswords[field.key] })} className="absolute left-4 top-3.5 text-[#918a95] transition-colors hover:text-[#c61d70]" aria-label={showPasswords[field.key] ? 'مخفی کردن رمز' : 'نمایش رمز'}>
                    {showPasswords[field.key] ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {field.key === 'newPass' && passwordData.newPass.length > 0 && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex flex-1 gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= pwdStrength.score
                            ? pwdStrength.color === 'rose' ? 'bg-rose-400'
                            : pwdStrength.color === 'amber' ? 'bg-amber-400'
                            : pwdStrength.color === 'lime' ? 'bg-lime-400'
                            : 'bg-emerald-400'
                            : 'bg-[#e9e5eb]'
                        }`} />
                      ))}
                    </div>
                    <span className={`text-[10px] font-bold ${
                      pwdStrength.color === 'rose' ? 'text-rose-500'
                      : pwdStrength.color === 'amber' ? 'text-amber-500'
                      : pwdStrength.color === 'lime' ? 'text-lime-600'
                      : 'text-emerald-600'
                    }`}>{pwdStrength.label}</span>
                  </div>
                )}

                {field.key === 'confirm' && passwordData.confirm.length > 0 && (
                  <p className={`mt-1.5 flex items-center gap-1 text-[10px] font-bold ${passwordsMatch ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {passwordsMatch ? <><Check size={12} /> رمزها یکسان هستند</> : <><AlertCircle size={12} /> رمزها یکسان نیستند</>}
                  </p>
                )}
              </div>
            ))}

            <button type="submit" disabled={changingPassword} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#28242b] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#3a333f] disabled:opacity-50">
              {changingPassword ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
              {changingPassword ? 'در حال ذخیره...' : isOtpUser ? 'تنظیم رمز عبور' : 'تغییر رمز عبور'}
            </button>
          </form>
        </section>
      </div>

      <section className="rounded-3xl border border-[#e9e5eb] bg-white p-5 shadow-sm md:p-8">
        <div className="mb-5 flex items-center justify-between border-b border-[#e9e5eb] pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#fff0f7]">
              <ListChecks size={20} className="text-[#c61d70]" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#28242b] md:text-lg">سفارشات اخیر</h2>
              <p className="text-[11px] text-[#77717b] md:text-xs">آخرین سفارش‌های ثبت‌شده شما</p>
            </div>
          </div>
          <Link href="/account/orders" className="text-xs font-bold text-[#c61d70] hover:underline">مشاهده همه</Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-8 text-center">
            <Package size={36} className="mx-auto mb-3 text-[#c61d70]/30" />
            <p className="mb-3 text-xs text-[#77717b]">هنوز سفارشی ثبت نکرده‌اید</p>
            <Link href="/products" className="inline-flex items-center gap-1 rounded-xl bg-[#fff0f7] px-4 py-2 text-xs font-bold text-[#c61d70]">
              شروع خرید <ArrowLeft size={12} />
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentOrders.map((order) => {
              const st = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
              const Icon = st.icon;
              return (
                <Link key={order.id} href={`/account/orders/${order.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-[#e9e5eb] bg-white p-3 transition-all hover:border-[#c61d70]/40 hover:bg-[#fffafd] md:p-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#28242b] md:text-sm" dir="ltr">{order.trackingCode}</span>
                      <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold ${st.cls}`}>
                        <Icon size={10} /> {st.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#918a95]">
                      <span>{formatPersianDate(order.createdAt)}</span>
                      <span>·</span>
                      <span className="font-bold text-[#28242b]">{formatToman(order.totalAmount)}</span>
                    </div>
                  </div>
                  <ChevronLeft size={16} className="shrink-0 text-[#c61d70]" />
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#28242b] to-[#3a333f] p-4 text-white md:p-8">
        <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#c61d70]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

        <div className="relative">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles size={20} className="text-[#f4b7d5]" />
            <h3 className="text-base font-black md:text-lg">باشگاه مشتریان فاطمه بیوتی لند</h3>
          </div>
          <p className="mb-6 text-xs leading-relaxed text-white/70 md:text-sm">
            به عنوان عضو فعال، به تخفیف‌های ویژه، پیشنهادهای اختصاصی و اطلاع‌رسانی زودتر محصولات جدید دسترسی دارید.
          </p>
          <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <membership.icon size={16} className="text-[#f4b7d5]" />
                <span className="text-xs font-bold text-white/80">سطح فعلی: <span className="text-[#f4b7d5]">{membership.title}</span></span>
              </div>
              <span className="text-xs font-black text-[#f4b7d5] bg-white/10 px-2 py-1 rounded-md">{membership.points.toLocaleString('fa-IR')} امتیاز</span>
            </div>
            
            {membership.next ? (
              <>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-l from-[#c61d70] to-[#f4b7d5] transition-all duration-1000" style={{ width: `${membership.progress}%` }} />
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-white/60">
                  <span>{membership.progress.toFixed(0)}٪</span>
                  <span>تا {membership.next}: {membership.remaining.toLocaleString('fa-IR')} امتیاز دیگر</span>
                </div>
              </>
            ) : (
              <div className="text-center py-2 text-xs font-bold text-amber-300 bg-amber-500/10 rounded-lg border border-amber-500/20">
                🎉 شما در بالاترین سطح وفاداری هستید!
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-3">
            <div className="rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
              <Clock size={16} className="mb-2 text-[#f4b7d5]" />
              <p className="mb-1 text-[10px] text-white/60">عضویت شما</p>
              <p className="text-xs md:text-sm font-black truncate">{formatPersianDate(stats.memberSince)}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
              <Award size={16} className="mb-2 text-[#f4b7d5]" />
              <p className="mb-1 text-[10px] text-white/60">سطح فعلی</p>
              <p className="text-xs md:text-sm font-black truncate">{membership.title}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-sm">
              <Calendar size={16} className="mb-2 text-[#f4b7d5]" />
              <p className="mb-1 text-[10px] text-white/60">امتیاز فعلی</p>
              <p className="text-xs md:text-sm font-black truncate">{membership.points.toLocaleString('fa-IR')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-rose-200 bg-white p-5 shadow-sm md:p-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-rose-50">
            <LogOut size={20} className="text-rose-500" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#28242b] md:text-lg">خروج از حساب</h2>
            <p className="text-[11px] text-[#77717b] md:text-xs">با خروج، دسترسی به این بخش قطع می‌شود</p>
          </div>
        </div>
        <button type="button" onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 py-3 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-100 md:w-auto md:px-6">
          <LogOut size={16} /> خروج از حساب کاربری
        </button>
      </section>

      <Link href="/" className="flex items-center justify-center gap-2 rounded-xl border border-[#e9e5eb] bg-white py-3 text-sm font-bold text-[#28242b] transition-transform active:scale-[0.98] md:hidden">
        <ArrowLeft size={16} /> بازگشت به فروشگاه
      </Link>

      {isDirty && !saving && (
        <div className="fixed bottom-[90px] left-3 right-3 z-40 flex gap-2 rounded-2xl border border-[#e9e5eb] bg-white p-2 shadow-2xl md:hidden">
          <button type="button" onClick={resetForm} className="flex-1 rounded-xl py-2.5 text-sm font-bold text-[#77717b] transition-colors hover:bg-[#f8f7fa]">انصراف</button>
          <button type="button" onClick={() => handleSaveProfile()} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#c61d70] py-2.5 text-sm font-bold text-white shadow-lg shadow-[#c61d70]/30">
            <Save size={16} /> ذخیره
          </button>
        </div>
      )}

      {phoneModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setPhoneModalOpen(false)}>
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-black text-[#28242b] text-center mb-2">تایید شماره جدید</h3>
            <p className="text-xs text-[#77717b] text-center mb-6">
              کد ۶ رقمی ارسال شده به <span className="font-bold text-[#28242b]" dir="ltr">{formData.phone}</span> را وارد کنید.
            </p>
            
            <input
              type="text"
              value={phoneOtp}
              onChange={e => setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full text-center text-2xl font-mono tracking-[0.5em] py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:border-[#c61d70] outline-none"
              placeholder="------"
              maxLength={6}
              dir="ltr"
            />
            
            <div className="flex gap-2 mt-6">
              <button onClick={() => setPhoneModalOpen(false)} className="flex-1 rounded-xl bg-[#f8f7fa] py-3 text-sm font-bold text-[#77717b]">
                انصراف
              </button>
              <button
                onClick={handleVerifyPhoneOtp}
                disabled={verifyingPhone || phoneOtp.length < 6}
                className="flex-1 rounded-xl bg-[#c61d70] py-3 text-sm font-bold text-white disabled:opacity-50 flex items-center justify-center"
              >
                {verifyingPhone ? <Loader2 className="animate-spin" size={18} /> : 'تایید کد'}
              </button>
            </div>
          </div>
        </div>
      )}

      {avatarPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" onClick={cancelPreview}>
          <div className="w-full max-w-sm rounded-3xl border border-[#e9e5eb] bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 text-center text-base font-black text-[#28242b]">پیش‌نمایش عکس پروفایل</h3>
            <div className="mx-auto mb-5 h-40 w-40 overflow-hidden rounded-full border-4 border-[#fff0f7]">
              <Image src={avatarPreview} alt="پیش‌نمایش" width={160} height={160} className="h-full w-full object-cover" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={cancelPreview} className="flex-1 rounded-xl bg-[#f8f7fa] py-3 text-sm font-bold text-[#28242b] transition-colors hover:bg-[#e9e5eb]">انصراف</button>
              <button type="button" onClick={confirmAvatarUpload} disabled={uploading} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#c61d70] py-3 text-sm font-bold text-white shadow-lg shadow-[#c61d70]/30 disabled:opacity-50">
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {uploading ? 'در حال آپلود...' : 'تایید و آپلود'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


==========================================================================================
FILE [30/255] src\app\account\(protected)\profile\profile-form.tsx
SIZE 5287 bytes
==========================================================================================
'use client';

import { useState } from 'react';
import { User, Mail, Phone, Loader2, Save, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


export default function ProfileForm({ customer }: { customer: any }) {
  const [formData, setFormData] = useState({ name: customer.name, phone: customer.phone || '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('اطلاعات با موفقیت ذخیره شد');
        router.refresh();
      } else {
        toast.error(data.message || 'خطا');
      }
    } catch {
      toast.error('خطا در ارتباط');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-[#28242b] flex items-center gap-2">
          <User className="text-[#c61d70]" /> پروفایل من
        </h1>
        <p className="text-sm text-[#77717b] mt-1">اطلاعات شخصی خود را ویرایش کنید</p>
      </div>

      <div className="bg-white rounded-3xl border border-[#e9e5eb] p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#e9e5eb]">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-white flex items-center justify-center text-2xl md:text-3xl font-black shadow-lg">
            {customer.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-black text-[#28242b]">{customer.name}</h2>
            <p className="text-sm text-[#77717b]" dir="ltr">{customer.email}</p>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold mt-2">
              <ShieldCheck size={10} /> حساب تایید شده
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-bold text-[#28242b] mb-2 block">نام و نام خانوادگی</label>
            <div className="relative">
              <User className="absolute right-4 top-3.5 w-5 h-5 text-[#918a95]" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full pr-12 pl-4 py-3.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-base transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-[#28242b] mb-2 block">ایمیل (غیرقابل تغییر)</label>
            <div className="relative">
              <Mail className="absolute right-4 top-3.5 w-5 h-5 text-[#918a95]" />
              <input
                type="email"
                value={customer.email}
                disabled
                dir="ltr"
                className="w-full pr-12 pl-4 py-3.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-base text-left text-[#918a95] cursor-not-allowed"
              />
            </div>
            <p className="text-[10px] text-[#918a95] mt-1">برای تغییر ایمیل با پشتیبانی تماس بگیرید</p>
          </div>

          <div>
            <label className="text-sm font-bold text-[#28242b] mb-2 block">شماره موبایل</label>
            <div className="relative">
              <Phone className="absolute right-4 top-3.5 w-5 h-5 text-[#918a95]" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                dir="ltr"
                placeholder="09xxxxxxxxx"
                className="w-full pr-12 pl-4 py-3.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-base transition-all text-left"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#c61d70]/30 hover:bg-[#a9155d] transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </button>
        </form>
      </div>
    </div>
  );
}


==========================================================================================
FILE [31/255] src\app\account\(protected)\support\[id]\chat-client.tsx
SIZE 25508 bytes
==========================================================================================
'use client';

import { useState, useEffect, useRef, useMemo, Fragment } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Loader2, Send, ShieldCheck, X, ImagePlus, Clock,
  ArrowDown, Lock, Sparkles, MessageCircle, Check, CheckCheck,
  Search, Smile, Copy, Volume2, VolumeX, Maximize2, Minimize2,
  Rows3, Rows4, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const STATUS: Record<string, { label: string; cls: string; dot: string }> = {
  open: { label: 'باز', cls: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  answered: { label: 'پاسخ داده شده', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  closed: { label: 'بسته', cls: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400' },
};

const EMOJIS = ['😀','😂','❤️','👍','🙏','🔥','✨','🎉','😍','😊','🤔','😢','💯','👌','🙌','💖','🌸','🌷','💐','🦋'];

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
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
    osc.start(); osc.stop(ctx.currentTime + 0.25);
  } catch {}
}

function renderText(text: string, query: string) {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline font-bold hover:opacity-80 break-all">{part}</a>;
    }
    if (query && part.toLowerCase().includes(query.toLowerCase())) {
      const segments = part.split(new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'));
      return (
        <Fragment key={i}>
          {segments.map((s, j) =>
            s.toLowerCase() === query.toLowerCase()
              ? <mark key={j} className="bg-yellow-300/80 rounded px-0.5 text-[#28242b]">{s}</mark>
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
  const [compact, setCompact] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('chat-compact') === 'on';
  });
  const [fullscreen, setFullscreen] = useState(false);
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
  const lastReadId = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].senderType === 'customer' && messages[i].isRead) return messages[i].id;
    }
    return null;
  }, [messages]);

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
      if (newMsgs.some(m => m.senderType === 'admin') && soundOn) playBeep();
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
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px';
  }, [newMessage]);

  useEffect(() => { localStorage.setItem('chat-sound', soundOn ? 'on' : 'off'); }, [soundOn]);
  useEffect(() => { localStorage.setItem('chat-compact', compact ? 'on' : 'off'); }, [compact]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (fullscreen) setFullscreen(false);
        else if (searchMode) { setSearchMode(false); setSearchQuery(''); }
        else if (showEmoji) setShowEmoji(false);
        else if (lightbox) setLightbox(null);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setSearchMode(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fullscreen, searchMode, showEmoji, lightbox]);

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

  const containerClass = fullscreen
    ? 'fixed inset-0 z-[150] flex flex-col bg-[#fafafc]'
    : 'relative flex flex-col h-[calc(100dvh-160px)] md:h-[calc(100dvh-120px)] bg-[#fafafc] rounded-[2rem] border border-[#e9e5eb] shadow-2xl shadow-[#c61d70]/10 overflow-hidden';

  return (
    <div className={containerClass}>
      <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#c61d70]/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-300/10 blur-3xl" />

      {/* HEADER */}
      <div className="relative shrink-0 border-b border-[#f2d7e5] bg-gradient-to-br from-[#fff0f7] via-[#fce5f0] to-white backdrop-blur-xl">
        <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#c61d70]/10 blur-2xl" />
        <div className="relative px-3 md:px-5 py-3 md:py-4 flex items-center gap-3">
          <Link href="/account/support" className="p-2.5 rounded-2xl bg-white/80 backdrop-blur text-[#77717b] hover:bg-white hover:text-[#c61d70] transition-all shadow-sm shrink-0" aria-label="بازگشت">
            <ArrowRight size={18} />
          </Link>
          <div className="relative shrink-0">
            <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-[#c61d70] to-[#e84e9e] flex items-center justify-center text-white shadow-lg shadow-[#c61d70]/30 ring-2 ring-white">
              <MessageCircle size={22} />
            </div>
            <span className={'absolute -bottom-0.5 -left-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-white animate-pulse ' + statusInfo.dot} />
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
            <button onClick={() => setCompact(!compact)} className={'p-2 rounded-xl transition-all ' + (compact ? 'bg-[#c61d70] text-white shadow-md' : 'bg-white/70 text-[#77717b] hover:bg-white hover:text-[#c61d70]')} aria-label="حالت فشرده" title={compact ? 'نرمال' : 'فشرده'}>
              {compact ? <Rows4 size={16} /> : <Rows3 size={16} />}
            </button>
            <button onClick={() => { setSearchMode(!searchMode); setSearchQuery(''); }} className={'p-2 rounded-xl transition-all ' + (searchMode ? 'bg-[#c61d70] text-white shadow-md' : 'bg-white/70 text-[#77717b] hover:bg-white hover:text-[#c61d70]')} aria-label="جستجو" title="جستجو (Ctrl+F)">
              <Search size={16} />
            </button>
            <button onClick={() => setSoundOn(!soundOn)} className="p-2 rounded-xl bg-white/70 text-[#77717b] hover:bg-white hover:text-[#c61d70] transition-all" aria-label="صدا">
              {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button onClick={() => setFullscreen(!fullscreen)} className="p-2 rounded-xl bg-white/70 text-[#77717b] hover:bg-white hover:text-[#c61d70] transition-all hidden md:flex" aria-label="تمام‌صفحه">
              {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
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
      <div ref={scrollRef} onScroll={handleScroll} className="chat-scroll flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 md:px-6 py-4 md:py-6 relative">
        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="relative mb-5">
              <div className="absolute inset-0 rounded-full bg-[#fff0f7] animate-ping" style={{ animationDuration: '2.5s' }} />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#c61d70] to-[#e84e9e] flex items-center justify-center shadow-xl shadow-[#c61d70]/30">
                <Sparkles size={36} className="text-white" />
              </div>
            </div>
            <h3 className="text-lg font-black text-[#28242b] mb-2">{searchQuery ? 'پیامی پیدا نشد' : 'گفتگو رو شروع کن'}</h3>
            <p className="text-sm text-[#77717b] max-w-xs leading-relaxed">
              {searchQuery ? 'عبارت جستجو رو تغییر بده.' : 'اولین پیامت رو بفرست تا تیم پشتیبانی پاسخ بده.'}
            </p>
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
                const isUnread = !isAdmin && msg.id === lastReadId;
                return (
                  <div key={msg.id} className={'group flex gap-2 mt-1.5 ' + (isAdmin ? 'flex-row' : 'flex-row-reverse') + ' animate-in fade-in slide-in-from-bottom-2 duration-300'} style={{ animationDelay: (mi * 30) + 'ms' }}>
                    <div className={'shrink-0 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-md ' + (compact ? 'w-6 h-6 text-[8px]' : 'w-8 h-8') + ' ' + (isAdmin ? 'bg-gradient-to-br from-[#c61d70] to-[#e84e9e] ring-2 ring-white' : 'bg-gradient-to-br from-[#28242b] to-[#5a535e]') + (showAvatar ? '' : ' opacity-0')}>
                      {isAdmin ? <ShieldCheck size={compact ? 10 : 14} /> : currentUserName.charAt(0)}
                    </div>
                    <div className={'max-w-[78%] md:max-w-[70%] flex flex-col ' + (isAdmin ? 'items-start' : 'items-end')}>
                      {showAvatar && !compact && (
                        <span className="text-[9px] font-bold text-[#918a95] mb-1 px-1">
                          {isAdmin ? 'تیم پشتیبانی' : 'شما'}
                        </span>
                      )}
                      <div className={'relative rounded-2xl overflow-hidden shadow-sm ' + (compact ? 'text-[12px]' : 'text-[13px] md:text-sm') + ' ' + (isAdmin ? 'bg-white border border-[#e9e5eb] text-[#28242b] rounded-tr-sm' : 'bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-white rounded-tl-sm shadow-[#c61d70]/25')}>
                        {msg.attachmentUrl && (
                          <button onClick={() => setLightbox(msg.attachmentUrl)} className="block w-full max-w-[260px] cursor-zoom-in hover:opacity-95 transition-opacity">
                            <img src={msg.attachmentUrl} alt="پیوست" className="w-full h-auto object-cover" loading="lazy" />
                          </button>
                        )}
                        {msg.message && msg.message !== 'عکس ارسال شد' && (
                          <div className={'whitespace-pre-wrap break-words ' + (compact ? 'px-3 py-1.5' : 'px-4 py-2.5')}>
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
              <div className="mb-3 relative inline-block">
                <img src={attachmentUrl} alt="پیش‌نمایش" className="h-20 w-auto rounded-xl border-2 border-[#f2d7e5] shadow-sm" />
                <button onClick={() => setAttachmentUrl(null)} className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 shadow-md transition-colors" aria-label="حذف عکس">
                  <X size={12} />
                </button>
              </div>
            )}
            {showEmoji && (
              <div className="mb-2 p-2 rounded-2xl bg-white border border-[#e9e5eb] shadow-lg animate-in slide-in-from-bottom-2 flex flex-wrap gap-1 max-w-md">
                {EMOJIS.map((e, i) => (
                  <button key={i} onClick={() => { setNewMessage(prev => prev + e); textareaRef.current?.focus(); }} className="w-9 h-9 rounded-xl hover:bg-[#fff0f7] text-xl transition-colors">
                    {e}
                  </button>
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
                  className="flex-1 py-3 px-1 bg-transparent text-sm outline-none resize-none max-h-40 chat-scroll-hide"
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


==========================================================================================
FILE [32/255] src\app\account\(protected)\support\[id]\page.tsx
SIZE 1554 bytes
==========================================================================================
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { supportTickets, supportMessages } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { notFound } from 'next/navigation';
import ChatClient from './chat-client';

export const instant = false;

function Skeleton() {
  return <div className="p-8 text-center text-[#c61d70]">در حال بارگذاری چت...</div>;
}

async function ChatContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const current = await getCurrentCustomer();
  if (!current) return null;

  const [ticket] = await db.select().from(supportTickets).where(and(eq(supportTickets.id, id), eq(supportTickets.customerId, current.id))).limit(1);
  if (!ticket) notFound();

  const messages = await db.select().from(supportMessages).where(eq(supportMessages.ticketId, id)).orderBy(asc(supportMessages.createdAt));

  if (ticket.unreadByCustomer > 0) {
    await db.update(supportMessages).set({ isRead: true }).where(and(eq(supportMessages.ticketId, id), eq(supportMessages.senderType, 'admin')));
    await db.update(supportTickets).set({ unreadByCustomer: 0 }).where(eq(supportTickets.id, id));
  }

  return <ChatClient ticket={ticket} initialMessages={messages} currentUserName={current.name} />;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <ChatContent params={params} />
    </Suspense>
  );
}


==========================================================================================
FILE [33/255] src\app\account\(protected)\support\page.tsx
SIZE 314 bytes
==========================================================================================
import { Suspense } from 'react';
import SupportClient from './support-client';

export const instant = false;

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#c61d70]">در حال بارگذاری...</div>}>
      <SupportClient />
    </Suspense>
  );
}


==========================================================================================
FILE [34/255] src\app\account\(protected)\support\support-client.tsx
SIZE 9493 bytes
==========================================================================================
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MessageCircle, Plus, Search, Clock, CheckCircle2, X, Loader2, ChevronLeft, Send } from 'lucide-react';
import { toast } from 'sonner';
import { formatPersianDate } from '@/lib/format';

const CATEGORIES: Record<string, string> = { order: 'سفارش', product: 'محصول', payment: 'پرداخت', other: 'سایر' };
const STATUS: Record<string, { label: string; cls: string; icon: any }> = {
  open: { label: 'باز', cls: 'bg-blue-50 text-blue-700 border-blue-200', icon: Clock },
  answered: { label: 'پاسخ داده شده', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  closed: { label: 'بسته', cls: 'bg-gray-50 text-gray-600 border-gray-200', icon: X },
};

export default function SupportClient() {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('order');
  const [newMessage, setNewMessage] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch('/api/support/tickets')
      .then(res => res.json())
      .then(data => { if (data.success) setTickets(data.tickets); })
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (newSubject.length < 5) { toast.error('موضوع حداقل ۵ حرف'); return; }
    if (newMessage.length < 10) { toast.error('پیام حداقل ۱۰ حرف'); return; }
    setCreating(true);
    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject: newSubject, category: newCategory, message: newMessage }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('تیکت ایجاد شد');
        router.push(`/account/support/${data.ticket.id}`);
      } else toast.error(data.message || 'خطا');
    } catch { toast.error('خطا'); }
    finally { setCreating(false); }
  };

  const filtered = tickets.filter(t => t.subject.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="p-12 text-center text-[#c61d70]"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-5 pb-8">
      <div className="relative overflow-hidden rounded-3xl border border-[#f2d7e5] bg-gradient-to-br from-[#fff0f7] via-[#fce5f0] to-[#f8f7fa] p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-black text-[#28242b] md:text-2xl">
              <MessageCircle className="text-[#c61d70]" size={26} /> پشتیبانی
            </h1>
            <p className="text-xs text-[#77717b] md:text-sm mt-2">چطور می‌توانیم کمکتان کنیم؟</p>
          </div>
          <button onClick={() => setShowNew(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#c61d70] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-colors w-full md:w-auto">
            <Plus size={18} /> تیکت جدید
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95]" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="جستجو در تیکت‌ها..." className="w-full pr-11 pl-4 py-3.5 bg-white border border-[#e9e5eb] rounded-2xl text-sm outline-none focus:border-[#c61d70] transition-all" />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#e9e5eb] bg-white p-12 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#fff0f7]">
            <MessageCircle size={36} className="text-[#c61d70]/50" />
          </div>
          <h3 className="text-lg font-black text-[#28242b] mb-2">{tickets.length === 0 ? 'هنوز تیکتی ندارید' : 'تیکتی یافت نشد'}</h3>
          <p className="text-sm text-[#77717b] mb-6">{tickets.length === 0 ? 'سوالی دارید؟ روی «تیکت جدید» کلیک کنید.' : 'عبارت جستجو را تغییر دهید.'}</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((ticket) => {
            const status = STATUS[ticket.status] || STATUS.open;
            const StatusIcon = status.icon;
            return (
              <Link key={ticket.id} href={`/account/support/${ticket.id}`} className="group rounded-2xl border border-[#e9e5eb] bg-white p-4 hover:border-[#c61d70]/30 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <h3 className="font-black text-sm md:text-base text-[#28242b] truncate">{ticket.subject}</h3>
                      {ticket.unreadByCustomer > 0 && (
                        <span className="shrink-0 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-[#c61d70] text-white text-[10px] font-black">{ticket.unreadByCustomer.toLocaleString('fa-IR')}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${status.cls}`}><StatusIcon size={10} /> {status.label}</span>
                      <span className="inline-flex items-center rounded-full bg-[#f8f7fa] border border-[#e9e5eb] px-2 py-0.5 text-[10px] font-bold text-[#77717b]">{CATEGORIES[ticket.category] || ticket.category}</span>
                    </div>
                  </div>
                  <ChevronLeft size={18} className="shrink-0 text-[#c61d70] opacity-50 group-hover:opacity-100" />
                </div>
                <div className="text-[10px] text-[#918a95] flex items-center gap-2"><Clock size={11} /> آخرین پیام: {formatPersianDate(ticket.lastMessageAt)}</div>
              </Link>
            );
          })}
        </div>
      )}

      {showNew && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setShowNew(false)}>
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#e9e5eb]">
              <h3 className="text-lg font-black text-[#28242b]">تیکت جدید</h3>
              <button onClick={() => setShowNew(false)} className="p-1.5 rounded-lg text-[#77717b] hover:bg-[#f8f7fa]"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#28242b] mb-2">موضوع</label>
                <input type="text" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} placeholder="مثلاً: پیگیری سفارش" className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm outline-none focus:border-[#c61d70] focus:bg-white transition-all" maxLength={200} />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#28242b] mb-2">دسته‌بندی</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(CATEGORIES).map(([key, val]) => (
                    <button key={key} type="button" onClick={() => setNewCategory(key)} className={`py-2.5 rounded-xl text-xs font-bold transition-all ${newCategory === key ? 'bg-[#c61d70] text-white' : 'bg-[#f8f7fa] text-[#77717b] border border-[#e9e5eb]'}`}>{val}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#28242b] mb-2">توضیحات</label>
                <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="جزئیات مشکل یا سوال..." rows={5} className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm outline-none focus:border-[#c61d70] focus:bg-white resize-none transition-all" maxLength={2000} />
              </div>
              <button onClick={handleCreate} disabled={creating} className="w-full py-3.5 bg-[#c61d70] text-white text-sm font-black rounded-xl shadow-lg shadow-[#c61d70]/25 hover:bg-[#a9155d] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {creating ? <><Loader2 size={16} className="animate-spin" /> در حال ارسال...</> : <><Send size={16} /> ارسال تیکت</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


==========================================================================================
FILE [35/255] src\app\account\(protected)\wishlist\page.tsx
SIZE 6042 bytes
==========================================================================================
import { db } from '@/lib/db';
import { wishlist, products } from '@/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import Link from 'next/link';
import SafeImage from '@/components/product/SafeImage';
import { Heart, Package, ArrowLeft, ShoppingBag } from 'lucide-react';
import { formatToman } from '@/lib/currency';
import { getPublicProductImage } from '@/lib/product-content';
import WishlistRemoveButton from './remove-button';
import EmptyState from '@/components/shared/EmptyState';


export const instant = false;

export default async function WishlistPage() {
  const customer = await getCurrentCustomer();
  const customerId = customer!.id;

  const items = await db
    .select({
      id: wishlist.id,
      productId: wishlist.productId,
      createdAt: wishlist.createdAt,
    })
    .from(wishlist)
    .where(eq(wishlist.customerId, customerId))
    .orderBy(desc(wishlist.createdAt));

  let productsList: any[] = [];
  if (items.length > 0) {
    const productIds = items.map(i => i.productId);
    productsList = await db.select().from(products).where(inArray(products.id, productIds));
  }

  const mergedItems = items
    .map(item => ({
      ...item,
      product: productsList.find(p => p.id === item.productId),
    }))
    .filter(item => item.product);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#28242b] flex items-center gap-2">
            <Heart className="text-rose-500" fill="currentColor" />
            علاقه‌مندی‌های من
          </h1>
          <p className="text-sm text-[#77717b] mt-1">
            {mergedItems.length.toLocaleString('fa-IR')} محصول در لیست علاقه‌مندی‌های شما
          </p>
        </div>
        <Link href="/products" className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-[#c61d70] text-white text-sm font-bold rounded-xl hover:bg-[#a9155d] transition-colors">
          <ShoppingBag size={16} /> ادامه خرید
        </Link>
      </div>

      {mergedItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#e9e5eb] p-12 text-center">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-rose-300" />
          </div>
          <h3 className="text-lg font-black text-[#28242b] mb-2">لیست علاقه‌مندی‌ها خالی است</h3>
          <p className="text-sm text-[#77717b] mb-6 max-w-md mx-auto">
            محصولاتی که به آن‌ها علاقه دارید را با کلیک روی آیکون قلب ذخیره کنید و بعداً به راحتی پیدایشان کنید.
          </p>
          <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl hover:bg-[#a9155d] transition-colors">
            مشاهده محصولات <ArrowLeft size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {mergedItems.map((item) => {
            const product = item.product!;
            const hasPrice = product.price > 0;
            const isAvailable = product.stock > 0 && hasPrice;
            const productImage = getPublicProductImage(product.mainImage);

            return (
              <div key={item.id} className="group bg-white rounded-2xl border border-[#e9e5eb] overflow-hidden hover:shadow-xl hover:shadow-[#c61d70]/5 transition-all">
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="relative aspect-square bg-[#fafafc] p-4">
                    {productImage ? (
                      <SafeImage src={productImage} alt={product.name} fill className="object-contain transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#c61d70]/20"><Package size={32} /></div>
                    )}
                    {!isAvailable && (
                      <span className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[9px] font-bold text-rose-500 shadow-sm">
                        {hasPrice ? 'ناموجود' : 'در انتظار قیمت'}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm md:text-base font-black text-[#28242b] mb-1 line-clamp-1 group-hover:text-[#c61d70] transition-colors">{product.name}</h3>
                    <div className="flex items-center justify-between border-t border-[#f5f0f2] pt-3 mt-2">
                      <span className="text-xs md:text-sm font-black text-[#28242b]">{hasPrice ? formatToman(product.price) : '---'}</span>
                    </div>
                  </div>
                </Link>
                <div className="px-4 pb-4 flex gap-2">
                  <Link href={`/products/${product.slug}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#c61d70] text-white text-xs font-bold rounded-lg hover:bg-[#a9155d] transition-colors">
                    <ShoppingBag size={13} /> مشاهده
                  </Link>
                  <WishlistRemoveButton wishlistId={item.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Link href="/products" className="md:hidden flex items-center justify-center gap-2 w-full py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl hover:bg-[#a9155d] transition-colors">
        <ShoppingBag size={16} /> ادامه خرید
      </Link>
    </div>
  );
}


==========================================================================================
FILE [36/255] src\app\account\(protected)\wishlist\remove-button.tsx
SIZE 1288 bytes
==========================================================================================
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';


export default function WishlistRemoveButton({ wishlistId }: { wishlistId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRemove = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/account/wishlist?id=${wishlistId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('از علاقه‌مندی‌ها حذف شد');
        router.refresh();
      } else {
        toast.error('خطا در حذف');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      className="flex items-center justify-center w-10 h-10 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100 transition-colors disabled:opacity-50"
      aria-label="حذف از علاقه‌مندی‌ها"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
    </button>
  );
}


==========================================================================================
FILE [37/255] src\app\account\(public)\login\content.tsx
SIZE 21403 bytes
==========================================================================================
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Phone, ArrowLeft, Loader2, ShieldCheck, KeyRound,
  CheckCircle2, ShieldAlert, Sparkles, RotateCcw, ChevronLeft,
  LockKeyhole, Mail, Lock, Eye, EyeOff
} from 'lucide-react';
import { toast } from 'sonner';


export default function CustomerLoginPage() {
  const router = useRouter();
  const [method, setMethod] = useState<'password' | 'otp'>('password');
  
  // Password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP state
  const [step, setStep] = useState<1 | 2>(1);
  const [mobile, setMobile] = useState('');
  const [codeArray, setCodeArray] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorShake, setErrorShake] = useState(false);

  // OTP Timer
  useEffect(() => {
    const storedTime = localStorage.getItem('otp_timer_login');
    if (storedTime) {
      const remaining = Math.floor((parseInt(storedTime) - Date.now()) / 1000);
      if (remaining > 0) {
        setTimer(remaining);
        if (step === 1) setStep(2);
      } else {
        localStorage.removeItem('otp_timer_login');
      }
    }

    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    if (step === 2 && method === 'otp') {
      setTimeout(() => inputRefs.current[0]?.focus(), 150);
    }
  }, [step, method]);

  // ===== PASSWORD LOGIN =====
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const res = await fetch('/api/account/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          const urlParams = new URLSearchParams(window.location.search);
          const redirectTo = urlParams.get('redirect') || '/account';
          // 🛡️ جلوگیری از Open Redirect
          const safeRedirect = redirectTo.startsWith('/') && !redirectTo.startsWith('//') ? redirectTo : '/account';
          window.location.href = safeRedirect;
        }, 1000);
      } else {
        toast.error(data.message || 'ایمیل یا رمز عبور اشتباه است');
        setErrorShake(true);
        setTimeout(() => setErrorShake(false), 500);
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  // ===== OTP LOGIN =====
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!/^09\d{9}$/.test(mobile)) {
      toast.error('شماره موبایل معتبر نیست');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.bypassCode) {
          const codeDigits = String(data.bypassCode).split('').slice(0, 6);
          setCodeArray(codeDigits);
          toast.info(
            data.isExistingUser
              ? `خوش برگشتی! کد ${data.bypassCode} وارد شد.`
              : `حالت تست: کد ${data.bypassCode} وارد شد.`,
            { duration: 5000 }
          );
        } else {
          toast.success(data.message || 'کد تأیید ارسال شد.');
        }
        setStep(2);
        setTimer(60);
      } else {
        toast.error(data.message || 'خطا در ارسال پیامک');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || codeArray.join('');
    if (code.length < 6) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, code }),
      });
      const data = await res.json();
      if (res.ok) {
        // Use server-provided routing hint
        const isNew = data.isNewUser === true;
        const needsOnboarding = data.needsOnboarding === true;
        
        if (!isNew) {
          toast.success(`خوش برگشتی ${data.customer?.name || ''}!`.trim());
        } else {
          toast.success('به فاطمه بیوتی لند خوش آمدید!');
        }
        
        setSuccess(true);
        setTimeout(() => {
          if (needsOnboarding) {
            window.location.href = '/account/onboarding';
          } else {
            const urlParams = new URLSearchParams(window.location.search);
            const redirectTo = urlParams.get('redirect') || '/account';
          // 🛡️ جلوگیری از Open Redirect
          const safeRedirect = redirectTo.startsWith('/') && !redirectTo.startsWith('//') ? redirectTo : '/account';
            window.location.href = safeRedirect;
          }
        }, 1000);
      } else {
        toast.error(data.message || 'کد وارد شده صحیح نیست');
        setErrorShake(true);
        setTimeout(() => setErrorShake(false), 500);
        setCodeArray(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const code = codeArray.join('');
    if (code.length === 6 && step === 2 && method === 'otp' && !loading) {
      handleVerifyOtp(code);
    }
  }, [codeArray, step, method]);

  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const newCode = [...codeArray];
    newCode[index] = value;
    setCodeArray(newCode);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newCode = [...codeArray];
      for (let i = 0; i < pastedData.length; i++) newCode[i] = pastedData[i];
      setCodeArray(newCode);
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const timerProgress = (timer / 120) * 100;

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafc]" dir="rtl">
        <div className="text-center animate-in zoom-in duration-500">
          <div className="relative mx-auto mb-6 w-28 h-28">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping" />
            <div className="relative w-28 h-28 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle2 className="w-14 h-14 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-[#28242b] mb-2">خوش آمدید!</h2>
          <p className="text-sm text-[#77717b]">در حال انتقال...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#fafafc] px-4 py-12 overflow-hidden" dir="rtl">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-gradient-to-br from-[#fff0f7] to-[#fce5f0] rounded-full blur-[100px] opacity-70 animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-gradient-to-tr from-[#f4b7d5]/40 to-transparent rounded-full blur-[80px]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(#c61d70 1px, transparent 1px), linear-gradient(90deg, #c61d70 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#c61d70] mb-6 hover:underline transition-all">
          <ArrowLeft size={14} /> بازگشت به فروشگاه
        </Link>

        <div className="bg-white/85 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_30px_80px_-20px_rgba(198,29,112,0.2)] border border-white p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#c61d70]/10 to-transparent rounded-bl-[3rem] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#c61d70]/10 to-transparent rounded-tr-[3rem] pointer-events-none" />

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#fff0f7] to-[#fce5f0] rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-[#f2d7e5] relative group transition-transform hover:scale-105">
                <LockKeyhole className="w-7 h-7 text-[#c61d70]" />
                <Sparkles className="absolute -top-2 -right-2 text-[#c61d70]/50 w-5 h-5 animate-pulse" />
              </div>
              <h1 className="text-2xl font-black text-[#28242b] mb-2">ورود به حساب</h1>
              <p className="text-sm text-[#77717b]">روش ورود خود را انتخاب کنید</p>
            </div>

            {/* Tabs */}
            <div className="flex rounded-2xl bg-[#f8f7fa] p-1 mb-6">
              <button
                onClick={() => setMethod('password')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${method === 'password' ? 'bg-white text-[#c61d70] shadow-sm' : 'text-[#77717b] hover:text-[#28242b]'}`}
              >
                ورود با رمز عبور
              </button>
              <button
                onClick={() => setMethod('otp')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${method === 'otp' ? 'bg-white text-[#c61d70] shadow-sm' : 'text-[#77717b] hover:text-[#28242b]'}`}
              >
                ورود با کد یکبار مصرف
              </button>
            </div>

            {/* ===== PASSWORD LOGIN FORM ===== */}
            {method === 'password' && (
              <form onSubmit={handlePasswordLogin} className={`space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 ${errorShake ? 'animate-shake' : ''}`}>
                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">ایمیل</label>
                  <div className="relative group">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95] group-focus-within:text-[#c61d70] transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      dir="ltr"
                      className="w-full pr-11 pl-4 py-3.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-4 focus:ring-[#c61d70]/10 outline-none text-sm transition-all text-left"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">رمز عبور</label>
                  <div className="relative group">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95] group-focus-within:text-[#c61d70] transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pr-11 pl-12 py-3.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-4 focus:ring-[#c61d70]/10 outline-none text-sm transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#918a95] hover:text-[#c61d70] transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full py-4 bg-[#28242b] text-white font-bold rounded-2xl shadow-xl shadow-[#28242b]/20 hover:bg-black hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0 mt-2"
                >
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
                  {loading ? 'در حال ورود...' : 'ورود به حساب'}
                </button>
              </form>
            )}

            {/* ===== OTP LOGIN FORM ===== */}
            {method === 'otp' && (
              <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                {step === 1 ? (
                  <form onSubmit={handleSendOtp} className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-[#28242b] mb-2">شماره موبایل</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <span className="text-sm font-bold text-[#918a95] border-l border-[#e9e5eb] pl-3 ml-1 group-focus-within:text-[#c61d70] transition-colors" dir="ltr">+98</span>
                        </div>
                        <input
                          type="tel"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 11))}
                          required
                          dir="ltr"
                          placeholder="912 345 6789"
                          className="w-full pr-20 pl-4 py-4 bg-[#f8f7fa] border border-[#e9e5eb] rounded-2xl focus:bg-white focus:border-[#c61d70] focus:ring-4 focus:ring-[#c61d70]/10 outline-none text-left font-mono text-lg tracking-wider transition-all"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading || mobile.length < 11}
                      className="w-full py-4 bg-[#28242b] text-white font-bold rounded-2xl shadow-xl shadow-[#28242b]/20 hover:bg-black hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {loading ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
                      {loading ? 'در حال ارسال...' : 'دریافت کد ورود'}
                    </button>
                  </form>
                ) : (
                  <div className={`space-y-6 ${errorShake ? 'animate-shake' : ''}`}>
                    <div dir="ltr" className="flex justify-center gap-2 sm:gap-3">
                      {codeArray.map((digit, index) => (
                        <input
                          key={index}
                          ref={(el) => { inputRefs.current[index] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleCodeChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={handlePaste}
                          className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-black rounded-xl border outline-none transition-all shadow-sm ${
                            digit 
                              ? 'bg-white border-[#c61d70] text-[#c61d70] ring-2 ring-[#c61d70]/20 scale-105' 
                              : 'bg-[#f8f7fa] border-[#e9e5eb] text-[#28242b] focus:bg-white focus:border-[#c61d70] focus:ring-4 focus:ring-[#c61d70]/10'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between bg-[#f8f7fa] rounded-2xl p-2 border border-[#e9e5eb]">
                      <button
                        type="button"
                        onClick={() => { setStep(1); setCodeArray(['', '', '', '', '', '']); }}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#77717b] hover:text-[#28242b] px-3 py-2 rounded-xl transition-colors hover:bg-white"
                      >
                        <ChevronLeft size={14} /> ویرایش شماره
                      </button>
                      <div className="flex items-center gap-3 px-2">
                        {timer > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#c61d70]" dir="ltr">{formatTime(timer)}</span>
                            <div className="w-16 h-1.5 bg-[#e9e5eb] rounded-full overflow-hidden">
                              <div className="h-full bg-[#c61d70] transition-all duration-1000 ease-linear" style={{ width: `${timerProgress}%` }} />
                            </div>
                          </div>
                        ) : (
                          <button type="button" onClick={handleSendOtp} className="flex items-center gap-1.5 text-xs font-bold text-[#c61d70] bg-[#fff0f7] px-3 py-2 rounded-xl hover:bg-[#fce5f0] transition-colors animate-pulse">
                            <RotateCcw size={13} /> ارسال مجدد
                          </button>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleVerifyOtp()}
                      disabled={loading || codeArray.join('').length < 6}
                      className="w-full py-4 bg-[#c61d70] text-white font-bold rounded-2xl shadow-xl shadow-[#c61d70]/30 hover:bg-[#a9155d] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {loading ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                      {loading ? 'در حال بررسی...' : 'تایید و ورود'}
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-[#e9e5eb] text-center">
              <p className="text-xs text-[#77717b]">
                حساب کاربری ندارید؟{' '}
                <Link href="/account/register" className="font-black text-[#c61d70] hover:underline">
                  ثبت‌نام کنید
                </Link>
              </p>
            </div>
          </div>
        </div>
        <p className="text-center text-[10px] text-[#918a95] mt-8 flex items-center justify-center gap-1.5">
          <ShieldAlert size={13} /> اطلاعات شما نزد ما کاملاً محفوظ است.
        </p>
      </div>
    </div>
  );
}


==========================================================================================
FILE [38/255] src\app\account\(public)\login\page.tsx
SIZE 478 bytes
==========================================================================================
import { Suspense } from 'react';
import ClientContent from './content';

export const instant = false;

function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#c61d70] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ClientContent />
    </Suspense>
  );
}


==========================================================================================
FILE [39/255] src\app\account\(public)\register\content.tsx
SIZE 27710 bytes
==========================================================================================
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft,
  Check, ShieldCheck, Sparkles, Heart, Package,
  MapPin, TrendingUp, AlertCircle, CheckCircle2, Phone, ChevronLeft
} from 'lucide-react';
import { toast } from 'sonner';

function evaluatePassword(pwd: string) {
  if (!pwd) return { score: 0, label: '', color: '', bar: '' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
  else if (/[a-zA-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;
  if (score <= 2) return { score: 1, label: 'ضعیف', color: 'text-rose-500', bar: 'bg-rose-400' };
  if (score === 3) return { score: 2, label: 'متوسط', color: 'text-amber-500', bar: 'bg-amber-400' };
  if (score === 4) return { score: 3, label: 'خوب', color: 'text-lime-600', bar: 'bg-lime-500' };
  return { score: 4, label: 'قوی', color: 'text-emerald-600', bar: 'bg-emerald-500' };
}

const BENEFITS = [
  { icon: Package, text: 'پیگیری آسان سفارشات' },
  { icon: Heart, text: 'ذخیره محصولات مورد علاقه' },
  { icon: MapPin, text: 'مدیریت سریع آدرس‌ها' },
  { icon: TrendingUp, text: 'دسترسی به باشگاه مشتریان' },
];

export default function RegisterPage() {
  const router = useRouter();
  
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [phoneStep, setPhoneStep] = useState<1 | 2>(1);
  const [mobile, setMobile] = useState('');
  const [codeArray, setCodeArray] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [loadingPhone, setLoadingPhone] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // 🛡️ جلوگیری از دور زدن تایمر با رفرش صفحه
    const storedTime = localStorage.getItem('otp_timer_register');
    if (storedTime) {
      const remaining = Math.floor((parseInt(storedTime) - Date.now()) / 1000);
      if (remaining > 0) {
        setTimer(remaining);
        if (phoneStep === 1) setPhoneStep(2); // اگر تایمر فعال بود، مستقیم برو به مرحله کد
      } else {
        localStorage.removeItem('otp_timer_register');
      }
    }

    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    if (phoneStep === 2 && !isPhoneVerified) {
      setTimeout(() => inputRefs.current[0]?.focus(), 150);
    }
  }, [phoneStep, isPhoneVerified]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!/^09\d{9}$/.test(mobile)) {
      toast.error('شماره موبایل معتبر نیست');
      return;
    }
    setLoadingPhone(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.bypassCode) {
          const codeDigits = String(data.bypassCode).split('').slice(0, 6);
          setCodeArray(codeDigits);
          toast.info(`کد تست: ${data.bypassCode}`, { duration: 5000 });
        } else {
          toast.success('کد تایید ارسال شد.');
        }
        setPhoneStep(2);
        setTimer(60);
        localStorage.setItem('otp_timer_register', (Date.now() + 60000).toString());
      } else {
        toast.error(data.message || 'خطا در ارسال پیامک');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoadingPhone(false);
    }
  };

  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || codeArray.join('');
    if (code.length < 6) return;
    setLoadingPhone(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, code }),
      });
      const data = await res.json();
      
      if (res.ok) {
        // 🚀 منطق بی‌نقص: اگر کاربر از قبل بوده و نیاز به آنبوردینگ ندارد
        if (data.isNewUser === false && data.needsOnboarding === false) {
          toast.success('شما قبلاً ثبت‌نام کرده‌اید! در حال انتقال به حساب کاربری...');
          setTimeout(() => { window.location.href = '/account'; }, 1500);
          return;
        }
        
        // در غیر این صورت، فرم زیبای ثبت‌نام را نشان بده
        toast.success('شماره شما تایید شد! اکنون اطلاعات خود را تکمیل کنید.');
        setIsPhoneVerified(true);
      } else {
        toast.error(data.message || 'کد وارد شده صحیح نیست');
        setCodeArray(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoadingPhone(false);
    }
  };

  useEffect(() => {
    const code = codeArray.join('');
    if (code.length === 6 && phoneStep === 2 && !loadingPhone) {
      handleVerifyOtp(code);
    }
  }, [codeArray, phoneStep]);

  const handleCodeChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    const newCode = [...codeArray];
    newCode[index] = value;
    setCodeArray(newCode);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !codeArray[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newCode = [...codeArray];
      for (let i = 0; i < pastedData.length; i++) newCode[i] = pastedData[i];
      setCodeArray(newCode);
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    }
  };

  const strength = useMemo(() => evaluatePassword(password), [password]);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const nameValid = name.trim().length >= 2;
  const passwordValid = password.length >= 6;
  const match = confirm.length > 0 && confirm === password;
  const canSubmit = nameValid && emailValid && passwordValid && match && terms && !loadingForm;

  const progress = [nameValid, emailValid, passwordValid].filter(Boolean).length;
  const initial = name.trim().charAt(0) || '؟';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || loadingForm) return;
    setLoadingForm(true);
    try {
      const res = await fetch('/api/account/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: mobile,
          password,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast.success('به فاطمه بیوتی لند خوش آمدید');
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/account';
        }, 1000);
      } else {
        toast.error(data.message || 'خطا در ثبت‌نام');
        setLoadingForm(false);
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
      setLoadingForm(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafc]" dir="rtl">
        <div className="text-center animate-in zoom-in duration-500">
          <div className="relative mx-auto mb-6 w-28 h-28">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping" />
            <div className="relative w-28 h-28 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle2 className="w-14 h-14 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-[#28242b] mb-2">خوش آمدید!</h2>
          <p className="text-sm text-[#77717b]">حساب شما ساخته شد. در حال انتقال...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#fafafc] overflow-hidden" dir="rtl">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#c61d70]/12 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#f4b7d5]/30 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-[#fff0f7] blur-[80px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        
        {!isPhoneVerified ? (
          <div className="w-full flex items-center justify-center p-4 md:p-8 min-h-screen">
            <div className="w-full max-w-[420px]">
              <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#c61d70] mb-6 hover:underline">
                <ArrowLeft size={14} /> بازگشت به فروشگاه
              </Link>
              
              <div className="bg-white/85 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_30px_80px_-20px_rgba(198,29,112,0.2)] border border-white p-8 md:p-10 relative overflow-hidden">
                <div className="text-center mb-8">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#fff0f7] to-[#fce5f0] rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-[#f2d7e5]">
                    <Phone className="w-7 h-7 text-[#c61d70]" />
                  </div>
                  <h1 className="text-2xl font-black text-[#28242b] mb-2">تایید شماره موبایل</h1>
                  <p className="text-sm text-[#77717b]">برای ثبت‌نام، ابتدا شماره خود را تایید کنید</p>
                </div>

                {phoneStep === 1 ? (
                  <form onSubmit={handleSendOtp} className="space-y-5 animate-in fade-in slide-in-from-right-4">
                    <div>
                      <label className="block text-xs font-bold text-[#28242b] mb-2">شماره موبایل</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <span className="text-sm font-bold text-[#918a95] border-l border-[#e9e5eb] pl-3 ml-1 group-focus-within:text-[#c61d70] transition-colors" dir="ltr">+98</span>
                        </div>
                        <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 11))} required dir="ltr" placeholder="912 345 6789" className="w-full pr-20 pl-4 py-4 bg-[#f8f7fa] border border-[#e9e5eb] rounded-2xl focus:bg-white focus:border-[#c61d70] focus:ring-4 focus:ring-[#c61d70]/10 outline-none text-left font-mono text-lg tracking-wider transition-all" />
                      </div>
                    </div>
                    <button type="submit" disabled={loadingPhone || mobile.length < 11} className="w-full py-4 bg-[#28242b] text-white font-bold rounded-2xl shadow-xl shadow-[#28242b]/20 hover:bg-black hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                      {loadingPhone ? <Loader2 size={20} className="animate-spin" /> : <ShieldCheck size={20} />}
                      {loadingPhone ? 'در حال ارسال...' : 'دریافت کد تایید'}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-left-4">
                    <div className="text-center">
                      <p className="text-xs text-[#77717b] mb-1">کد ارسال شده به</p>
                      <p className="font-bold text-[#28242b] font-mono text-lg" dir="ltr">{mobile}</p>
                    </div>
                    <div dir="ltr" className="flex justify-center gap-2 sm:gap-3">
                      {codeArray.map((digit, index) => (
                        <input key={index} ref={(el) => { inputRefs.current[index] = el; }} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => handleCodeChange(index, e.target.value)} onKeyDown={(e) => handleKeyDown(index, e)} onPaste={handlePaste} className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-2xl font-black rounded-xl border outline-none transition-all shadow-sm ${digit ? 'bg-white border-[#c61d70] text-[#c61d70] ring-2 ring-[#c61d70]/20 scale-105' : 'bg-[#f8f7fa] border-[#e9e5eb] text-[#28242b] focus:bg-white focus:border-[#c61d70] focus:ring-4 focus:ring-[#c61d70]/10'}`} />
                      ))}
                    </div>
                    <div className="flex items-center justify-between bg-[#f8f7fa] rounded-2xl p-2 border border-[#e9e5eb]">
                      <button type="button" onClick={() => { setPhoneStep(1); setCodeArray(['', '', '', '', '', '']); }} className="flex items-center gap-1.5 text-xs font-bold text-[#77717b] hover:text-[#28242b] px-3 py-2 rounded-xl transition-colors hover:bg-white">
                        <ChevronLeft size={14} /> ویرایش شماره
                      </button>
                      <div className="flex items-center gap-3 px-2">
                        {timer > 0 ? (
                          <span className="text-[10px] font-bold text-[#c61d70]" dir="ltr">{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</span>
                        ) : (
                          <button type="button" onClick={handleSendOtp} className="text-xs font-bold text-[#c61d70] hover:underline">ارسال مجدد</button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 min-h-screen lg:min-h-0">
              <div className="w-full max-w-md py-8">
                <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-[#c61d70] mb-6 hover:underline transition-all">
                  <ArrowLeft size={14} /> بازگشت به فروشگاه
                </Link>

                <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(198,29,112,0.18)] border border-white/70 p-7 md:p-10">
                  <div className="text-center mb-8">
                    <div className="mx-auto w-14 h-14 bg-gradient-to-br from-[#fff0f7] to-[#fce5f0] rounded-2xl flex items-center justify-center mb-4 border border-[#f2d7e5] relative">
                      <Sparkles className="w-6 h-6 text-[#c61d70]" />
                    </div>
                    <h1 className="text-2xl font-black text-[#28242b] mb-1.5">تکمیل اطلاعات</h1>
                    <p className="text-sm text-[#77717b]">شماره <span className="font-bold text-[#c61d70] font-mono" dir="ltr">{mobile}</span> تایید شد</p>
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-7">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className={`h-1.5 rounded-full transition-all duration-500 ${progress >= n ? 'w-12 bg-[#c61d70]' : 'w-8 bg-[#e9e5eb]'}`} />
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#28242b] mb-2">نام و نام خانوادگی</label>
                      <div className="relative group">
                        <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95] group-focus-within:text-[#c61d70] transition-colors" />
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً فاطمه محمدی" required className="w-full pr-11 pl-11 py-3.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-4 focus:ring-[#c61d70]/10 outline-none text-sm transition-all" />
                        {nameValid && <Check className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#28242b] mb-2">ایمیل</label>
                      <div className="relative group">
                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95] group-focus-within:text-[#c61d70] transition-colors" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required dir="ltr" className="w-full pr-11 pl-11 py-3.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-4 focus:ring-[#c61d70]/10 outline-none text-sm transition-all text-left" />
                        {emailValid && <Check className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#28242b] mb-2">رمز عبور</label>
                      <div className="relative group">
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95] group-focus-within:text-[#c61d70] transition-colors" />
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="حداقل ۶ حرف" required className="w-full pr-11 pl-12 py-3.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-4 focus:ring-[#c61d70]/10 outline-none text-sm transition-all" />
                        <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#918a95] hover:text-[#c61d70]">
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {password.length > 0 && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex flex-1 gap-1">
                            {[1, 2, 3, 4].map((i) => (
                              <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength.score ? strength.bar : 'bg-[#e9e5eb]'}`} />
                            ))}
                          </div>
                          <span className={`text-[10px] font-bold ${strength.color}`}>{strength.label}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#28242b] mb-2">تکرار رمز عبور</label>
                      <div className="relative group">
                        <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95] group-focus-within:text-[#c61d70] transition-colors" />
                        <input type={showConfirm ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" required className={`w-full pr-11 pl-12 py-3.5 bg-[#f8f7fa] border rounded-xl focus:bg-white focus:ring-4 outline-none text-sm transition-all ${confirm.length > 0 ? match ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/10' : 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10' : 'border-[#e9e5eb] focus:border-[#c61d70] focus:ring-[#c61d70]/10'}`} />
                        <button type="button" onClick={() => setShowConfirm(s => !s)} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#918a95] hover:text-[#c61d70]">
                          {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {confirm.length > 0 && (
                        <p className={`mt-1.5 flex items-center gap-1 text-[10px] font-bold ${match ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {match ? <><Check size={11} /> رمزها یکسان هستند</> : <><AlertCircle size={11} /> رمزها یکسان نیستند</>}
                        </p>
                      )}
                    </div>

                    <label className="flex items-start gap-2.5 cursor-pointer pt-2">
                      <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-1 h-4 w-4 accent-[#c61d70] cursor-pointer" />
                      <span className="text-[11px] leading-relaxed text-[#77717b]">
                        <Link href="/policies/privacy" className="text-[#c61d70] font-bold hover:underline">قوانین حریم خصوصی</Link> و{' '}
                        <Link href="/policies/shipping" className="text-[#c61d70] font-bold hover:underline">شرایط استفاده</Link> را می‌پذیرم.
                      </span>
                    </label>

                    <button type="submit" disabled={!canSubmit} className="w-full py-4 bg-[#c61d70] text-white font-black text-sm rounded-2xl shadow-xl shadow-[#c61d70]/25 hover:bg-[#a9155d] transition-all flex items-center justify-center gap-2 disabled:opacity-40 mt-2">
                      {loadingForm ? <><Loader2 size={18} className="animate-spin" /> در حال ساخت حساب...</> : <><Sparkles size={18} /> ساخت حساب کاربری</>}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 relative">
              <div className="relative w-full max-w-md">
                <div className="absolute -top-8 -right-6 text-[#c61d70]/30 animate-pulse" style={{ animationDuration: '3s' }}><Sparkles size={40} /></div>
                <div className="absolute -bottom-6 -left-6 text-[#c61d70]/20 animate-pulse" style={{ animationDuration: '4s' }}><Sparkles size={32} /></div>

                <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-white via-[#fff8fc] to-[#fce5f0] p-8 shadow-[0_30px_80px_-20px_rgba(198,29,112,0.28)]">
                  <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#c61d70]/25 to-transparent blur-3xl" />
                  <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-tr from-[#f4b7d5]/40 to-transparent blur-3xl" />

                  <div className="relative">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <p className="text-[10px] font-black tracking-[0.3em] text-[#c61d70]">FATEMEH BEAUTY LAND</p>
                        <p className="text-xs text-[#77717b] mt-1">کارت عضویت اختصاصی</p>
                      </div>
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#c61d70] to-[#e84e9e] flex items-center justify-center shadow-lg">
                        <Heart size={20} className="text-white" />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-8">
                      <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-[#c61d70] to-[#e84e9e] flex items-center justify-center text-white text-3xl font-black shadow-lg ring-4 ring-white/70 transition-all duration-300">
                        {initial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-black text-[#28242b] truncate">{name || 'نام شما'}</p>
                        <p className="text-xs text-[#918a95] truncate" dir="ltr">{email || 'email@example.com'}</p>
                        <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/80 border border-[#f2d7e5] px-2.5 py-0.5">
                          <Sparkles size={10} className="text-[#c61d70]" />
                          <span className="text-[10px] font-bold text-[#c61d70]">عضو جدید</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-dashed border-[#c61d70]/25 pt-5 mb-6">
                      <div>
                        <p className="text-[10px] text-[#918a95] mb-1">تاریخ عضویت</p>
                        <p className="text-sm font-black text-[#28242b]">امروز</p>
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] text-[#918a95] mb-1">سطح</p>
                        <p className="text-sm font-black text-[#c61d70]">تازه‌وارد</p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <p className="text-[11px] font-black text-[#28242b] mb-3">مزایای عضویت شما:</p>
                      {BENEFITS.map((b, i) => {
                        const Icon = b.icon;
                        return (
                          <div key={i} className="flex items-center gap-2.5">
                            <div className="grid h-7 w-7 place-items-center rounded-lg bg-white border border-[#f2d7e5] text-[#c61d70] shadow-sm">
                              <Icon size={13} />
                            </div>
                            <span className="text-[11px] text-[#5a535e] font-medium">{b.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


==========================================================================================
FILE [40/255] src\app\account\(public)\register\page.tsx
SIZE 478 bytes
==========================================================================================
import { Suspense } from 'react';
import ClientContent from './content';

export const instant = false;

function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#c61d70] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ClientContent />
    </Suspense>
  );
}


==========================================================================================
FILE [41/255] src\app\account\error.tsx
SIZE 1335 bytes
==========================================================================================
'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';


export default function AccountGlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[Account Global Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-[#fafafc]">
      <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="text-rose-500 w-10 h-10" />
      </div>
      <h2 className="text-2xl font-black text-[#28242b] mb-3">خطایی رخ داد</h2>
      <p className="text-sm text-[#77717b] mb-8 max-w-md leading-relaxed">
        متأسفانه در بارگذاری این بخش مشکلی پیش آمد. لطفاً دوباره تلاش کنید. اگر مشکل ادامه داشت با پشتیبانی تماس بگیرید.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 rounded-xl bg-[#c61d70] px-8 py-3.5 text-sm font-bold text-white hover:bg-[#a9155d] transition-colors shadow-lg shadow-[#c61d70]/20"
      >
        <RotateCcw size={18} /> تلاش مجدد
      </button>
    </div>
  );
}


==========================================================================================
FILE [42/255] src\app\account\layout.tsx
SIZE 153 bytes
==========================================================================================

export const instant = false;

export default function AccountRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


==========================================================================================
FILE [43/255] src\app\account\onboarding\onboarding-client.tsx
SIZE 19809 bytes
==========================================================================================
'use client';

import { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  User, Mail, Lock, Eye, EyeOff, Camera, Loader2,
  Check, AlertCircle, Sparkles, ShieldCheck,
  CheckCircle2, Phone, Heart, Package, MapPin, TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';

function normalizeDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

function evaluatePassword(pwd: string) {
  if (!pwd) return { score: 0, label: '', bar: '' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
  else if (/[a-zA-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;
  if (score <= 2) return { score: 1, label: 'ضعیف', bar: 'bg-rose-400' };
  if (score === 3) return { score: 2, label: 'متوسط', bar: 'bg-amber-400' };
  if (score === 4) return { score: 3, label: 'خوب', bar: 'bg-lime-500' };
  return { score: 4, label: 'قوی', bar: 'bg-emerald-500' };
}

const BENEFITS = [
  { icon: Package, text: 'پیگیری آسان سفارشات' },
  { icon: Heart, text: 'ذخیره محصولات مورد علاقه' },
  { icon: MapPin, text: 'مدیریت سریع آدرس‌ها' },
  { icon: TrendingUp, text: 'دسترسی به باشگاه مشتریان' },
];

export default function OnboardingClient({
  customer,
}: {
  customer: { name: string; phone: string | null };
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(customer.name.startsWith('کاربر ') ? '' : customer.name);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [emailError, setEmailError] = useState('');

  const [avatar, setAvatar] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = useMemo(() => evaluatePassword(password), [password]);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const nameValid = name.trim().length >= 2;
  const passwordValid = password.length >= 6;
  const match = confirm.length > 0 && confirm === password;
  const canSubmit = nameValid && emailValid && passwordValid && match && !loading;

  const initial = name.trim().charAt(0) || '؟';

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { toast.error('حجم عکس حداکثر ۲ مگابایت است'); return; }
    if (!file.type.startsWith('image/')) { toast.error('فقط فایل تصویری مجاز است'); return; }

    const reader = new FileReader();
    reader.onload = async () => {
      setAvatar(reader.result as string);
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/account/avatar', { method: 'POST', body: fd });
        const data = await res.json();
        if (res.ok) toast.success('عکس پروفایل آپلود شد');
        else { toast.error(data.message || 'خطا'); setAvatar(null); }
      } catch {
        toast.error('خطا در آپلود');
        setAvatar(null);
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setEmailError('');

    setLoading(true);
    try {
      const res = await fetch('/api/account/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: customer.phone || '',
          password,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/account';
        }, 1500);
      } else {
        // 🛡️ مدیریت خطای تکراری بودن ایمیل
        if (data.message && data.message.includes('ایمیل')) {
          setEmailError(data.message);
        } else {
          toast.error(data.message || 'خطا در ذخیره اطلاعات');
        }
        setLoading(false);
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafc]" dir="rtl">
        <div className="text-center animate-in zoom-in duration-500">
          <div className="relative mx-auto mb-6 w-28 h-28">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping" />
            <div className="relative w-28 h-28 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
              <CheckCircle2 className="w-14 h-14 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-[#28242b] mb-2">حساب شما کامل شد!</h2>
          <p className="text-sm text-[#77717b]">در حال انتقال به داشبورد...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#fafafc] overflow-hidden" dir="rtl">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#c61d70]/12 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#f4b7d5]/30 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-[#fff0f7] blur-[80px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        
        {/* ================= ستون فرم ================= */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 min-h-screen lg:min-h-0">
          <div className="w-full max-w-md py-8">
            <div className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(198,29,112,0.18)] border border-white/70 p-7 md:p-10">
              <div className="text-center mb-8">
                <div className="mx-auto w-14 h-14 bg-gradient-to-br from-[#fff0f7] to-[#fce5f0] rounded-2xl flex items-center justify-center mb-4 border border-[#f2d7e5] relative">
                  <Sparkles className="w-6 h-6 text-[#c61d70]" />
                </div>
                <h1 className="text-2xl font-black text-[#28242b] mb-1.5">تکمیل پروفایل</h1>
                <p className="text-sm text-[#77717b]">قدم نهایی برای ساخت حساب کاربری</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* عکس پروفایل */}
                <div className="flex flex-col items-center mb-4">
                  <div className="relative">
                    <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-white shadow-lg">
                      {avatar ? (
                        <Image src={avatar} alt="آواتار" width={96} height={96} className="h-full w-full object-cover" unoptimized />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-4xl font-black text-white">
                          {initial}
                        </div>
                      )}
                    </div>
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="absolute bottom-0 right-0 grid h-9 w-9 place-items-center rounded-full border-2 border-white bg-[#c61d70] text-white shadow-lg transition-transform hover:scale-110 active:scale-95 disabled:opacity-50">
                      {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarSelect} disabled={uploading} className="hidden" />
                  </div>
                  <p className="mt-2 text-[10px] text-[#918a95]">عکس پروفایل (اختیاری)</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">نام و نام خانوادگی</label>
                  <div className="relative group">
                    <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95] group-focus-within:text-[#c61d70] transition-colors" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً فاطمه محمدی" required className="w-full pr-11 pl-11 py-3.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-4 focus:ring-[#c61d70]/10 outline-none text-sm transition-all" />
                    {nameValid && <Check className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">ایمیل</label>
                  <div className="relative group">
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95] group-focus-within:text-[#c61d70] transition-colors" />
                    <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setEmailError(''); }} placeholder="you@example.com" required dir="ltr" className={`w-full pr-11 pl-11 py-3.5 bg-[#f8f7fa] border rounded-xl focus:bg-white focus:ring-4 outline-none text-sm transition-all text-left ${emailError ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10' : 'border-[#e9e5eb] focus:border-[#c61d70] focus:ring-[#c61d70]/10'}`} />
                    {emailValid && !emailError && <Check className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />}
                  </div>
                  {emailError && <p className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-rose-500"><AlertCircle size={11} /> {emailError}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">شماره موبایل (تایید شده)</label>
                  <div className="relative group">
                    <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95]" />
                    <input type="tel" value={customer.phone || ''} disabled dir="ltr" className="w-full pr-11 pl-11 py-3.5 bg-[#e9e5eb]/50 border border-[#e9e5eb] rounded-xl text-sm text-[#77717b] cursor-not-allowed text-left" />
                    <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">تعیین رمز عبور</label>
                  <div className="relative group">
                    <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95] group-focus-within:text-[#c61d70] transition-colors" />
                    <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="حداقل ۶ حرف" required minLength={6} className="w-full pr-11 pl-12 py-3.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-4 focus:ring-[#c61d70]/10 outline-none text-sm transition-all" />
                    <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#918a95] hover:text-[#c61d70]">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex flex-1 gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength.score ? strength.bar : 'bg-[#e9e5eb]'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-[#77717b]">{strength.label}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">تکرار رمز عبور</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95] group-focus-within:text-[#c61d70] transition-colors" />
                    <input type={showConfirm ? 'text' : 'password'} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" required className={`w-full pr-11 pl-12 py-3.5 bg-[#f8f7fa] border rounded-xl focus:bg-white focus:ring-4 outline-none text-sm transition-all ${confirm.length > 0 ? match ? 'border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/10' : 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10' : 'border-[#e9e5eb] focus:border-[#c61d70] focus:ring-[#c61d70]/10'}`} />
                    <button type="button" onClick={() => setShowConfirm(s => !s)} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#918a95] hover:text-[#c61d70]">
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirm.length > 0 && (
                    <p className={`mt-1.5 flex items-center gap-1 text-[10px] font-bold ${match ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {match ? <><Check size={11} /> رمزها یکسان هستند</> : <><AlertCircle size={11} /> رمزها یکسان نیستند</>}
                    </p>
                  )}
                </div>

                <button type="submit" disabled={!canSubmit} className="w-full py-4 bg-[#c61d70] text-white font-black text-sm rounded-2xl shadow-xl shadow-[#c61d70]/25 hover:bg-[#a9155d] transition-all flex items-center justify-center gap-2 disabled:opacity-40 mt-2">
                  {loading ? <><Loader2 size={18} className="animate-spin" /> در حال ذخیره...</> : <><CheckCircle2 size={18} /> تکمیل حساب و ورود</>}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* ================= ستون کارت عضویت ================= */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 relative">
          <div className="relative w-full max-w-md">
            <div className="absolute -top-8 -right-6 text-[#c61d70]/30 animate-pulse" style={{ animationDuration: '3s' }}><Sparkles size={40} /></div>
            <div className="absolute -bottom-6 -left-6 text-[#c61d70]/20 animate-pulse" style={{ animationDuration: '4s' }}><Sparkles size={32} /></div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-white via-[#fff8fc] to-[#fce5f0] p-8 shadow-[0_30px_80px_-20px_rgba(198,29,112,0.28)]">
              <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#c61d70]/25 to-transparent blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-tr from-[#f4b7d5]/40 to-transparent blur-3xl" />

              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-[10px] font-black tracking-[0.3em] text-[#c61d70]">FATEMEH BEAUTY LAND</p>
                    <p className="text-xs text-[#77717b] mt-1">کارت عضویت اختصاصی</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#c61d70] to-[#e84e9e] flex items-center justify-center shadow-lg">
                    <Heart size={20} className="text-white" />
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-[#c61d70] to-[#e84e9e] flex items-center justify-center text-white text-3xl font-black shadow-lg ring-4 ring-white/70 transition-all duration-300">
                    {initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-black text-[#28242b] truncate">{name || 'نام شما'}</p>
                    <p className="text-xs text-[#918a95] truncate" dir="ltr">{email || 'email@example.com'}</p>
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/80 border border-[#f2d7e5] px-2.5 py-0.5">
                      <Sparkles size={10} className="text-[#c61d70]" />
                      <span className="text-[10px] font-bold text-[#c61d70]">عضو جدید</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-dashed border-[#c61d70]/25 pt-5 mb-6">
                  <div>
                    <p className="text-[10px] text-[#918a95] mb-1">تاریخ عضویت</p>
                    <p className="text-sm font-black text-[#28242b]">امروز</p>
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] text-[#918a95] mb-1">سطح</p>
                    <p className="text-sm font-black text-[#c61d70]">تازه‌وارد</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <p className="text-[11px] font-black text-[#28242b] mb-3">مزایای عضویت شما:</p>
                  {BENEFITS.map((b, i) => {
                    const Icon = b.icon;
                    return (
                      <div key={i} className="flex items-center gap-2.5">
                        <div className="grid h-7 w-7 place-items-center rounded-lg bg-white border border-[#f2d7e5] text-[#c61d70] shadow-sm">
                          <Icon size={13} />
                        </div>
                        <span className="text-[11px] text-[#5a535e] font-medium">{b.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


==========================================================================================
FILE [44/255] src\app\account\onboarding\page.tsx
SIZE 924 bytes
==========================================================================================
import { getCurrentCustomer } from '@/lib/customer-auth';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import OnboardingClient from './onboarding-client';

export const instant = false;

export default async function OnboardingPage() {
  const current = await getCurrentCustomer();
  if (!current) redirect('/account/login');

  const [customer] = await db.select().from(customers).where(eq(customers.id, current.id)).limit(1);
  if (!customer) redirect('/account/login');

  // If DB says user is complete, but they are on onboarding,
  // it means JWT is outdated. Force logout to clear the old token.
  if (!customer.email.endsWith('@temp.fatemehlab.ir')) {
    redirect('/api/auth/force-logout');
  }

  return <OnboardingClient customer={{ name: customer.name, phone: customer.phone }} />;
}


==========================================================================================
FILE [45/255] src\app\admin\(dashboard)\admin-layout-client.tsx
SIZE 9253 bytes
==========================================================================================
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, LogOut, Settings, Menu, X, Package, BookOpen, MessageSquare, Bell, HelpCircle, User, BellRing, TicketPercent, Users, Headphones } from 'lucide-react';
import { Suspense, useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import AdminBottomNav from '@/components/admin/AdminBottomNav';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const { permission, requestPermission, hasNew } = useAdminNotifications();

  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    
    fetch('/api/admin/orders').then(res => res.json()).then(data => {
      if (data.success) {
        setPendingCount(data.orders.filter((o: any) => ['pending', 'paid', 'processing'].includes(o.status)).length);
      }
    }).catch(() => {});
  }, [pathname]);

  const handleLogout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch (e) {}
    router.push('/admin/login'); router.refresh();
  };

  const menuItems = [
    { name: 'داشبورد', href: '/admin', icon: LayoutDashboard },
    { name: 'سفارشات', href: '/admin/orders', icon: Package, badge: pendingCount },
    { name: 'محصولات', href: '/admin/products', icon: ShoppingBag },
    { name: 'مجله', href: '/admin/articles', icon: BookOpen },
    { name: 'نظرات', href: '/admin/reviews', icon: MessageSquare },
        { name: 'مشتریان', href: '/admin/customers', icon: Users },
        { name: 'اعلان موجودی', href: '/admin/stock-notify', icon: BellRing },
    { name: 'پشتیبانی', href: '/admin/support', icon: Headphones },
    { name: 'کد تخفیف', href: '/admin/coupons', icon: TicketPercent },
    { name: 'تنظیمات', href: '/admin/settings', icon: Settings },
    { name: 'راهنما', href: '/admin/help', icon: HelpCircle },
  ];

  const SidebarContent = () => (
    <>
      <div className="flex h-20 shrink-0 items-center gap-3 px-6">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c61d70] to-[#e84e9e] shadow-lg shadow-[#c61d70]/20">
          <Image src="/logo.png" alt="لوگو" width={24} height={24} className="rounded-full" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-base font-black text-[#28242b] leading-tight">فاطمه بیوتی لند</h2>
          <span className="text-[10px] font-bold tracking-widest text-[#c61d70]">ADMIN PANEL</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1.5 overflow-y-auto px-4 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && item.href !== '/admin/help' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 ${
                isActive 
                  ? 'bg-[#fff0f7] text-[#c61d70] shadow-sm border border-[#f2d7e5]' 
                  : 'text-[#77717b] hover:bg-white hover:text-[#28242b] hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-[#c61d70]' : 'text-[#918a95] group-hover:text-[#28242b]'} />
                <span className={`text-sm ${isActive ? 'font-black' : 'font-bold'}`}>{item.name}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#c61d70] px-1.5 text-[10px] font-black text-white shadow-sm">
                  {item.badge.toLocaleString('fa-IR')}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
      <div className="shrink-0 p-4 space-y-4">

        {permission !== 'granted' && (
          <button onClick={requestPermission} className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#c61d70] to-[#e84e9e] p-3 text-white shadow-lg shadow-[#c61d70]/20 animate-pulse">
            <BellRing size={18} />
            <span className="text-xs font-bold">فعال‌سازی اعلان‌های مرورگر</span>
          </button>
        )}
        
        <div className="flex items-center gap-3 rounded-2xl border border-[#e9e5eb] bg-[#f8f7fa] p-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[#fff0f7] text-[#c61d70]">
            <User size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-[#28242b] truncate">مدیر سیستم</p>
            <p className="text-[10px] text-[#77717b] truncate">دسترسی کامل</p>
          </div>
        </div>

        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-50">
          <LogOut size={20} />
          <span>خروج از پنل</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-[100dvh] max-w-[100vw] overflow-hidden bg-[#fafafc]">
      <Toaster position="top-center" richColors theme="light" />

      <aside className="sticky top-0 z-20 hidden h-screen w-72 shrink-0 flex-col border-l border-[#e9e5eb] bg-white/70 backdrop-blur-2xl md:flex">
        <Suspense fallback={null}><SidebarContent /></Suspense>
      </aside>

      <div className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-[#e9e5eb] bg-white/80 px-4 backdrop-blur-xl md:hidden">
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -mr-2 text-[#28242b]" aria-label="منو">
            <Menu size={24} />
          </button>
          <h2 className="text-sm font-black text-[#28242b]">پنل مدیریت</h2>
        </div>
        <div className="flex items-center gap-2">
          {permission !== 'granted' ? (
            <button onClick={requestPermission} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#fff0f7] text-[#c61d70] rounded-full text-[10px] font-bold border border-[#f2d7e5] animate-pulse">
              <BellRing size={14} /> فعال‌سازی
            </button>
          ) : (
            <button className="relative p-2 text-[#77717b]">
              <Bell size={20} className={hasNew ? 'text-[#c61d70] animate-bounce' : ''} />
              {pendingCount > 0 && <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#c61d70] ring-2 ring-white"></span>}
            </button>
          )}
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#c61d70] to-[#e84e9e] flex items-center justify-center text-white font-bold text-xs shadow-sm">
            ا
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed bottom-0 right-0 top-0 z-[70] flex w-[290px] max-w-[85vw] flex-col bg-white shadow-2xl md:hidden animate-in slide-in-from-right duration-300">
            <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-[#e9e5eb]">
              <h2 className="text-sm font-black">منوی مدیریت</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -ml-2 text-[#77717b] bg-[#f8f7fa] rounded-xl">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Suspense fallback={null}><SidebarContent /></Suspense>
            </div>
          </div>
        </>
      )}

      <main className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-[#fafafc] to-[#fafafc]" />
        <div className="relative z-10 min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden pb-24 pt-16 md:pb-8 md:pt-0">
          <div className="mx-auto max-w-6xl p-4 md:p-8 lg:p-10">
            {children}
          </div>
        </div>
      </main>

      <Suspense fallback={null}>
        <AdminBottomNav pendingCount={pendingCount} onOpenMenu={() => setIsMobileMenuOpen(true)} />
      </Suspense>
    </div>
  );
}


==========================================================================================
FILE [46/255] src\app\admin\(dashboard)\articles\[id]\edit-form.tsx
SIZE 16364 bytes
==========================================================================================
'use client';
import { formatPersianDate, formatPersianDateTime } from '@/lib/format';
import { useState, useEffect } from 'react';
import { ArrowRight, Loader2, UploadCloud, Image as ImageIcon, X, Save, Eye, Sparkles, Settings, FileText, Globe, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false, loading: () => <div className="h-[400px] bg-gray-100 animate-pulse rounded-xl" /> });


export default function EditForm({ article }: { article: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState(article.coverImage || '');
  
  const [formData, setFormData] = useState({ 
    title: article.title || '',
    slug: article.slug || '',
    excerpt: article.excerpt || '',
    content: article.content || '',
    category: article.category || 'education',
    status: article.status || 'draft',
    readTime: article.readTime || '۵ دقیقه',
    author: article.author || 'تیم فاطمه بیوتی لند',
    featured: article.featured || false,
    editorsPick: article.editorsPick || false,
    seoTitle: article.seoTitle || '',
    seoDescription: article.seoDescription || '',
  });

  // محاسبه خودکار زمان مطالعه
  useEffect(() => {
    const words = formData.content.trim().split(/\s+/).length;
    if (words > 10) {
      const minutes = Math.ceil(words / 200);
      setFormData(prev => ({ ...prev, readTime: `${minutes.toLocaleString('fa-IR')} دقیقه` }));
    }
  }, [formData.content]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggle = (field: 'featured' | 'editorsPick') => {
    setFormData({ ...formData, [field]: !formData[field] });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const result = await res.json();
      if (res.ok) { setImageUrl(result.url); toast.success('تصویر آپلود شد'); }
      else toast.error(result.message);
    } catch { toast.error('خطا در آپلود'); }
    finally { setUploading(false); }
  };

  const handleGenerateAI = async () => {
    setGenerating(true);
    const toastId = toast.loading('هوش مصنوعی در حال خلق تصویر است...');
    try {
      const res = await fetch(`/api/admin/articles/${article.id}/generate-cover`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        setImageUrl(data.coverImage);
        toast.success('تصویر با موفقیت خلق شد', { id: toastId });
      } else {
        toast.error(data.message || 'خطا در تولید تصویر', { id: toastId });
      }
    } catch {
      toast.error('خطا در ارتباط با سرور', { id: toastId });
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...formData, coverImage: imageUrl };

    try {
      const res = await fetch(`/api/admin/articles/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) { toast.success('مقاله ذخیره شد'); router.push('/admin/articles'); router.refresh(); }
      else toast.error(data.message);
    } catch { toast.error('خطا در ارتباط با سرور'); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto pb-20">
      <div className="sticky top-0 z-30 bg-white border-b border-line py-3 px-4 md:px-6 flex items-center justify-between -mx-4 md:-mx-8 lg:-mx-10 mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/articles" className="p-2 hover:bg-chalk rounded-lg transition-colors">
            <ArrowRight className="w-5 h-5 text-ink" />
          </Link>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-ink line-clamp-1">{formData.title || 'ویرایش مقاله'}</h1>
            <p className="text-xs text-muted">آخرین به‌روزرسانی: {formatPersianDate(article.updatedAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/journal/${article.slug}`} target="_blank" className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-chalk text-ink text-xs font-bold rounded-lg border border-line hover:bg-white transition-colors">
            <Eye size={14} /> پیش‌نمایش
          </Link>
          <button type="submit" disabled={loading || uploading || generating} className="flex items-center gap-2 px-5 py-2 bg-ink text-white text-xs md:text-sm font-bold rounded-lg shadow-sm disabled:opacity-50 hover:bg-ink/90 transition-colors">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
            ذخیره مقاله
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-line rounded-2xl shadow-sm p-5 md:p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-ink flex items-center gap-2"><FileText size={16} className="text-sage"/> عنوان مقاله *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-3 bg-chalk border border-line rounded-xl focus:ring-2 focus:ring-sage/50 focus:bg-white transition-all text-lg font-bold text-ink" placeholder="عنوان جذاب مقاله را وارد کنید..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-ink">شناسه (Slug) *</label>
              <div className="flex items-center">
                <span className="bg-chalk border border-line border-l-0 rounded-r-xl px-3 py-2.5 text-sm text-muted font-mono" dir="ltr">/journal/</span>
                <input type="text" name="slug" value={formData.slug} onChange={handleChange} required dir="ltr" className="flex-1 px-4 py-2.5 bg-chalk border border-line rounded-l-xl focus:ring-2 focus:ring-sage/50 focus:bg-white transition-all font-mono text-sm" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-line rounded-2xl shadow-sm p-5 md:p-6 space-y-3">
            <label className="text-sm font-bold text-ink flex items-center gap-2"><Sparkles size={16} className="text-sage"/> خلاصه مقاله</label>
            <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={3} placeholder="یک خلاصه جذاب که در کارت مجله نمایش داده می‌شود..." className="w-full px-4 py-3 bg-chalk border border-line rounded-xl focus:ring-2 focus:ring-sage/50 focus:bg-white transition-all text-sm leading-relaxed"></textarea>
          </div>

          <div className="bg-white border border-line rounded-2xl shadow-sm p-5 md:p-6 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-ink flex items-center gap-2"><FileText size={16} className="text-sage"/> محتوای اصلی *</label>
              <span className="text-xs text-muted">{formData.content.split(/\s+/).length.toLocaleString('fa-IR')} کلمه</span>
            </div>
            <RichTextEditor content={formData.content} onChange={(html) => setFormData(prev => ({ ...prev, content: html }))} />
          </div>

          <div className="bg-white border border-line rounded-2xl shadow-sm p-5 md:p-6 space-y-4">
            <h3 className="text-sm font-bold text-ink flex items-center gap-2 border-b border-line pb-3"><Globe size={16} className="text-sage"/> تنظیمات سئو (SEO)</h3>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted">عنوان سئو (Meta Title)</label>
              <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} placeholder="اگر خالی باشد، از عنوان مقاله استفاده می‌شود" className="w-full px-4 py-2.5 bg-chalk border border-line rounded-lg focus:ring-2 focus:ring-sage/50 text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted">توضیحات سئو (Meta Description)</label>
              <textarea name="seoDescription" value={formData.seoDescription} onChange={handleChange} rows={2} placeholder="اگر خالی باشد، از خلاصه مقاله استفاده می‌شود" className="w-full px-4 py-2.5 bg-chalk border border-line rounded-lg focus:ring-2 focus:ring-sage/50 text-sm"></textarea>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-line rounded-2xl shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-ink flex items-center gap-2 border-b border-line pb-3"><Settings size={16} className="text-sage"/> انتشار</h3>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted">وضعیت</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 bg-chalk border border-line rounded-lg cursor-pointer text-sm font-medium">
                <option value="draft">پیش‌نویس</option>
                <option value="published">منتشر شده</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted">دسته‌بندی</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 bg-chalk border border-line rounded-lg cursor-pointer text-sm">
                <option value="education">آموزش</option>
                <option value="buying-guide">راهنمای خرید</option>
                <option value="skincare">مراقبت پوست</option>
                <option value="haircare">مراقبت مو</option>
                <option value="makeup">آرایشی</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted">نویسنده</label>
                <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full px-3 py-2 bg-chalk border border-line rounded-lg text-xs" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted">زمان مطالعه</label>
                <input type="text" name="readTime" value={formData.readTime} onChange={handleChange} className="w-full px-3 py-2 bg-chalk border border-line rounded-lg text-xs" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-line rounded-2xl shadow-sm p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-line pb-3">
              <h3 className="text-sm font-bold text-ink flex items-center gap-2"><ImageIcon size={16} className="text-sage"/> تصویر کاور</h3>
              <button type="button" onClick={handleGenerateAI} disabled={generating || uploading} className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-lg shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                {generating ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                {generating ? 'در حال خلق...' : 'تولید با AI'}
              </button>
            </div>
            
            <div className="border-2 border-dashed border-line rounded-xl p-3 flex flex-col items-center justify-center bg-chalk relative min-h-[140px]">
              {imageUrl ? (
                <div className="relative w-full">
                  <div className="aspect-video rounded-lg overflow-hidden bg-white border border-line">
                    <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                  <button type="button" onClick={() => setImageUrl('')} className="absolute top-2 right-2 bg-rose text-white p-1.5 rounded-md text-xs hover:bg-rose/90">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-muted mb-2" />
                  <p className="text-xs text-muted mb-3 text-center">تصویر کاور را آپلود کنید یا از AI بگیرید</p>
                  <label className="px-4 py-2 bg-white border border-line rounded-lg text-xs font-bold text-ink cursor-pointer hover:bg-chalk transition-colors">
                    <UploadCloud size={14} className="inline mr-1" /> انتخاب دستی
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                  </label>
                </>
              )}
              {(uploading || generating) && <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl"><Loader2 className="w-6 h-6 animate-spin text-sage" /></div>}
            </div>
          </div>

          <div className="bg-white border border-line rounded-2xl shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-ink flex items-center gap-2 border-b border-line pb-3"><Sparkles size={16} className="text-sage"/> تنظیمات ویژه</h3>
            <button type="button" onClick={() => handleToggle('featured')} className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${formData.featured ? 'bg-sage/10 border-sage text-sage' : 'bg-chalk border-line text-muted'}`}>
              <span className="text-sm font-medium">مقاله شاخص</span>
              <div className={`w-9 h-5 rounded-full relative transition-colors ${formData.featured ? 'bg-sage' : 'bg-line'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${formData.featured ? 'left-0.5' : 'left-4.5'}`}></div>
              </div>
            </button>
            <button type="button" onClick={() => handleToggle('editorsPick')} className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${formData.editorsPick ? 'bg-amber-500/10 border-amber-500 text-amber-600' : 'bg-chalk border-line text-muted'}`}>
              <span className="text-sm font-medium">انتخاب سردبیر</span>
              <div className={`w-9 h-5 rounded-full relative transition-colors ${formData.editorsPick ? 'bg-amber-500' : 'bg-line'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${formData.editorsPick ? 'left-0.5' : 'left-4.5'}`}></div>
              </div>
            </button>
          </div>

        </div>
      </div>
    </form>
  );
}


==========================================================================================
FILE [47/255] src\app\admin\(dashboard)\articles\[id]\page.tsx
SIZE 933 bytes
==========================================================================================
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { articles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import AdminGuard from '@/components/admin/AdminGuard';
import EditForm from './edit-form';

export const instant = false;

function Skeleton() {
  return <div className="p-8 text-center text-[#77717b]">در حال بارگذاری مقاله...</div>;
}

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [article] = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  if (!article) notFound();
  return <EditForm article={article} />;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <AdminGuard>
        <Content params={params} />
      </AdminGuard>
    </Suspense>
  );
}


==========================================================================================
FILE [48/255] src\app\admin\(dashboard)\articles\list.tsx
SIZE 8902 bytes
==========================================================================================
'use client';
import { formatPersianDate, formatPersianDateTime } from '@/lib/format';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2, Edit, Plus, Search, BookOpen, Sparkles, Eye } from 'lucide-react';
import { toast } from 'sonner';


const categoryLabels: Record<string, string> = {
  education: 'آموزش',
  'buying-guide': 'راهنمای خرید',
  skincare: 'مراقبت پوست',
  haircare: 'مراقبت مو',
  makeup: 'آرایشی',
};

export default function ArticlesClient({ initialArticles }: { initialArticles: any[] }) {
  const router = useRouter();
  const [articlesList, setArticlesList] = useState(initialArticles);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این مقاله مطمئن هستید؟')) return;
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticlesList(articlesList.filter(a => a.id !== id));
        toast.success('مقاله حذف شد');
        router.refresh();
      } else toast.error('خطا در حذف مقاله');
    } catch { toast.error('خطا در ارتباط با سرور'); }
    finally { setIsDeleting(null); }
  };

  const filtered = articlesList.filter(a => a.title.includes(searchTerm) || a.slug.includes(searchTerm));

  const stats = {
    total: articlesList.length,
    published: articlesList.filter(a => a.status === 'published').length,
    featured: articlesList.filter(a => a.featured).length,
    drafts: articlesList.filter(a => a.status === 'draft').length,
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">مدیریت مجله</h1>
          <p className="text-sm text-muted mt-1">مدیریت کامل مقالات و محتوای مجله</p>
        </div>
        <Link href="/admin/articles/new" className="flex items-center gap-2 px-5 py-2.5 bg-ink text-white rounded-lg text-sm font-medium hover:bg-ink/90 transition-colors shadow-sm w-full sm:w-auto justify-center">
          <Plus size={18} />
          مقاله جدید
        </Link>
      </div>

      {/* کارت‌های آماری */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-line rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <BookOpen size={16} className="text-blue-500" />
            <span className="text-xs text-muted">کل مقالات</span>
          </div>
          <p className="text-2xl font-black text-ink">{stats.total}</p>
        </div>
        <div className="bg-white border border-line rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Eye size={16} className="text-emerald-500" />
            <span className="text-xs text-muted">منتشر شده</span>
          </div>
          <p className="text-2xl font-black text-ink">{stats.published}</p>
        </div>
        <div className="bg-white border border-line rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} className="text-rose-500" />
            <span className="text-xs text-muted">شاخص</span>
          </div>
          <p className="text-2xl font-black text-ink">{stats.featured}</p>
        </div>
        <div className="bg-white border border-line rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Edit size={16} className="text-amber-500" />
            <span className="text-xs text-muted">پیش‌نویس</span>
          </div>
          <p className="text-2xl font-black text-ink">{stats.drafts}</p>
        </div>
      </div>

      {/* جستجو */}
      <div className="bg-white border border-line rounded-xl p-4">
        <div className="relative max-w-sm">
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-muted" />
          <input type="text" placeholder="جستجو در مقالات..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pr-9 pl-4 py-2 bg-chalk border border-line rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage/50" />
        </div>
      </div>

      {/* لیست مقالات */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-line rounded-2xl p-12 text-center">
          <BookOpen size={48} className="mx-auto text-muted/40 mb-4" />
          <h3 className="font-bold text-ink mb-2">مقاله‌ای یافت نشد</h3>
          <p className="text-sm text-muted mb-6">اولین مقاله مجله را بسازید و تجربه‌ای زیبا برای مخاطبان خود ایجاد کنید.</p>
          <Link href="/admin/articles/new" className="btn-primary inline-flex">
            <Plus size={16} />
            ساخت اولین مقاله
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((article) => (
            <div key={article.id} className="bg-white border border-line rounded-2xl overflow-hidden hover:shadow-md transition-shadow group">
              {/* کاور */}
              <div className="aspect-video relative bg-gradient-to-br from-pink-50 to-purple-50">
                {article.coverImage ? (
                  <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen size={32} className="text-sage/30" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-1.5">
                  {article.featured && (
                    <span className="bg-rose text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles size={9} /> شاخص
                    </span>
                  )}
                  {article.editorsPick && (
                    <span className="bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">سردبیر</span>
                  )}
                </div>
                <span className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full ${article.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                  {article.status === 'published' ? 'منتشر شده' : 'پیش‌نویس'}
                </span>
              </div>

              {/* محتوا */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-sage bg-sage/10 px-2 py-0.5 rounded">
                    {categoryLabels[article.category] || article.category}
                  </span>
                  <span className="text-[10px] text-muted">{formatPersianDate(article.createdAt)}</span>
                </div>
                <h3 className="font-bold text-sm text-ink mb-1 line-clamp-2">{article.title}</h3>
                {article.excerpt && <p className="text-xs text-muted line-clamp-2 mb-3">{article.excerpt}</p>}
                
                <div className="flex gap-2 pt-3 border-t border-line">
                  <Link href={`/admin/articles/${article.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-chalk text-ink text-xs font-bold rounded-lg border border-line hover:bg-white hover:border-sage transition-colors">
                    <Edit size={13} /> ویرایش
                  </Link>
                  <Link href={`/journal/${article.slug}`} target="_blank" className="p-2 bg-chalk text-ink rounded-lg border border-line hover:bg-white hover:border-sage transition-colors" title="مشاهده در سایت">
                    <Eye size={13} />
                  </Link>
                  <button onClick={() => handleDelete(article.id)} disabled={isDeleting === article.id} className="p-2 bg-rose/5 text-rose rounded-lg border border-rose/20 hover:bg-rose/10 transition-colors disabled:opacity-50" title="حذف">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


==========================================================================================
FILE [49/255] src\app\admin\(dashboard)\articles\new\content.tsx
SIZE 13581 bytes
==========================================================================================
'use client';
import { useState } from 'react';
import { ArrowRight, Loader2, UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
const RichTextEditor = dynamic(() => import('@/components/admin/RichTextEditor'), { ssr: false, loading: () => <div className="h-[400px] bg-gray-100 animate-pulse rounded-xl" /> });


export default function NewArticlePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  
  const [formData, setFormData] = useState({ 
    title: '', 
    slug: '', 
    excerpt: '', 
    content: '', 
    category: 'education',
    status: 'draft',
    readTime: '۵ دقیقه',
    author: 'تیم فاطمه بیوتی لند',
    featured: false,
    editorsPick: false,
    seoTitle: '',
    seoDescription: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggle = (field: 'featured' | 'editorsPick') => {
    setFormData({ ...formData, [field]: !formData[field] });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const result = await res.json();
      if (res.ok) { setImageUrl(result.url); toast.success('تصویر آپلود شد'); }
      else toast.error(result.message);
    } catch { toast.error('خطا در آپلود'); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = { ...formData, coverImage: imageUrl };

    try {
      const res = await fetch('/api/admin/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) { toast.success('مقاله با موفقیت ساخته شد'); router.push('/admin/articles'); router.refresh(); }
      else toast.error(data.message);
    } catch { toast.error('خطا در ارتباط با سرور'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/articles" className="p-2 bg-white border border-line rounded-xl hover:bg-chalk transition-colors">
          <ArrowRight className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-ink">مقاله جدید</h1>
          <p className="text-sm text-muted mt-1">اطلاعات کامل مقاله را وارد کنید</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* اطلاعات اصلی */}
        <div className="bg-white border border-line rounded-2xl shadow-sm p-6 space-y-5">
          <h2 className="text-base font-bold text-ink border-b border-line pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs font-bold">۱</span>
            اطلاعات اصلی
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">عنوان مقاله *</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-2.5 bg-chalk border border-line rounded-lg focus:ring-2 focus:ring-sage/50 focus:bg-white transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">شناسه (Slug) *</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required dir="ltr" placeholder="article-slug" className="w-full px-4 py-2.5 bg-chalk border border-line rounded-lg focus:ring-2 focus:ring-sage/50 focus:bg-white transition-all font-mono text-sm" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">خلاصه مقاله</label>
            <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2} placeholder="یک خلاصه یک یا دو جمله‌ای..." className="w-full px-4 py-2.5 bg-chalk border border-line rounded-lg focus:ring-2 focus:ring-sage/50 focus:bg-white transition-all"></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">دسته‌بندی</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 bg-chalk border border-line rounded-lg focus:ring-2 focus:ring-sage/50 cursor-pointer">
                <option value="education">آموزش</option>
                <option value="buying-guide">راهنمای خرید</option>
                <option value="skincare">مراقبت پوست</option>
                <option value="haircare">مراقبت مو</option>
                <option value="makeup">آرایشی</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">زمان مطالعه</label>
              <input type="text" name="readTime" value={formData.readTime} onChange={handleChange} className="w-full px-4 py-2.5 bg-chalk border border-line rounded-lg focus:ring-2 focus:ring-sage/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">نویسنده</label>
              <input type="text" name="author" value={formData.author} onChange={handleChange} className="w-full px-4 py-2.5 bg-chalk border border-line rounded-lg focus:ring-2 focus:ring-sage/50" />
            </div>
          </div>
        </div>

        {/* تصویر کاور */}
        <div className="bg-white border border-line rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-ink border-b border-line pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs font-bold">۲</span>
            تصویر کاور
          </h2>
          
          <div className="border-2 border-dashed border-line rounded-xl p-6 flex flex-col items-center justify-center bg-chalk relative min-h-[180px]">
            {imageUrl ? (
              <div className="relative w-full max-w-md">
                <div className="aspect-video rounded-xl overflow-hidden bg-white border border-line shadow-sm">
                  <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
                </div>
                <button type="button" onClick={() => setImageUrl('')} className="absolute top-2 right-2 bg-rose text-white p-2 rounded-lg text-xs flex items-center gap-1 hover:bg-rose/90 transition-colors">
                  <X size={14} /> حذف تصویر
                </button>
              </div>
            ) : (
              <>
                <ImageIcon className="w-12 h-12 text-muted mb-3" />
                <p className="text-sm text-muted mb-1">تصویری برای کاور انتخاب کنید</p>
                <p className="text-xs text-muted mb-4">JPG, PNG, WebP - حداکثر ۵ مگابایت</p>
                <label className="btn-primary cursor-pointer text-sm">
                  <UploadCloud size={16} />
                  انتخاب تصویر
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" />
                </label>
              </>
            )}
            {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl"><Loader2 className="w-8 h-8 animate-spin text-sage" /></div>}
          </div>
        </div>

        {/* محتوا */}
        <div className="bg-white border border-line rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-ink border-b border-line pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs font-bold">۳</span>
            محتوای مقاله
          </h2>
          <RichTextEditor content={formData.content} onChange={(html) => setFormData(prev => ({ ...prev, content: html }))} />
          <p className="text-xs text-muted">💡 هر پاراگراف با Enter از هم جدا می‌شود.</p>
        </div>

        {/* تنظیمات نمایش */}
        <div className="bg-white border border-line rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-ink border-b border-line pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs font-bold">۴</span>
            تنظیمات نمایش
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">وضعیت انتشار</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 bg-chalk border border-line rounded-lg cursor-pointer">
                <option value="draft">پیش‌نویس</option>
                <option value="published">منتشر شده</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">مقاله شاخص</label>
              <button type="button" onClick={() => handleToggle('featured')} className={`w-full px-4 py-2.5 rounded-lg border font-medium text-sm transition-all ${formData.featured ? 'bg-sage text-white border-sage' : 'bg-chalk text-muted border-line'}`}>
                {formData.featured ? '✓ بله (شاخص)' : 'خیر'}
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink">انتخاب سردبیر</label>
              <button type="button" onClick={() => handleToggle('editorsPick')} className={`w-full px-4 py-2.5 rounded-lg border font-medium text-sm transition-all ${formData.editorsPick ? 'bg-sage text-white border-sage' : 'bg-chalk text-muted border-line'}`}>
                {formData.editorsPick ? '✓ بله (پیشنهاد ویژه)' : 'خیر'}
              </button>
            </div>
          </div>
        </div>

        {/* سئو */}
        <div className="bg-white border border-line rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-base font-bold text-ink border-b border-line pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs font-bold">۵</span>
            تنظیمات سئو
          </h2>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">عنوان سئو</label>
            <input type="text" name="seoTitle" value={formData.seoTitle} onChange={handleChange} placeholder="اگر خالی باشد، از عنوان مقاله استفاده می‌شود" className="w-full px-4 py-2.5 bg-chalk border border-line rounded-lg focus:ring-2 focus:ring-sage/50" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink">توضیحات سئو</label>
            <textarea name="seoDescription" value={formData.seoDescription} onChange={handleChange} rows={2} placeholder="اگر خالی باشد، از خلاصه مقاله استفاده می‌شود" className="w-full px-4 py-2.5 bg-chalk border border-line rounded-lg focus:ring-2 focus:ring-sage/50"></textarea>
          </div>
        </div>

        {/* دکمه‌های عملیات */}
        <div className="bg-white border border-line rounded-2xl shadow-sm p-4 flex justify-end gap-3 sticky bottom-4 z-10">
          <Link href="/admin/articles" className="px-6 py-2.5 text-sm font-medium hover:bg-chalk rounded-lg transition-colors">انصراف</Link>
          <button type="submit" disabled={loading || uploading} className="px-8 py-2.5 text-sm font-bold bg-sage text-white rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50 hover:bg-sage/90 transition-colors">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> در حال ذخیره...</> : 'ذخیره مقاله'}
          </button>
        </div>
      </form>
    </div>
  );
}


==========================================================================================
FILE [50/255] src\app\admin\(dashboard)\articles\new\page.tsx
SIZE 478 bytes
==========================================================================================
import { Suspense } from 'react';
import ClientContent from './content';

export const instant = false;

function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#c61d70] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ClientContent />
    </Suspense>
  );
}


==========================================================================================
FILE [51/255] src\app\admin\(dashboard)\articles\page.tsx
SIZE 701 bytes
==========================================================================================
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { articles } from '@/db/schema';
import ArticlesClient from './list';
import { desc } from 'drizzle-orm';
import AdminGuard from '@/components/admin/AdminGuard';

export const instant = false;

function Skeleton() {
  return <div className="p-8 text-center text-[#77717b]">در حال بارگذاری مجله...</div>;
}

async function Content() {
  const allArticles = await db.select().from(articles).orderBy(desc(articles.createdAt));
  return <ArticlesClient initialArticles={allArticles} />;
}

export default function Page() {
  return <Suspense fallback={<Skeleton />}><AdminGuard><Content /></AdminGuard></Suspense>;
}


==========================================================================================
FILE [52/255] src\app\admin\(dashboard)\coupons\coupons-client.tsx
SIZE 18965 bytes
==========================================================================================
'use client';
import { formatNumberInput, parseNumberInput } from '@/lib/format';
import { formatPersianDate, formatPersianDateTime } from '@/lib/format';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Edit, Search, Loader2, X, Check, Percent, Tag, TicketPercent, Power } from 'lucide-react';
import { toast } from 'sonner';
import PersianDatePicker from '@/components/shared/PersianDatePicker';


type Coupon = {
  id: string;
  code: string;
  description: string | null;
  type: string;
  value: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  usageLimit: number | null;
  usedCount: number;
  startsAt: Date;
  expiresAt: Date | null;
  isActive: boolean;
  createdAt: Date;
};

export default function CouponsClient({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const router = useRouter();
  const [list, setList] = useState(initialCoupons);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'percent' | 'fixed'>('percent');
  const [value, setValue] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [maxDiscountAmount, setMaxDiscountAmount] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setCode(''); setDescription(''); setType('percent'); setValue('');
    setMinOrderAmount(''); setMaxDiscountAmount(''); setUsageLimit('');
    setExpiresAt(''); setIsActive(true); setEditing(null);
  };

  const openCreate = () => { resetForm(); setShowForm(true); };

  const openEdit = (coupon: Coupon) => {
    setEditing(coupon);
    setCode(coupon.code);
    setDescription(coupon.description || '');
    setType(coupon.type as 'percent' | 'fixed');
    setValue(String(coupon.value));
    setMinOrderAmount(String(coupon.minOrderAmount));
    setMaxDiscountAmount(coupon.maxDiscountAmount ? String(coupon.maxDiscountAmount) : '');
    setUsageLimit(coupon.usageLimit ? String(coupon.usageLimit) : '');
    setExpiresAt(coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().split('T')[0] : '');
    setIsActive(coupon.isActive);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !value) { toast.error('کد و مقدار تخفیف الزامی است'); return; }
    setSaving(true);
    try {
      const payload = {
        code,
        description: description || null,
        type,
        value: Number(value),
        minOrderAmount: Number(minOrderAmount) || 0,
        maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
        usageLimit: usageLimit ? Number(usageLimit) : null,
        expiresAt: expiresAt || null,
        isActive,
      };

      const url = editing ? `/api/admin/coupons/${editing.id}` : '/api/admin/coupons';
      const method = editing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(editing ? 'کد تخفیف ویرایش شد' : 'کد تخفیف ساخته شد');
        setShowForm(false);
        resetForm();
        router.refresh();
        const listRes = await fetch('/api/admin/coupons');
        const listData = await listRes.json();
        if (listData.success) setList(listData.coupons);
      } else {
        toast.error(data.message || 'خطا');
      }
    } catch {
      toast.error('خطا در ارتباط');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('این کد تخفیف حذف شود؟')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('کد تخفیف حذف شد');
        setList(list.filter((c) => c.id !== id));
        router.refresh();
      } else toast.error('خطا در حذف');
    } catch {
      toast.error('خطا در ارتباط');
    } finally {
      setDeletingId(null);
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...coupon, isActive: !coupon.isActive }),
      });
      if (res.ok) {
        setList(list.map((c) => c.id === coupon.id ? { ...c, isActive: !c.isActive } : c));
        toast.success(coupon.isActive ? 'کد غیرفعال شد' : 'کد فعال شد');
      }
    } catch {}
  };

  const filtered = list.filter((c) => c.code.toLowerCase().includes(search.toLowerCase()));

  const stats = {
    total: list.length,
    active: list.filter((c) => c.isActive).length,
    used: list.reduce((sum, c) => sum + c.usedCount, 0),
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-[#28242b] md:text-2xl flex items-center gap-2">
            <TicketPercent className="text-[#c61d70]" size={26} />
            کدهای تخفیف
          </h1>
          <p className="text-xs text-[#77717b] md:text-sm mt-1">کمپین‌های تخفیف خود را مدیریت کنید.</p>
        </div>
        <button onClick={openCreate} className="flex items-center justify-center gap-2 rounded-xl bg-[#c61d70] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-colors w-full md:w-auto">
          <Plus size={18} /> کد تخفیف جدید
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-[#e9e5eb] bg-white p-4">
          <p className="text-[10px] font-bold text-[#77717b] mb-1">کل کدها</p>
          <p className="text-xl font-black text-[#28242b]">{stats.total.toLocaleString('fa-IR')}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-[10px] font-bold text-emerald-700 mb-1">فعال</p>
          <p className="text-xl font-black text-emerald-800">{stats.active.toLocaleString('fa-IR')}</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-[10px] font-bold text-blue-700 mb-1">تعداد استفاده</p>
          <p className="text-xl font-black text-blue-800">{stats.used.toLocaleString('fa-IR')}</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95]" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="جستجو در کدها..." className="w-full pr-11 pl-4 py-3 bg-white border border-[#e9e5eb] rounded-2xl text-sm outline-none focus:border-[#c61d70]" />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#e9e5eb] bg-white p-12 text-center">
          <TicketPercent size={48} className="mx-auto mb-4 text-[#c61d70]/30" />
          <h3 className="text-lg font-black text-[#28242b] mb-2">هنوز کد تخفیفی ندارید</h3>
          <p className="text-sm text-[#77717b] mb-6">اولین کمپین تخفیف خود را بسازید.</p>
          <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-[#c61d70] px-6 py-3 text-sm font-bold text-white hover:bg-[#a9155d]">
            <Plus size={16} /> کد تخفیف جدید
          </button>
        </div>
      ) : (
        <div className="grid gap-2">
          {filtered.map((coupon) => {
            const expired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
            const exhausted = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;
            return (
              <div key={coupon.id} className={`rounded-2xl border bg-white p-4 transition-all ${coupon.isActive && !expired && !exhausted ? 'border-[#e9e5eb] hover:border-[#c61d70]/30' : 'border-gray-200 opacity-70'}`}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono font-black text-base text-[#28242b] tracking-wider">{coupon.code}</span>
                      {!coupon.isActive && <span className="text-[9px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-bold">غیرفعال</span>}
                      {expired && <span className="text-[9px] px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">منقضی</span>}
                      {exhausted && <span className="text-[9px] px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">تکمیل ظرفیت</span>}
                    </div>
                    {coupon.description && <p className="text-xs text-[#77717b]">{coupon.description}</p>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggleActive(coupon)} className={`p-2 rounded-lg transition-colors ${coupon.isActive ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-gray-500 bg-gray-100 hover:bg-gray-200'}`} title={coupon.isActive ? 'غیرفعال کردن' : 'فعال کردن'}>
                      <Power size={14} />
                    </button>
                    <button onClick={() => openEdit(coupon)} className="p-2 rounded-lg bg-[#f8f7fa] text-[#28242b] hover:bg-[#e9e5eb]" title="ویرایش">
                      <Edit size={14} />
                    </button>
                    <button onClick={() => handleDelete(coupon.id)} disabled={deletingId === coupon.id} className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 disabled:opacity-50" title="حذف">
                      {deletingId === coupon.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-[#e9e5eb]">
                  <div>
                    <p className="text-[10px] text-[#918a95] mb-1">مقدار تخفیف</p>
                    <p className="text-xs font-bold text-[#c61d70]">
                      {coupon.type === 'percent' ? `${coupon.value}٪` : `${coupon.value.toLocaleString('fa-IR')} ریال`}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#918a95] mb-1">حداقل سفارش</p>
                    <p className="text-xs font-bold text-[#28242b]">{coupon.minOrderAmount > 0 ? `${coupon.minOrderAmount.toLocaleString('fa-IR')} ریال` : 'ندارد'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#918a95] mb-1">استفاده</p>
                    <p className="text-xs font-bold text-[#28242b]">{coupon.usedCount.toLocaleString('fa-IR')} {coupon.usageLimit ? `/ ${coupon.usageLimit.toLocaleString('fa-IR')}` : ''}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#918a95] mb-1">انقضا</p>
                    <p className="text-xs font-bold text-[#28242b]">{coupon.expiresAt ? formatPersianDate(coupon.expiresAt) : 'ندارد'}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#e9e5eb]">
              <h3 className="text-lg font-black text-[#28242b]">{editing ? 'ویرایش کد تخفیف' : 'کد تخفیف جدید'}</h3>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-lg text-[#77717b] hover:bg-[#f8f7fa]"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">کد تخفیف *</label>
                  <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''))} placeholder="مثلاً SALE20" disabled={!!editing} className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm font-mono outline-none focus:border-[#c61d70] disabled:opacity-60" dir="ltr" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">توضیحات</label>
                  <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="مثلاً تخفیف آخر هفته" className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm outline-none focus:border-[#c61d70]" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setType('percent')} className={`py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${type === 'percent' ? 'bg-[#c61d70] text-white shadow-lg shadow-[#c61d70]/20' : 'bg-[#f8f7fa] text-[#77717b] border border-[#e9e5eb]'}`}>
                  <Percent size={16} /> تخفیف درصدی
                </button>
                <button type="button" onClick={() => setType('fixed')} className={`py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${type === 'fixed' ? 'bg-[#c61d70] text-white shadow-lg shadow-[#c61d70]/20' : 'bg-[#f8f7fa] text-[#77717b] border border-[#e9e5eb]'}`}>
                  <Tag size={16} /> تخفیف مبلغ ثابت
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">{type === 'percent' ? 'درصد تخفیف *' : 'مبلغ تخفیف (ریال) *'}</label>
                  <input type="text" value={formatNumberInput(value)} onChange={(e) => setValue(parseNumberInput(e.target.value).toString())} className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm outline-none focus:border-[#c61d70]" dir="ltr" required />
                </div>
                {type === 'percent' && (
                  <div>
                    <label className="block text-xs font-bold text-[#28242b] mb-2">سقف تخفیف (ریال) - اختیاری</label>
                    <input type="text" value={formatNumberInput(maxDiscountAmount)} onChange={(e) => setMaxDiscountAmount(parseNumberInput(e.target.value).toString())} className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm outline-none focus:border-[#c61d70]" dir="ltr" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">حداقل مبلغ سفارش (ریال)</label>
                  <input type="text" value={formatNumberInput(minOrderAmount)} onChange={(e) => setMinOrderAmount(parseNumberInput(e.target.value).toString())} placeholder="0" className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm outline-none focus:border-[#c61d70]" dir="ltr" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#28242b] mb-2">سقف تعداد استفاده</label>
                  <input type="text" value={formatNumberInput(usageLimit)} onChange={(e) => setUsageLimit(parseNumberInput(e.target.value).toString())} placeholder="نامحدود" className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm outline-none focus:border-[#c61d70]" dir="ltr" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#28242b] mb-2">تاریخ انقضا - اختیاری</label>
                <PersianDatePicker
  value={expiresAt ? new Date(expiresAt) : null}
  onChange={(date) => setExpiresAt(date ? date.toISOString() : '')}
  placeholder="انتخاب تاریخ انقضا..."
/>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="w-4 h-4 accent-[#c61d70]" />
                <span className="text-sm font-bold text-[#28242b]">این کد از همان ابتدا فعال باشد</span>
              </label>

              <div className="flex gap-2 pt-4 border-t border-[#e9e5eb]">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-[#f8f7fa] text-[#28242b] text-sm font-bold rounded-xl">انصراف</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#c61d70]/20 disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  {saving ? 'در حال ذخیره...' : 'ذخیره'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


==========================================================================================
FILE [53/255] src\app\admin\(dashboard)\coupons\page.tsx
SIZE 635 bytes
==========================================================================================
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { coupons } from '@/db/schema';
import { desc } from 'drizzle-orm';
import CouponsClient from './coupons-client';

export const instant = false;

function Skeleton() {
  return <div className="p-8 text-center text-[#77717b]">در حال بارگذاری کدهای تخفیف...</div>;
}

async function Content() {
  const allCoupons = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  return <CouponsClient initialCoupons={allCoupons} />;
}

export default function Page() {
  return <Suspense fallback={<Skeleton />}><Content /></Suspense>;
}


==========================================================================================
FILE [54/255] src\app\admin\(dashboard)\customers\customers-client.tsx
SIZE 8224 bytes
==========================================================================================
'use client';

import { useState, useEffect } from 'react';
import { Search, Users, ShoppingBag, DollarSign, Loader2, Mail, Phone, Calendar, AlertCircle } from 'lucide-react';
import { formatToman } from '@/lib/currency';
import Image from 'next/image';
import { formatPersianDate } from '@/lib/format';

export default function CustomersClient() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/customers')
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => { 
        if (data.success) setCustomers(data.customers); 
        else setError('خطا در بارگذاری');
      })
      .catch(() => setError('دسترسی غیرمجاز'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) || 
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone && c.phone.includes(search))
  );

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.totalOrders > 0).length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  if (loading) return <div className="p-12 text-center text-[#c61d70]"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" /><p className="text-sm">در حال بارگذاری...</p></div>;

  if (error) return (
    <div className="p-12 text-center">
      <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
      <p className="text-sm text-rose-600">{error}</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#28242b] flex items-center gap-2">
            <Users className="text-[#c61d70]" size={26} /> مدیریت مشتریان (CRM)
          </h1>
          <p className="text-sm text-[#77717b] mt-1">لیست تمام کاربران ثبت‌نام شده و آمار خرید آن‌ها</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border border-[#e9e5eb] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Users size={24} /></div>
          <div>
            <p className="text-xs font-bold text-[#77717b]">کل مشتریان</p>
            <p className="text-2xl font-black text-[#28242b]">{totalCustomers.toLocaleString('fa-IR')}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-[#e9e5eb] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><ShoppingBag size={24} /></div>
          <div>
            <p className="text-xs font-bold text-[#77717b]">مشتریان فعال</p>
            <p className="text-2xl font-black text-[#28242b]">{activeCustomers.toLocaleString('fa-IR')}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-[#e9e5eb] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#fff0f7] text-[#c61d70] flex items-center justify-center shrink-0"><DollarSign size={24} /></div>
          <div>
            <p className="text-xs font-bold text-[#77717b]">ارزش کل مشتریان (LTV)</p>
            <p className="text-xl font-black text-[#28242b]">{formatToman(totalRevenue)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#e9e5eb] p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95]" />
          <input 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="جستجو بر اساس نام، ایمیل یا شماره موبایل..." 
            className="w-full pr-11 pl-4 py-2.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm outline-none focus:border-[#c61d70] focus:bg-white transition-all" 
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#e9e5eb] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#fafafc] border-b border-[#e9e5eb] text-[#77717b]">
              <tr>
                <th className="px-6 py-4 font-bold">مشتری</th>
                <th className="px-6 py-4 font-bold">اطلاعات تماس</th>
                <th className="px-6 py-4 font-bold text-center">تعداد سفارش</th>
                <th className="px-6 py-4 font-bold">مجموع خرید</th>
                <th className="px-6 py-4 font-bold">تاریخ عضویت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9e5eb]">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-16 text-center text-[#77717b]">مشتری یافت نشد.</td></tr>
              ) : (
                filtered.map((customer) => (
                  <tr key={customer.id} className="hover:bg-[#fafafc] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fff0f7] to-[#fce5f0] text-[#c61d70] flex items-center justify-center font-black shrink-0 overflow-hidden relative">
                          {customer.avatar ? (
                            <Image src={customer.avatar} alt={customer.name} fill className="object-cover" />
                          ) : (
                            customer.name?.charAt(0) || '?'
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-[#28242b] block">{customer.name}</span>
                          {customer.email?.endsWith('@temp.fatemehlab.ir') && (
                            <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">OTP User</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#77717b] space-y-1">
                      <div className="flex items-center gap-1.5"><Mail size={12}/> <span dir="ltr" className="truncate">{customer.email}</span></div>
                      {customer.phone && <div className="flex items-center gap-1.5"><Phone size={12}/> <span dir="ltr">{customer.phone}</span></div>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black ${customer.totalOrders > 0 ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400'}`}>
                        {customer.totalOrders}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-black ${customer.totalSpent > 0 ? 'text-emerald-600' : 'text-[#918a95]'}`}>
                        {customer.totalSpent > 0 ? formatToman(customer.totalSpent) : 'بدون خرید'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-[#77717b]">
                      <div className="flex items-center gap-1.5"><Calendar size={12}/> {formatPersianDate(customer.createdAt)}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


==========================================================================================
FILE [55/255] src\app\admin\(dashboard)\customers\page.tsx
SIZE 336 bytes
==========================================================================================
import { Suspense } from 'react';
import CustomersClient from './customers-client';

export const instant = false;

export default function Page() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#c61d70]">در حال بارگذاری مشتریان...</div>}>
      <CustomersClient />
    </Suspense>
  );
}


==========================================================================================
FILE [56/255] src\app\admin\(dashboard)\error.tsx
SIZE 2110 bytes
==========================================================================================
'use client';
import { unstable_rethrow } from 'next/navigation';
import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('════════════════════════════════════════════');
    console.error('🔴 ADMIN ERROR CAUGHT');
    console.error('Message:', error.message);
    console.error('Digest:', error.digest);
    console.error('Name:', error.name);
    console.error('Stack:', error.stack);
    console.error('Full JSON:', JSON.stringify({ message: error.message, digest: error.digest, name: error.name, stack: error.stack }));
    console.error('════════════════════════════════════════════');
  }, [error]);

  unstable_rethrow(error);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-rose-100 shadow-sm">
      <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="text-rose-500 w-8 h-8" />
      </div>
      <h2 className="text-xl font-black text-[#28242b] mb-2">خطایی در پنل مدیریت رخ داد</h2>
      <p className="text-sm text-[#77717b] mb-2 max-w-md">متأسفانه در بارگذاری این بخش مشکلی پیش آمد.</p>
      {error.digest && (
        <p className="text-xs text-rose-500 mb-6 font-mono" dir="ltr">Digest: {error.digest}</p>
      )}
      <p className="text-xs text-[#918a95] mb-6 max-w-md leading-relaxed">
        {error.message || 'خطای ناشناخته'}
      </p>
      <button onClick={() => reset()} className="flex items-center gap-2 rounded-xl bg-[#28242b] px-6 py-3 text-sm font-bold text-white hover:bg-black transition-colors">
        <RotateCcw size={16} /> تلاش مجدد
      </button>
    </div>
  );
}


==========================================================================================
FILE [57/255] src\app\admin\(dashboard)\help\page.tsx
SIZE 16322 bytes
==========================================================================================
'use client';

import { useState } from 'react';
import { 
  Search, LayoutDashboard, ShoppingBag, Package, Users, 
  MessageSquare, Settings, FileText, ChevronDown, BookOpen, 
  Sparkles, ShieldCheck, TicketPercent, Bell, Image as ImageIcon,
  CreditCard, HelpCircle, Activity
} from 'lucide-react';
import Link from 'next/link';

// ══════════ دیتای راهنما (بسیار کامل و دقیق) ══════════
const helpDatabase = [
  {
    category: 'داشبورد و تحلیل داده',
    icon: LayoutDashboard,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    faqs: [
      { q: 'نمودارهای صفحه اصلی (Recharts) چه چیزی را نشان می‌دهند؟', a: 'نمودار خطی (Area) روند درآمد ۷ روز اخیر و نمودار ستونی (Bar) تعداد سفارشات روزانه را نشان می‌دهد. با نگه داشتن موس روی نمودار، جزئیات آن روز نمایش داده می‌شود.' },
      { q: 'منظور از KPI «میانگین سبد خرید» (AOV) چیست؟', a: 'این عدد کل درآمد را بر تعداد سفارشات تقسیم می‌کند. این شاخص به شما نشان می‌دهد که هر مشتری به طور میانگین چه مبلغی را در سبد خرید خود قرار می‌دهد.' },
      { q: 'بخش «۵ محصول پرفروش» چگونه محاسبه می‌شود؟', a: 'سیستم به صورت خودکار به دیتابیس نگاه می‌کند و بر اساس مجموع تعدادی که از هر محصول فروخته شده (بدون احتساب سفارشات لغو شده)، ۵ محصول برتر را نشان می‌دهد.' },
    ]
  },
  {
    category: 'مدیریت محصولات',
    icon: ShoppingBag,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    faqs: [
      { q: 'چگونه محصول جدید اضافه کنم؟', a: 'از منوی «محصولات» روی دکمه «محصول جدید» کلیک کنید. نام، قیمت (به تومان)، موجودی و عکس را وارد کنید. حتماً وضعیت را روی «منتشر شده» قرار دهید تا در سایت دیده شود.' },
      { q: 'چرا قیمت محصول در سایت نمایش داده نمی‌شود؟', a: 'اگر قیمت محصول را صفر بگذارید، سیستم آن را به عنوان «قیمت ثبت نشده» در نظر می‌گیرد و دکمه خرید غیرفعال می‌شود. برای فروش، حتماً قیمت را وارد کنید.' },
      { q: 'چگونه محصول را «ناموجود» کنم؟', a: 'کافیست در صفحه ویرایش محصول، موجودی انبار را به صفر برسانید. سیستم به صورت خودکار برچسب «ناموجود» را روی محصول نمایش می‌دهد.' },
      { q: 'گالری تصاویر و مشخصات فنی چگونه کار می‌کند؟', a: 'می‌توانید چندین عکس آپلود کنید. در بخش مشخصات فنی (Specifications) می‌توانید کلید-مقدارهایی مثل «حجم: ۲۰۰ میلی‌لیتر» اضافه کنید تا در جدول صفحه محصول نمایش داده شود.' },
    ]
  },
  {
    category: 'مدیریت سفارشات و پرداخت',
    icon: Package,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    faqs: [
      { q: 'وضعیت سفارشات به چه معناست؟', a: '«در انتظار پرداخت» یعنی مشتری سفارش داده اما به درگاه نرفته. «پرداخت شده» یعنی زرین‌پال تایید کرده است. «در حال پردازش» یعنی شما در حال آماده‌سازی هستید. «ارسال شده» و «تحویل شده» مراحل بعدی هستند.' },
      { q: 'آیا کم شدن موجودی انبار با پرداخت انجام می‌شود؟', a: 'بله، این یک قابلیت بسیار مهم است. موجودی محصولات فقط زمانی از انبار کم می‌شود که مشتری در درگاه زرین‌پال پرداخت را با موفقیت انجام دهد. اگر مشتری انصراف دهد، موجودی دست‌نخورده می‌ماند.' },
      { q: 'چگونه خروجی اکسل (CSV) از سفارشات بگیرم؟', a: 'در صفحه سفارشات، روی دکمه سبز رنگ «دانلود اکسل» کلیک کنید. فایلی شامل نام، آدرس، تلفن، مبلغ و محصولات دانلود می‌شود که در Excel قابل باز کردن است.' },
      { q: 'حذف یک سفارش چه تاثیری دارد؟', a: 'حذف سفارش غیرقابل بازگشت است و تمام اطلاعات (محصولات و آدرس) را پاک می‌کند. دقت کنید که این کار موجودی انبار را برنمی‌گرداند.' },
    ]
  },
  {
    category: 'مشتریان (CRM)',
    icon: Users,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    faqs: [
      { q: 'پنل CRM چه اطلاعاتی به من می‌دهد؟', a: 'شما می‌توانید لیست تمام کاربران، تعداد سفارشات هر کدام و مجموع مبلغی که خرج کرده‌اند (LTV یا ارزش طول عمر) را ببینید. این برای شناسایی مشتریان وفادار عالی است.' },
      { q: 'تگ «OTP User» در کنار بعضی مشتریان چیست؟', a: 'این مشتریان با شماره موبایل (بدون ایمیل واقعی و رمز عبور) وارد شده‌اند. ایمیل آن‌ها موقت است و هنوز پروفایل خود را تکمیل نکرده‌اند.' },
      { q: 'آیا می‌توانم مشتری را حذف کنم؟', a: 'برای حفظ امنیت و جلوگیری از حذف اطلاعات مالی مرتبط با سفارشات، گزینه حذف مشتری در پنل فعلی وجود ندارد.' },
    ]
  },
  {
    category: 'کد تخفیف و بازاریابی',
    icon: TicketPercent,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    faqs: [
      { q: 'چگونه کد تخفیف بسازم؟', a: 'در بخش کدهای تخفیف، نوع تخفیف (درصدی یا مبلغ ثابت)، مقدار، حداقل مبلغ سفارش و سقف استفاده را تعیین کنید. کدهایی که در سایت استفاده می‌شوند در اینجا قابل مدیریت هستند.' },
      { q: 'سقف تخفیف (Max Discount) چیست؟', a: 'اگر تخفیف درصدی (مثلاً ۲۰٪) بسازید، می‌توانید سقف بگذارید (مثلاً ۵۰,۰۰۰ تومان) تا برای سبدهای خرید بزرگ، مبلغ تخفیف سرسام‌آور نشود.' },
      { q: 'اگر کد تخفیف با سفارش همخوانی نداشته باشد چه می‌شود؟', a: 'اگر مشتری مبلغی کمتر از «حداقل سفارش» وارد کند، یا کد منقضی شده باشد، به او خطای مربوطه نشان داده می‌شود و کد اعمال نمی‌شود.' },
    ]
  },
  {
    category: 'مجله و محتوا (Articles)',
    icon: FileText,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    faqs: [
      { q: 'ادیتور متن (Tiptap) چه امکاناتی دارد؟', a: 'شما می‌توانید متن را با فرمت‌های مختلف (تیتر، لیست، رنگ، بولد) بنویسید، از داخل ادیتور عکس آپلود کنید و لینک بگذارید. نیازی به دانش HTML نیست.' },
      { q: 'تولید عکس کاور با هوش مصنوعی چگونه کار می‌کند؟', a: 'در صفحه نوشتن مقاله، روی دکمه «تولید با AI» کلیک کنید. سیستم بر اساس موضوع مقاله یک تصویر مینیمال و زیبا تولید می‌کند و به عنوان کاور قرار می‌دهد.' },
      { q: 'منظور از «مقاله شاخص» (Featured) چیست؟', a: 'اگر این گزینه را فعال کنید، مقاله در بالاترین قسمت صفحه مجله، با سایز بزرگتر و به عنوان مقاله اصلی نمایش داده می‌شود.' },
    ]
  },
  {
    category: 'نظرات و تنظیمات',
    icon: Settings,
    color: 'text-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    faqs: [
      { q: 'چرا نظرات کاربران در سایت نمایش داده نمی‌شوند؟', a: 'تمامی نظرات ابتدا در وضعیت «در انتظار» ثبت می‌شوند تا از اسپم جلوگیری شود. شما باید از بخش مدیریت نظرات، آن‌ها را بررسی و تایید کنید.' },
      { q: 'پرداخت زرین‌پال چطور کار می‌کند؟', a: 'کافیست مرچنت‌کد (Merchant ID) خود را در متغیرهای محیطی Vercel قرار دهید. سیستم به صورت خودکار مشتری را به درگاه بانک هدایت کرده و پس از پرداخت، وضعیت سفارش را به‌روزرسانی می‌کند.' },
      { q: 'اطلاعات فروشگاه در تنظیمات به چه کار می‌آید؟', a: 'نام فروشگاه، شماره تماس و آدرس در این بخش ذخیره می‌شوند و در فوتر سایت (پایین صفحه) به کاربران نمایش داده می‌شوند.' },
    ]
  }
];

export default function AdminHelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openCategory, setOpenCategory] = useState<string | null>(helpDatabase[0].category);

  // جستجوی هوشمند
  const filteredData = helpDatabase.map(category => {
    const matchedFaqs = category.faqs.filter(faq => 
      faq.q.includes(searchTerm) || faq.a.includes(searchTerm)
    );
    return { ...category, faqs: matchedFaqs };
  }).filter(category => category.faqs.length > 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      
      {/* هدر زیبا */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#fff0f7] via-[#fce5f0] to-[#f8f7fa] border border-[#f2d7e5] p-8 md:p-12 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm text-[#c61d70] mb-6">
            <BookOpen size={32} />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#28242b] mb-3">مرکز راهنمای مدیران</h1>
          <p className="text-sm md:text-base text-[#77717b] max-w-xl mx-auto leading-relaxed">
            پاسخ تمام سوالات شما درباره مدیریت فروشگاه، محصولات، سفارشات و تنظیمات در اینجا جمع‌آوری شده است.
          </p>
        </div>
      </div>

      {/* نوار جستجوی شناور */}
      <div className="relative -mt-16 z-20 max-w-2xl mx-auto px-4">
        <div className="relative flex items-center bg-white/90 backdrop-blur-xl border border-[#e9e5eb] shadow-xl rounded-2xl overflow-hidden transition-all focus-within:ring-4 focus-within:ring-[#c61d70]/20 focus-within:border-[#c61d70]">
          <div className="p-4 bg-[#f8f7fa] border-l border-[#e9e5eb]">
            <Search className="text-[#c61d70]" size={22} />
          </div>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="چه چیزی می‌خواهید یاد بگیرید؟ (مثلاً: کد تخفیف، افزودن محصول...)" 
            className="w-full px-5 py-4 bg-transparent outline-none text-sm font-medium text-[#28242b] placeholder:text-[#918a95]"
          />
        </div>
      </div>

      {/* لیست آکاردئون‌ها */}
      <div className="grid gap-4 pt-4">
        {filteredData.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#e9e5eb]">
            <HelpCircle size={48} className="mx-auto text-[#c61d70]/30 mb-4" />
            <h3 className="text-lg font-black text-[#28242b]">نتیجه‌ای یافت نشد</h3>
            <p className="text-sm text-[#77717b] mt-2">عبارت دیگری را جستجو کنید یا به پشتیبانی فنی تماس بگیرید.</p>
          </div>
        ) : (
          filteredData.map((category) => {
            const Icon = category.icon;
            const isOpen = openCategory === category.category;
            
            return (
              <div key={category.category} className="bg-white rounded-3xl border border-[#e9e5eb] shadow-sm overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => setOpenCategory(isOpen ? null : category.category)}
                  className="w-full flex items-center justify-between p-5 md:p-6 bg-white hover:bg-[#fafafc] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${category.bg} ${category.color} ${category.border} border`}>
                      <Icon size={22} />
                    </div>
                    <div className="text-right">
                      <h2 className="text-base md:text-lg font-black text-[#28242b]">{category.category}</h2>
                      <p className="text-xs text-[#77717b] mt-1">{category.faqs.length} سوال در این بخش</p>
                    </div>
                  </div>
                  <ChevronDown size={20} className={`text-[#918a95] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="border-t border-[#e9e5eb] bg-[#fafafc] p-4 md:p-6 space-y-3 animate-in slide-in-from-top-2">
                    {category.faqs.map((faq, idx) => (
                      <div key={idx} className="bg-white border border-[#e9e5eb] rounded-2xl p-5 shadow-sm">
                        <h3 className="font-bold text-sm text-[#28242b] flex items-start gap-2 mb-3">
                          <Sparkles size={16} className="text-[#c61d70] shrink-0 mt-0.5" />
                          {faq.q}
                        </h3>
                        <p className="text-xs md:text-sm text-[#5a535e] leading-loose pr-6 text-justify">
                          {faq.a}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      
      {/* بخش تماس با پشتیبانی فنی */}
      <div className="mt-12 bg-gradient-to-r from-[#28242b] to-[#3a333f] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#c61d70]/30 rounded-full blur-2xl" />
        <div className="relative z-10 text-center md:text-right">
          <h3 className="text-lg font-black text-white mb-1">پاسخ سوال خود را پیدا نکردید؟</h3>
          <p className="text-xs text-white/70">تیم فنی ما آماده پاسخگویی به سوالات پیچیده شماست.</p>
        </div>
        <a href="mailto:amirgt206@gmail.com" className="relative z-10 px-6 py-3 bg-white text-[#28242b] text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors whitespace-nowrap">
          تماس با پشتیبانی
        </a>
      </div>

    </div>
  );
}


==========================================================================================
FILE [58/255] src\app\admin\(dashboard)\layout.tsx
SIZE 1533 bytes
==========================================================================================
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { redirect } from 'next/navigation';
import AdminLayoutClient from './admin-layout-client';

export const instant = false;

const secretRaw = process.env.JWT_SECRET;
if (!secretRaw) throw new Error('FATAL: JWT_SECRET is missing in environment variables.');
const secret = new TextEncoder().encode(secretRaw);

async function requireAdmin() {
  const token = (await cookies()).get('admin_token')?.value;
  if (!token) redirect('/admin/login');
  try { await jwtVerify(token, secret); }
  catch { redirect('/admin/login'); }
}

function LayoutSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafc]">
      <div className="w-10 h-10 border-4 border-[#c61d70] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="p-8 space-y-4 animate-pulse">
      <div className="h-8 bg-gray-200 rounded-lg w-1/3" />
      <div className="grid grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 rounded-2xl" />)}
      </div>
    </div>
  );
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <Suspense fallback={<LayoutSkeleton />}>
      <AdminLayoutClient>
        <Suspense fallback={<PageSkeleton />}>
          {children}
        </Suspense>
      </AdminLayoutClient>
    </Suspense>
  );
}


==========================================================================================
FILE [59/255] src\app\admin\(dashboard)\orders\[id]\page.tsx
SIZE 4900 bytes
==========================================================================================
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import AdminGuard from '@/components/admin/AdminGuard';
import { formatToman } from '@/lib/currency';
import { ArrowRight, User, Phone, MapPin, Package } from 'lucide-react';
import Link from 'next/link';
import StatusUpdater from './status-updater';
import { Printer } from 'lucide-react';

export const instant = false;

function Skeleton() {
  return <div className="p-8 text-center text-[#77717b]">در حال بارگذاری سفارش...</div>;
}

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderData = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (orderData.length === 0) notFound();
  const order = orderData[0];
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/orders/${order.id}/print`} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-sm hover:bg-[#a9155d]"><Printer size={16} /> پرینت فاکتور</Link>
        <Link href="/admin/orders" prefetch={false} className="p-2 bg-white border border-border rounded-xl hover:bg-[#F8F9FA] transition-colors shadow-sm">
          <ArrowRight className="w-5 h-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">جزئیات سفارش</h1>
          <p className="text-sm text-muted-foreground mt-1 font-mono" dir="ltr">{order.trackingCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white border border-border rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold border-b border-border pb-3 mb-4 flex items-center gap-2"><User className="w-5 h-5 text-sage" /> مشتری</h2>
          <div className="space-y-3 text-sm">
            <p className="flex justify-between"><span className="text-muted-foreground">نام:</span> <span className="font-medium">{order.firstName} {order.lastName}</span></p>
            <p className="flex justify-between"><span className="text-muted-foreground">تلفن:</span> <span className="font-medium font-mono" dir="ltr">{order.phone}</span></p>
            <p className="flex justify-between"><span className="text-muted-foreground">شهر:</span> <span className="font-medium">{order.city}</span></p>
            <p className="flex justify-between"><span className="text-muted-foreground">کد پستی:</span> <span className="font-medium font-mono" dir="ltr">{order.postalCode}</span></p>
          </div>
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2"><MapPin className="w-4 h-4" /> آدرس:</p>
            <p className="text-sm bg-[#F8F9FA] p-3 rounded-lg border border-border leading-relaxed">{order.address}</p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold border-b border-border pb-3 mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-sage" /> محصولات سفارش</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 flex items-center justify-center bg-[#F8F9FA] border border-border rounded-lg text-xs font-bold">{item.quantity}</span>
                    <span className="font-medium text-foreground">{item.productName}</span>
                  </div>
                  <span className="font-bold">{formatToman(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 flex justify-between items-center">
              <span className="font-bold text-foreground">مبلغ کل</span>
              <span className="font-black text-xl text-sage">{formatToman(order.totalAmount)}</span>
            </div>
          </div>

          <StatusUpdater orderId={order.id} currentStatus={order.status} />
        </div>
      </div>
    </div>
  );
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <AdminGuard>
        <Content params={params} />
      </AdminGuard>
    </Suspense>
  );
}


==========================================================================================
FILE [60/255] src\app\admin\(dashboard)\orders\[id]\print\page.tsx
SIZE 1246 bytes
==========================================================================================
import { db } from '@/lib/db';
import { orders, orderItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import InvoiceTemplate from '@/components/shared/InvoiceTemplate';
import PrintButton from './print-button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function AdminPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderData = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (orderData.length === 0) notFound();

  const order = orderData[0];
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center no-print">
        <Link href={`/admin/orders/${id}`} className="flex items-center gap-2 text-sm font-bold text-[#28242b] bg-white px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50">
          <ArrowRight size={16} /> بازگشت به سفارش
        </Link>
        <PrintButton />
      </div>
      <InvoiceTemplate order={order} items={items} isAdmin={true} />
    </div>
  );
}


==========================================================================================
FILE [61/255] src\app\admin\(dashboard)\orders\[id]\print\print-button.tsx
SIZE 378 bytes
==========================================================================================
'use client';
import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button onClick={() => window.print()} className="flex items-center gap-2 text-sm font-bold text-white bg-[#c61d70] px-6 py-2 rounded-xl shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d]">
      <Printer size={16} /> چاپ فاکتور و لیبل
    </button>
  );
}


==========================================================================================
FILE [62/255] src\app\admin\(dashboard)\orders\[id]\status-updater.tsx
SIZE 4534 bytes
==========================================================================================
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, Trash2 } from 'lucide-react';


const statusOptions = [
  { value: 'paid', label: 'پرداخت شده', color: 'bg-sky-500' },
  { value: 'processing', label: 'در حال پردازش', color: 'bg-blue-500' },
  { value: 'shipped', label: 'ارسال شده', color: 'bg-purple-500' },
  { value: 'delivered', label: 'تحویل داده شده', color: 'bg-emerald-500' },
  { value: 'cancelled', label: 'لغو شده', color: 'bg-rose-500' },
];

export default function StatusUpdater({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = async (newStatus: string) => {
    if (newStatus === status) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
        toast.success('وضعیت سفارش با موفقیت به‌روزرسانی شد');
        router.refresh();
      } else {
        toast.error('خطا در تغییر وضعیت');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('آیا از حذف کامل این سفارش مطمئن هستید؟ این عمل غیرقابل بازگشت است.')) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('سفارش حذف شد');
        router.push('/admin/orders');
        router.refresh();
      } else {
        toast.error('خطا در حذف سفارش');
      }
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#e9e5eb] bg-white p-6 shadow-sm">
        <h2 className="mb-4 flex items-center gap-2 border-b border-[#e9e5eb] pb-3 text-lg font-black text-[#28242b]">
          تغییر وضعیت
          {loading && <Loader2 className="h-4 w-4 animate-spin text-[#c61d70]" />}
        </h2>
        
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleUpdate(opt.value)}
              disabled={loading || status === opt.value}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm font-bold transition-all ${
                status === opt.value
                  ? 'border-[#28242b] bg-[#28242b] text-white shadow-lg'
                  : 'border-[#e9e5eb] bg-[#f8f7fa] text-[#77717b] hover:border-[#c61d70] hover:text-[#c61d70]'
              } disabled:cursor-default`}
            >
              {status === opt.value ? <CheckCircle2 className="h-5 w-5" /> : <div className={`h-3 w-3 rounded-full ${opt.color}`} />}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
        <h2 className="mb-2 flex items-center gap-2 text-base font-black text-rose-700">
          <Trash2 className="h-5 w-5" /> منطقه خطر
        </h2>
        <p className="mb-4 text-xs leading-relaxed text-rose-600/80">با حذف سفارش، تمام اطلاعات مربوط به آن (شامل محصولات و آدرس) برای همیشه پاک می‌شود.</p>
        <button onClick={handleDelete} disabled={isDeleting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-rose-700 disabled:opacity-50 sm:w-auto">
          {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
          حذف کامل سفارش
        </button>
      </div>
    </div>
  );
}


==========================================================================================
FILE [63/255] src\app\admin\(dashboard)\orders\content.tsx
SIZE 10032 bytes
==========================================================================================
'use client';
import { formatPersianDate, formatPersianDateTime } from '@/lib/format';

import { useState, useEffect } from 'react';
import { Search, Eye, Trash2, Loader2, Filter, Download } from 'lucide-react';
import { formatToman } from '@/lib/currency';
import Link from 'next/link';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';


const statusMap: Record<string, { label: string, color: string, dot: string }> = {
  pending: { label: 'در انتظار پرداخت', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  paid: { label: 'پرداخت شده', color: 'bg-sky-50 text-sky-700 border-sky-200', dot: 'bg-sky-500' },
  processing: { label: 'در حال پردازش', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  shipped: { label: 'ارسال شده', color: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  delivered: { label: 'تحویل شده', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  cancelled: { label: 'لغو شده', color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchOrders = () => {
    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => { if (data.success) setOrders(data.orders); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این سفارش مطمئن هستید؟ این عمل قابل بازگشت نیست.')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('سفارش حذف شد');
        setOrders(orders.filter(o => o.id !== id));
        router.refresh();
      } else toast.error('خطا در حذف سفارش');
    } catch { toast.error('خطا در ارتباط با سرور'); }
    finally { setDeletingId(null); }
  };

  const filteredOrders = orders.filter(o =>
    o.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.phone.includes(searchTerm) ||
    o.firstName.includes(searchTerm)
  );

  if (loading) return <div className="p-12 text-center text-[#77717b] flex flex-col items-center"><Loader2 className="w-8 h-8 animate-spin text-[#c61d70] mb-4" /><span>در حال بارگذاری...</span></div>;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-[#28242b] md:text-2xl">مدیریت سفارشات</h1>
          <p className="mt-1 text-xs text-[#77717b] md:text-sm">همه سفارشات فروشگاه را در یک نگاه ببینید و مدیریت کنید.</p>
        </div>
        <a 
          href="/api/admin/orders/export" 
          download
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
        >
          <Download size={16} /> دانلود اکسل (CSV)
        </a>
        <div className="px-4 py-2 bg-white rounded-xl border border-[#e9e5eb] shadow-sm flex items-center gap-2">
          <span className="text-xs text-[#77717b]">کل سفارشات:</span>
          <span className="font-black text-[#28242b]">{orders.length.toLocaleString('fa-IR')}</span>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#e9e5eb] bg-white shadow-sm">
        <div className="border-b border-[#e9e5eb] p-4 flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-3 h-4 w-4 text-[#918a95]" />
            <input type="text" placeholder="جستجوی کد رهگیری، نام یا موبایل..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] py-2.5 pl-4 pr-9 text-sm outline-none transition-colors focus:border-[#c61d70] focus:bg-white" />
          </div>
          <button className="flex items-center gap-2 px-4 rounded-xl border border-[#e9e5eb] bg-white text-xs font-bold text-[#28242b] hover:bg-[#f8f7fa]">
            <Filter size={16} /> فیلتر
          </button>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-right text-sm">
            <thead className="border-b border-[#e9e5eb] bg-[#fafafc] text-[#77717b]">
              <tr>
                <th className="px-6 py-4 font-medium">کد رهگیری</th>
                <th className="px-6 py-4 font-medium">مشتری</th>
                <th className="px-6 py-4 font-medium">تاریخ</th>
                <th className="px-6 py-4 font-medium">مبلغ</th>
                <th className="px-6 py-4 font-medium">وضعیت</th>
                <th className="px-6 py-4 text-left font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9e5eb]">
              {filteredOrders.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-16 text-center text-[#77717b]">سفارشی یافت نشد.</td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-[#fafafc]">
                    <td className="px-6 py-4 font-mono font-bold text-[#28242b]" dir="ltr">{order.trackingCode}</td>
                    <td className="px-6 py-4"><span className="font-bold text-[#28242b] block">{order.firstName} {order.lastName}</span><span className="text-[10px] text-[#77717b]" dir="ltr">{order.phone}</span></td>
                    <td className="px-6 py-4 text-xs text-[#77717b]">{formatPersianDate(order.createdAt)}</td>
                    <td className="px-6 py-4 font-bold text-[#28242b]" dir="auto">{formatToman(order.totalAmount)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusMap[order.status]?.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusMap[order.status]?.dot}`} />
                        {statusMap[order.status]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/orders/${order.id}`} className="rounded-lg bg-[#f8f7fa] p-2 text-[#28242b] transition-colors hover:bg-[#e9e5eb]" title="مشاهده">
                          <Eye size={16} />
                        </Link>
                        <button onClick={() => handleDelete(order.id)} disabled={deletingId === order.id} className="rounded-lg bg-rose-50 p-2 text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50" title="حذف">
                          {deletingId === order.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {filteredOrders.length === 0 ? (<p className="py-10 text-center text-sm text-[#77717b]">سفارشی یافت نشد.</p>) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-[#e9e5eb] bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between border-b border-[#e9e5eb] pb-3">
                  <span className="font-mono text-xs font-bold text-[#28242b]" dir="ltr">{order.trackingCode}</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusMap[order.status]?.color}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${statusMap[order.status]?.dot}`} />
                    {statusMap[order.status]?.label}
                  </span>
                </div>
                <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
                  <div><span className="mb-1 block text-[10px] text-[#77717b]">مشتری</span><span className="font-bold">{order.firstName} {order.lastName}</span></div>
                  <div><span className="mb-1 block text-[10px] text-[#77717b]">مبلغ</span><span className="font-bold">{formatToman(order.totalAmount)}</span></div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/orders/${order.id}`} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#f8f7fa] py-2.5 text-xs font-bold text-[#28242b] border border-[#e9e5eb]"><Eye size={14} /> جزئیات</Link>
                  <button onClick={() => handleDelete(order.id)} disabled={deletingId === order.id} className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-600 disabled:opacity-50">{deletingId === order.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


==========================================================================================
FILE [64/255] src\app\admin\(dashboard)\orders\page.tsx
SIZE 478 bytes
==========================================================================================
import { Suspense } from 'react';
import ClientContent from './content';

export const instant = false;

function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#c61d70] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ClientContent />
    </Suspense>
  );
}


==========================================================================================
FILE [65/255] src\app\admin\(dashboard)\page.tsx
SIZE 8393 bytes
==========================================================================================
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { orders, orderItems, products } from '@/db/schema';
import { ShoppingBag, AlertCircle, Plus, Activity, DollarSign, TrendingUp, Clock, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatToman } from '@/lib/currency';
import { desc, eq, sql } from 'drizzle-orm';
import ChartsClientWrapper from '@/components/admin/ChartsClientWrapper';

export const instant = false;

function DashboardSkeleton() {
  return <div className="p-8 text-center text-[#77717b] animate-pulse">در حال بارگذاری داشبورد...</div>;
}

async function DashboardContent() {
  let allProducts: any[] = [];
  let recentOrders: any[] = [];
  let topItems: any[] = [];

  try { allProducts = await db.select().from(products); } catch (e) {}
  try { recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(50); } catch (e) {}
  
  // محاسبه KPI ها
  const validOrders = recentOrders.filter(o => o.status !== 'cancelled');
  const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const avgOrderValue = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;
  const lowStockProducts = allProducts.filter(p => p.stock > 0 && p.stock <= 5);
  const outOfStockProducts = allProducts.filter(p => p.stock === 0);

  // داده‌های نمودار
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' }),
      fullDate: d.toISOString().split('T')[0],
      revenue: 0,
      orders: 0
    };
  });
  validOrders.forEach(order => {
    const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
    const dayData = last7Days.find(d => d.fullDate === orderDate);
    if (dayData) {
      dayData.revenue += order.totalAmount;
      dayData.orders += 1;
    }
  });

  // پرفروش‌ترین‌ها
  try {
    topItems = await db
      .select({
        productId: orderItems.productId,
        name: orderItems.productName,
        totalSold: sql<number>`sum(${orderItems.quantity})`,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(sql`${orders.status} != 'cancelled'`)
      .groupBy(orderItems.productId, orderItems.productName)
      .orderBy(desc(sql`sum(${orderItems.quantity})`))
      .limit(5);
  } catch (e) {}

  const stats = [
    { title: 'درآمد کل', value: formatToman(totalRevenue), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'میانگین سبد', value: formatToman(avgOrderValue), icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'تعداد سفارشات', value: validOrders.length.toLocaleString('fa-IR'), icon: ShoppingBag, color: 'text-[#c61d70]', bg: 'bg-[#fff0f7]' },
    { title: 'هشدار موجودی', value: (lowStockProducts.length + outOfStockProducts.length).toLocaleString('fa-IR'), icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* هدر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#28242b] flex items-center gap-2">
            تحلیل داده‌های فروشگاه <Activity size={22} className="text-[#c61d70]" />
          </h1>
          <p className="mt-1 text-xs text-[#77717b]">نمای کلی از عملکرد مالی و سفارشات شما</p>
        </div>
        <Link href="/admin/products/new" className="flex items-center gap-2 rounded-xl bg-[#c61d70] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-colors">
          <Plus size={18} /> محصول جدید
        </Link>
      </div>

      {/* کارت‌های KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="rounded-3xl border border-[#e9e5eb] bg-white/70 backdrop-blur-md p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className={`grid h-10 w-10 md:h-12 md:w-12 place-items-center rounded-2xl ${stat.bg} ${stat.color} mb-3`}>
                <Icon size={22} className="md:w-6 md:h-6" />
              </div>
              <p className="text-[11px] md:text-xs font-bold text-[#77717b]">{stat.title}</p>
              <p className="mt-1 text-lg md:text-xl font-black text-[#28242b]">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* نمودارها */}
      <ChartsClientWrapper data={last7Days} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* پرفروش‌ترین محصولات */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-[#e9e5eb] p-5 shadow-sm">
          <h3 className="text-sm font-black text-[#28242b] mb-4 flex items-center gap-2">
            <ArrowUpRight size={16} className="text-emerald-500" /> ۵ محصول پرفروش
          </h3>
          <div className="space-y-3">
            {topItems.length === 0 ? (
              <p className="text-xs text-[#77717b] text-center py-4">داده‌ای موجود نیست.</p>
            ) : (
              topItems.map((item, i) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <span className="w-5 h-5 flex items-center justify-center bg-[#fafafc] border border-[#e9e5eb] rounded-md text-[10px] font-bold text-[#77717b]">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#28242b] truncate">{item.name}</p>
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{item.totalSold} عدد</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* آخرین سفارشات */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-md rounded-3xl border border-[#e9e5eb] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-[#28242b] flex items-center gap-2">
              <Clock size={16} className="text-[#c61d70]" /> آخرین سفارشات
            </h3>
            <Link href="/admin/orders" className="text-[10px] font-bold text-[#c61d70] hover:underline">مشاهده همه</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="text-[#77717b] border-b border-[#e9e5eb]">
                <tr>
                  <th className="pb-3 font-medium">مشتری</th>
                  <th className="pb-3 font-medium">کد رهگیری</th>
                  <th className="pb-3 font-medium">مبلغ</th>
                  <th className="pb-3 font-medium">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f0f2]">
                {validOrders.slice(0, 4).map((order: any) => (
                  <tr key={order.id} className="hover:bg-[#fafafc]">
                    <td className="py-3 font-bold text-[#28242b]">{order.firstName} {order.lastName}</td>
                    <td className="py-3 font-mono text-[#77717b]" dir="ltr">{order.trackingCode}</td>
                    <td className="py-3 font-bold">{formatToman(order.totalAmount)}</td>
                    <td className="py-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold">پردازش</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import AdminGuard from '@/components/admin/AdminGuard';

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
    </AdminGuard>
  );
}



==========================================================================================
FILE [66/255] src\app\admin\(dashboard)\products\[id]\edit-form.tsx
SIZE 19405 bytes
==========================================================================================
'use client';
import { formatNumberInput, parseNumberInput } from '@/lib/format';
import { useState } from 'react';
import { ArrowRight, Loader2, UploadCloud, Plus, Trash2, AlertCircle, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { rialToToman } from '@/lib/currency';


const normalizeDigits = (str: string) => {
  return str.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
};

const SKIN_TYPES = ['همه انواع پوست', 'پوست خشک', 'پوست چرب', 'پوست مختلط', 'پوست حساس', 'پوست نرمال', 'موی خشک', 'موی چرب', 'موی معمولی'];

export default function EditForm({ product }: { product: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  
  const [mainImage, setMainImage] = useState(product.mainImage || '');
  const [gallery, setGallery] = useState<string[]>(product.gallery || []);
  const [specs, setSpecs] = useState<{key: string, value: string}[]>(
    product.specifications && product.specifications.length > 0 ? product.specifications : [{ key: '', value: '' }]
  );
  
  const [formData, setFormData] = useState({ 
    name: product.name, 
    slug: product.slug, 
    brand: product.brand || '',
    countryOfOrigin: product.countryOfOrigin || '',
    description: product.description || '', 
    price: rialToToman(product.price), 
    compareAtPrice: product.compareAtPrice ? rialToToman(product.compareAtPrice) : '',
    stock: product.stock, 
    status: product.status,
    skinType: product.skinType || '',
    expiryDate: product.expiryDate || '',
    warnings: product.warnings || '',
    ingredients: product.ingredients || '',
    usage: product.usage || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadFile = async (file: File) => {
    const data = new FormData();
    data.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: data });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result.url;
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setMainImage(url);
      toast.success('تصویر کاور آپلود شد');
    } catch (err: any) { toast.error(err.message); }
    finally { setUploading(false); }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingGallery(true);
    try {
      const urls = await Promise.all(files.map(uploadFile));
      setGallery([...gallery, ...urls]);
      toast.success('تصاویر گالری آپلود شدند');
    } catch (err: any) { toast.error(err.message); }
    finally { setUploadingGallery(false); }
  };

  const removeGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const handleAddSpec = () => setSpecs([...specs, { key: '', value: '' }]);
  const handleRemoveSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index));
  const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = val;
    setSpecs(newSpecs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      ...formData,
      price: Number(normalizeDigits(formData.price.toString())) || 0,
      compareAtPrice: formData.compareAtPrice ? Number(normalizeDigits(formData.compareAtPrice.toString())) : null,
      stock: Number(normalizeDigits(formData.stock.toString())) || 0,
      mainImage: mainImage,
      gallery,
      specifications: specs.filter(s => s.key.trim() && s.value.trim()),
    };

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) { toast.success('تغییرات ذخیره شد'); router.push('/admin/products'); router.refresh(); }
      else toast.error(data.message);
    } catch { toast.error('خطا در ارتباط با سرور'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 bg-white border border-border rounded-xl hover:bg-[#F8F9FA]"><ArrowRight className="w-5 h-5" /></Link>
        <h1 className="text-xl md:text-2xl font-bold">ویرایش محصول</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl shadow-sm p-5 md:p-8 space-y-8">
        
        {/* ====== اطلاعات اصلی ====== */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-ink border-b border-border pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs font-bold">۱</span>
            اطلاعات اصلی
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">نام محصول *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">شناسه (Slug) *</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required dir="ltr" className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50 font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">برند (Brand)</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="مثلاً Vitabla" className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">کشور سازنده</label>
              <input type="text" name="countryOfOrigin" value={formData.countryOfOrigin} onChange={handleChange} placeholder="مثلاً کره جنوبی" className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">توضیحات کوتاه</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50"></textarea>
          </div>
        </section>

        {/* ====== قیمت و موجودی ====== */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-ink border-b border-border pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs font-bold">۲</span>
            قیمت و موجودی
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">قیمت فروش (تومان)</label>
              <input type="text" name="price" value={formatNumberInput(formData.price)} onChange={(e) => setFormData({ ...formData, price: parseNumberInput(e.target.value) as any })} dir="ltr" className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">قیمت قبل از تخفیف (اختیاری)</label>
              <input type="text" name="compareAtPrice" value={formatNumberInput(formData.compareAtPrice)} onChange={(e) => setFormData({ ...formData, compareAtPrice: parseNumberInput(e.target.value) as any })} dir="ltr" className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">موجودی انبار</label>
              <input type="text" name="stock" value={formatNumberInput(formData.stock)} onChange={(e) => setFormData({ ...formData, stock: parseNumberInput(e.target.value) as any })} dir="ltr" className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50" />
            </div>
          </div>
        </section>

        {/* ====== اطلاعات تخصصی ====== */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-ink border-b border-border pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs font-bold">۳</span>
            اطلاعات تخصصی
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">نوع پوست / مو</label>
              <select name="skinType" value={formData.skinType} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl cursor-pointer">
                <option value="">انتخاب کنید...</option>
                {SKIN_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">تاریخ انقضا</label>
              <input type="text" name="expiryDate" value={formData.expiryDate} onChange={handleChange} placeholder="مثلاً 1405/06/15" className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2"><AlertCircle size={16} className="text-amber-500"/> هشدارهای ایمنی (در صفحه محصول با رنگ زرد نمایش داده می‌شود)</label>
            <textarea name="warnings" value={formData.warnings} onChange={handleChange} rows={3} placeholder="مثلاً: در صورت داشتن پوست حساس، ابتدا تست حساسیت انجام دهید." className="w-full px-4 py-2.5 bg-amber-50/50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400/50"></textarea>
          </div>
        </section>

        {/* ====== ترکیبات و روش استفاده ====== */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-ink border-b border-border pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs font-bold">۴</span>
            ترکیبات و روش استفاده
          </h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">ترکیبات کامل (مطابق بسته‌بندی)</label>
            <textarea name="ingredients" value={formData.ingredients} onChange={handleChange} rows={3} placeholder="لیست کامل ترکیبات..." className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50"></textarea>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">روش استفاده</label>
            <textarea name="usage" value={formData.usage} onChange={handleChange} rows={3} placeholder="روش استفاده توصیه‌شده توسط سازنده..." className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50"></textarea>
          </div>
        </section>

        {/* ====== تصاویر ====== */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-ink border-b border-border pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs font-bold">۵</span>
            تصاویر محصول
          </h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">تصویر اصلی</label>
            <div className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center bg-[#F8F9FA] relative min-h-[150px]">
              {mainImage ? (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-sm">
                  <img src={mainImage} alt="Cover" className="w-full h-full object-contain bg-white" />
                  <button type="button" onClick={() => setMainImage('')} className="absolute top-1 right-1 bg-rose text-white p-1 rounded-md text-xs">حذف</button>
                </div>
              ) : (
                <><UploadCloud className="w-8 h-8 text-muted-foreground mb-2" /><span className="text-sm text-muted-foreground">کلیک کنید</span><input type="file" accept="image/*" onChange={handleMainImageUpload} disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer" /></>
              )}
              {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-sage" /></div>}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">گالری تصاویر</label>
            <div className="border-2 border-dashed border-border rounded-xl p-4 bg-[#F8F9FA] relative">
              <div className="flex flex-wrap gap-2 mb-4">
                {gallery.map((url, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border bg-white">
                    <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-contain p-1" />
                    <button type="button" onClick={() => removeGalleryImage(i)} className="absolute top-0 right-0 bg-rose text-white p-0.5 rounded-bl-md"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
              <div className="relative flex items-center justify-center h-12">
                <span className="text-sm text-muted-foreground">برای آپلود چند عکس کلیک کنید</span>
                <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} disabled={uploadingGallery} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              {uploadingGallery && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-sage" /></div>}
            </div>
          </div>
        </section>

        {/* ====== مشخصات فنی ====== */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-ink border-b border-border pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs font-bold">۶</span>
            مشخصات فنی
          </h2>
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">مثل حجم، وزن، ابعاد و...</p>
            <button type="button" onClick={handleAddSpec} className="text-sm text-sage flex items-center gap-1 hover:text-sage/80"><Plus className="w-4 h-4" /> افزودن ردیف</button>
          </div>
          {specs.map((spec, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input type="text" placeholder="عنوان (مثلاً حجم)" value={spec.key} onChange={(e) => handleSpecChange(index, 'key', e.target.value)} className="w-1/2 px-4 py-2 bg-[#F8F9FA] border border-border rounded-xl text-sm" />
              <input type="text" placeholder="مقدار (مثلاً ۲۰۰ml)" value={spec.value} onChange={(e) => handleSpecChange(index, 'value', e.target.value)} className="w-1/2 px-4 py-2 bg-[#F8F9FA] border border-border rounded-xl text-sm" />
              <button type="button" onClick={() => handleRemoveSpec(index)} className="p-2 text-rose hover:bg-rose/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </section>

        {/* ====== وضعیت انتشار ====== */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-ink border-b border-border pb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs font-bold">۷</span>
            انتشار
          </h2>
          <div className="space-y-2">
            <label className="text-sm font-medium">وضعیت</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl cursor-pointer">
              <option value="draft">پیش‌نویس (در سایت دیده نمی‌شود)</option>
              <option value="published">منتشر شده (در سایت دیده می‌شود)</option>
            </select>
          </div>
        </section>

        <div className="pt-6 border-t border-border flex justify-end gap-3">
          <Link href="/admin/products" className="px-6 py-2.5 text-sm font-medium hover:bg-background-secondary rounded-lg">انصراف</Link>
          <button type="submit" disabled={loading || uploading || uploadingGallery} className="px-6 py-2.5 text-sm font-medium bg-sage text-white rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ذخیره تغییرات'}</button>
        </div>
      </form>
    </div>
  );
}


==========================================================================================
FILE [67/255] src\app\admin\(dashboard)\products\[id]\page.tsx
SIZE 891 bytes
==========================================================================================
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import EditForm from './edit-form';

export const instant = false;

function Skeleton() {
  return <div className="p-8 text-center text-[#77717b]">در حال بارگذاری محصول...</div>;
}

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (product.length === 0) {
    return <div className="p-8 text-center text-rose-500">محصول یافت نشد</div>;
  }
  return <EditForm product={product[0]} />;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <Content params={params} />
    </Suspense>
  );
}


==========================================================================================
FILE [68/255] src\app\admin\(dashboard)\products\list.tsx
SIZE 8790 bytes
==========================================================================================
'use client';
import { Trash2, Edit, Search, Plus, Package, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { formatTomanPlain } from '@/lib/currency';


export default function ProductsPage({ initialProducts }: { initialProducts: any[] }) {
  const router = useRouter();
  const [productsList, setProductsList] = useState(initialProducts);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این محصول مطمئن هستید؟')) return;
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProductsList(productsList.filter(p => p.id !== id));
        toast.success('محصول حذف شد');
        router.refresh();
      } else toast.error('خطا در حذف محصول');
    } catch { toast.error('خطا در ارتباط با سرور'); }
    finally { setIsDeleting(null); }
  };

  const filtered = productsList.filter(p => p.name.includes(searchTerm) || p.slug.includes(searchTerm));

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-black text-[#28242b] md:text-2xl">مدیریت محصولات</h1>
          <p className="mt-1 text-xs text-[#77717b] md:text-sm">{productsList.length} محصول در فروشگاه ثبت شده است</p>
        </div>
        <Link href="/admin/products/new" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#28242b] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5 sm:w-auto">
          <Plus size={18} /> محصول جدید
        </Link>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#e9e5eb] bg-white shadow-sm">
        <div className="border-b border-[#e9e5eb] p-4">
          <div className="relative max-w-sm">
            <Search className="absolute right-3 top-3 h-4 w-4 text-[#918a95]" />
            <input type="text" placeholder="جستجوی محصول..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] py-2.5 pl-4 pr-9 text-sm outline-none transition-colors focus:border-[#c61d70] focus:bg-white" />
          </div>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-right text-sm">
            <thead className="border-b border-[#e9e5eb] bg-[#fafafc] text-[#77717b]">
              <tr>
                <th className="px-6 py-4 font-medium">محصول</th>
                <th className="px-6 py-4 font-medium">قیمت (تومان)</th>
                <th className="px-6 py-4 font-medium">موجودی</th>
                <th className="px-6 py-4 font-medium">وضعیت</th>
                <th className="px-6 py-4 text-left font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9e5eb]">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-16 text-center text-[#77717b]">محصولی یافت نشد.</td></tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="transition-colors hover:bg-[#fafafc]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-[#e9e5eb] bg-[#f8f7fa]">
                          {product.mainImage ? <Image src={product.mainImage} alt={product.name} fill className="object-cover" /> : <Package size={20} className="text-[#918a95]" />}
                        </div>
                        <div><span className="block font-bold text-[#28242b]">{product.name}</span><span className="text-[10px] text-[#77717b]" dir="ltr">{product.slug}</span></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#77717b]" dir="auto">{product.price > 0 ? formatTomanPlain(product.price) : 'تعیین نشده'}</td>
                    <td className="px-6 py-4"><span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-bold ${product.stock > 0 ? 'text-[#28242b] bg-[#f8f7fa]' : 'text-rose-600 bg-rose-50'}`}>{product.stock.toLocaleString('fa-IR')}</span></td>
                    <td className="px-6 py-4"><span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold ${product.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>{product.status === 'published' ? 'منتشر شده' : 'پیش‌نویس'}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/products/${product.id}`} className="rounded-lg bg-[#f8f7fa] p-2 text-[#28242b] transition-colors hover:bg-[#e9e5eb]" title="ویرایش"><Edit size={16} /></Link>
                        <button onClick={() => handleDelete(product.id)} disabled={isDeleting === product.id} className="rounded-lg bg-rose-50 p-2 text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50" title="حذف">{isDeleting === product.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 p-4 md:hidden">
          {filtered.length === 0 ? (<p className="py-10 text-center text-sm text-[#77717b]">محصولی یافت نشد.</p>) : (
            filtered.map((product) => (
              <div key={product.id} className="rounded-2xl border border-[#e9e5eb] bg-white p-4 shadow-sm">
                <div className="mb-3 flex gap-3">
                  <div className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-[#e9e5eb] bg-[#f8f7fa]">
                    {product.mainImage ? <Image src={product.mainImage} alt={product.name} fill className="object-cover" /> : <Package size={20} className="text-[#918a95]" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-[#28242b]">{product.name}</h3>
                    <span className={`mt-1 inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-bold ${product.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{product.status === 'published' ? 'منتشر شده' : 'پیش‌نویس'}</span>
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl bg-[#f8f7fa] p-2 text-center text-xs">
                  <div><span className="mb-1 block text-[10px] text-[#77717b]">قیمت</span><span className="font-bold">{product.price > 0 ? formatTomanPlain(product.price) : 'تعیین نشده'}</span></div>
                  <div className="border-r border-[#e9e5eb]"><span className="mb-1 block text-[10px] text-[#77717b]">موجودی</span><span className={`font-bold ${product.stock > 0 ? 'text-[#28242b]' : 'text-rose-500'}`}>{product.stock}</span></div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/products/${product.id}`} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#f8f7fa] py-2.5 text-xs font-bold text-[#28242b] border border-[#e9e5eb]"><Edit size={14} /> ویرایش</Link>
                  <button onClick={() => handleDelete(product.id)} disabled={isDeleting === product.id} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 py-2.5 text-xs font-bold text-rose-600 disabled:opacity-50">{isDeleting === product.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} حذف</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


==========================================================================================
FILE [69/255] src\app\admin\(dashboard)\products\new\content.tsx
SIZE 12065 bytes
==========================================================================================
'use client';
import { formatNumberInput, parseNumberInput } from '@/lib/format';
import { useState } from 'react';
import { ArrowRight, Loader2, UploadCloud, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';


const normalizeDigits = (str: string) => {
  return str.replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
};

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  
  const [mainImage, setMainImage] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [specs, setSpecs] = useState([{ key: '', value: '' }]);
  
  const [formData, setFormData] = useState({ 
    name: '', slug: '', description: '', price: '', stock: '', status: 'draft', ingredients: '', usage: '' 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const uploadFile = async (file: File) => {
    const data = new FormData();
    data.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: data });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result.url;
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setMainImage(url);
      toast.success('تصویر کاور آپلود شد');
    } catch (err: any) { toast.error(err.message); }
    finally { setUploading(false); }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingGallery(true);
    try {
      const urls = await Promise.all(files.map(uploadFile));
      setGallery([...gallery, ...urls]);
      toast.success('تصاویر گالری آپلود شدند');
    } catch (err: any) { toast.error(err.message); }
    finally { setUploadingGallery(false); }
  };

  const removeGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const handleAddSpec = () => setSpecs([...specs, { key: '', value: '' }]);
  const handleRemoveSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index));
  const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field] = val;
    setSpecs(newSpecs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const payload = {
      ...formData,
      price: Number(normalizeDigits(formData.price.toString())) || 0,
      stock: Number(normalizeDigits(formData.stock.toString())) || 0,
      mainImage: mainImage,
      gallery,
      specifications: specs.filter(s => s.key.trim() && s.value.trim()),
    };

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) { toast.success('محصول ذخیره شد'); router.push('/admin/products'); router.refresh(); }
      else toast.error(data.message);
    } catch { toast.error('خطا در ارتباط با سرور'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 bg-white border border-border rounded-xl hover:bg-[#F8F9FA]"><ArrowRight className="w-5 h-5" /></Link>
        <h1 className="text-2xl font-bold">افزودن محصول</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-border rounded-2xl shadow-sm p-6 md:p-8 space-y-8">
        
        {/* تصویر کاور */}
        <div className="space-y-2">
          <label className="text-sm font-medium">تصویر کاور (اصلی)</label>
          <div className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center bg-[#F8F9FA] relative min-h-[150px]">
            {mainImage ? (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-sm">
                <img src={mainImage} alt="Cover" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setMainImage('')} className="absolute top-1 right-1 bg-rose text-white p-1 rounded-md text-xs">حذف</button>
              </div>
            ) : (
              <><UploadCloud className="w-8 h-8 text-muted-foreground mb-2" /><span className="text-sm text-muted-foreground">کلیک کنید</span><input type="file" accept="image/*" onChange={handleMainImageUpload} disabled={uploading} className="absolute inset-0 opacity-0 cursor-pointer" /></>
            )}
            {uploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-sage" /></div>}
          </div>
        </div>

        {/* گالری تصاویر */}
        <div className="space-y-2">
          <label className="text-sm font-medium">گالری تصاویر (چند عکس)</label>
          <div className="border-2 border-dashed border-border rounded-xl p-4 bg-[#F8F9FA] relative">
            <div className="flex flex-wrap gap-2 mb-4">
              {gallery.map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                  <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeGalleryImage(i)} className="absolute top-0 right-0 bg-rose text-white p-0.5 rounded-bl-md"><Trash2 className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
            <div className="relative flex items-center justify-center h-12">
              <span className="text-sm text-muted-foreground">برای آپلود چند عکس کلیک کنید</span>
              <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} disabled={uploadingGallery} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            {uploadingGallery && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-sage" /></div>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2"><label className="text-sm font-medium">نام محصول *</label><input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50" /></div>
          <div className="space-y-2"><label className="text-sm font-medium">شناسه (Slug) *</label><input type="text" name="slug" value={formData.slug} onChange={handleChange} required dir="ltr" placeholder="toner-vitabla" className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50 font-mono text-sm" /></div>
        </div>

        <div className="space-y-2"><label className="text-sm font-medium">توضیحات کوتاه</label><textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50"></textarea></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2"><label className="text-sm font-medium">قیمت (تومان)</label><input type="text" name="price" value={formatNumberInput(formData.price)} onChange={(e) => setFormData({ ...formData, price: parseNumberInput(e.target.value) as any })} dir="ltr" className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50" /></div>
          <div className="space-y-2"><label className="text-sm font-medium">موجودی</label><input type="text" name="stock" value={formatNumberInput(formData.stock)} onChange={(e) => setFormData({ ...formData, stock: parseNumberInput(e.target.value) as any })} dir="ltr" className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50" /></div>
        </div>

        <div className="space-y-2"><label className="text-sm font-medium">وضعیت انتشار</label><select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl cursor-pointer"><option value="draft">پیش‌نویس</option><option value="published">منتشر شده</option></select></div>

        <hr className="border-border" />

        {/* مشخصات فنی */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">مشخصات فنی</label>
            <button type="button" onClick={handleAddSpec} className="text-sm text-sage flex items-center gap-1 hover:text-sage/80"><Plus className="w-4 h-4" /> افزودن</button>
          </div>
          {specs.map((spec, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input type="text" placeholder="عنوان (مثلاً حجم)" value={spec.key} onChange={(e) => handleSpecChange(index, 'key', e.target.value)} className="w-1/2 px-4 py-2 bg-[#F8F9FA] border border-border rounded-xl text-sm" />
              <input type="text" placeholder="مقدار (مثلاً ۲۰۰ml)" value={spec.value} onChange={(e) => handleSpecChange(index, 'value', e.target.value)} className="w-1/2 px-4 py-2 bg-[#F8F9FA] border border-border rounded-xl text-sm" />
              <button type="button" onClick={() => handleRemoveSpec(index)} className="p-2 text-rose hover:bg-rose/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2"><label className="text-sm font-medium">مواد تشکیل‌دهنده</label><textarea name="ingredients" value={formData.ingredients} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50"></textarea></div>
          <div className="space-y-2"><label className="text-sm font-medium">روش استفاده</label><textarea name="usage" value={formData.usage} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 bg-[#F8F9FA] border border-border rounded-xl focus:ring-2 focus:ring-sage/50"></textarea></div>
        </div>

        <div className="pt-6 border-t border-border flex justify-end gap-3">
          <Link href="/admin/products" className="px-6 py-2.5 text-sm font-medium hover:bg-background-secondary rounded-lg">انصراف</Link>
          <button type="submit" disabled={loading || uploading || uploadingGallery} className="px-6 py-2.5 text-sm font-medium bg-sage text-white rounded-lg shadow-sm flex items-center gap-2 disabled:opacity-50">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ذخیره محصول'}</button>
        </div>
      </form>
    </div>
  );
}


==========================================================================================
FILE [70/255] src\app\admin\(dashboard)\products\new\page.tsx
SIZE 478 bytes
==========================================================================================
import { Suspense } from 'react';
import ClientContent from './content';

export const instant = false;

function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#c61d70] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ClientContent />
    </Suspense>
  );
}


==========================================================================================
FILE [71/255] src\app\admin\(dashboard)\products\page.tsx
SIZE 703 bytes
==========================================================================================
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { products } from '@/db/schema';
import ProductsPage from './list';
import { desc } from 'drizzle-orm';
import AdminGuard from '@/components/admin/AdminGuard';

export const instant = false;

function Skeleton() {
  return <div className="p-8 text-center text-[#77717b]">در حال بارگذاری محصولات...</div>;
}

async function Content() {
  const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
  return <ProductsPage initialProducts={allProducts} />;
}

export default function Page() {
  return <Suspense fallback={<Skeleton />}><AdminGuard><Content /></AdminGuard></Suspense>;
}


==========================================================================================
FILE [72/255] src\app\admin\(dashboard)\reviews\content.tsx
SIZE 9606 bytes
==========================================================================================
'use client';
import { formatPersianDate, formatPersianDateTime } from '@/lib/format';
import { useState, useEffect } from 'react';
import { Check, X, Star, Loader2, MessageSquare, ShieldCheck, Trash2, Mail, Package, User } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const fetchReviews = () => {
    fetch('/api/admin/reviews')
      .then(res => res.json())
      .then(data => { if (data.success) setReviews(data.reviews); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'delete') => {
    if (action === 'delete' && !confirm('آیا از حذف این نظر مطمئن هستید؟')) return;
    
    setProcessing(id);
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      if (res.ok) {
        toast.success(action === 'approve' ? 'نظر تایید شد' : action === 'reject' ? 'نظر رد شد' : 'نظر حذف شد');
        fetchReviews();
      } else toast.error('خطا در انجام عملیات');
    } catch { toast.error('خطا در ارتباط با سرور'); }
    finally { setProcessing(null); }
  };

  if (loading) return <div className="p-12 text-center text-[#c61d70]"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;

  const filteredReviews = reviews.filter(r => filter === 'all' || r.status === filter);

  return (
    <div className="space-y-6 pb-20 md:pb-6 max-w-6xl mx-auto">
      {/* هدر صفحه */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#28242b] flex items-center gap-2">
            <MessageSquare className="text-[#c61d70]" size={26} /> مدیریت نظرات
          </h1>
          <p className="text-sm text-[#77717b] mt-1">
            {reviews.filter(r => r.status === 'pending').length} نظر در انتظار تایید
          </p>
        </div>
      </div>

      {/* نوار فیلتر شناور */}
      <div className="bg-white/70 backdrop-blur-xl border border-[#e9e5eb] rounded-2xl p-1.5 flex gap-1 overflow-x-auto shadow-sm w-fit">
        {[
          { k: 'all', label: 'همه نظرات' },
          { k: 'pending', label: 'در انتظار' },
          { k: 'approved', label: 'تایید شده' },
          { k: 'rejected', label: 'رد شده' },
        ].map((tab) => (
          <button
            key={tab.k}
            onClick={() => setFilter(tab.k as any)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0 ${
              filter === tab.k ? 'bg-[#c61d70] text-white shadow-md' : 'text-[#77717b] hover:bg-[#f8f7fa]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredReviews.length === 0 ? (
        <div className="bg-white border border-dashed border-[#e9e5eb] rounded-3xl p-16 text-center">
          <MessageSquare size={48} className="mx-auto text-[#c61d70]/30 mb-4" />
          <h3 className="font-black text-lg text-[#28242b]">نظری در این بخش یافت نشد</h3>
          <p className="text-sm text-[#77717b] mt-2">با فیلترهای دیگر امتحان کنید.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${review.status === 'pending' ? 'border-amber-300 shadow-[0_8px_30px_-6px_rgba(251,191,36,0.15)]' : 'border-[#e9e5eb] shadow-sm'}`}>
              
              <div className="flex flex-col md:flex-row">
                {/* محصول */}
                <div className="md:w-48 shrink-0 bg-[#fafafc] p-4 flex flex-row md:flex-col items-center gap-3 border-b md:border-b-0 md:border-l border-[#e9e5eb]">
                  <div className="w-16 h-16 relative rounded-xl border border-[#e9e5eb] bg-white overflow-hidden shrink-0">
                    {review.productImage ? (
                      <Image src={review.productImage} alt={review.productName} fill className="object-contain p-1.5" />
                    ) : (
                      <Package className="w-6 h-6 m-auto text-[#918a95]" />
                    )}
                  </div>
                  <div className="text-center md:mt-2">
                    <span className="text-xs font-bold text-[#28242b] line-clamp-2 leading-relaxed">{review.productName || 'محصول حذف شده'}</span>
                  </div>
                </div>

                {/* محتوای نظر */}
                <div className="flex-1 p-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#fff0f7] to-[#fce5f0] text-[#c61d70] flex items-center justify-center font-black text-lg shadow-sm">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-[#28242b] flex items-center gap-1"><User size={14} className="text-[#918a95]"/> {review.name}</span>
                          {review.verifiedPurchase && (
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-100">
                              <ShieldCheck size={10} /> خریدار
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-[#918a95]">
                          {review.email && <span className="flex items-center gap-1"><Mail size={10}/> {review.email}</span>}
                          <span>{formatPersianDate(review.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} className={i < review.rating ? '' : 'text-gray-200'} />
                        ))}
                      </div>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${
                        review.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        review.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {review.status === 'approved' ? 'تایید شده' : review.status === 'pending' ? 'در انتظار' : 'رد شده'}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-[#3a333f] leading-loose bg-[#fafafc] p-4 rounded-xl border border-[#f5f0f2]">
                    {review.comment}
                  </p>

                  {/* دکمه‌های عملیات */}
                  <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-[#e9e5eb]">
                    <button onClick={() => handleAction(review.id, 'delete')} disabled={processing === review.id} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50">
                      {processing === review.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} حذف
                    </button>
                    {review.status !== 'rejected' && (
                      <button onClick={() => handleAction(review.id, 'reject')} disabled={processing === review.id} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50">
                        <X size={14} /> رد کردن
                      </button>
                    )}
                    {review.status !== 'approved' && (
                      <button onClick={() => handleAction(review.id, 'approve')} disabled={processing === review.id} className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-[#c61d70] text-white rounded-lg shadow-md shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-colors disabled:opacity-50">
                        {processing === review.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} تایید نظر
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


==========================================================================================
FILE [73/255] src\app\admin\(dashboard)\reviews\page.tsx
SIZE 478 bytes
==========================================================================================
import { Suspense } from 'react';
import ClientContent from './content';

export const instant = false;

function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#c61d70] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ClientContent />
    </Suspense>
  );
}


==========================================================================================
FILE [74/255] src\app\admin\(dashboard)\settings\content.tsx
SIZE 13066 bytes
==========================================================================================
'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Save, Loader2, Store, ShieldCheck, CreditCard, Info, Sparkles, Trash2 } from 'lucide-react';
import PersianDatePicker from '@/components/shared/PersianDatePicker';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, any>>({});
  
  // استیت‌های مربوط به نوار تبلیغاتی
  const [promoText, setPromoText] = useState('');
  const [promoExpiresAt, setPromoExpiresAt] = useState<Date | null>(null);
  const [promoActive, setPromoActive] = useState(true);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const map: Record<string, any> = {};
          data.settings.forEach((s: any) => { map[s.key] = s.value; });
          setSettings(map);
          setPromoText(map.promoBarText || '');
          if (map.promoBarExpiresAt) {
            setPromoExpiresAt(new Date(map.promoBarExpiresAt));
          }
          if (map.promoBarActive !== undefined) {
            setPromoActive(Boolean(map.promoBarActive));
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...settings, 
          promoBarText: promoText, 
          promoBarExpiresAt: promoExpiresAt ? promoExpiresAt.toISOString() : null,
          promoBarActive: promoActive
        }),
      });
      if (res.ok) toast.success('تنظیمات با موفقیت ذخیره شد');
      else toast.error('خطا در ذخیره تنظیمات');
    } catch {
      toast.error('خطا در ارتباط با سرور');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePromo = async () => {
    if (!confirm('آیا از حذف کامل نوار تبلیغاتی مطمئن هستید؟')) return;
    setPromoText('');
    setPromoExpiresAt(null);
    setPromoActive(false);
    
    const newSettings = { ...settings, promoBarText: '', promoBarExpiresAt: null, promoBarActive: false };
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) toast.success('نوار تبلیغاتی با موفقیت حذف شد');
      else toast.error('خطا در حذف');
    } catch {
      toast.error('خطا در ارتباط با سرور');
    }
  };

  if (loading) return <div className="p-12 text-center text-[#77717b] flex flex-col items-center"><Loader2 className="w-8 h-8 animate-spin text-[#c61d70] mb-4" /><span>در حال بارگذاری...</span></div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-24 md:pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#28242b] md:text-2xl">تنظیمات فروشگاه</h1>
          <p className="mt-1 text-xs text-[#77717b] md:text-sm">اطلاعات پایه، تجارت، امنیت و بازاریابی را اینجا مدیریت کنید.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="hidden items-center gap-2 rounded-xl bg-[#28242b] px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-transform hover:-translate-y-0.5 disabled:opacity-50 md:flex">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          ذخیره تغییرات
        </button>
      </div>

      <div className="grid gap-5 md:gap-6">
        {/* General Settings */}
        <div className="rounded-3xl border border-[#e9e5eb] bg-white p-5 shadow-sm md:p-6">
          <h2 className="mb-5 flex items-center gap-2 border-b border-[#e9e5eb] pb-4 text-sm font-black text-[#28242b]"><Store size={18} className="text-[#c61d70]"/> اطلاعات عمومی</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#28242b]">نام فروشگاه</label>
              <input type="text" value={settings.siteName || ''} onChange={e => handleChange('siteName', e.target.value)} className="w-full rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] px-4 py-3 text-sm outline-none transition-colors focus:border-[#c61d70] focus:bg-white" placeholder="مثلاً فاطمه بیوتی لند" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#28242b]">شماره تماس</label>
              <input type="text" value={settings.phone || ''} onChange={e => handleChange('phone', e.target.value)} className="w-full rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] px-4 py-3 text-left text-sm outline-none transition-colors focus:border-[#c61d70] focus:bg-white" dir="ltr" placeholder="0990..." />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-[#28242b]">آدرس فیزیکی</label>
              <input type="text" value={settings.address || ''} onChange={e => handleChange('address', e.target.value)} className="w-full rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] px-4 py-3 text-sm outline-none transition-colors focus:border-[#c61d70] focus:bg-white" placeholder="تهران، ..." />
            </div>
          </div>
        </div>

        {/* Commerce Settings */}
        <div className="rounded-3xl border border-[#e9e5eb] bg-white p-5 shadow-sm md:p-6">
          <h2 className="mb-5 flex items-center gap-2 border-b border-[#e9e5eb] pb-4 text-sm font-black text-[#28242b]"><CreditCard size={18} className="text-[#c61d70]"/> تنظیمات تجارت</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#28242b]">واحد پول</label>
              <select value={settings.currency || 'IRR'} onChange={e => handleChange('currency', e.target.value)} className="w-full cursor-pointer rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] px-4 py-3 text-sm outline-none focus:border-[#c61d70] focus:bg-white">
                <option value="IRR">ریال</option>
                <option value="IRT">تومان</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#28242b] flex items-center gap-1">مالیات (٪) <Info size={12} className="text-[#918a95]"/></label>
              <input type="number" value={settings.taxRate || 0} onChange={e => handleChange('taxRate', Number(e.target.value))} className="w-full rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] px-4 py-3 text-left text-sm outline-none transition-colors focus:border-[#c61d70] focus:bg-white" dir="ltr" />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="rounded-3xl border border-[#e9e5eb] bg-white p-5 shadow-sm md:p-6">
          <h2 className="mb-5 flex items-center gap-2 border-b border-[#e9e5eb] pb-4 text-sm font-black text-[#28242b]"><ShieldCheck size={18} className="text-[#c61d70]"/> امنیت و دسترسی</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#28242b]">وضعیت فروشگاه</label>
              <select value={settings.storeStatus || 'open'} onChange={e => handleChange('storeStatus', e.target.value)} className="w-full cursor-pointer rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] px-4 py-3 text-sm outline-none focus:border-[#c61d70] focus:bg-white">
                <option value="open">باز (فعال)</option>
                <option value="closed">بسته (تعمیرات)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#28242b]">حداقل مبلغ سفارش (تومان)</label>
              <input type="number" value={settings.minOrderAmount || 0} onChange={e => handleChange('minOrderAmount', Number(e.target.value))} className="w-full rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] px-4 py-3 text-left text-sm outline-none transition-colors focus:border-[#c61d70] focus:bg-white" dir="ltr" />
            </div>
          </div>
        </div>

        {/* Promotion Settings */}
        <div className="rounded-3xl border border-[#e9e5eb] bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center justify-between mb-5 border-b border-[#e9e5eb] pb-4">
            <h2 className="flex items-center gap-2 text-sm font-black text-[#28242b]">
              <Sparkles size={18} className="text-[#c61d70]"/> نوار تبلیغاتی بالای سایت
            </h2>
            {(promoText || promoExpiresAt) && (
              <button onClick={handleDeletePromo} className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-colors">
                <Trash2 size={14} />
                حذف نوار
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* سوییچ فعال/غیرفعال */}
            <div className="space-y-2 md:col-span-2 pb-4 border-b border-[#e9e5eb]">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold text-[#28242b] block">وضعیت نمایش نوار</label>
                  <p className="text-[10px] text-[#77717b] mt-1">
                    {promoActive ? 'نوار در حال حاضر در سایت فعال است' : 'نوار در سایت غیرفعال شده است'}
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => setPromoActive(!promoActive)}
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 shrink-0 ${promoActive ? 'bg-[#c61d70] shadow-lg shadow-[#c61d70]/30' : 'bg-[#e9e5eb]'}`}
                  aria-label="تغییر وضعیت"
                >
                  <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${promoActive ? 'right-1' : 'right-8'}`} />
                </button>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-[#28242b]">متن نوار تبلیغاتی</label>
              <input 
                type="text" 
                value={promoText} 
                onChange={e => setPromoText(e.target.value)} 
                className="w-full rounded-xl border border-[#e9e5eb] bg-[#f8f7fa] px-4 py-3 text-sm outline-none transition-colors focus:border-[#c61d70] focus:bg-white" 
                placeholder="مثلاً: ارسال رایگان برای خرید بالای ۵۰۰ هزار تومان" 
              />
              <p className="text-[10px] text-[#77717b]">اگر خالی باشد، نوار تبلیغاتی نمایش داده نمی‌شود.</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-[#28242b]">تاریخ و ساعت پایان کمپین (اختیاری)</label>
              <PersianDatePicker
                value={promoExpiresAt}
                onChange={setPromoExpiresAt}
                withTime={true}
                placeholder="انتخاب تاریخ و ساعت..."
              />
              <p className="text-[10px] text-[#77717b]">اگر تنظیم شود، یک تایمر شمارش معکوس در نوار نمایش داده می‌شود و پس از آن به طور خودکار حذف می‌شود.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Save Bar */}
      <div className="fixed bottom-24 left-3 right-3 z-40 md:hidden">
        <button onClick={handleSave} disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#28242b] py-3.5 text-sm font-bold text-white shadow-2xl transition-transform active:scale-[0.98] disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          ذخیره تغییرات
        </button>
      </div>
    </div>
  );
}


==========================================================================================
FILE [75/255] src\app\admin\(dashboard)\settings\page.tsx
SIZE 478 bytes
==========================================================================================
import { Suspense } from 'react';
import ClientContent from './content';

export const instant = false;

function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#c61d70] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ClientContent />
    </Suspense>
  );
}


==========================================================================================
FILE [76/255] src\app\admin\(dashboard)\stock-notify\client.tsx
SIZE 6790 bytes
==========================================================================================
'use client';

import { useState, useEffect } from 'react';
import { Bell, Search, CheckCircle2, Clock, Loader2, Package, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { formatPersianDate } from '@/lib/format';

export default function StockNotifyClient() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/admin/stock-notify')
      .then(res => res.json())
      .then(data => { if (data.success) setNotifications(data.notifications); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = notifications.filter(n => 
    n.contact?.includes(search) || 
    n.productName?.includes(search)
  );

  const stats = {
    total: notifications.length,
    pending: notifications.filter(n => n.status === 'pending').length,
    notified: notifications.filter(n => n.status === 'notified').length,
  };

  if (loading) return <div className="p-12 text-center text-[#c61d70]"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-black text-[#28242b] flex items-center gap-2">
          <Bell className="text-[#c61d70]" size={26} /> اعلان‌های موجودی
        </h1>
        <p className="text-sm text-[#77717b] mt-1">لیست درخواست‌های اطلاع‌رسانی برای محصولات ناموجود</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl border border-[#e9e5eb] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Bell size={24} /></div>
          <div>
            <p className="text-xs font-bold text-[#77717b]">کل درخواست‌ها</p>
            <p className="text-2xl font-black text-[#28242b]">{stats.total.toLocaleString('fa-IR')}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-[#e9e5eb] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><Clock size={24} /></div>
          <div>
            <p className="text-xs font-bold text-[#77717b]">در انتظار</p>
            <p className="text-2xl font-black text-[#28242b]">{stats.pending.toLocaleString('fa-IR')}</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-[#e9e5eb] p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><CheckCircle2 size={24} /></div>
          <div>
            <p className="text-xs font-bold text-[#77717b]">اطلاع داده شده</p>
            <p className="text-2xl font-black text-[#28242b]">{stats.notified.toLocaleString('fa-IR')}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#e9e5eb] p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="جستجو در شماره یا نام محصول..." className="w-full pr-11 pl-4 py-2.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm outline-none focus:border-[#c61d70] transition-all" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#e9e5eb] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-[#fafafc] border-b border-[#e9e5eb] text-[#77717b]">
              <tr>
                <th className="px-6 py-4 font-bold">محصول</th>
                <th className="px-6 py-4 font-bold">اطلاعات تماس</th>
                <th className="px-6 py-4 font-bold">تاریخ درخواست</th>
                <th className="px-6 py-4 font-bold">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e9e5eb]">
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-16 text-center text-[#77717b]">درخواستی یافت نشد.</td></tr>
              ) : (
                filtered.map((n) => (
                  <tr key={n.id} className="hover:bg-[#fafafc] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#f8f7fa] border border-[#e9e5eb] flex items-center justify-center shrink-0 overflow-hidden relative">
                          {n.productImage ? (
                            <Image src={n.productImage} alt={n.productName} fill className="object-contain p-1" />
                          ) : (
                            <Package size={16} className="text-[#918a95]" />
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-[#28242b] block">{n.productName || 'محصول حذف شده'}</span>
                          <span className="text-[10px] text-[#77717b]">موجودی فعلی: {n.productStock}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-[#28242b]" dir="ltr">
                      {n.contact.startsWith('09') ? <span className="flex items-center gap-1.5 justify-end"><Phone size={12}/> {n.contact}</span> : <span className="flex items-center gap-1.5 justify-end"><Mail size={12}/> {n.contact}</span>}
                    </td>
                    <td className="px-6 py-4 text-xs text-[#77717b]">{formatPersianDate(n.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${n.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                        {n.status === 'pending' ? <><Clock size={10}/> در انتظار</> : <><CheckCircle2 size={10}/> اطلاع داده شد</>}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


==========================================================================================
FILE [77/255] src\app\admin\(dashboard)\stock-notify\page.tsx
SIZE 404 bytes
==========================================================================================
import { Suspense } from 'react';
import StockNotifyClient from './client';

export const instant = false;

function Skeleton() {
  return <div className="p-8 text-center text-[#77717b] text-sm">در حال بارگذاری اعلان‌ها...</div>;
}

export default function AdminStockNotifyPage() {
  return (
    <Suspense fallback={<Skeleton />}>
      <StockNotifyClient />
    </Suspense>
  );
}


==========================================================================================
FILE [78/255] src\app\admin\(dashboard)\support\[id]\admin-chat-client.tsx
SIZE 32483 bytes
==========================================================================================
'use client';

import { useState, useEffect, useRef, useMemo, Fragment } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Loader2, Send, ShieldCheck, X, ImagePlus, Clock,
  ArrowDown, Lock, MessageCircle, Mail, User, Sparkles, CheckCircle2,
  Zap, CircleDot, Search, Smile, Copy, Volume2, VolumeX, Check, CheckCheck,
  AlertTriangle, Timer, ChevronDown, Info
} from 'lucide-react';
import { toast } from 'sonner';
import { formatPersianDate } from '@/lib/format';

const STATUS: Record<string, { label: string; cls: string; dot: string; bar: string }> = {
  open: { label: 'باز', cls: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500', bar: 'from-blue-500 to-blue-600' },
  answered: { label: 'پاسخ داده شده', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500', bar: 'from-emerald-500 to-emerald-600' },
  closed: { label: 'بسته', cls: 'bg-gray-50 text-gray-600 border-gray-200', dot: 'bg-gray-400', bar: 'from-gray-400 to-gray-500' },
};

const EMOJIS = ['😀','😂','❤️','👍','🙏','🔥','✨','🎉','😍','😊','🤔','😢','💯','👌','🙌','💖'];

const QUICK_REPLIES = [
  { label: 'خوش‌آمد', text: 'سلام! ممنون از پیامتون. چطور می‌تونیم کمکتون کنیم؟' },
  { label: 'در حال بررسی', text: 'در حال بررسی موضوع هستیم و در اولین فرصت پاسخ کامل خدمتتون ارائه می‌شه.' },
  { label: 'پیگیری سفارش', text: 'سفارش شما در حال آماده‌سازیه و به‌محض ارسال، کد رهگیری خدمتتون اعلام می‌شه.' },
  { label: 'تشکر', text: 'از صبر و همراهی شما سپاسگزاریم.' },
  { label: 'بستن تیکت', text: 'اگر مشکل حل شده، لطفاً تیکت رو ببندید. در خدمتتون هستیم.' },
];

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
      return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline font-bold hover:opacity-80 break-all">{part}</a>;
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

function getSla(lastMessageAt: Date | string) {
  const mins = Math.floor((Date.now() - new Date(lastMessageAt).getTime()) / 60000);
  if (mins < 5) return { label: 'همین الان', color: 'text-emerald-600', bg: 'bg-emerald-50', urgency: 0 };
  if (mins < 30) return { label: mins + ' دقیقه پیش', color: 'text-emerald-600', bg: 'bg-emerald-50', urgency: 1 };
  if (mins < 120) return { label: Math.floor(mins/60) + ' ساعت پیش', color: 'text-amber-600', bg: 'bg-amber-50', urgency: 2 };
  if (mins < 1440) return { label: Math.floor(mins/60) + ' ساعت پیش', color: 'text-orange-600', bg: 'bg-orange-50', urgency: 3 };
  return { label: Math.floor(mins/1440) + ' روز پیش', color: 'text-rose-600', bg: 'bg-rose-50', urgency: 4 };
}

export default function AdminChatClient({ ticket, customer, initialMessages }: { ticket: any; customer: { name: string; email: string }; initialMessages: any[] }) {
  const [messages, setMessages] = useState<any[]>(initialMessages);
  const [status, setStatus] = useState<string>(ticket.status);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [showQuick, setShowQuick] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarTab, setSidebarTab] = useState<'info' | 'quick'>('info');
  const [soundOn, setSoundOn] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return localStorage.getItem('admin-chat-sound') !== 'off';
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const seenIds = useRef<Set<string>>(new Set(initialMessages.map(m => m.id)));
  const messageCount = messages.length;
  const signature = useMemo(() => messages.map(m => m.id).join('|'), [messages]);
  const sla = getSla(ticket.lastMessageAt);

  useEffect(() => {
    fetch('/api/admin/support', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ticketId: ticket.id }) }).catch(() => {});
  }, [ticket.id]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/admin/support/' + ticket.id, { cache: 'no-store' });
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
      const hasIncoming = newMsgs.some(m => m.senderType === 'customer');
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
    localStorage.setItem('admin-chat-sound', soundOn ? 'on' : 'off');
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
      const res = await fetch('/api/admin/support/' + ticket.id, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage.trim() || 'عکس ارسال شد', status: 'answered', attachmentUrl }),
      });
      if (res.ok) {
        setNewMessage(''); setAttachmentUrl(null); setStatus('answered'); setShowEmoji(false);
        const refresh = await fetch('/api/admin/support/' + ticket.id, { cache: 'no-store' });
        const data = await refresh.json();
        if (data.success) setMessages(data.messages);
        toast.success('پاسخ ارسال شد');
      } else { const d = await res.json(); toast.error(d.message || 'خطا'); }
    } catch { toast.error('خطا'); }
    finally { setSending(false); }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const res = await fetch('/api/admin/support/' + ticket.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) { setStatus(newStatus); toast.success('وضعیت به‌روزرسانی شد'); }
    } catch { toast.error('خطا'); }
  };

  const applyQuickReply = (text: string) => {
    setNewMessage(text);
    setShowQuick(false);
    textareaRef.current?.focus();
  };

  const insertEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    textareaRef.current?.focus();
  };

  const copyMsg = (text: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success('کپی شد')).catch(() => toast.error('خطا'));
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
    <div className="flex h-[calc(100dvh-100px)] md:h-[calc(100dvh-80px)] gap-4">
      {/* MAIN CHAT */}
      <div className="relative flex-1 min-w-0 flex flex-col bg-[#fafafc] rounded-[2rem] border border-[#e9e5eb] shadow-2xl shadow-[#c61d70]/10 overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#c61d70]/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#c61d70]/5 blur-3xl" />

        {/* HEADER */}
        <div className="relative shrink-0 border-b border-[#f2d7e5] bg-gradient-to-br from-[#fff0f7] via-[#fce5f0] to-white">
          <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-[#c61d70]/10 blur-2xl" />
          <div className="relative px-3 md:px-5 py-3 md:py-4 flex items-center gap-3 flex-wrap">
            <Link href="/admin/support" className="p-2.5 rounded-2xl bg-white/80 backdrop-blur text-[#77717b] hover:bg-white hover:text-[#c61d70] transition-all shadow-sm shrink-0" aria-label="بازگشت">
              <ArrowRight size={18} />
            </Link>
            <div className="relative shrink-0">
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-[#c61d70] to-[#e84e9e] flex items-center justify-center text-white text-lg font-black shadow-lg shadow-[#c61d70]/30 ring-2 ring-white">
                {(customer.name || 'ک').charAt(0)}
              </div>
              <span className={'absolute -bottom-0.5 -left-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-white ' + statusInfo.dot + ' animate-pulse'} />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-sm md:text-base font-black text-[#28242b] truncate leading-tight">{customer.name || 'کاربر'}</h1>
              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#77717b]">
                <Mail size={10} className="shrink-0" />
                <span dir="ltr" className="truncate">{customer.email}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => { setSearchMode(!searchMode); setSearchQuery(''); }} className={'p-2 rounded-xl transition-all ' + (searchMode ? 'bg-[#c61d70] text-white shadow-md' : 'bg-white/70 text-[#77717b] hover:bg-white hover:text-[#c61d70]')} aria-label="جستجو">
                <Search size={16} />
              </button>
              <button onClick={() => setSoundOn(!soundOn)} className="p-2 rounded-xl bg-white/70 text-[#77717b] hover:bg-white hover:text-[#c61d70] transition-all" aria-label="صدا">
                {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <select value={status} onChange={(e) => updateStatus(e.target.value)} className={'text-[10px] md:text-[11px] font-black rounded-xl border-2 px-2.5 py-1.5 outline-none bg-white cursor-pointer transition-all hover:shadow-sm ' + statusInfo.cls}>
                <option value="open">باز</option>
                <option value="answered">پاسخ داده</option>
                <option value="closed">بسته</option>
              </select>
            </div>
          </div>
          <div className="relative px-3 md:px-5 pb-2 md:pb-3 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-[10px] md:text-[11px] font-bold text-[#77717b]">
              <MessageCircle size={11} className="text-[#c61d70]" />
              <span className="truncate">موضوع: <span className="text-[#28242b]">{ticket.subject}</span></span>
            </span>
            <span className={'inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ' + sla.bg + ' ' + sla.color}>
              {sla.urgency >= 3 ? <AlertTriangle size={10} /> : <Timer size={10} />}
              {sla.label}
            </span>
          </div>
          {searchMode && (
            <div className="relative px-3 md:px-5 pb-3 animate-in slide-in-from-top-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95]" />
                <input autoFocus type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="جستجو در پیام‌ها..." className="w-full pr-10 pl-10 py-2.5 bg-white border-2 border-[#e9e5eb] rounded-xl text-xs outline-none focus:border-[#c61d70] transition-all" />
                {searchQuery && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#c61d70]">{filteredMessages.length.toLocaleString('fa-IR')} یافت</span>}
              </div>
            </div>
          )}
        </div>

        {/* MESSAGES */}
        <div ref={scrollRef} onScroll={handleScroll} className="chat-scroll flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 md:px-6 py-4 md:py-6 relative">
          {filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="w-16 h-16 rounded-full bg-white border border-[#e9e5eb] flex items-center justify-center mb-4 shadow-sm">
                <MessageCircle size={28} className="text-[#c61d70]/40" />
              </div>
              <h3 className="text-base font-black text-[#28242b] mb-1">{searchQuery ? 'پیامی پیدا نشد' : 'هنوز پیامی نیست'}</h3>
              <p className="text-xs text-[#77717b]">{searchQuery ? 'عبارت جستجو را تغییر بده.' : 'اولین پاسخ را بفرست تا گفتگو شروع شود.'}</p>
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
                  const isOwn = isAdmin;
                  return (
                    <div key={msg.id} className={'group flex gap-2 mt-1.5 ' + (isAdmin ? 'flex-row-reverse' : '') + ' animate-in fade-in slide-in-from-bottom-2 duration-300'} style={{ animationDelay: (mi * 30) + 'ms' }}>
                      <div className={'shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-md ' + (isAdmin ? 'bg-gradient-to-br from-[#c61d70] to-[#e84e9e] ring-2 ring-white' : 'bg-gradient-to-br from-[#28242b] to-[#5a535e]') + (showAvatar ? '' : ' opacity-0')}>
                        {isAdmin ? <ShieldCheck size={14} /> : (customer.name || 'ک').charAt(0)}
                      </div>
                      <div className={'max-w-[78%] md:max-w-[70%] flex flex-col ' + (isAdmin ? 'items-end' : 'items-start')}>
                        {showAvatar && (
                          <span className="text-[9px] font-bold text-[#918a95] mb-1 px-1">{isAdmin ? 'شما (پشتیبانی)' : customer.name}</span>
                        )}
                        <div className={'relative rounded-2xl overflow-hidden text-[13px] md:text-sm leading-relaxed shadow-sm ' + (isAdmin ? 'bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-white rounded-tl-sm shadow-[#c61d70]/25' : 'bg-white border border-[#e9e5eb] text-[#28242b] rounded-tr-sm')}>
                          {msg.attachmentUrl && (
                            <button onClick={() => setLightbox(msg.attachmentUrl)} className="block w-full max-w-[260px] cursor-zoom-in hover:opacity-95 transition-opacity">
                              <img src={msg.attachmentUrl} alt="پیوست" className="w-full h-auto object-cover" loading="lazy" />
                            </button>
                          )}
                          {msg.message && msg.message !== 'عکس ارسال شد' && (
                            <div className="px-4 py-2.5 whitespace-pre-wrap break-words">{renderText(msg.message, searchMode ? searchQuery : '')}</div>
                          )}
                        </div>
                        <div className={'flex items-center gap-1.5 mt-1 px-1 ' + (isAdmin ? 'flex-row-reverse' : '')}>
                          <span className="text-[9px] text-[#918a95] flex items-center gap-1"><Clock size={9} /> {formatTime(msg.createdAt)}</span>
                          {msg.message && msg.message !== 'عکس ارسال شد' && (
                            <button onClick={() => copyMsg(msg.message)} className="opacity-0 group-hover:opacity-100 max-md:opacity-40 text-[#918a95] hover:text-[#c61d70] transition-all" aria-label="کپی"><Copy size={10} /></button>
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
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600 shadow-sm">
                <Lock size={14} /> تیکت بسته شده — برای پاسخ، وضعیت را باز کنید
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <button onClick={() => setShowQuick(!showQuick)} className={'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ' + (showQuick ? 'bg-[#c61d70] text-white shadow-md shadow-[#c61d70]/20' : 'bg-[#f8f7fa] text-[#77717b] border border-[#e9e5eb] hover:border-[#c61d70]/30')}>
                  <Zap size={12} /> پاسخ سریع
                </button>
                <span className="text-[10px] text-[#918a95]">{newMessage.length.toLocaleString('fa-IR')} / ۲۰۰۰</span>
              </div>
              {showQuick && (
                <div className="mb-2 flex gap-2 overflow-x-auto pb-1 chat-scroll-hide animate-in fade-in slide-in-from-top-2">
                  {QUICK_REPLIES.map((qr, i) => (
                    <button key={i} onClick={() => applyQuickReply(qr.text)} className="shrink-0 px-3 py-1.5 rounded-full bg-white border border-[#e9e5eb] text-[10px] md:text-[11px] font-bold text-[#28242b] hover:border-[#c61d70]/40 hover:bg-[#fff0f7] hover:text-[#c61d70] transition-all">{qr.label}</button>
                  ))}
                </div>
              )}
              {attachmentUrl && (
                <div className="mb-3 relative inline-block">
                  <img src={attachmentUrl} alt="پیش‌نمایش" className="h-20 w-auto rounded-xl border-2 border-[#f2d7e5] shadow-sm" />
                  <button onClick={() => setAttachmentUrl(null)} className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 shadow-md transition-colors" aria-label="حذف عکس"><X size={12} /></button>
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
                  <button onClick={() => setShowEmoji(!showEmoji)} className={'p-3 transition-colors shrink-0 ' + (showEmoji ? 'text-[#c61d70]' : 'text-[#918a95] hover:text-[#c61d70]')} aria-label="ایموجی"><Smile size={20} /></button>
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="p-3 text-[#918a95] hover:text-[#c61d70] transition-colors shrink-0 disabled:opacity-50" aria-label="پیوست">
                    {uploading ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} />}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                  <textarea ref={textareaRef} value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="پاسخ خود را بنویسید..." rows={1} className="flex-1 py-3 px-1 bg-transparent text-sm outline-none resize-none max-h-32 chat-scroll-hide" style={{ minHeight: '48px' }} maxLength={2000} />
                </div>
                <button onClick={handleSend} disabled={sending || (newMessage.trim().length === 0 && !attachmentUrl)} className="h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-white flex items-center justify-center shadow-lg shadow-[#c61d70]/30 hover:shadow-xl hover:shadow-[#c61d70]/40 hover:-translate-y-0.5 disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0 transition-all" aria-label="ارسال">
                  {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-80 shrink-0 gap-4">
        <div className="rounded-[2rem] border border-[#e9e5eb] bg-white shadow-sm overflow-hidden">
          <div className="relative p-5 bg-gradient-to-br from-[#fff0f7] via-[#fce5f0] to-white border-b border-[#f2d7e5]">
            <div className="pointer-events-none absolute -top-8 -right-8 h-24 w-24 rounded-full bg-[#c61d70]/10 blur-2xl" />
            <div className="relative flex flex-col items-center text-center">
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#c61d70] to-[#e84e9e] flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-[#c61d70]/30 ring-4 ring-white">
                  {(customer.name || 'ک').charAt(0)}
                </div>
                <span className={'absolute -bottom-1 -right-1 h-4 w-4 rounded-full ring-2 ring-white ' + statusInfo.dot} />
              </div>
              <h3 className="text-base font-black text-[#28242b] mb-1">{customer.name || 'کاربر'}</h3>
              <p className="text-[11px] text-[#77717b] flex items-center gap-1" dir="ltr"><Mail size={11} /> {customer.email || '—'}</p>
            </div>
          </div>
          <div className="flex border-b border-[#e9e5eb]">
            <button onClick={() => setSidebarTab('info')} className={'flex-1 py-2.5 text-[11px] font-black transition-colors border-b-2 ' + (sidebarTab === 'info' ? 'text-[#c61d70] border-[#c61d70] bg-[#fff0f7]/50' : 'text-[#77717b] border-transparent hover:text-[#28242b]')}>
              <Info size={12} className="inline mb-0.5 ml-1" /> اطلاعات
            </button>
            <button onClick={() => setSidebarTab('quick')} className={'flex-1 py-2.5 text-[11px] font-black transition-colors border-b-2 ' + (sidebarTab === 'quick' ? 'text-[#c61d70] border-[#c61d70] bg-[#fff0f7]/50' : 'text-[#77717b] border-transparent hover:text-[#28242b]')}>
              <Zap size={12} className="inline mb-0.5 ml-1" /> پاسخ سریع
            </button>
          </div>
          <div className="p-4">
            {sidebarTab === 'info' ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs py-2 border-b border-[#f5f0f2]">
                  <span className="text-[#77717b] font-medium flex items-center gap-1.5"><CircleDot size={11} className={statusInfo.dot.replace('bg-', 'text-')} /> وضعیت</span>
                  <span className={'px-2 py-0.5 rounded-full border text-[10px] font-bold ' + statusInfo.cls}>{statusInfo.label}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-2 border-b border-[#f5f0f2]">
                  <span className="text-[#77717b] font-medium flex items-center gap-1.5"><Sparkles size={11} className="text-[#c61d70]" /> تعداد پیام‌ها</span>
                  <span className="font-black text-[#28242b]">{messages.length.toLocaleString('fa-IR')}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-2 border-b border-[#f5f0f2]">
                  <span className="text-[#77717b] font-medium flex items-center gap-1.5"><Clock size={11} className="text-[#c61d70]" /> ایجاد تیکت</span>
                  <span className="font-bold text-[#28242b] text-[10px]">{formatPersianDate(ticket.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-2 border-b border-[#f5f0f2]">
                  <span className="text-[#77717b] font-medium flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-500" /> آخرین پیام</span>
                  <span className="font-bold text-[#28242b] text-[10px]">{formatPersianDate(ticket.lastMessageAt)}</span>
                </div>
                <div className={'flex items-center justify-between text-xs py-2 px-3 rounded-xl ' + sla.bg}>
                  <span className={'font-bold flex items-center gap-1.5 ' + sla.color}>
                    {sla.urgency >= 3 ? <AlertTriangle size={11} /> : <Timer size={11} />} SLA
                  </span>
                  <span className={'font-black text-[10px] ' + sla.color}>{sla.label}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[280px] overflow-y-auto chat-scroll">
                {QUICK_REPLIES.map((qr, i) => (
                  <button key={i} onClick={() => applyQuickReply(qr.text)} className="w-full text-right p-2.5 rounded-xl bg-[#f8f7fa] hover:bg-[#fff0f7] hover:border-[#c61d70]/30 border border-transparent transition-all group">
                    <p className="text-[11px] font-black text-[#28242b] group-hover:text-[#c61d70] mb-0.5">{qr.label}</p>
                    <p className="text-[10px] text-[#918a95] line-clamp-2 leading-relaxed">{qr.text}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {lightbox && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors" aria-label="بستن"><X size={20} /></button>
          <img src={lightbox} alt="پیوست" className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}


==========================================================================================
FILE [79/255] src\app\admin\(dashboard)\support\[id]\page.tsx
SIZE 1395 bytes
==========================================================================================
import { Suspense } from 'react';
import { db } from '@/lib/db';
import { supportTickets, supportMessages, customers } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import AdminChatClient from './admin-chat-client';

export const instant = false;

function Skeleton() {
  return <div className="p-8 text-center text-[#c61d70]">در حال بارگذاری چت...</div>;
}

async function ChatContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await db.select({
    ticket: supportTickets,
    customerName: customers.name,
    customerEmail: customers.email,
  }).from(supportTickets).leftJoin(customers, eq(supportTickets.customerId, customers.id)).where(eq(supportTickets.id, id)).limit(1);

  if (result.length === 0) notFound();

  const messages = await db.select().from(supportMessages).where(eq(supportMessages.ticketId, id)).orderBy(asc(supportMessages.createdAt));

  return (
    <AdminChatClient
      ticket={result[0].ticket}
      customer={{ name: result[0].customerName || 'کاربر', email: result[0].customerEmail || '' }}
      initialMessages={messages}
    />
  );
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <ChatContent params={params} />
    </Suspense>
  );
}


==========================================================================================
FILE [80/255] src\app\admin\(dashboard)\support\admin-support-client.tsx
SIZE 8237 bytes
==========================================================================================
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, Search, Clock, CheckCircle2, ChevronLeft, AlertCircle, Loader2 } from 'lucide-react';
import { formatPersianDate } from '@/lib/format';

const CATEGORIES: Record<string, string> = { order: 'سفارش', product: 'محصول', payment: 'پرداخت', other: 'سایر' };
const STATUS: Record<string, { label: string; cls: string }> = {
  open: { label: 'باز', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  answered: { label: 'پاسخ داده شده', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  closed: { label: 'بسته', cls: 'bg-gray-50 text-gray-600 border-gray-200' },
};

export default function AdminSupportClient() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'answered' | 'closed'>('all');

  useEffect(() => {
    fetch('/api/admin/support')
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => { 
        if (data.success) setTickets(data.tickets); 
        else setError(data.message || 'خطا');
      })
      .catch((err) => setError(err.message || 'دسترسی غیرمجاز'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tickets.filter((t) => {
    if (filter !== 'all' && t.ticket.status !== filter) return false;
    if (search && !t.ticket.subject.toLowerCase().includes(search.toLowerCase()) && !t.customerName?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.ticket.status === 'open').length,
    answered: tickets.filter((t) => t.ticket.status === 'answered').length,
    unread: tickets.filter((t) => t.ticket.unreadByAdmin > 0).length,
  };

  if (loading) return <div className="p-12 text-center text-[#c61d70]"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" /><p className="text-sm">در حال بارگذاری تیکت‌ها...</p></div>;

  if (error) return (
    <div className="p-12 text-center">
      <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
      <p className="text-sm text-rose-600">{error}</p>
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-black text-[#28242b] md:text-2xl">
          <MessageCircle className="text-[#c61d70]" size={26} /> مدیریت پشتیبانی
        </h1>
        <p className="mt-1 text-xs text-[#77717b] md:text-sm">تیکت‌های کاربران را ببینید و پاسخ دهید.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-[#e9e5eb] bg-white p-4">
          <div className="flex items-center justify-between mb-2"><span className="text-[11px] font-bold text-[#77717b]">کل تیکت‌ها</span><MessageCircle size={16} className="text-[#c61d70]" /></div>
          <p className="text-xl font-black text-[#28242b]">{stats.total.toLocaleString('fa-IR')}</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center justify-between mb-2"><span className="text-[11px] font-bold text-blue-700">باز</span><Clock size={16} className="text-blue-600" /></div>
          <p className="text-xl font-black text-blue-800">{stats.open.toLocaleString('fa-IR')}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center justify-between mb-2"><span className="text-[11px] font-bold text-emerald-700">پاسخ داده شده</span><CheckCircle2 size={16} className="text-emerald-600" /></div>
          <p className="text-xl font-black text-emerald-800">{stats.answered.toLocaleString('fa-IR')}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center justify-between mb-2"><span className="text-[11px] font-bold text-amber-700">پیام جدید</span><AlertCircle size={16} className="text-amber-600" /></div>
          <p className="text-xl font-black text-amber-800">{stats.unread.toLocaleString('fa-IR')}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#918a95]" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="جستجو..." className="w-full pr-11 pl-4 py-3 bg-white border border-[#e9e5eb] rounded-2xl text-sm outline-none focus:border-[#c61d70] transition-all" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {[{ k: 'all' as const, label: 'همه' }, { k: 'open' as const, label: 'باز' }, { k: 'answered' as const, label: 'پاسخ داده' }, { k: 'closed' as const, label: 'بسته' }].map((f) => (
            <button key={f.k} onClick={() => setFilter(f.k)} className={`shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${filter === f.k ? 'bg-[#c61d70] text-white shadow-lg shadow-[#c61d70]/20' : 'bg-white text-[#77717b] border border-[#e9e5eb]'}`}>{f.label}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#e9e5eb] bg-white p-12 text-center">
          <MessageCircle size={48} className="mx-auto mb-4 text-[#c61d70]/30" />
          <h3 className="text-lg font-black text-[#28242b] mb-2">تیکتی یافت نشد</h3>
          <p className="text-sm text-[#77717b]">هنوز هیچ تیکتی ثبت نشده است.</p>
        </div>
      ) : (
        <div className="grid gap-2">
          {filtered.map(({ ticket, customerName, customerEmail }) => {
            const status = STATUS[ticket.status] || STATUS.open;
            return (
              <Link key={ticket.id} href={`/admin/support/${ticket.id}`} className="group rounded-2xl border border-[#e9e5eb] bg-white p-4 hover:border-[#c61d70]/30 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-black text-sm text-[#28242b] truncate">{ticket.subject}</h3>
                      {ticket.unreadByAdmin > 0 && (
                        <span className="shrink-0 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-[#c61d70] text-white text-[10px] font-black animate-pulse">{ticket.unreadByAdmin.toLocaleString('fa-IR')}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-[#77717b]">
                      <span className="font-bold">{customerName || 'کاربر'}</span>
                      {customerEmail && <><span>·</span><span className="truncate" dir="ltr">{customerEmail}</span></>}
                    </div>
                  </div>
                  <ChevronLeft size={18} className="shrink-0 text-[#c61d70] opacity-50 group-hover:opacity-100" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[9px] font-bold ${status.cls}`}>{status.label}</span>
                  <span className="inline-flex items-center rounded-full bg-[#f8f7fa] border border-[#e9e5eb] px-2 py-0.5 text-[9px] font-bold text-[#77717b]">{CATEGORIES[ticket.category] || ticket.category}</span>
                  <span className="text-[9px] text-[#918a95]">{formatPersianDate(ticket.lastMessageAt)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}


==========================================================================================
FILE [81/255] src\app\admin\(dashboard)\support\page.tsx
SIZE 330 bytes
==========================================================================================
import { Suspense } from 'react';
import AdminSupportClient from './admin-support-client';

export const instant = false;

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#c61d70]">در حال بارگذاری...</div>}>
      <AdminSupportClient />
    </Suspense>
  );
}


==========================================================================================
FILE [82/255] src\app\admin\ClientRedirector.tsx
SIZE 612 bytes
==========================================================================================
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ClientRedirector({ to }: { to: string }) {
  const router = useRouter();
  useEffect(() => { router.replace(to); }, [router, to]);
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#c61d70]" />
        <p className="text-sm font-bold text-[#77717b]">در حال انتقال...</p>
      </div>
    </div>
  );
}


==========================================================================================
FILE [83/255] src\app\admin\layout.tsx
SIZE 119 bytes
==========================================================================================
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


==========================================================================================
FILE [84/255] src\app\admin\login\content.tsx
SIZE 3533 bytes
==========================================================================================
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2 } from 'lucide-react';


export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push('/admin');
      } else {
        const data = await res.json();
        setError(data.message || 'خطا در ورود');
      }
    } catch (err) {
      setError('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-sage/20 blur-[120px] rounded-full" />
      
      <div className="glass-panel p-8 w-full max-w-md z-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black mb-2">ورود به پنل مدیریت</h1>
          <p className="text-sm text-muted-foreground">فاطمه بیوتی لند - بخش مدیریت</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">ایمیل</label>
            <div className="relative">
              <Mail className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-10 pl-4 py-2 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/50"
                placeholder="admin@fatemehlab.ir"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">رمز عبور</label>
            <div className="relative">
              <Lock className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-4 py-2 bg-white/50 border border-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/50"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && <p className="text-rose text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-foreground text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-foreground/80 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'ورود به پنل'}
          </button>
        </form>
      </div>
    </div>
  );
}



==========================================================================================
FILE [85/255] src\app\admin\login\page.tsx
SIZE 478 bytes
==========================================================================================
import { Suspense } from 'react';
import ClientContent from './content';

export const instant = false;

function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#c61d70] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ClientContent />
    </Suspense>
  );
}


==========================================================================================
FILE [86/255] src\app\api\account\addresses\[id]\route.ts
SIZE 2056 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { addresses } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const { isDefault, ...data } = body;

    // بررسی تعلق آدرس به مشتری
    const existing = await db.select({ id: addresses.id }).from(addresses).where(and(eq(addresses.id, id), eq(addresses.customerId, customer.id))).limit(1);
    if (existing.length === 0) return NextResponse.json({ success: false, message: 'آدرس یافت نشد' }, { status: 404 });

    // اگر این آدرس به عنوان پیش‌فرض انتخاب شد، بقیه را غیر پیش‌فرض کنیم
    if (isDefault) {
      await db.update(addresses).set({ isDefault: false }).where(eq(addresses.customerId, customer.id));
    }

    await db.update(addresses).set({ ...data, isDefault }).where(eq(addresses.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطا در ویرایش' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 });

    const { id } = await params;
    await db.delete(addresses).where(and(eq(addresses.id, id), eq(addresses.customerId, customer.id)));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: 'خطا در حذف' }, { status: 500 });
  }
}


==========================================================================================
FILE [87/255] src\app\api\account\addresses\route.ts
SIZE 2950 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { addresses } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { z } from 'zod';

const addressSchema = z.object({
  title: z.string().min(2, 'عنوان آدرس الزامی است'),
  firstName: z.string().min(1, 'نام الزامی است'),
  lastName: z.string().min(1, 'نام خانوادگی الزامی است'),
  phone: z.string().min(10, 'شماره موبایل معتبر نیست'),
  province: z.string().min(2, 'استان الزامی است'),
  city: z.string().min(2, 'شهر الزامی است'),
  address: z.string().min(10, 'آدرس کامل الزامی است'),
  postalCode: z.string().min(10, 'کد پستی ۱۰ رقمی الزامی است'),
  isDefault: z.boolean().optional(),
});

export async function GET() {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false }, { status: 401 });

    const list = await db.select().from(addresses).where(eq(addresses.customerId, customer.id)).orderBy(desc(addresses.isDefault), desc(addresses.createdAt));
    return NextResponse.json({ success: true, addresses: list });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 });

    const body = await req.json();
    const validated = addressSchema.parse(body);

    // اگر اولین آدرس است، به صورت خودکار پیش‌فرض شود
    const existing = await db.select({ id: addresses.id }).from(addresses).where(eq(addresses.customerId, customer.id));
    const isFirst = existing.length === 0;

    // اگر این آدرس به عنوان پیش‌فرض انتخاب شد، بقیه را غیر پیش‌فرض کنیم
    if (validated.isDefault || isFirst) {
      await db.update(addresses).set({ isDefault: false }).where(eq(addresses.customerId, customer.id));
    }

    const [newAddress] = await db.insert(addresses).values({
      customerId: customer.id,
      ...validated,
      isDefault: validated.isDefault || isFirst,
    }).returning();

    return NextResponse.json({ success: true, address: newAddress });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ success: false, message: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ success: false, message: 'خطا در ثبت آدرس' }, { status: 500 });
  }
}


==========================================================================================
FILE [88/255] src\app\api\account\avatar\route.ts
SIZE 2355 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { put, del } from '@vercel/blob';

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(req: Request) {
  try {
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 });

    // 🛡️ بررسی وجود توکن Blob
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('BLOB_READ_WRITE_TOKEN is missing');
      return NextResponse.json({ success: false, message: 'سیستم آپلود موقتاً در دسترس نیست' }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) return NextResponse.json({ success: false, message: 'فایلی ارسال نشد' }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ success: false, message: 'حجم عکس حداکثر ۲ مگابایت است' }, { status: 400 });
    if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ success: false, message: 'فقط JPG, PNG یا WebP مجاز است' }, { status: 400 });

    const [current] = await db.select({ avatar: customers.avatar }).from(customers).where(eq(customers.id, customer.id)).limit(1);
    if (current?.avatar) {
      try { await del(current.avatar, { token: process.env.BLOB_READ_WRITE_TOKEN }); } catch {}
    }

    const blob = await put(`avatar-${customer.id}-${Date.now()}`, file, {
      access: 'public',
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    await db.update(customers).set({ avatar: blob.url }).where(eq(customers.id, customer.id));

    return NextResponse.json({ success: true, avatar: blob.url });
  } catch (error: any) {
    console.error('Avatar upload error:', error);
    return NextResponse.json({ success: false, message: 'خطا در آپلود عکس' }, { status: 500 });
  }
}


==========================================================================================
FILE [89/255] src\app\api\account\change-password\route.ts
SIZE 2145 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as argon2 from 'argon2';
import { z } from 'zod';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { validateOrigin, rejectCsrf } from '@/lib/security';

const schema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'رمز جدید باید حداقل ۶ حرف باشد'),
});

export async function POST(req: Request) {
  try {
    // 🛡️ سپر امنیتی
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 });

    const body = await req.json();
    const { currentPassword, newPassword } = schema.parse(body);

    const [cust] = await db.select().from(customers).where(eq(customers.id, customer.id)).limit(1);
    if (!cust) return NextResponse.json({ success: false, message: 'کاربر یافت نشد' }, { status: 404 });

    if (cust.passwordHash && cust.passwordHash !== '') {
      if (!currentPassword) {
        return NextResponse.json({ success: false, message: 'رمز عبور فعلی الزامی است' }, { status: 400 });
      }
      const isValid = await argon2.verify(cust.passwordHash, currentPassword);
      if (!isValid) return NextResponse.json({ success: false, message: 'رمز عبور فعلی اشتباه است' }, { status: 400 });
    }

    const newHash = await argon2.hash(newPassword);
    await db.update(customers).set({ passwordHash: newHash }).where(eq(customers.id, customer.id));

    return NextResponse.json({ success: true, message: 'رمز عبور با موفقیت تنظیم شد' });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ success: false, message: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ success: false, message: 'خطا در تغییر رمز' }, { status: 500 });
  }
}


==========================================================================================
FILE [90/255] src\app\api\account\login\route.ts
SIZE 2688 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as argon2 from 'argon2';
import { z } from 'zod';
import { createCustomerToken } from '@/lib/customer-auth';
import { rateLimit } from '@/lib/rate-limit';

const loginSchema = z.object({
  email: z.string().email('ایمیل معتبر نیست'),
  password: z.string().min(1, 'رمز عبور الزامی است'),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const rl = await rateLimit('customer-login:' + ip);
    if (!rl.success) {
      return NextResponse.json({ success: false, message: 'تعداد تلاش‌ها بیش از حد مجاز است.' }, { status: 429 });
    }

    const body = await req.json();
    const validated = loginSchema.parse(body);

    const [customer] = await db
      .select()
      .from(customers)
      .where(eq(customers.email, validated.email.toLowerCase()))
      .limit(1);

    if (!customer) {
      return NextResponse.json({ success: false, message: 'ایمیل یا رمز عبور اشتباه است' }, { status: 401 });
    }

    // 🛡️ بررسی کاربران OTP (که رمز ندارند)
    if (!customer.passwordHash || customer.passwordHash === '') {
      return NextResponse.json({ 
        success: false, 
        message: 'شما با کد یکبار مصرف ثبت‌نام کرده‌اید. لطفاً از تب «ورود با کد یکبار مصرف» استفاده کنید.' 
      }, { status: 400 });
    }

    const isValid = await argon2.verify(customer.passwordHash, validated.password);
    if (!isValid) {
      return NextResponse.json({ success: false, message: 'ایمیل یا رمز عبور اشتباه است' }, { status: 401 });
    }

    const token = await createCustomerToken({
      id: customer.id,
      email: customer.email,
      name: customer.name,
    });

    const response = NextResponse.json({
      success: true,
      customer: { id: customer.id, name: customer.name, email: customer.email },
    });

    response.cookies.set('customer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'خطا در ورود' }, { status: 500 });
  }
}


==========================================================================================
FILE [91/255] src\app\api\account\logout\route.ts
SIZE 220 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { clearCustomerCookie } from '@/lib/customer-auth';

export async function POST() {
  await clearCustomerCookie();
  return NextResponse.json({ success: true });
}


==========================================================================================
FILE [92/255] src\app\api\account\me\route.ts
SIZE 803 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';

export async function GET() {
  const current = await getCurrentCustomer();
  if (!current) return NextResponse.json({ success: false }, { status: 401 });

  const [customer] = await db.select({
    id: customers.id,
    name: customers.name,
    email: customers.email,
    phone: customers.phone,
    avatar: customers.avatar,
    createdAt: customers.createdAt,
  }).from(customers).where(eq(customers.id, current.id)).limit(1);

  if (!customer) return NextResponse.json({ success: false }, { status: 404 });

  return NextResponse.json({ success: true, customer });
}


==========================================================================================
FILE [93/255] src\app\api\account\onboarding\route.ts
SIZE 2915 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as argon2 from 'argon2';
import { z } from 'zod';
import { getCurrentCustomer, createCustomerToken } from '@/lib/customer-auth';

function normalizeDigits(str: string): string {
  return str
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

const onboardingSchema = z.object({
  name: z.string().min(2, 'نام حداقل ۲ حرف باشد').max(100),
  email: z.string().email('ایمیل معتبر نیست'),
  phone: z.string().refine((val) => {
    const normalized = normalizeDigits(val).replace(/\s+/g, '');
    return /^0\d{10}$/.test(normalized);
  }, 'شماره تماس باید ۱۱ رقم و با ۰ شروع شود'),
  password: z.string().min(6, 'رمز عبور باید حداقل ۶ حرف باشد'),
});

export async function POST(req: Request) {
  try {
    const current = await getCurrentCustomer();
    if (!current) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 });

    const body = await req.json();
    const validated = onboardingSchema.parse(body);

    const normalizedEmail = validated.email.toLowerCase().trim();
    const normalizedPhone = normalizeDigits(validated.phone).replace(/\s+/g, '');

    const existing = await db
      .select({ id: customers.id })
      .from(customers)
      .where(eq(customers.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0 && existing[0].id !== current.id) {
      return NextResponse.json({ success: false, message: 'این ایمیل قبلاً ثبت شده است' }, { status: 400 });
    }

    const passwordHash = await argon2.hash(validated.password);

    await db.update(customers).set({
      name: validated.name.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      passwordHash,
    }).where(eq(customers.id, current.id));

    // Update JWT token to reflect the new email
    const newToken = await createCustomerToken({
      id: current.id,
      email: normalizedEmail,
      name: validated.name.trim(),
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set('customer_token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: 'خطا در ذخیره اطلاعات' }, { status: 500 });
  }
}


==========================================================================================
FILE [94/255] src\app\api\account\phone\route.ts
SIZE 1617 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { sendOtpCode } from '@/lib/sms';
import { Redis } from '@upstash/redis';
import { z } from 'zod';

const schema = z.object({ newPhone: z.string().regex(/^0\d{10}$/, 'شماره معتبر نیست') });

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}
const memoryStore = new Map<string, string>();

export async function POST(req: Request) {
  try {
    const current = await getCurrentCustomer();
    if (!current) return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 });

    const { newPhone } = schema.parse(await req.json());
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `phone_otp:${current.id}`;

    const redis = getRedis();
    if (redis) await redis.set(key, `${newPhone}:${code}`, { ex: 120 });
    else { memoryStore.set(key, `${newPhone}:${code}`); setTimeout(() => memoryStore.delete(key), 120000); }

    const result = await sendOtpCode(newPhone, code);
    if (result.success) return NextResponse.json({ success: true });
    return NextResponse.json({ message: 'خطا در ارسال پیامک' }, { status: 500 });
  } catch (err: any) {
    if (err instanceof z.ZodError) return NextResponse.json({ message: err.issues[0].message }, { status: 400 });
    return NextResponse.json({ message: 'خطای سرور' }, { status: 500 });
  }
}


==========================================================================================
FILE [95/255] src\app\api\account\phone\verify\route.ts
SIZE 2102 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { Redis } from '@upstash/redis';
import { z } from 'zod';

const schema = z.object({ newPhone: z.string(), code: z.string().length(6) });

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}
const memoryStore = new Map<string, string>();

export async function POST(req: Request) {
  try {
    const current = await getCurrentCustomer();
    if (!current) return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 });

    const { newPhone, code } = schema.parse(await req.json());
    const key = `phone_otp:${current.id}`;

    let stored = '';
    const redis = getRedis();
    if (redis) stored = await redis.get(key) || '';
    else stored = memoryStore.get(key) || '';

    const [storedPhone, storedCode] = stored.split(':');

    if (storedPhone !== newPhone || storedCode !== code) {
      return NextResponse.json({ message: 'کد نامعتبر یا منقضی شده' }, { status: 400 });
    }

    if (redis) await redis.del(key);
    else memoryStore.delete(key);

    const existing = await db.select({ id: customers.id }).from(customers).where(eq(customers.phone, newPhone)).limit(1);
    if (existing.length > 0 && existing[0].id !== current.id) {
      return NextResponse.json({ message: 'این شماره قبلاً توسط کاربر دیگری ثبت شده' }, { status: 400 });
    }

    await db.update(customers).set({ phone: newPhone }).where(eq(customers.id, current.id));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err instanceof z.ZodError) return NextResponse.json({ message: err.issues[0].message }, { status: 400 });
    return NextResponse.json({ message: 'خطای سرور' }, { status: 500 });
  }
}


==========================================================================================
FILE [96/255] src\app\api\account\profile\route.ts
SIZE 2505 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getCurrentCustomer, createCustomerToken } from '@/lib/customer-auth';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(2, 'نام حداقل ۲ حرف باشد'),
  phone: z.string().optional().nullable(),
  email: z.string().email('ایمیل معتبر نیست').optional(),
});

export async function PUT(req: Request) {
  try {
    // 🛡️ سپر امنیتی
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    const current = await getCurrentCustomer();
    if (!current) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 });

    const body = await req.json();
    const validated = profileSchema.parse(body);

    const updateData: any = { name: validated.name, phone: validated.phone || null };
    let emailChanged = false;
    let nameChanged = validated.name !== current.name;

    if (validated.email && validated.email.toLowerCase() !== current.email.toLowerCase()) {
      const existing = await db.select({ id: customers.id }).from(customers).where(eq(customers.email, validated.email.toLowerCase())).limit(1);
      if (existing.length > 0 && existing[0].id !== current.id) {
        return NextResponse.json({ success: false, message: 'این ایمیل قبلاً ثبت شده است' }, { status: 400 });
      }
      updateData.email = validated.email.toLowerCase();
      emailChanged = true;
    }

    await db.update(customers).set(updateData).where(eq(customers.id, current.id));

    const response = NextResponse.json({ success: true });

    if (emailChanged || nameChanged) {
      const newToken = await createCustomerToken({
        id: current.id,
        email: updateData.email,
        name: validated.name,
      });
      response.cookies.set('customer_token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
        path: '/',
      });
    }

    return response;
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ success: false, message: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ success: false, message: 'خطا' }, { status: 500 });
  }
}


==========================================================================================
FILE [97/255] src\app\api\account\register\route.ts
SIZE 2704 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as argon2 from 'argon2';
import { z } from 'zod';
import { createCustomerToken } from '@/lib/customer-auth';
import { rateLimit } from '@/lib/rate-limit';

const registerSchema = z.object({
  name: z.string().min(2, 'نام باید حداقل ۲ حرف باشد'),
  email: z.string().email('ایمیل معتبر نیست'),
  password: z.string().min(6, 'رمز عبور باید حداقل ۶ حرف باشد'),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const rl = await rateLimit('customer-register:' + ip);
    if (!rl.success) {
      return NextResponse.json({ success: false, message: 'تعداد درخواست‌ها بیش از حد مجاز است.' }, { status: 429 });
    }

    const body = await req.json();
    const validated = registerSchema.parse(body);

    const existing = await db
      .select({ id: customers.id })
      .from(customers)
      .where(eq(customers.email, validated.email.toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { success: false, message: 'این ایمیل قبلاً ثبت شده است' },
        { status: 400 }
      );
    }

    const passwordHash = await argon2.hash(validated.password);

    const [newCustomer] = await db
      .insert(customers)
      .values({
        name: validated.name,
        email: validated.email.toLowerCase(),
        passwordHash,
      })
      .returning();

    const token = await createCustomerToken({
      id: newCustomer.id,
      email: newCustomer.email,
      name: newCustomer.name,
    });

    // Set cookie explicitly on the response (most reliable method)
    const response = NextResponse.json({
      success: true,
      customer: { id: newCustomer.id, name: newCustomer.name, email: newCustomer.email },
    });

    response.cookies.set('customer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return response;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error('Register error:', error);
    return NextResponse.json({ success: false, message: 'خطا در ثبت‌نام' }, { status: 500 });
  }
}


==========================================================================================
FILE [98/255] src\app\api\account\wishlist\check\route.ts
SIZE 980 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { wishlist } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';

export async function GET(req: Request) {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false, isWishlisted: false });

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    if (!productId) return NextResponse.json({ success: false, isWishlisted: false });

    const existing = await db
      .select({ id: wishlist.id })
      .from(wishlist)
      .where(and(eq(wishlist.customerId, customer.id), eq(wishlist.productId, productId)))
      .limit(1);

    return NextResponse.json({ success: true, isWishlisted: existing.length > 0 });
  } catch {
    return NextResponse.json({ success: false, isWishlisted: false });
  }
}


==========================================================================================
FILE [99/255] src\app\api\account\wishlist\route.ts
SIZE 3682 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { wishlist, products } from '@/db/schema';
import { eq, and, desc, inArray } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';

// GET: لیست علاقه‌مندی‌ها با اطلاعات محصولات
export async function GET() {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 });

    const items = await db
      .select({
        id: wishlist.id,
        productId: wishlist.productId,
        createdAt: wishlist.createdAt,
      })
      .from(wishlist)
      .where(eq(wishlist.customerId, customer.id))
      .orderBy(desc(wishlist.createdAt));

    if (items.length === 0) return NextResponse.json({ success: true, items: [] });

    const productIds = items.map(i => i.productId);
    const productList = await db.select().from(products).where(inArray(products.id, productIds));

    const merged = items.map(item => ({
      ...item,
      product: productList.find(p => p.id === item.productId),
    })).filter(item => item.product);

    return NextResponse.json({ success: true, items: merged });
  } catch (error) {
    console.error('Wishlist GET error:', error);
    return NextResponse.json({ success: false, message: 'خطا در دریافت علاقه‌مندی‌ها' }, { status: 500 });
  }
}

// POST: افزودن یا حذف از علاقه‌مندی‌ها (toggle)
export async function POST(req: Request) {
  try {
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 });

    const { productId } = await req.json();
    if (!productId) return NextResponse.json({ success: false, message: 'شناسه محصول الزامی است' }, { status: 400 });

    // بررسی وجود
    const existing = await db
      .select({ id: wishlist.id })
      .from(wishlist)
      .where(and(eq(wishlist.customerId, customer.id), eq(wishlist.productId, productId)))
      .limit(1);

    if (existing.length > 0) {
      // حذف
      await db.delete(wishlist).where(eq(wishlist.id, existing[0].id));
      return NextResponse.json({ success: true, action: 'removed' });
    } else {
      // افزودن
      await db.insert(wishlist).values({ customerId: customer.id, productId });
      return NextResponse.json({ success: true, action: 'added' });
    }
  } catch (error) {
    console.error('Wishlist POST error:', error);
    return NextResponse.json({ success: false, message: 'خطا در عملیات' }, { status: 500 });
  }
}

// DELETE: حذف از علاقه‌مندی‌ها
export async function DELETE(req: Request) {
  try {
    const customer = await getCurrentCustomer();
    if (!customer) return NextResponse.json({ success: false, message: 'UNAUTHORIZED' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'شناسه الزامی است' }, { status: 400 });

    await db.delete(wishlist).where(and(eq(wishlist.id, id), eq(wishlist.customerId, customer.id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطا' }, { status: 500 });
  }
}


==========================================================================================
FILE [100/255] src\app\api\admin\analytics\route.ts
SIZE 2788 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems, products } from '@/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await verifyAdmin();

    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    
    // ۱. محاسبه آمار کلی
    const validOrders = allOrders.filter(o => o.status !== 'cancelled');
    const totalRevenue = validOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalOrders = validOrders.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // ۲. داده‌های نمودار ۷ روز اخیر
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        date: d.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' }),
        fullDate: d.toISOString().split('T')[0],
        revenue: 0,
        orders: 0
      };
    });

    validOrders.forEach(order => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      const dayData = last7Days.find(d => d.fullDate === orderDate);
      if (dayData) {
        dayData.revenue += order.totalAmount;
        dayData.orders += 1;
      }
    });

    // ۳. پرفروش‌ترین محصولات
    const topItems = await db
      .select({
        productId: orderItems.productId,
        name: orderItems.productName,
        totalSold: sql<number>`sum(${orderItems.quantity})`,
        revenue: sql<number>`sum(${orderItems.quantity} * ${orderItems.price})`
      })
      .from(orderItems)
      .innerJoin(orders, eq(orderItems.orderId, orders.id))
      .where(sql`${orders.status} != 'cancelled'`)
      .groupBy(orderItems.productId, orderItems.productName)
      .orderBy(desc(sql`sum(${orderItems.quantity})`))
      .limit(5);

    // گرفتن عکس محصولات
    const topProducts = await Promise.all(topItems.map(async (item) => {
      const [prod] = await db.select({ mainImage: products.mainImage, slug: products.slug }).from(products).where(eq(products.id, item.productId)).limit(1);
      return { ...item, mainImage: prod?.mainImage, slug: prod?.slug };
    }));

    // ۴. سفارشات در انتظار
    const pendingCount = allOrders.filter(o => o.status === 'processing' || o.status === 'pending').length;

    return NextResponse.json({
      success: true,
      kpi: { totalRevenue, totalOrders, avgOrderValue, pendingCount },
      chartData: last7Days,
      topProducts
    });

  } catch (error) {
    return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
  }
}


==========================================================================================
FILE [101/255] src\app\api\admin\articles\[id]\generate-cover\route.ts
SIZE 1349 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { articles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateArticleCover } from '@/lib/ai-image';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const [article] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, id))
      .limit(1);
    
    if (!article) {
      return NextResponse.json(
        { success: false, message: 'مقاله یافت نشد' },
        { status: 404 }
      );
    }

    console.log(`🎨 تولید کاور برای: ${article.title}`);
    
    const coverImage = await generateArticleCover(article.title, article.category);
    
    await db
      .update(articles)
      .set({ coverImage, updatedAt: new Date() })
      .where(eq(articles.id, id));

    return NextResponse.json({
      success: true,
      coverImage,
      message: 'تصویر با موفقیت تولید شد',
    });
  } catch (error: any) {
    console.error('❌ Error generating cover:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'خطا در تولید تصویر' },
      { status: 500 }
    );
  }
}


==========================================================================================
FILE [102/255] src\app\api\admin\articles\[id]\route.ts
SIZE 2079 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { articles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await verifyAdmin();
    const { id } = await params;
    await db.delete(articles).where(eq(articles.id, id));
    revalidatePath('/journal');
    revalidatePath('/admin/articles');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
    return NextResponse.json({ message: 'خطا در حذف مقاله' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await verifyAdmin();
    const { id } = await params;
    const body = await req.json();
    const { title, slug, excerpt, content, category, coverImage, status, readTime, author, featured, editorsPick, seoTitle, seoDescription } = body;

    await db.update(articles)
      .set({ 
        title, slug, excerpt, content, category, coverImage, status, readTime, author,
        featured: featured ?? false,
        editorsPick: editorsPick ?? false,
        seoTitle, seoDescription,
        updatedAt: new Date() 
      })
      .where(eq(articles.id, id));

    revalidatePath('/journal');
    revalidatePath('/admin/articles');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
    if (error?.cause?.code === '23505') return NextResponse.json({ message: 'این شناسه قبلاً استفاده شده است.' }, { status: 400 });
    return NextResponse.json({ message: 'خطا در ویرایش مقاله' }, { status: 500 });
  }
}


==========================================================================================
FILE [103/255] src\app\api\admin\articles\route.ts
SIZE 1962 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { articles } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';
import { z } from 'zod';

const articleSchema = z.object({
  title: z.string().min(3, 'عنوان حداقل ۳ حرف باشد'),
  slug: z.string().min(2, 'شناسه حداقل ۲ حرف باشد').regex(/^[a-z0-9-]+$/, 'شناسه نامعتبر است'),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(10, 'محتوا حداقل ۱۰ حرف باشد'),
  category: z.string().min(1),
  coverImage: z.string().optional().nullable(),
  status: z.enum(['draft', 'published']),
  readTime: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  featured: z.boolean().optional().default(false),
  editorsPick: z.boolean().optional().default(false),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    await verifyAdmin();
    const body = await req.json();
    const validated = articleSchema.parse(body);

    const newArticle = await db.insert(articles).values(validated).returning();

    revalidatePath('/journal');
    revalidatePath('/admin/articles');

    return NextResponse.json({ success: true, article: newArticle[0] });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
    if (error instanceof z.ZodError) return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    if (error?.cause?.code === '23505') return NextResponse.json({ message: 'این شناسه قبلاً استفاده شده است.' }, { status: 400 });
    return NextResponse.json({ message: 'خطا در ثبت مقاله' }, { status: 500 });
  }
}


==========================================================================================
FILE [104/255] src\app\api\admin\coupons\[id]\route.ts
SIZE 1317 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { coupons } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await verifyAdmin();
    const { id } = await params;
    const body = await req.json();
    await db.update(coupons).set({
      description: body.description || null,
      type: body.type,
      value: body.value,
      minOrderAmount: body.minOrderAmount || 0,
      maxDiscountAmount: body.maxDiscountAmount || null,
      usageLimit: body.usageLimit || null,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      isActive: body.isActive,
    }).where(eq(coupons.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: 'خطا' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await verifyAdmin();
    const { id } = await params;
    await db.delete(coupons).where(eq(coupons.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: 'خطا' }, { status: 500 });
  }
}


==========================================================================================
FILE [105/255] src\app\api\admin\coupons\route.ts
SIZE 2133 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { coupons } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';
import { z } from 'zod';

const couponSchema = z.object({
  code: z.string().min(2).max(50).regex(/^[A-Za-z0-9_-]+$/),
  description: z.string().optional().nullable(),
  type: z.enum(['percent', 'fixed']),
  value: z.coerce.number().min(1),
  minOrderAmount: z.coerce.number().min(0).default(0),
  maxDiscountAmount: z.coerce.number().optional().nullable(),
  usageLimit: z.coerce.number().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export async function GET() {
  try {
    await verifyAdmin();
    const all = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
    return NextResponse.json({ success: true, coupons: all });
  } catch {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await verifyAdmin();
    const body = await req.json();
    const v = couponSchema.parse(body);
    const [existing] = await db.select().from(coupons).where(eq(coupons.code, v.code.toUpperCase())).limit(1);
    if (existing) return NextResponse.json({ message: 'این کد قبلاً وجود دارد' }, { status: 400 });
    const [newCoupon] = await db.insert(coupons).values({
      code: v.code.toUpperCase(),
      description: v.description || null,
      type: v.type,
      value: v.value,
      minOrderAmount: v.minOrderAmount || 0,
      maxDiscountAmount: v.maxDiscountAmount || null,
      usageLimit: v.usageLimit || null,
      expiresAt: v.expiresAt ? new Date(v.expiresAt) : null,
      isActive: v.isActive,
    }).returning();
    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (e: any) {
    if (e instanceof z.ZodError) return NextResponse.json({ message: e.issues[0].message }, { status: 400 });
    return NextResponse.json({ message: 'خطا' }, { status: 500 });
  }
}


==========================================================================================
FILE [106/255] src\app\api\admin\customers\route.ts
SIZE 1266 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers, orders } from '@/db/schema';
import { desc, sql, eq } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await verifyAdmin();
    const allCustomers = await db.select().from(customers).orderBy(desc(customers.createdAt));
    const orderStats = await db
      .select({
        customerId: orders.customerId,
        totalOrders: sql<number>`count(${orders.id})`.mapWith(Number),
        totalSpent: sql<number>`coalesce(sum(case when ${orders.status} != 'cancelled' then ${orders.totalAmount} else 0 end), 0)`.mapWith(Number)
      })
      .from(orders)
      .groupBy(orders.customerId);

    const customersWithStats = allCustomers.map(customer => {
      const stats = orderStats.find(s => s.customerId === customer.id);
      return {
        ...customer,
        totalOrders: stats?.totalOrders || 0,
        totalSpent: stats?.totalSpent || 0,
      };
    });

    return NextResponse.json({ success: true, customers: customersWithStats });
  } catch (error) {
    console.error('Admin customers error:', error);
    return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
  }
}


==========================================================================================
FILE [107/255] src\app\api\admin\notifications\route.ts
SIZE 965 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, reviews } from '@/db/schema';
import { eq, and, or } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await verifyAdmin();
    
    // سفارشاتی که در انتظار پردازش هستند
    const pendingOrders = await db
      .select({ id: orders.id })
      .from(orders)
      .where(eq(orders.status, 'processing'));

    // نظراتی که در انتظار تایید هستند
    const pendingReviews = await db
      .select({ id: reviews.id })
      .from(reviews)
      .where(eq(reviews.status, 'pending'));

    return NextResponse.json({
      success: true,
      orders: pendingOrders.length,
      reviews: pendingReviews.length,
    });
  } catch (error) {
    return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
  }
}


==========================================================================================
FILE [108/255] src\app\api\admin\orders\[id]\route.ts
SIZE 5793 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { orders, orderItems, products, coupons, customers } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';
import { sendOrderNotification } from '@/lib/sms';

// 🛡️ ماشین حالت: تعریف مسیرهای مجاز برای تغییر وضعیت
const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['processing', 'cancelled'],
  paid: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    await verifyAdmin();
    const { id } = await params;
    const { status } = await req.json();
    
    const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: 'وضعیت نامعتبر است' }, { status: 400 });
    }

    const [existingOrder] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (!existingOrder) return NextResponse.json({ message: 'سفارش یافت نشد' }, { status: 404 });

    const allowedNextStatuses = VALID_TRANSITIONS[existingOrder.status] || [];
    if (!allowedNextStatuses.includes(status)) {
      return NextResponse.json({ 
        message: `تغییر وضعیت از «${existingOrder.status}» به «${status}» مجاز نیست.` 
      }, { status: 400 });
    }

    // اگر لغو سفارش pending است: بازگرداندن موجودی، کد تخفیف و امتیازات
    if (status === 'cancelled' && existingOrder.status === 'pending') {
      await db.transaction(async (tx) => {
        const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, id));
        for (const item of items) {
          await tx.update(products)
            .set({ stock: sql`${products.stock} + ${item.quantity}` })
            .where(eq(products.id, item.productId));
        }
        if (existingOrder.couponCode) {
          await tx.update(coupons)
            .set({ usedCount: sql`${coupons.usedCount} - 1` })
            .where(eq(coupons.code, existingOrder.couponCode));
        }
        if (existingOrder.usedPoints > 0 && existingOrder.customerId) {
          await tx.update(customers)
            .set({ loyaltyPoints: sql`${customers.loyaltyPoints} + ${existingOrder.usedPoints}` })
            .where(eq(customers.id, existingOrder.customerId));
        }
        await tx.update(orders).set({ status }).where(eq(orders.id, id));
      });
    } else if (status === 'cancelled' && (existingOrder.status === 'paid' || existingOrder.status === 'processing')) {
      // 🛡️ لغو سفارش پرداخت‌شده: برگرداندن موجودی + امتیاز + کد تخفیف
      await db.transaction(async (tx) => {
        const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, id));
        for (const item of items) {
          await tx.update(products)
            .set({ stock: sql`${products.stock} + ${item.quantity}` })
            .where(eq(products.id, item.productId));
        }
        
        // برگرداندن امتیازاتی که کاربر خرج کرده بود
        if (existingOrder.usedPoints > 0 && existingOrder.customerId) {
          await tx.update(customers)
            .set({ loyaltyPoints: sql`${customers.loyaltyPoints} + ${existingOrder.usedPoints}` })
            .where(eq(customers.id, existingOrder.customerId));
        }

        // برگرداندن امتیازاتی که به کاربر داده شده بود
        if (existingOrder.customerId && existingOrder.totalAmount > 0) {
          const earnedPoints = Math.floor(existingOrder.totalAmount / 100000);
          if (earnedPoints > 0) {
            await tx.update(customers)
              .set({ loyaltyPoints: sql`GREATEST(0, ${customers.loyaltyPoints} - ${earnedPoints})` })
              .where(eq(customers.id, existingOrder.customerId));
          }
        }

        // برگرداندن کد تخفیف
        if (existingOrder.couponCode) {
          await tx.update(coupons)
            .set({ usedCount: sql`GREATEST(0, ${coupons.usedCount} - 1)` })
            .where(eq(coupons.code, existingOrder.couponCode));
        }

        await tx.update(orders).set({ status }).where(eq(orders.id, id));
      });
    } else {
      await db.update(orders).set({ status }).where(eq(orders.id, id));
    }

    if (status === 'shipped') {
      sendOrderNotification(existingOrder.phone, existingOrder.trackingCode).catch(e => console.error('[SMS Shipping]', e));
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ message: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await verifyAdmin();
    const { id } = await params;
    
    await db.delete(orderItems).where(eq(orderItems.orderId, id));
    await db.delete(orders).where(eq(orders.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ message: 'Delete failed' }, { status: 500 });
  }
}


==========================================================================================
FILE [109/255] src\app\api\admin\orders\export\route.ts
SIZE 2292 bytes
==========================================================================================
import { formatPersianDate, formatPersianDateTime } from '@/lib/format';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/db/schema';
import { verifyAdmin } from '@/lib/auth';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    await verifyAdmin();

    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    const allItems = await db.select().from(orderItems);

    // Build CSV
    const headers = ['کد رهگیری', 'نام', 'نام خانوادگی', 'موبایل', 'شهر', 'آدرس', 'کد پستی', 'مبلغ کل', 'تخفیف', 'کد تخفیف', 'وضعیت', 'تاریخ', 'محصولات'];
    const rows: string[][] = [headers];

    for (const order of allOrders) {
      const items = allItems.filter(i => i.orderId === order.id);
      const productList = items.map(i => `${i.productName} (${i.quantity})`).join(' | ');
      
      const statusMap: Record<string, string> = {
        pending: 'در انتظار',
        paid: 'پرداخت شده',
        processing: 'در حال پردازش',
        shipped: 'ارسال شده',
        delivered: 'تحویل شده',
        cancelled: 'لغو شده',
      };

      rows.push([
        order.trackingCode,
        order.firstName,
        order.lastName,
        order.phone,
        order.city,
        order.address,
        order.postalCode,
        order.totalAmount.toString(),
        order.discountAmount?.toString() || '0',
        order.couponCode || '',
        statusMap[order.status] || order.status,
        formatPersianDate(order.createdAt),
        productList,
      ]);
    }

    // Add BOM for Excel UTF-8 compatibility
    const BOM = '\uFEFF';
    const csvContent = BOM + rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\r\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="fatemehlab-orders-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: 'خطا در خروجی' }, { status: 500 });
  }
}


==========================================================================================
FILE [110/255] src\app\api\admin\orders\route.ts
SIZE 554 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/db/schema';
import { verifyAdmin } from '@/lib/auth';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    await verifyAdmin();
    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return NextResponse.json({ success: true, orders: allOrders });
  } catch (error) {
    return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
  }
}


==========================================================================================
FILE [111/255] src\app\api\admin\products\[id]\route.ts
SIZE 3054 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { products, stockNotifications } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath, revalidateTag } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';
import { tomanToRial } from '@/lib/currency';
import { sendBackInStockSms } from '@/lib/sms';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    await verifyAdmin();
    const { id } = await params;
    const body = await req.json();
    const { name, slug, sku, description, price, stock, status, mainImage, gallery, specifications, ingredients, usage } = body;

    // 1. آپدیت محصول
    const [updatedProduct] = await db.update(products)
      .set({ 
        name, slug, sku: sku || null, description, 
        price: tomanToRial(Number(price)), 
        stock: Number(stock), 
        status, mainImage, 
        gallery: gallery || [], 
        specifications: specifications || [], 
        ingredients, usage, 
        updatedAt: new Date() 
      })
      .where(eq(products.id, id))
      .returning();

    // 2. ارسال خودکار پیامک در صورت شارژ موجودی
    if (updatedProduct && Number(updatedProduct.stock) > 0) {
      // 🛡️ استفاده از limit(15) برای جلوگیری از Timeout در Vercel
      const pendingNotifs = await db.select()
        .from(stockNotifications)
        .where(and(eq(stockNotifications.productId, id), eq(stockNotifications.status, 'pending')))
        .limit(15);

      if (pendingNotifs.length > 0) {
        // 🚀 await کردن برای اینکه Vercel سرور را زودتر خاموش نکند
        try {
          for (const notif of pendingNotifs) {
            if (notif.phoneOrEmail.startsWith('09')) {
              await sendBackInStockSms(notif.phoneOrEmail, updatedProduct.name);
            } else {
              console.log(`[Email Mock] Send email to ${notif.phoneOrEmail}`);
            }
            
            await db.update(stockNotifications)
              .set({ status: 'notified' })
              .where(eq(stockNotifications.id, notif.id));
          }
        } catch (err) {
          console.error('Stock notify error:', err);
        }
      }
    }

    revalidateTag('products', 'max');
    revalidatePath('/admin/products');
    revalidatePath('/');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
    if (error?.cause?.code === '23505') return NextResponse.json({ message: 'این شناسه قبلاً استفاده شده است.' }, { status: 400 });
    return NextResponse.json({ message: 'خطا در ویرایش محصول' }, { status: 500 });
  }
}


==========================================================================================
FILE [112/255] src\app\api\admin\products\route.ts
SIZE 2354 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { revalidatePath, revalidateTag } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';
import { z } from 'zod';
import { tomanToRial } from '@/lib/currency';

const productSchema = z.object({
  name: z.string().min(2, 'نام محصول حداقل ۲ حرف باشد'),
  slug: z.string().min(2, 'شناسه حداقل ۲ حرف باشد').regex(/^[a-z0-9-]+$/, 'شناسه نامعتبر است'),
  sku: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  price: z.coerce.number().min(0, 'قیمت نمی‌تواند منفی باشد'),
  stock: z.coerce.number().min(0, 'موجودی نمی‌تواند منفی باشد'),
  status: z.enum(['draft', 'published']),
  mainImage: z.string().optional().nullable(),
  gallery: z.array(z.string()).optional().default([]),
  specifications: z.array(z.object({ key: z.string(), value: z.string() })).optional().default([]),
  ingredients: z.string().optional().nullable(),
  usage: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    await verifyAdmin();
    const body = await req.json();
    const validated = productSchema.parse(body);

    const newProduct = await db.insert(products).values({
      ...validated,
      price: tomanToRial(validated.price),
    }).returning();

    revalidateTag('products', 'max');
    revalidatePath('/admin/products');
    revalidatePath('/');

    return NextResponse.json({ success: true, product: newProduct[0] });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
    if (error instanceof z.ZodError) return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    if (error?.cause?.code === '23505') return NextResponse.json({ message: 'این شناسه قبلاً استفاده شده است.' }, { status: 400 });
    return NextResponse.json({ message: 'خطا در ثبت محصول' }, { status: 500 });
  }
}


==========================================================================================
FILE [113/255] src\app\api\admin\reviews\route.ts
SIZE 2478 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { reviews, products } from '@/db/schema';
import { eq, desc, ilike, or, and } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    await verifyAdmin();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const conditions: any[] = [];
    if (status && status !== 'all') conditions.push(eq(reviews.status, status));
    if (search) conditions.push(or(ilike(reviews.name, `%${search}%`), ilike(reviews.comment, `%${search}%`)));

    const allReviews = await db
      .select({
        id: reviews.id,
        productId: reviews.productId,
        name: reviews.name,
        email: reviews.email,
        rating: reviews.rating,
        comment: reviews.comment,
        images: reviews.images,
        verifiedPurchase: reviews.verifiedPurchase,
        helpfulCount: reviews.helpfulCount,
        notHelpfulCount: reviews.notHelpfulCount,
        adminReply: reviews.adminReply,
        adminReplyAt: reviews.adminReplyAt,
        status: reviews.status,
        createdAt: reviews.createdAt,
        productName: products.name,
        productImage: products.mainImage,
      })
      .from(reviews)
      .leftJoin(products, eq(reviews.productId, products.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(reviews.createdAt));

    return NextResponse.json({ success: true, reviews: allReviews });
  } catch {
    return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
  }
}

export async function PUT(req: Request) {
  try {
    await verifyAdmin();
    const { id, action, adminReply } = await req.json();
    
    if (action === 'approve') {
      await db.update(reviews).set({ status: 'approved' }).where(eq(reviews.id, id));
    } else if (action === 'reject') {
      await db.update(reviews).set({ status: 'rejected' }).where(eq(reviews.id, id));
    } else if (action === 'delete') {
      await db.delete(reviews).where(eq(reviews.id, id));
    } else if (action === 'reply') {
      await db.update(reviews).set({ adminReply, adminReplyAt: new Date(), status: 'approved' }).where(eq(reviews.id, id));
    }
    
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: 'خطا' }, { status: 500 });
  }
}


==========================================================================================
FILE [114/255] src\app\api\admin\settings\route.ts
SIZE 1734 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { siteSettings } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await verifyAdmin();
    const settings = await db.select().from(siteSettings);
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    if (error?.message === 'UNAUTHORIZED' || error?.message === 'FORBIDDEN') {
      return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
    }
    return NextResponse.json({ message: 'خطا در دریافت تنظیمات' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    await verifyAdmin();
    const body = await req.json();
    const entries = Object.entries(body);

    for (const [key, value] of entries) {
      await db.insert(siteSettings)
        .values({ key, value })
        .onConflictDoUpdate({
          target: siteSettings.key,
          set: { value, updatedAt: new Date() },
        });
    }

    revalidatePath('/admin/settings');
    revalidatePath('/');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.message === 'UNAUTHORIZED' || error?.message === 'FORBIDDEN') {
      return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
    }
    return NextResponse.json({ message: 'خطا در ذخیره تنظیمات' }, { status: 500 });
  }
}


==========================================================================================
FILE [115/255] src\app\api\admin\stock-notify\route.ts
SIZE 969 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { stockNotifications, products } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await verifyAdmin();
    
    const notifications = await db
      .select({
        id: stockNotifications.id,
        contact: stockNotifications.phoneOrEmail,
        status: stockNotifications.status,
        createdAt: stockNotifications.createdAt,
        productName: products.name,
        productImage: products.mainImage,
        productStock: products.stock,
      })
      .from(stockNotifications)
      .leftJoin(products, eq(stockNotifications.productId, products.id))
      .orderBy(desc(stockNotifications.createdAt));

    return NextResponse.json({ success: true, notifications });
  } catch {
    return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
  }
}


==========================================================================================
FILE [116/255] src\app\api\admin\support\[id]\route.ts
SIZE 3162 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supportTickets, supportMessages, customers } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';
import { z } from 'zod';

const replySchema = z.object({
  message: z.string().min(1).max(2000),
  attachmentUrl: z.string().optional().nullable(),
  status: z.enum(['open', 'answered', 'closed']).optional(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await verifyAdmin();
    const { id } = await params;
    const result = await db.select({
      ticket: supportTickets,
      customerName: customers.name,
      customerEmail: customers.email,
    }).from(supportTickets).leftJoin(customers, eq(supportTickets.customerId, customers.id)).where(eq(supportTickets.id, id)).limit(1);
    if (result.length === 0) return NextResponse.json({ message: 'not found' }, { status: 404 });
    
    const messages = await db.select().from(supportMessages).where(eq(supportMessages.ticketId, id)).orderBy(asc(supportMessages.createdAt));
    return NextResponse.json({ success: true, ticket: result[0].ticket, customer: { name: result[0].customerName, email: result[0].customerEmail }, messages });
  } catch { return NextResponse.json({ message: 'Unauthorized' }, { status: 401 }); }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await verifyAdmin();
    const { id } = await params;
    const body = await req.json();
    const validated = replySchema.parse(body);
    
    const [ticket] = await db.select().from(supportTickets).where(eq(supportTickets.id, id)).limit(1);
    if (!ticket) return NextResponse.json({ message: 'not found' }, { status: 404 });
    
    await db.insert(supportMessages).values({
      ticketId: id,
      senderType: 'admin',
      senderName: 'تیم پشتیبانی',
      message: validated.message,
      attachmentUrl: validated.attachmentUrl || null,
    });
    
    await db.update(supportTickets).set({
      status: validated.status || 'answered',
      unreadByCustomer: (ticket.unreadByCustomer || 0) + 1,
      unreadByAdmin: 0,
      lastMessageAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(supportTickets.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ message: 'خطا' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await verifyAdmin();
    const { id } = await params;
    const { status } = await req.json();
    if (!['open', 'answered', 'closed'].includes(status)) return NextResponse.json({ message: 'invalid' }, { status: 400 });
    await db.update(supportTickets).set({ status, updatedAt: new Date() }).where(eq(supportTickets.id, id));
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ message: 'خطا' }, { status: 500 }); }
}


==========================================================================================
FILE [117/255] src\app\api\admin\support\route.ts
SIZE 1137 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supportTickets, customers } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await verifyAdmin();
    const tickets = await db.select({
      ticket: supportTickets,
      customerName: customers.name,
      customerEmail: customers.email,
    }).from(supportTickets).leftJoin(customers, eq(supportTickets.customerId, customers.id)).orderBy(desc(supportTickets.lastMessageAt));
    return NextResponse.json({ success: true, tickets });
  } catch (error) {
    console.error('Admin support GET error:', error);
    return NextResponse.json({ message: 'Unauthorized', tickets: [] }, { status: 401 });
  }
}

export async function POST(req: Request) {
  try {
    await verifyAdmin();
    const { ticketId } = await req.json();
    await db.update(supportTickets).set({ unreadByAdmin: 0 }).where(eq(supportTickets.id, ticketId));
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ message: 'خطا' }, { status: 500 }); }
}


==========================================================================================
FILE [118/255] src\app\api\auth\force-logout\route.ts
SIZE 485 bytes
==========================================================================================
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || url.origin;
  
  const response = NextResponse.redirect(`${baseUrl}/account/login?msg=session_sync`);
  response.cookies.set('customer_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}


==========================================================================================
FILE [119/255] src\app\api\auth\login\route.ts
SIZE 1993 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { adminUsers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as argon2 from 'argon2';
import { SignJWT } from 'jose';
import { rateLimit } from '@/lib/rate-limit';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-change-me-in-env');

export async function POST(req: Request) {
  try {
    // 🛡️ سپر امنیتی: جلوگیری از حملات Brute-force
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const rl = await rateLimit('admin-login:' + ip);
    
    if (!rl.success) {
      return NextResponse.json({ message: 'تلاش‌های ناموفق زیاد است. لطفاً ۵ دقیقه دیگر تلاش کنید.' }, { status: 429 });
    }

    const { email, password } = await req.json();
    const user = await db.select().from(adminUsers).where(eq(adminUsers.email, email)).limit(1);

    if (user.length === 0) {
      return NextResponse.json({ message: 'ایمیل یا رمز عبور اشتباه است' }, { status: 401 });
    }

    const isValid = await argon2.verify(user[0].passwordHash, password);
    if (!isValid) {
      return NextResponse.json({ message: 'ایمیل یا رمز عبور اشتباه است' }, { status: 401 });
    }

    const token = await new SignJWT({ id: user[0].id, role: user[0].role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(secret);

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // باگ خروج ناخواسته را برطرف کردیم
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: 'خطای سرور' }, { status: 500 });
  }
}


==========================================================================================
FILE [120/255] src\app\api\auth\logout\route.ts
SIZE 398 bytes
==========================================================================================
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  // پاک کردن کوکی HttpOnly در سمت سرور
  response.cookies.set('admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}


==========================================================================================
FILE [121/255] src\app\api\auth\send-otp\route.ts
SIZE 3124 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { sendOtpCode } from '@/lib/sms';
import { Redis } from '@upstash/redis';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';

function getRedis(): Redis | null {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return null;
    return new Redis({ url, token });
  } catch { return null; }
}

const IS_BYPASS = process.env.SMS_BYPASS_MODE === 'true';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const mobile = body?.mobile;

    if (!mobile || !/^09\d{9}$/.test(mobile)) {
      return NextResponse.json({ success: false, message: 'شماره موبایل معتبر نیست.' }, { status: 400 });
    }

    // 🛡️ محدودیت ارسال بر اساس شماره موبایل (جلوگیری از اسپم)
    try {
      const rl = await rateLimit('otp-send:' + mobile);
      if (!rl.success) {
        return NextResponse.json({ success: false, message: 'لطفاً ۱ دقیقه صبر کنید و دوباره تلاش کنید.' }, { status: 429 });
      }
    } catch (e) {}

    const existingUsers = await db.select({ id: customers.id, email: customers.email }).from(customers).where(eq(customers.phone, mobile)).limit(1);
    const isExistingUser = existingUsers.length > 0;
    const needsOnboarding = isExistingUser && existingUsers[0].email.endsWith('@temp.fatemehlab.ir');

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // ذخیره در Redis (اگر در دسترس باشد)
    const redis = getRedis();
    if (redis) {
      try { await redis.set(`otp:${mobile}`, code, { ex: 120 }); } catch (e) {}
    }

    // ارسال پیامک
    if (!IS_BYPASS) {
      try {
        const result = await Promise.race([
          sendOtpCode(mobile, code),
          new Promise<any>((_, reject) => setTimeout(() => reject(new Error('SMS Timeout')), 15000))
        ]);
        
        if (!result.success) {
          console.error('[SMS ERROR]', result.error);
        }
      } catch (err: any) {
        console.error('[SMS TIMEOUT]', err.message);
      }
    } else {
      console.log(`[SMS BYPASS] Mobile: ${mobile} | Code: ${code}`);
    }

    const response = NextResponse.json({
      success: true,
      message: isExistingUser ? 'کد تایید ارسال شد.' : 'به فاطمه بیوتی لند خوش آمدید. کد تایید ارسال شد.',
      bypassCode: IS_BYPASS ? code : undefined,
      isExistingUser,
      needsOnboarding,
    });

    response.cookies.set(`otp_${mobile}`, code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 120,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('[send-otp fatal]', error);
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 });
  }
}


==========================================================================================
FILE [122/255] src\app\api\auth\verify-otp\route.ts
SIZE 3092 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createCustomerToken } from '@/lib/customer-auth';
import { Redis } from '@upstash/redis';
import { cookies } from 'next/headers';

function getRedis(): Redis | null {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) return null;
    return new Redis({ url, token });
  } catch { return null; }
}

const IS_BYPASS = process.env.SMS_BYPASS_MODE === 'true';

export async function POST(req: Request) {
  try {
    const { mobile, code } = await req.json();

    if (!mobile || !code) {
      return NextResponse.json({ message: 'اطلاعات ناقص است.' }, { status: 400 });
    }

    let isValid = false;

    if (IS_BYPASS) {
      isValid = true;
    } else {
      const redis = getRedis();
      let storedCode: string | null = null;

      if (redis) {
        try { storedCode = await redis.get(`otp:${mobile}`); } catch (e) {}
      }
      if (!storedCode) {
        const cookieStore = await cookies();
        storedCode = cookieStore.get(`otp_${mobile}`)?.value || null;
      }

      if (storedCode && storedCode === code) isValid = true;
    }

    if (!isValid) {
      return NextResponse.json({ message: 'کد تایید نامعتبر یا منقضی شده است.' }, { status: 400 });
    }

    const redis = getRedis();
    if (redis) { try { await redis.del(`otp:${mobile}`); } catch (e) {} }

    const existingUsers = await db.select().from(customers).where(eq(customers.phone, mobile));
    let customer;
    let isNewUser = false;
    let needsOnboarding = false;

    if (existingUsers.length === 0) {
      const [newCustomer] = await db.insert(customers).values({
        name: `کاربر ${mobile.slice(-4)}`,
        email: `${mobile}@temp.fatemehlab.ir`,
        phone: mobile,
        passwordHash: '',
      }).returning();
      customer = newCustomer;
      isNewUser = true;
      needsOnboarding = true;
    } else {
      existingUsers.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      customer = existingUsers[0];
      isNewUser = false;
      needsOnboarding = customer.email.endsWith('@temp.fatemehlab.ir');
    }

    const token = await createCustomerToken({
      id: customer.id,
      email: customer.email,
      name: customer.name,
    });

    const response = NextResponse.json({
      success: true,
      isNewUser,
      needsOnboarding,
      customer: { id: customer.id, name: customer.name, email: customer.email },
    });

    response.cookies.set('customer_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    response.cookies.set(`otp_${mobile}`, '', { maxAge: 0, path: '/' });
    return response;
  } catch (error) {
    return NextResponse.json({ message: 'خطای سرور' }, { status: 500 });
  }
}


==========================================================================================
FILE [123/255] src\app\api\coupons\validate\route.ts
SIZE 2025 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { coupons } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const schema = z.object({
  code: z.string().min(1),
  orderAmount: z.number().min(0),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, orderAmount } = schema.parse(body);
    const normalizedCode = code.trim().toUpperCase();
    const [coupon] = await db.select().from(coupons).where(eq(coupons.code, normalizedCode)).limit(1);

    if (!coupon) return NextResponse.json({ success: false, message: 'کد تخفیف یافت نشد' }, { status: 404 });
    if (!coupon.isActive) return NextResponse.json({ success: false, message: 'کد غیرفعال است' }, { status: 400 });

    const now = new Date();
    if (coupon.expiresAt && new Date(coupon.expiresAt) < now) return NextResponse.json({ success: false, message: 'کد منقضی شده' }, { status: 400 });
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return NextResponse.json({ success: false, message: 'ظرفیت تکمیل شده' }, { status: 400 });
    if (orderAmount < coupon.minOrderAmount) return NextResponse.json({ success: false, message: `حداقل مبلغ ${coupon.minOrderAmount.toLocaleString('fa-IR')} ریال` }, { status: 400 });

    let discount = coupon.type === 'percent'
      ? Math.round((orderAmount * coupon.value) / 100)
      : coupon.value;

    if (coupon.type === 'percent' && coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
      discount = coupon.maxDiscountAmount;
    }
    if (discount > orderAmount) discount = orderAmount;

    return NextResponse.json({ success: true, coupon: { code: coupon.code, description: coupon.description, type: coupon.type, value: coupon.value }, discount });
  } catch {
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 });
  }
}


==========================================================================================
FILE [124/255] src\app\api\cron\cleanup\route.ts
SIZE 2284 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems, products, customers, coupons } from '@/db/schema';
import { and, eq, lt, sql } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'default-secret'}`) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
    
    // فقط سفارشات pending را پاکسازی می‌کنیم
    const pendingOrders = await db
      .select()
      .from(orders)
      .where(and(eq(orders.status, 'pending'), lt(orders.createdAt, thirtyMinsAgo)));

    let cleanedCount = 0;

    for (const order of pendingOrders) {
      await db.transaction(async (tx) => {
        // ۱. برگرداندن موجودی
        const items = await tx.select().from(orderItems).where(eq(orderItems.orderId, order.id));
        for (const item of items) {
          await tx.update(products)
            .set({ stock: sql`${products.stock} + ${item.quantity}` })
            .where(eq(products.id, item.productId));
        }
        
        // ۲. برگرداندن امتیازات
        if (order.usedPoints > 0 && order.customerId) {
          await tx.update(customers)
            .set({ loyaltyPoints: sql`${customers.loyaltyPoints} + ${order.usedPoints}` })
            .where(eq(customers.id, order.customerId));
        }

        // ۳. برگرداندن کد تخفیف
        if (order.couponCode) {
          await tx.update(coupons)
            .set({ usedCount: sql`${coupons.usedCount} - 1` })
            .where(eq(coupons.code, order.couponCode));
        }
        
        // ۴. لغو سفارش
        await tx.update(orders).set({ status: 'cancelled' }).where(eq(orders.id, order.id));
      });
      cleanedCount++;
    }

    return NextResponse.json({ 
      success: true, 
      message: `تعداد ${cleanedCount} سفارش رها شده پاکسازی شد.` 
    });
  } catch (error) {
    console.error('Cron cleanup error:', error);
    return NextResponse.json({ message: 'خطای سرور' }, { status: 500 });
  }
}


==========================================================================================
FILE [125/255] src\app\api\orders\route.ts
SIZE 7058 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { orders, orderItems, products, coupons, customers } from '@/db/schema';
import { eq, inArray, and, gte, sql } from 'drizzle-orm';
import { z } from 'zod';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { rateLimit } from '@/lib/rate-limit';

const orderSchema = z.object({
  customer: z.object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100),
    phone: z.string().min(10).max(15),
    address: z.string().min(10).max(500),
    city: z.string().min(2).max(100),
    postalCode: z.string().min(10).max(10),
    notes: z.string().max(1000).optional().nullable(),
  }),
  cartItems: z.array(z.object({
    id: z.string().uuid(),
    quantity: z.number().int().min(1).max(99),
    name: z.string().optional(),
  })).min(1),
  couponCode: z.string().optional().nullable(),
  usedPoints: z.number().min(0).optional().default(0),
});

export async function POST(req: Request) {
  try {
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const rl = await rateLimit('order-submit:' + ip);
    if (!rl.success) return NextResponse.json({ message: 'تعداد درخواست‌ها زیاد است. لطفاً بعداً تلاش کنید.' }, { status: 429 });

    const currentCustomer = await getCurrentCustomer();
    if (!currentCustomer) return NextResponse.json({ message: 'برای ثبت سفارش ابتدا وارد شوید.' }, { status: 401 });

    const body = await req.json();
    const validated = orderSchema.parse(body);
    const { customer, cartItems, couponCode, usedPoints } = validated;

    const [customerData] = await db.select().from(customers).where(eq(customers.id, currentCustomer.id)).limit(1);
    if (!customerData) return NextResponse.json({ message: 'کاربر یافت نشد.' }, { status: 404 });

    if (usedPoints > customerData.loyaltyPoints) {
      return NextResponse.json({ message: 'امتیاز کافی برای استفاده ندارید.' }, { status: 400 });
    }

    const productIds = cartItems.map((item) => item.id);
    const dbProducts = await db.select().from(products).where(inArray(products.id, productIds));

    let subtotal = 0;
    const validatedItems: any[] = [];

    for (const item of cartItems) {
      const dbProduct = dbProducts.find((p) => p.id === item.id);
      if (!dbProduct || dbProduct.status !== 'published') return NextResponse.json({ message: 'محصول یافت نشد.' }, { status: 400 });
      if (dbProduct.price <= 0) return NextResponse.json({ message: `قیمت ${dbProduct.name} ثبت نشده است.` }, { status: 400 });
      if (dbProduct.stock < item.quantity) return NextResponse.json({ message: `موجودی ${dbProduct.name} کافی نیست.` }, { status: 400 });

      subtotal += dbProduct.price * item.quantity;
      validatedItems.push({
        productId: dbProduct.id,
        productName: dbProduct.name,
        price: dbProduct.price,
        quantity: item.quantity,
      });
    }

    let discountAmount = 0;
    let validCouponCode = null;

    if (couponCode) {
      const now = new Date();
      const [coupon] = await db.select().from(coupons).where(
        and(
          eq(coupons.code, couponCode.trim().toUpperCase()),
          eq(coupons.isActive, true),
          sql`(${coupons.expiresAt} IS NULL OR ${coupons.expiresAt} > ${now})`,
          sql`(${coupons.usageLimit} IS NULL OR ${coupons.usedCount} < ${coupons.usageLimit})`
        )
      ).limit(1);

      if (coupon && subtotal >= coupon.minOrderAmount) {
        const updateResult = await db.update(coupons)
          .set({ usedCount: sql`${coupons.usedCount} + 1` })
          .where(
            and(
              eq(coupons.id, coupon.id),
              sql`(${coupons.usageLimit} IS NULL OR ${coupons.usedCount} < ${coupons.usageLimit})`
            )
          )
          .returning({ id: coupons.id });

        if (updateResult.length > 0) {
          discountAmount = coupon.type === 'percent' ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
          if (coupon.type === 'percent' && coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
            discountAmount = coupon.maxDiscountAmount;
          }
          if (discountAmount > subtotal) discountAmount = subtotal;
          validCouponCode = coupon.code;
        }
      }
    }

    const pointsDiscount = usedPoints * 10000;
    const finalAmount = Math.max(0, subtotal - discountAmount - pointsDiscount);

    const orderId = crypto.randomUUID();
    const trackingCode = `FL-${orderId.slice(0, 6).toUpperCase()}`;

    const newOrder = await db.transaction(async (tx) => {
      for (const item of validatedItems) {
        const updateResult = await tx.update(products)
          .set({ stock: sql`${products.stock} - ${item.quantity}` })
          .where(and(eq(products.id, item.productId), gte(products.stock, item.quantity)))
          .returning({ id: products.id });

        if (updateResult.length === 0) {
          throw new Error(`موجودی ${item.productName} کافی نیست.`);
        }
      }

      const [order] = await tx.insert(orders).values({
        id: orderId,
        customerId: currentCustomer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        postalCode: customer.postalCode,
        notes: customer.notes || null,
        totalAmount: finalAmount,
        discountAmount: discountAmount + pointsDiscount,
        usedPoints: usedPoints,
        couponCode: validCouponCode,
        status: 'pending',
        trackingCode,
      }).returning();

      await tx.insert(orderItems).values(validatedItems.map((item) => ({ ...item, orderId: orderId })));

      if (usedPoints > 0) {
        const pointsUpdateResult = await tx.update(customers)
          .set({ loyaltyPoints: sql`${customers.loyaltyPoints} - ${usedPoints}` })
          .where(and(eq(customers.id, currentCustomer.id), gte(customers.loyaltyPoints, usedPoints)))
          .returning({ id: customers.id });

        if (pointsUpdateResult.length === 0) {
          throw new Error('موجودی امتیاز شما کافی نیست.');
        }
      }

      return order;
    });

    return NextResponse.json({ success: true, orderId: newOrder.id, trackingCode: newOrder.trackingCode });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    if (error.message && error.message.includes('موجودی')) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'خطا در ثبت سفارش' }, { status: 500 });
  }
}


==========================================================================================
FILE [126/255] src\app\api\payment\request\route.ts
SIZE 1785 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) return NextResponse.json({ success: false, message: 'سفارش یافت نشد' }, { status: 404 });

    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    if (!merchantId) return NextResponse.json({ success: false, message: 'مرچنت کد تنظیم نشده است' }, { status: 500 });

    const response = await fetch('https://payment.zarinpal.com/pg/v4/payment/request.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        merchant_id: merchantId,
        amount: order.totalAmount,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/verify?orderId=${orderId}`,
        description: `پرداخت سفارش ${order.trackingCode}`,
        metadata: { mobile: order.phone }
      }),
    });

    const data = await response.json();

    if (data.data && data.data.code === 100) {
      await db.update(orders).set({ paymentAuthority: data.data.authority }).where(eq(orders.id, orderId));
      return NextResponse.json({ success: true, redirectUrl: `https://payment.zarinpal.com/pg/StartPay/${data.data.authority}` });
    } else {
      return NextResponse.json({ success: false, message: data.errors?.message || 'خطا در ایجاد تراکنش' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطای سرور' }, { status: 500 });
  }
}


==========================================================================================
FILE [127/255] src\app\api\payment\verify\route.ts
SIZE 3671 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, customers } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const authority = searchParams.get('Authority');
    const status = searchParams.get('Status');
    const orderId = searchParams.get('orderId');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fatemehbeautyland.ir';

    if (!authority || !orderId) return NextResponse.redirect(`${baseUrl}/order/failure?reason=missing_params`);
    if (status !== 'OK') return NextResponse.redirect(`${baseUrl}/order/failure?reason=cancelled`);

    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) return NextResponse.redirect(`${baseUrl}/order/failure?reason=order_not_found`);

    // 🛡️ بررسی تطابق Authority (جلوگیری از دستکاری سفارش)
    if (order.paymentAuthority !== authority) {
      console.error(`[SECURITY] Authority mismatch for order ${orderId}`);
      return NextResponse.redirect(`${baseUrl}/order/failure?reason=security_error`);
    }

    // 🛡️ جلوگیری از تایید سفارشات لغو شده
    if (order.status === 'cancelled') {
      return NextResponse.redirect(`${baseUrl}/order/failure?reason=cancelled`);
    }

    // 🛡️ Idempotency: اگر قبلاً پرداخت شده، دوباره تایید نکن
    if (order.status === 'paid' || order.status === 'processing') {
      return NextResponse.redirect(`${baseUrl}/order/success?id=${orderId}&code=${order.trackingCode}`);
    }

    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    const response = await fetch('https://payment.zarinpal.com/pg/v4/payment/verify.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ merchant_id: merchantId, amount: order.totalAmount, authority }),
    });

    const data = await response.json();

    if (data.data && (data.data.code === 100 || data.data.code === 101)) {
      // ✅ پرداخت موفق
      await db.transaction(async (tx) => {
        // 1. تغییر وضعیت سفارش
        await tx.update(orders)
          .set({ status: 'paid', paymentRefId: data.data.ref_id.toString() })
          .where(eq(orders.id, orderId));

        // 2. 🏆 اعطای امتیاز جدید (توجه: usedPoints قبلاً در orders کم شده)
        if (order.customerId) {
          const [customer] = await tx.select().from(customers).where(eq(customers.id, order.customerId)).limit(1);
          if (customer) {
            const earnedPoints = Math.floor(order.totalAmount / 100000);
            const newPoints = customer.loyaltyPoints + earnedPoints;
            
            let newTier = 'bronze';
            if (newPoints >= 1500) newTier = 'gold';
            else if (newPoints >= 500) newTier = 'silver';

            await tx.update(customers)
              .set({ loyaltyPoints: newPoints, tier: newTier })
              .where(eq(customers.id, order.customerId));
          }
        }
      });

      return NextResponse.redirect(`${baseUrl}/order/success?id=${orderId}&code=${order.trackingCode}`);
    } else {
      console.error('[Zarinpal Verify Error]', data);
      return NextResponse.redirect(`${baseUrl}/order/failure?reason=verify_failed`);
    }
  } catch (error) {
    console.error('Payment Verify Error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/order/failure?reason=server_error`);
  }
}


==========================================================================================
FILE [128/255] src\app\api\products\route.ts
SIZE 2099 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { and, eq, gte, lte, inArray, ilike, or, desc, asc, SQL } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 12;
    const offset = (page - 1) * limit;

    const q = searchParams.get('q')?.trim() || '';
    const brands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
    const skinTypes = searchParams.get('skinTypes')?.split(',').filter(Boolean) || [];
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock') === 'true';
    const sort = searchParams.get('sort') || 'newest';

    const conditions: SQL[] = [eq(products.status, 'published')];

    if (q) {
      conditions.push(or(ilike(products.name, `%${q}%`), ilike(products.description, `%${q}%`))!);
    }
    if (brands.length > 0) {
      conditions.push(inArray(products.brand, brands));
    }
    if (skinTypes.length > 0) {
      conditions.push(inArray(products.skinType, skinTypes));
    }
    if (minPrice) {
      conditions.push(gte(products.price, parseInt(minPrice, 10)));
    }
    if (maxPrice) {
      conditions.push(lte(products.price, parseInt(maxPrice, 10)));
    }
    if (inStock) {
      conditions.push(gte(products.stock, 1));
    }

    let orderBy: any = desc(products.createdAt);
    if (sort === 'cheapest') orderBy = asc(products.price);
    if (sort === 'expensive') orderBy = desc(products.price);

    const results = await db
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ success: true, products: results });
  } catch (error) {
    console.error('API products error:', error);
    return NextResponse.json({ success: false, message: 'خطا در دریافت محصولات' }, { status: 500 });
  }
}


==========================================================================================
FILE [129/255] src\app\api\reviews\route.ts
SIZE 5837 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';
import { reviews, orders, orderItems } from '@/db/schema';
import { and, eq, desc, sql } from 'drizzle-orm';
import { z } from 'zod';
import { getCurrentCustomer } from '@/lib/customer-auth';

const reviewSchema = z.object({
  productId: z.string().uuid(),
  name: z.string().min(2, 'نام باید حداقل ۲ حرف باشد'),
  email: z.string().email().optional().or(z.literal('')),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'متن نظر باید حداقل ۱۰ حرف باشد'),
  images: z.array(z.string()).optional().default([]),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const rl = await rateLimit('review-submit:' + ip);
    if (!rl.success) return NextResponse.json({ success: false, message: 'شما اخیراً نظر ثبت کرده‌اید. لطفاً کمی صبر کنید.' }, { status: 429 });
    const body = await req.json();
    const validated = reviewSchema.parse(body);

    // ✅ بررسی خریدار تأیید شده: آیا این ایمیل/نام قبلاً این محصول رو خریداری کرده؟
    let verifiedPurchase = false;
    if (validated.email) {
      const purchased = await db
        .select({ id: orderItems.id })
        .from(orderItems)
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .where(
          and(
            eq(orderItems.productId, validated.productId),
            eq(orders.status, 'delivered')
          )
        )
        .limit(1);
      // اگر می‌خواهیم دقیق‌تر باشیم، باید ایمیل مشتری رو در جدول orders هم داشته باشیم
      // برای سادگی، فعلاً اگر شماره سفارش وجود داشته باشد، فرض می‌کنیم خریدار تایید شده است
      if (purchased.length > 0) verifiedPurchase = true;
    }

    // 🛡️ بررسی لاگین بودن کاربر: اگر لاگین باشد، نام و ایمیل از دیتابیس خوانده می‌شود
    const currentCustomer = await getCurrentCustomer();
    let finalName = validated.name;
    let finalEmail = validated.email || null;

    if (currentCustomer) {
      finalName = currentCustomer.name;
      finalEmail = currentCustomer.email;
    }

    await db.insert(reviews).values({
      productId: validated.productId,
      name: finalName,
      email: finalEmail,
      rating: validated.rating,
      comment: validated.comment,
      images: validated.images || [],
      verifiedPurchase,
      status: 'pending',
    });

    return NextResponse.json({ success: true, message: 'نظر شما ثبت شد و پس از تایید نمایش داده می‌شود.' });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: error.issues[0].message }, { status: 400 });
    }
    console.error('Review error:', error);
    return NextResponse.json({ success: false, message: 'خطا در ثبت نظر' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const sort = searchParams.get('sort') || 'newest';
    const ratingFilter = searchParams.get('rating');

    if (!productId) return NextResponse.json({ success: false, message: 'شناسه محصول الزامی است' }, { status: 400 });

    const conditions = [eq(reviews.productId, productId), eq(reviews.status, 'approved')];
    if (ratingFilter && ratingFilter !== 'all') {
      conditions.push(eq(reviews.rating, Number(ratingFilter)));
    }

    let orderBy = desc(reviews.createdAt);
    if (sort === 'helpful') orderBy = desc(reviews.helpfulCount);
    if (sort === 'highest') orderBy = desc(reviews.rating);
    if (sort === 'lowest') orderBy = sql`${reviews.rating} asc`;

    const approvedReviews = await db
      .select()
      .from(reviews)
      .where(and(...conditions))
      .orderBy(orderBy);

    // آمار توزیع امتیازها
    const allApproved = await db
      .select({ rating: reviews.rating })
      .from(reviews)
      .where(and(eq(reviews.productId, productId), eq(reviews.status, 'approved')));

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;
    allApproved.forEach(r => {
      if (r.rating >= 1 && r.rating <= 5) {
        distribution[r.rating as keyof typeof distribution]++;
        sum += r.rating;
      }
    });
    const avg = allApproved.length > 0 ? (sum / allApproved.length).toFixed(1) : null;

    return NextResponse.json({
      success: true,
      reviews: approvedReviews,
      stats: {
        total: allApproved.length,
        average: avg,
        distribution,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'خطا در دریافت نظرات' }, { status: 500 });
  }
}

// رأی مفید/غیرمفید
export async function PATCH(req: Request) {
  try {
    const { id, action } = await req.json();
    if (action === 'helpful') {
      await db.update(reviews).set({ helpfulCount: sql`${reviews.helpfulCount} + 1` }).where(eq(reviews.id, id));
    } else if (action === 'not-helpful') {
      await db.update(reviews).set({ notHelpfulCount: sql`${reviews.notHelpfulCount} + 1` }).where(eq(reviews.id, id));
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: 'خطا' }, { status: 500 });
  }
}


==========================================================================================
FILE [130/255] src\app\api\reviews\upload\route.ts
SIZE 905 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { validateImageUpload, sanitizeFilename } from '@/lib/security';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    const validation = validateImageUpload(file);
    if (!validation.valid) {
      return NextResponse.json({ message: validation.message }, { status: 400 });
    }

    const safeName = sanitizeFilename(file.name);

    const blob = await put(`review-${safeName}`, file, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error: any) {
    console.error('Review upload error:', error);
    return NextResponse.json({ message: 'خطا در آپلود' }, { status: 500 });
  }
}


==========================================================================================
FILE [131/255] src\app\api\search\route.ts
SIZE 1203 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { and, eq, ilike, or } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');

    if (!q || q.trim().length < 2) {
      return NextResponse.json({ success: true, results: [] });
    }

    const searchTerm = `%${q.trim()}%`;

    const results = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        mainImage: products.mainImage,
      })
      .from(products)
      .where(
        and(
          eq(products.status, 'published'),
          or(
            ilike(products.name, searchTerm),
            ilike(products.description, searchTerm),
            ilike(products.brand, searchTerm)
          )
        )
      )
      .limit(5); // فقط ۵ نتیجه برتر برای نمایش در منوی شیشه‌ای

    return NextResponse.json({ success: true, results });
  } catch (error) {
    return NextResponse.json({ success: false, results: [] }, { status: 500 });
  }
}


==========================================================================================
FILE [132/255] src\app\api\stock-notify\route.ts
SIZE 1807 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { stockNotifications } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';

const schema = z.object({
  productId: z.string().uuid(),
  contact: z.string().min(5, 'ایمیل یا شماره موبایل معتبر نیست'),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const rl = await rateLimit('stock-notify:' + ip);
    if (!rl.success) return NextResponse.json({ message: 'تعداد درخواست‌ها زیاد است.' }, { status: 429 });

    const body = await req.json();
    const { productId, contact } = schema.parse(body);

    // بررسی اینکه آیا کاربر قبلاً درخواست داده است؟
    const existing = await db.select().from(stockNotifications)
      .where(and(eq(stockNotifications.productId, productId), eq(stockNotifications.phoneOrEmail, contact)))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ success: true, message: 'شما قبلاً ثبت‌نام کرده‌اید. به محض موجود شدن اطلاع می‌دهیم.' });
    }

    await db.insert(stockNotifications).values({
      productId,
      phoneOrEmail: contact,
    });

    return NextResponse.json({ success: true, message: 'درخواست شما ثبت شد. به محض موجود شدن به شما اطلاع می‌دهیم.' });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ message: 'خطا در ثبت درخواست' }, { status: 500 });
  }
}


==========================================================================================
FILE [133/255] src\app\api\support\tickets\[id]\route.ts
SIZE 2994 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supportTickets, supportMessages } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { z } from 'zod';

const messageSchema = z.object({
  message: z.string().min(1).max(2000),
  attachmentUrl: z.string().optional().nullable(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const current = await getCurrentCustomer();
    if (!current) return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 });
    const { id } = await params;
    const [ticket] = await db.select().from(supportTickets).where(and(eq(supportTickets.id, id), eq(supportTickets.customerId, current.id))).limit(1);
    if (!ticket) return NextResponse.json({ message: 'یافت نشد' }, { status: 404 });
    
    const messages = await db.select().from(supportMessages).where(eq(supportMessages.ticketId, id)).orderBy(asc(supportMessages.createdAt));
    
    if (ticket.unreadByCustomer > 0) {
      await db.update(supportMessages).set({ isRead: true }).where(and(eq(supportMessages.ticketId, id), eq(supportMessages.senderType, 'admin')));
      await db.update(supportTickets).set({ unreadByCustomer: 0 }).where(eq(supportTickets.id, id));
    }
    return NextResponse.json({ success: true, ticket, messages });
  } catch { return NextResponse.json({ message: 'خطا' }, { status: 500 }); }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const current = await getCurrentCustomer();
    if (!current) return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 });
    const { id } = await params;
    const body = await req.json();
    const validated = messageSchema.parse(body);
    
    const [ticket] = await db.select().from(supportTickets).where(and(eq(supportTickets.id, id), eq(supportTickets.customerId, current.id))).limit(1);
    if (!ticket) return NextResponse.json({ message: 'یافت نشد' }, { status: 404 });
    if (ticket.status === 'closed') return NextResponse.json({ message: 'تیکت بسته شده' }, { status: 400 });
    
    const [msg] = await db.insert(supportMessages).values({
      ticketId: id,
      senderType: 'customer',
      senderName: current.name,
      message: validated.message,
      attachmentUrl: validated.attachmentUrl || null,
    }).returning();
    
    await db.update(supportTickets).set({
      status: 'open',
      unreadByAdmin: (ticket.unreadByAdmin || 0) + 1,
      lastMessageAt: new Date(),
      updatedAt: new Date(),
    }).where(eq(supportTickets.id, id));
    
    return NextResponse.json({ success: true, message: msg });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ message: 'خطا' }, { status: 500 });
  }
}


==========================================================================================
FILE [134/255] src\app\api\support\tickets\route.ts
SIZE 1983 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { supportTickets, supportMessages } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { z } from 'zod';

const createSchema = z.object({
  subject: z.string().min(5).max(200),
  category: z.enum(['order', 'product', 'payment', 'other']),
  message: z.string().min(10).max(2000),
  attachmentUrl: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const current = await getCurrentCustomer();
    if (!current) return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 });
    const tickets = await db.select().from(supportTickets).where(eq(supportTickets.customerId, current.id)).orderBy(desc(supportTickets.lastMessageAt));
    return NextResponse.json({ success: true, tickets });
  } catch { return NextResponse.json({ message: 'خطا' }, { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const current = await getCurrentCustomer();
    if (!current) return NextResponse.json({ message: 'UNAUTHORIZED' }, { status: 401 });
    const body = await req.json();
    const validated = createSchema.parse(body);
    
    const [ticket] = await db.insert(supportTickets).values({
      customerId: current.id,
      subject: validated.subject,
      category: validated.category,
      status: 'open',
      unreadByAdmin: 1,
    }).returning();
    
    await db.insert(supportMessages).values({
      ticketId: ticket.id,
      senderType: 'customer',
      senderName: current.name,
      message: validated.message,
      attachmentUrl: validated.attachmentUrl || null,
    });
    
    return NextResponse.json({ success: true, ticket });
  } catch (error: any) {
    if (error instanceof z.ZodError) return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    return NextResponse.json({ message: 'خطا' }, { status: 500 });
  }
}


==========================================================================================
FILE [135/255] src\app\api\support\upload\route.ts
SIZE 1460 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { verifyAdmin } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    let isAuthorized = false;
    try { await verifyAdmin(); isAuthorized = true; } catch { 
      const customer = await getCurrentCustomer();
      if (customer) isAuthorized = true;
    }
    if (!isAuthorized) return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ message: 'فایلی ارسال نشد' }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ message: 'حجم فایل بیش از ۵ مگابایت است' }, { status: 400 });
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return NextResponse.json({ message: 'فقط تصویر مجاز است' }, { status: 400 });

    const blob = await put(`support-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`, file, {
      access: 'public',
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ message: 'خطا در آپلود' }, { status: 500 });
  }
}


==========================================================================================
FILE [136/255] src\app\api\track\route.ts
SIZE 1894 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const rl = await rateLimit('track-order:' + ip);
    if (!rl.success) return NextResponse.json({ message: 'تعداد تلاش‌های شما برای رهگیری زیاد بوده است. لطفاً یک دقیقه دیگر تلاش کنید.' }, { status: 429 });
    const { trackingCode, phone } = await req.json();
    
    // تلاش اول: جستجو با کد دقیق
    let orderData = await db.select().from(orders).where(
      and(eq(orders.trackingCode, trackingCode), eq(orders.phone, phone))
    ).limit(1);
    
    // تلاش دوم: اگر پیدا نشد، با شماره تماس پیدا کن و از روی id بساز
    if (orderData.length === 0) {
      const allOrders = await db.select().from(orders).where(eq(orders.phone, phone));
      const matched = allOrders.find(o => {
        const derivedCode = `FL-${o.id.slice(0, 6).toUpperCase()}`;
        return derivedCode === trackingCode.toUpperCase() || o.trackingCode === trackingCode;
      });
      if (matched) orderData = [matched];
    }

    if (orderData.length === 0) {
      return NextResponse.json({ message: 'سفارشی با این مشخصات یافت نشد.' }, { status: 404 });
    }

    const order = orderData[0];
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    
    return NextResponse.json({ success: true, order, items });
  } catch (error) {
    return NextResponse.json({ message: 'خطا در سیستم رهگیری' }, { status: 500 });
  }
}


==========================================================================================
FILE [137/255] src\app\api\upload\route.ts
SIZE 1296 bytes
==========================================================================================
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { verifyAdmin } from '@/lib/auth';
import { validateImageUpload, sanitizeFilename } from '@/lib/security';

export async function POST(req: Request) {
  try {
    await verifyAdmin();

    const formData = await req.formData();
    const file = formData.get('file') as File;

    // 1. Validate file type & size (blocks SVG, HTML, etc.)
    const validation = validateImageUpload(file);
    if (!validation.valid) {
      return NextResponse.json({ message: validation.message }, { status: 400 });
    }

    // 2. Sanitize filename to prevent path traversal & dangerous extensions
    const safeName = sanitizeFilename(file.name);

    // 3. Upload to Vercel Blob with strict content type
    const blob = await put(safeName, file, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'خطا در آپلود تصویر' }, { status: 500 });
  }
}


==========================================================================================
FILE [138/255] src\app\api\vitals\route.ts
SIZE 748 bytes
==========================================================================================
import { NextResponse } from 'next/server';

// 🎯 دریافت معیارهای عملکرد از کلاینت
// در محیط پروداکشن می‌توانید این‌ها را به یک سرویس مانیتورینگ مثل Sentry یا LogRocket بفرستید
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, value, rating, delta, id } = body;

    // لاگ کردن برای دیباگ (در محیط پروداکشن به سرویس مانیتورینگ ارسال شود)
    console.log(`[Web Vital] ${name}: ${value} (${rating})`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}


==========================================================================================
FILE [139/255] src\app\cart\layout.tsx
SIZE 451 bytes
==========================================================================================
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سبد خرید | فاطمه بیوتی لند',
  description: 'محصولات انتخابی خود را در سبد خرید فاطمه بیوتی لند بررسی و سفارش خود را نهایی کنید.',
  robots: { index: false, follow: false },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}


==========================================================================================
FILE [140/255] src\app\cart\loading.tsx
SIZE 1170 bytes
==========================================================================================
export default function CartLoading() {
  return (
    <div className="min-h-screen bg-[#fafafc]">
      <div className="h-[74px] border-b border-[#e9e5eb] bg-white/80 backdrop-blur-md" />
      <div className="container-custom py-8 animate-pulse">
        <div className="w-48 h-10 bg-gray-200 rounded-lg mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-[#e9e5eb] p-4 flex gap-3">
                <div className="w-24 h-24 bg-gray-200 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="w-3/4 h-4 bg-gray-200 rounded" />
                  <div className="w-1/4 h-3 bg-gray-200 rounded" />
                  <div className="w-1/3 h-6 bg-gray-200 rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#e9e5eb] p-6 h-72" />
          </div>
        </div>
      </div>
    </div>
  );
}


==========================================================================================
FILE [141/255] src\app\cart\page.tsx
SIZE 6572 bytes
==========================================================================================
'use client';

import { useCartStore } from '@/store/cart';
import { formatToman } from '@/lib/currency';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react';
import EmptyState from '@/components/shared/EmptyState';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted) return (
    <div className="min-h-screen bg-background pt-32 flex justify-center">
      <div className="w-8 h-8 border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const totalPrice = getTotalPrice();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container-custom py-6 md:py-10 pb-24 md:pb-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-ink mb-6">سبد خرید شما</h1>

        {items.length === 0 ? (
          <div className="glass-panel p-10 md:p-16 text-center flex flex-col items-center justify-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
              <ShoppingBag className="w-9 h-9 text-muted" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-ink mb-2">سبد خرید شما خالی است</h2>
            <p className="text-muted mb-8 text-sm">هنوز محصولی به سبد خرید اضافه نکرده‌اید.</p>
            <Link href="/products" className="btn-primary w-full">
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* لیست محصولات */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="glass-panel p-4 flex gap-3 items-start">
                  <Link href={`/products/${item.slug}`} className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-oat relative">
                    {item.mainImage ? (
                      <Image src={item.mainImage} alt={item.name} fill sizes="96px" className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-sage/30" />
                      </div>
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <Link href={`/products/${item.slug}`} className="font-bold text-sm text-ink hover:text-sage line-clamp-2">
                        {item.name}
                      </Link>
                      <button onClick={() => removeItem(item.id)} className="p-1.5 -m-1.5 text-muted hover:text-rose shrink-0" aria-label="حذف محصول">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-[11px] text-muted mt-1">{formatToman(item.price)}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center bg-white border border-line rounded-lg overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-chalk text-ink" aria-label="افزایش تعداد">
                          <Plus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity.toLocaleString('fa-IR')}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-2 hover:bg-chalk text-ink disabled:opacity-30" aria-label="کاهش تعداد">
                          <Minus size={14} />
                        </button>
                      </div>
                      <span className="text-sm font-extrabold text-ink">{formatToman(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <button onClick={clearCart} className="text-xs text-muted hover:text-rose underline underline-offset-4 mt-2">
                پاک کردن سبد خرید
              </button>
            </div>

            {/* خلاصه سفارش */}
            <div className="lg:col-span-1">
              <div className="glass-panel p-5 md:p-6 sticky top-24">
                <h3 className="text-lg font-bold text-ink mb-4 border-b border-line pb-3">خلاصه سفارش</h3>
                <div className="space-y-3 text-sm mb-4">
                  <div className="flex justify-between text-muted">
                    <span>جمع کل کالاها</span>
                    <span>{formatToman(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>هزینه ارسال</span>
                    <span className="text-sage font-bold">در مرحله بعد</span>
                  </div>
                </div>
                <div className="border-t border-line pt-4 mb-5 flex justify-between items-center font-black text-lg text-ink">
                  <span>مبلغ قابل پرداخت</span>
                  <span>{formatToman(totalPrice)}</span>
                </div>
                <Link href="/checkout" className="btn-primary w-full justify-center">
                  ادامه و تسویه حساب <ArrowRight size={16} />
                </Link>
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
                  <ShieldCheck size={14} className="text-sage" /> پرداخت امن
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}


==========================================================================================
FILE [142/255] src\app\checkout\layout.tsx
SIZE 375 bytes
==========================================================================================
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تسویه‌حساب | فاطمه بیوتی لند',
  description: 'تسویه‌حساب و پرداخت امن سفارش شما.',
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}


==========================================================================================
FILE [143/255] src\app\checkout\loading.tsx
SIZE 970 bytes
==========================================================================================
export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-[#fafafc]">
      <div className="h-[74px] border-b border-[#e9e5eb] bg-white/80 backdrop-blur-md" />
      <div className="container-custom py-8 animate-pulse">
        <div className="w-56 h-10 bg-gray-200 rounded-lg mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white rounded-3xl border border-[#e9e5eb] p-8 space-y-4">
            <div className="w-40 h-6 bg-gray-200 rounded mb-6" />
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="space-y-2">
                <div className="w-24 h-3 bg-gray-200 rounded" />
                <div className="w-full h-12 bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
          <div className="lg:col-span-2 bg-white rounded-3xl border border-[#e9e5eb] p-6 h-96" />
        </div>
      </div>
    </div>
  );
}


==========================================================================================
FILE [144/255] src\app\checkout\page.tsx
SIZE 24116 bytes
==========================================================================================
'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cart';
import { formatToman } from '@/lib/currency';
import { ShieldCheck, MapPin, User, Phone, Loader2, ArrowRight, Home, Check, Plus, TicketPercent, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; description: string } | null>(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', address: '', city: '', postalCode: '', notes: '',
  });

  useEffect(() => { 
    setIsMounted(true); 
    // 🛡️ پاکسازی state در صورت بازگشت به صفحه
    setAppliedCoupon(null);
    setCouponCode('');
    setUsePoints(false);
    setPointsToUse(0);
  }, []);
  // 🛡️ اعتبارسنجی مجدد کد تخفیف وقتی سبد خرید تغییر می‌کند
  useEffect(() => {
    if (!appliedCoupon) return;
    
    const revalidate = async () => {
      try {
        const res = await fetch('/api/coupons/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: appliedCoupon.code, orderAmount: getTotalPrice() }),
        });
        const data = await res.json();
        
        if (!res.ok || !data.success) {
          setAppliedCoupon(null);
          setCouponCode('');
          setCouponError(data.message || 'کد تخفیف به دلیل تغییر سبد خرید حذف شد');
          toast.error('کد تخفیف به دلیل تغییر مبلغ سبد خرید حذف شد');
        } else {
          setAppliedCoupon({ code: data.coupon.code, discount: data.discount, description: data.coupon.description || '' });
        }
      } catch {
        // خطای شبکه را نادیده می‌گیریم
      }
    };

    revalidate();
  }, [getTotalPrice(), appliedCoupon?.code]); // فقط وقتی مبلغ یا کد تغییر کند

    useEffect(() => {
    fetch('/api/account/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.success) {
          router.replace('/account/login?redirect=/checkout');
        } else {
          setCheckingAuth(false);
          
          // ✅ پر کردن خودکار فرم با اطلاعات ثبت‌نام کاربر
          if (data.customer) {
            const nameParts = (data.customer.name || '').trim().split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(' ') || '';
            
            setFormData(prev => ({
              ...prev,
              firstName: prev.firstName || firstName,
              lastName: prev.lastName || lastName,
              phone: prev.phone || data.customer.phone || '',
            }));
          }
        }
      })
      .catch(() => {
        router.replace('/account/login?redirect=/checkout');
      });
  }, [router]);

  // دریافت آدرس‌های ذخیره‌شده
  useEffect(() => {
    fetch('/api/account/addresses')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.success && data.addresses.length > 0) {
          setSavedAddresses(data.addresses);
          const defaultAddr = data.addresses.find((a: any) => a.isDefault) || data.addresses[0];
          setSelectedAddressId(defaultAddr.id);
          setUseNewAddress(false);
        }
      })
      .catch(() => {});
  }, []);

  // پر کردن فرم با آدرس انتخاب‌شده
  useEffect(() => {
    if (!useNewAddress && selectedAddressId) {
      const addr = savedAddresses.find(a => a.id === selectedAddressId);
      if (addr) {
        setFormData({
          firstName: addr.firstName,
          lastName: addr.lastName,
          phone: addr.phone,
          address: addr.address,
          city: addr.city,
          postalCode: addr.postalCode,
          notes: '',
        });
      }
    }
  }, [selectedAddressId, useNewAddress, savedAddresses]);

  useEffect(() => {
    if (isMounted && items.length === 0 && !isSubmitting) {
      router.replace('/cart');
    }
  }, [isMounted, items.length, router, isSubmitting]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), orderAmount: getTotalPrice() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAppliedCoupon({ code: data.coupon.code, discount: data.discount, description: data.coupon.description || '' });
        toast.success(`کد تخفیف اعمال شد: ${data.discount.toLocaleString('fa-IR')} ریال تخفیف`);
      } else {
        setCouponError(data.message || 'کد نامعتبر است');
        setAppliedCoupon(null);
      }
    } catch {
      setCouponError('خطا در ارتباط با سرور');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null); setCouponCode(''); setCouponError('');
    toast.info('کد تخفیف حذف شد');
  };
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setLoading(true);
    setIsSubmitting(true);
    const toastId = toast.loading('در حال ثبت سفارش و اتصال به درگاه...');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: formData, cartItems: items, couponCode: appliedCoupon?.code || null, usedPoints: usePoints ? pointsToUse : 0 }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'خطا در ثبت سفارش');

      const payRes = await fetch('/api/payment/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: data.orderId }),
      });
      const payData = await payRes.json();

      if (!payRes.ok) throw new Error(payData.message || 'خطا در اتصال به درگاه');

      toast.success('در حال انتقال به درگاه پرداخت...', { id: toastId });
      clearCart();
        localStorage.removeItem('checkout-draft');
      window.location.href = payData.redirectUrl;

    } catch (err: any) {
      toast.error(err.message || 'خطا در ارتباط با سرور', { id: toastId });
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  if (!isMounted || checkingAuth) return null;
  if (items.length === 0 && !isSubmitting) return null;

  return (
    <div className="min-h-screen bg-[#fafafc] flex flex-col">
      <Header />
      <main className="flex-1 container-custom py-6 md:py-10 pb-32 md:pb-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-black text-[#28242b]">تسویه‌حساب</h1>
          <Link href="/cart" className="flex items-center gap-1 text-sm font-medium text-[#77717b] hover:text-[#c61d70] transition-colors">
            <ArrowRight size={16} /> بازگشت به سبد
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10">
          <div className="lg:col-span-3">
            <form id="checkout-form" onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#e9e5eb] p-5 md:p-8 space-y-6">
              
              {/* انتخاب آدرس ذخیره‌شده */}
              {savedAddresses.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#e9e5eb] pb-4">
                    <h2 className="text-lg font-black text-[#28242b] flex items-center gap-2">
                      <MapPin size={20} className="text-[#c61d70]" /> آدرس ارسال
                    </h2>
                  </div>
                  
                  <div className="grid gap-2">
                    {savedAddresses.map(addr => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => { setUseNewAddress(false); setSelectedAddressId(addr.id); }}
                        className={`text-right p-4 rounded-xl border-2 transition-all ${!useNewAddress && selectedAddressId === addr.id ? 'border-[#c61d70] bg-[#fff0f7]' : 'border-[#e9e5eb] bg-white hover:border-[#c61d70]/40'}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-[#28242b]">{addr.title}</span>
                          {!useNewAddress && selectedAddressId === addr.id && <Check size={16} className="text-[#c61d70]" />}
                        </div>
                        <p className="text-xs text-[#77717b] line-clamp-1">{addr.firstName} {addr.lastName} - {addr.province}، {addr.city}</p>
                        <p className="text-[10px] text-[#918a95] line-clamp-1 mt-1">{addr.address}</p>
                      </button>
                    ))}
                    
                    <button
                      type="button"
                      onClick={() => setUseNewAddress(true)}
                      className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed transition-all ${useNewAddress ? 'border-[#c61d70] bg-[#fff0f7] text-[#c61d70]' : 'border-[#e9e5eb] text-[#77717b] hover:border-[#c61d70]/40'}`}
                    >
                      <Plus size={16} /> ارسال به آدرس جدید
                    </button>
                  </div>
                </div>
              )}

              {/* فرم آدرس (وقتی آدرس جدید انتخاب شد) */}
              {useNewAddress && (
                <div className="space-y-4 pt-4 border-t border-[#e9e5eb]">
                  {savedAddresses.length > 0 && <h3 className="font-black text-sm text-[#28242b]">اطلاعات آدرس جدید</h3>}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#28242b]">نام *</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-base" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#28242b]">نام خانوادگی *</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-base" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#28242b]">شماره تماس *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required dir="ltr" className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-base text-left" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-[#28242b]">کد پستی *</label>
                      <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required dir="ltr" className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-base text-left" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#28242b]">شهر *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-base" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[#28242b]">آدرس کامل پستی *</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} required rows={3} className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-base resize-none"></textarea>
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-4 border-t border-[#e9e5eb]">
                <label className="text-sm font-bold text-[#28242b]">توضیحات سفارش (اختیاری)</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="w-full px-4 py-3 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl focus:bg-white focus:border-[#c61d70] focus:ring-2 focus:ring-[#c61d70]/20 outline-none text-base resize-none"></textarea>
              </div>
            </form>
          </div>

          {/* خلاصه سفارش */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-[#e9e5eb] p-5 md:p-6 sticky top-24">
              <h3 className="text-lg font-black text-[#28242b] mb-4 pb-4 border-b border-[#e9e5eb]">خلاصه سفارش</h3>

              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 flex items-center justify-center bg-[#f8f7fa] border border-[#e9e5eb] rounded-lg text-xs font-bold">{item.quantity.toLocaleString('fa-IR')}×</span>
                      <span className="text-[#77717b] font-medium truncate max-w-[150px]">{item.name}</span>
                    </div>
                    <span className="font-bold text-[#28242b] whitespace-nowrap">{formatToman(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#e9e5eb] pt-4 space-y-3 text-sm">
                <div className="flex justify-between text-[#77717b]">
                  <span>جمع کل کالاها</span>
                  <span>{formatToman(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-[#77717b]">
                  <span>هزینه ارسال</span>
                  <span className="text-[#c61d70] font-bold">در مرحله بعد</span>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="border-t border-[#e9e5eb] mt-4 pt-4 space-y-3">
                {appliedCoupon ? (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-emerald-700">کد اعمال شده:</span>
                        <span className="font-mono font-black text-sm text-emerald-700">{appliedCoupon.code}</span>
                      </div>
                      <p className="text-xs font-bold text-emerald-700">تخفیف: {appliedCoupon.discount.toLocaleString('fa-IR')} ریال</p>
                    </div>
                    <button onClick={removeCoupon} className="text-rose-500 text-xs font-bold hover:underline">حذف</button>
                  </div>
                ) : (
                  <div>
                    <label className="text-xs font-bold text-[#28242b] mb-2 block">کد تخفیف دارید؟</label>
                    <div className="flex gap-2">
                      <input type="text" value={couponCode} onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }} placeholder="کد تخفیف" className="flex-1 px-4 py-2.5 bg-[#f8f7fa] border border-[#e9e5eb] rounded-xl text-sm font-mono outline-none focus:border-[#c61d70]" dir="ltr" />
                      <button type="button" onClick={applyCoupon} disabled={applyingCoupon || !couponCode.trim()} className="px-4 py-2.5 bg-[#28242b] text-white text-xs font-bold rounded-xl disabled:opacity-40 shrink-0">
                        {applyingCoupon ? '...' : 'اعمال'}
                      </button>
                    </div>
                    {couponError && <p className="text-[10px] text-rose-500 mt-1.5">{couponError}</p>}
                  </div>
                )}
              </div>

                            {/* بخش استفاده از امتیاز */}
              {loyaltyPoints > 0 && (
                <div className="border-t border-[#e9e5eb] mt-4 pt-4 space-y-3">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={usePoints}
                        onChange={(e) => {
                          setUsePoints(e.target.checked);
                          setPointsToUse(e.target.checked ? Math.min(loyaltyPoints, Math.floor(getTotalPrice() / 1000)) : 0);
                        }}
                        className="w-4 h-4 accent-[#c61d70]"
                      />
                      <span className="text-xs font-bold text-[#28242b] group-hover:text-[#c61d70] transition-colors">استفاده از امتیازات باشگاه مشتریان</span>
                    </div>
                    <span className="text-[10px] font-black text-[#c61d70] bg-[#fff0f7] px-2 py-1 rounded-md">{loyaltyPoints.toLocaleString('fa-IR')} امتیاز</span>
                  </label>

                  {usePoints && (
                    <div className="bg-[#fff0f7] rounded-xl p-3 border border-[#f2d7e5] animate-in slide-in-from-top-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#28242b]">تعداد امتیاز برای استفاده:</span>
                        <span className="text-xs font-black text-[#c61d70]">{pointsToUse.toLocaleString('fa-IR')} امتیاز</span>
                      </div>
                      <input 
                        type="range" 
                        min={0} 
                        max={Math.min(loyaltyPoints, Math.floor(getTotalPrice() / 1000))}
                        value={pointsToUse}
                        onChange={(e) => setPointsToUse(parseInt(e.target.value))}
                        className="w-full accent-[#c61d70]"
                      />
                      <p className="text-[10px] text-[#77717b] mt-2">تخفیف اعمال شده: {((pointsToUse * 1000)).toLocaleString('fa-IR')} تومان</p>
                    </div>
                  )}
                </div>
              )}
              {appliedCoupon && (
                <div className="border-t border-[#e9e5eb] mt-3 pt-3 flex justify-between text-sm">
                  <span className="text-[#77717b]">جمع با تخفیف</span>
                  <span className="font-bold text-emerald-600">{formatToman(getTotalPrice() - appliedCoupon.discount)}</span>
                </div>
              )}

              <div className="border-t border-[#e9e5eb] mt-4 pt-4 flex justify-between items-center mb-6">
                <span className="font-bold text-[#28242b]">مبلغ قابل پرداخت</span>
                <span className="font-black text-xl text-[#c61d70]">
                  {formatToman(appliedCoupon ? getTotalPrice() - appliedCoupon.discount : getTotalPrice())}
                </span>
              </div>

              <button type="submit" form="checkout-form" disabled={loading} className="w-full min-h-[52px] bg-[#c61d70] text-white text-base font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#a9155d] transition-colors disabled:opacity-50 shadow-lg shadow-[#c61d70]/30">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                {loading ? 'در حال ثبت...' : 'ثبت نهایی سفارش'}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#77717b]">
                <ShieldCheck className="w-4 h-4 text-[#c61d70]" /> پرداخت امن و مطمئن
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#e9e5eb] p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] text-[#77717b] mb-0.5">مبلغ قابل پرداخت</p>
            <p className="text-base font-black text-[#28242b]">{formatToman(getTotalPrice())}</p>
          </div>
          <button type="submit" form="checkout-form" disabled={loading} className="flex-1 max-w-[200px] min-h-[48px] bg-[#c61d70] text-white text-sm font-bold rounded-xl disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'ثبت نهایی'}
          </button>
        </div>
      </div>
      
      <div className="hidden md:block"><Footer /></div>
    </div>
  );
}


==========================================================================================
FILE [145/255] src\app\contact\page.tsx
SIZE 4676 bytes
==========================================================================================
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { ArrowLeft, Mail, MapPin, Phone, Clock } from 'lucide-react';
import { InstagramIcon } from '@/components/icons/SocialIcons';

export const metadata: Metadata = {
  title: 'تماس با فاطمه بیوتی لند',
  description: 'راه‌های ارتباطی فروشگاه فاطمه بیوتی لند.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Header />
      <main className="flex-1">
        <section className="fl-page-intro">
          <div className="container-custom">
            <span className="fl-eyebrow"><span className="fl-eyebrow-dot" />تماس با ما</span>
            <h1 className="fl-page-title">ارتباط با فاطمه بیوتی لند</h1>
            <p className="fl-page-description">از راه‌های زیر می‌توانید با ما در ارتباط باشید. در اولین فرصت پاسخگو هستیم.</p>
          </div>
        </section>

        <section className="container-custom max-w-4xl py-10 md:py-14">
          <div className="grid gap-3 sm:grid-cols-2">
            <a href="tel:09905316327" className="rounded-2xl border border-[#eee9ef] bg-white p-5 transition hover:border-[#e6b3ce]">
              <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-[#fff0f7] text-[#c61d70]"><Phone size={18} /></span>
              <span className="block text-[11px] text-[#908894]">شماره تماس</span>
              <span className="mt-1 block text-[14px] font-bold text-[#302a33]" dir="ltr">۰۹۹۰۵۳۱۶۳۲۷</span>
            </a>

            <a href="mailto:mirzaeico255@gmail.com" className="rounded-2xl border border-[#eee9ef] bg-white p-5 transition hover:border-[#e6b3ce]">
              <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-[#fff0f7] text-[#c61d70]"><Mail size={18} /></span>
              <span className="block text-[11px] text-[#908894]">ایمیل</span>
              <span className="mt-1 block break-all text-[14px] font-bold text-[#302a33]" dir="ltr">mirzaeico255@gmail.com</span>
            </a>

            <a
              href="https://instagram.com/fatemehlab.ir"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-[#eee9ef] bg-white p-5 transition hover:border-[#e6b3ce]"
            >
              <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-[#fff0f7] text-[#c61d70] transition-transform duration-300 group-hover:scale-110">
                <InstagramIcon size={18} />
              </span>
              <span className="block text-[11px] text-[#908894]">اینستاگرام</span>
              <span className="mt-1 block text-[14px] font-bold text-[#302a33]" dir="ltr">@fatemehlab.ir</span>
            </a>

            <div className="rounded-2xl border border-[#eee9ef] bg-white p-5">
              <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-[#fff0f7] text-[#c61d70]"><MapPin size={18} /></span>
              <span className="block text-[11px] text-[#908894]">موقعیت</span>
              <span className="mt-1 block text-[14px] font-bold text-[#302a33]">تهران</span>
            </div>

            <div className="rounded-2xl border border-[#eee9ef] bg-white p-5 sm:col-span-2">
              <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-[#fff0f7] text-[#c61d70]"><Clock size={18} /></span>
              <span className="block text-[11px] text-[#908894]">ساعات پاسخگویی</span>
              <span className="mt-1 block text-[14px] font-bold text-[#302a33]">در اولین فرصت پاسخگو هستیم</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#f0dce8] bg-[#fff8fc] p-5">
            <div>
              <h2 className="text-[13px] font-extrabold text-[#302a33]">برای پیگیری سفارش</h2>
              <p className="mt-1 text-[11px] text-[#77717b]">کد رهگیری و شماره تماس سفارش را آماده داشته باشید.</p>
            </div>
            <Link href="/track" className="btn-primary">رهگیری سفارش <ArrowLeft size={15} /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


==========================================================================================
FILE [146/255] src\app\error.tsx
SIZE 1872 bytes
==========================================================================================
'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';
import { unstable_rethrow } from 'next/navigation';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  unstable_rethrow(error);

  useEffect(() => {
    console.error('[Global Error]', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafc] px-4">
      <div className="max-w-md w-full bg-white rounded-[2rem] border border-[#e9e5eb] p-8 text-center shadow-xl animate-in slide-in-from-bottom-8 duration-500">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-rose-500" />
        </div>
        <h2 className="text-2xl font-black text-[#28242b] mb-3">مشکلی پیش آمد!</h2>
        <p className="text-sm text-[#77717b] leading-loose mb-8">
          متأسفانه در بارگذاری این بخش خطایی رخ داد. تیم فنی ما مطلع شدند. لطفاً دوباره تلاش کنید.
        </p>
        <div className="flex flex-col gap-3">
          <button onClick={() => reset()} className="w-full py-3.5 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#c61d70]/20 hover:bg-[#a9155d] transition-all flex items-center justify-center gap-2">
            <RotateCcw size={18} /> تلاش مجدد
          </button>
          <Link href="/" className="w-full py-3.5 bg-white border border-[#e9e5eb] text-[#28242b] text-sm font-bold rounded-xl hover:bg-[#f8f7fa] transition-all flex items-center justify-center gap-2">
            <Home size={18} /> بازگشت به خانه
          </Link>
        </div>
      </div>
    </div>
  );
}


==========================================================================================
FILE [147/255] src\app\faq\page.tsx
SIZE 5178 bytes
==========================================================================================
import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'راهنمای خرید و سؤالات متداول',
  description: 'راهنمای استفاده از فروشگاه فاطمه بیوتی لند، مشاهده اطلاعات محصولات و پیگیری سفارش.',
};

const FAQ_GROUPS = [
  {
    title: 'محصولات و اطلاعات',
    items: [
      { question: 'از کجا مشخصات کامل محصول را ببینم؟', answer: 'روی محصول موردنظر بزنید تا وارد صفحه اختصاصی آن شوید. اطلاعاتی مانند توضیحات، تصاویر، مشخصات، ترکیبات و روش استفاده در صورت ثبت‌شدن در همان صفحه نمایش داده می‌شوند.' },
      { question: 'چرا قیمت بعضی محصولات نمایش داده نمی‌شود؟', answer: 'تا زمانی که قیمت محصول در فروشگاه ثبت نشده باشد، به‌جای نمایش مبلغ حدسی، وضعیت «قیمت ثبت نشده» نشان داده می‌شود و امکان افزودن آن به سبد خرید فعال نیست.' },
      { question: 'وضعیت موجودی محصول را چطور بررسی کنم؟', answer: 'وضعیت موجودی در صفحه محصول و کنار اطلاعات قیمت نمایش داده می‌شود. وضعیت نهایی هنگام ثبت سفارش نیز در سمت فروشگاه بررسی می‌شود.' },
    ],
  },
  {
    title: 'ثبت و پیگیری سفارش',
    items: [
      { question: 'چطور سفارش ثبت کنم؟', answer: 'محصولی را که قیمت ثبت‌شده و موجودی دارد انتخاب کنید، آن را به سبد خرید اضافه کنید و اطلاعات لازم را در مرحله تسویه‌حساب وارد کنید.' },
      { question: 'چطور سفارش ثبت‌شده را پیگیری کنم؟', answer: 'به صفحه «رهگیری سفارش» بروید و کد رهگیری و شماره تماس ثبت‌شده برای سفارش را وارد کنید.' },
      { question: 'اگر درباره یک محصول سؤال داشته باشم چه کار کنم؟', answer: 'از بخش تماس با ما، اطلاعات ارتباطی ثبت‌شده فروشگاه را بررسی کنید. اگر راه ارتباطی هنوز در فروشگاه درج نشده باشد، باید پیش از خرید از مالک فروشگاه دریافت شود.' },
    ],
  },
];

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_GROUPS.flatMap(group => group.items.map(item => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer }
  })))
};

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <Header />
      <main className="flex-1">
        <section className="fl-page-intro">
          <div className="container-custom">
            <span className="fl-eyebrow"><span className="fl-eyebrow-dot" />HELP CENTER</span>
            <h1 className="fl-page-title">راهنمای خرید</h1>
            <p className="fl-page-description">پاسخ پرسش‌های مربوط به بررسی محصولات، ثبت سفارش و پیگیری خرید.</p>
          </div>
        </section>

        <section className="container-custom max-w-4xl py-9 md:py-12">
          <div className="grid gap-9">
            {FAQ_GROUPS.map((group) => (
              <section key={group.title}>
                <h2 className="mb-4 border-b border-[#eee9ef] pb-3 text-[14px] font-extrabold text-[#302a33]">{group.title}</h2>
                <div className="fl-faq-list">
                  {group.items.map((item) => (
                    <details className="fl-faq-item" key={item.question}>
                      <summary>{item.question}</summary>
                      <div className="fl-faq-answer">{item.answer}</div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#f0dce8] bg-[#fff8fc] p-5">
            <div><h2 className="text-[13px] font-extrabold text-[#302a33]">سفارش ثبت‌شده‌ای دارید؟</h2><p className="mt-1 text-[11px] text-[#77717b]">برای مشاهده آخرین وضعیت، صفحه رهگیری را باز کنید.</p></div>
            <Link href="/track" className="btn-primary">رهگیری سفارش <ArrowLeft size={15} /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}


==========================================================================================
FILE [148/255] src\app\journal\[slug]\page.tsx
SIZE 8740 bytes
==========================================================================================
import { formatPersianDate, formatPersianDateTime } from '@/lib/format';
import { db } from '@/lib/db';
import { articles } from '@/db/schema';
import { eq, ne, and, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Calendar, User, BookOpen } from 'lucide-react';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import ReadingProgress from './reading-progress';


const categoryLabels: Record<string, string> = {
  education: 'آموزش',
  'buying-guide': 'راهنمای خرید',
  skincare: 'مراقبت پوست',
  haircare: 'مراقبت مو',
  makeup: 'آرایشی',
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [article] = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  
  if (!article) return { title: 'مقاله یافت نشد' };
  
  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
  };
}

export const instant = false;

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const [article] = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.status, 'published')))
    .limit(1);

  if (!article) notFound();

  const related = await db
    .select()
    .from(articles)
    .where(and(eq(articles.category, article.category), eq(articles.status, 'published'), ne(articles.id, article.id)))
    .orderBy(desc(articles.createdAt))
    .limit(3);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fatemehbeautyland.ir';
    const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "خانه", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "مجله", item: `${baseUrl}/journal` },
      { "@type": "ListItem", position: 3, name: article.title, item: `${baseUrl}/journal/${article.slug}` },
    ],
  };

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    image: article.coverImage ? [article.coverImage] : [`${baseUrl}/logo.png`],
    datePublished: new Date(article.createdAt).toISOString(),
    dateModified: new Date(article.updatedAt).toISOString(),
    author: { "@type": "Person", name: article.author || "تیم فاطمه بیوتی لند" },
    publisher: {
      "@type": "Organization",
      name: "فاطمه بیوتی لند",
      logo: { "@type": "ImageObject", url: `${baseUrl}/logo.png` },
    },
    description: article.excerpt,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${baseUrl}/journal/${article.slug}` },
  };

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <Header />
      
      <main className="flex-1 w-full max-w-[100vw]">
        {/* هدر مقاله */}
        <section className="pt-10 md:pt-16 pb-8 md:pb-12 px-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#fff0f7] to-white">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/journal" className="inline-flex items-center gap-2 text-[10px] md:text-xs font-black text-[#c61d70] bg-white shadow-sm border border-[#f2d7e5] px-4 py-1.5 md:px-5 md:py-2 rounded-full mb-6 md:mb-8 hover:bg-[#fff0f7] transition-colors">
              <ArrowRight size={14} className="md:w-4 md:h-4" /> بازگشت به مجله
            </Link>
            
            <div className="flex items-center justify-center gap-3 text-[10px] md:text-xs mb-4 md:mb-8">
              <span className="text-[#c61d70] font-black bg-white shadow-sm border border-[#f2d7e5] px-3 py-1 md:px-4 md:py-1.5 rounded-lg">{categoryLabels[article.category] || article.category}</span>
            </div>

            <h1 className="text-2xl md:text-5xl lg:text-6xl font-black text-[#28242b] leading-[1.5] md:leading-[1.4] mb-4 md:mb-8 tracking-tight px-2">
              {article.title}
            </h1>

            <p className="text-[#77717b] text-xs md:text-lg leading-loose mb-6 md:mb-10 max-w-2xl mx-auto px-4">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-8 text-[10px] md:text-sm font-bold text-[#918a95] bg-white shadow-sm border border-[#f2d7e5] w-fit mx-auto px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl">
              <span className="flex items-center gap-1.5 md:gap-2"><User size={14} className="text-[#c61d70] md:w-[18px] md:h-[18px]" /> {article.author}</span>
              <span className="hidden md:block w-px h-6 bg-[#e9e5eb]" />
              <span className="flex items-center gap-1.5 md:gap-2"><Calendar size={14} className="text-[#c61d70] md:w-[18px] md:h-[18px]" /> {formatPersianDate(article.createdAt)}</span>
              <span className="hidden md:block w-px h-6 bg-[#e9e5eb]" />
              <span className="flex items-center gap-1.5 md:gap-2"><Clock size={14} className="text-[#c61d70] md:w-[18px] md:h-[18px]" /> {article.readTime}</span>
            </div>
          </div>
        </section>

        {/* تصویر کاور */}
        {article.coverImage && (
          <section className="px-3 md:px-4 -mt-4 md:-mt-8 relative z-10 mb-8 md:mb-16">
            <div className="max-w-5xl mx-auto relative aspect-video md:aspect-[21/9] rounded-xl md:rounded-[2rem] overflow-hidden shadow-xl md:shadow-2xl shadow-[#c61d70]/20 border-2 md:border-4 border-white">
              <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority />
            </div>
          </section>
        )}

        {/* محتوای مقاله */}
        <section className="px-4 md:px-6 pb-16 md:pb-24">
          <article 
            className="journal-article-body max-w-3xl mx-auto text-sm md:text-base"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </section>

        {/* مقالات مرتبط */}
        {related.length > 0 && (
          <section className="bg-[#fafafc] py-12 md:py-20 border-t border-[#e9e5eb]">
            <div className="container-custom px-4 md:px-6">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl md:text-3xl font-black text-[#28242b] mb-2 md:mb-3">مقالات مرتبط</h2>
                <p className="text-[#77717b] text-xs md:text-sm">شاید این مطالب هم برایتان جالب باشد</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {related.map(rel => (
                  <Link key={rel.id} href={`/journal/${rel.slug}`} className="group bg-white rounded-2xl md:rounded-3xl border border-[#e9e5eb] overflow-hidden hover:shadow-2xl hover:shadow-[#c61d70]/10 hover:-translate-y-1 transition-all duration-300">
                    <div className="relative aspect-[16/10] md:aspect-[4/3] bg-[#fce5f0]">
                      {rel.coverImage ? (
                        <Image src={rel.coverImage} alt={rel.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#c61d70]/20"><BookOpen size={32} className="md:w-10 md:h-10" /></div>
                      )}
                    </div>
                    <div className="p-4 md:p-6">
                      <h3 className="font-black text-sm md:text-base text-[#28242b] group-hover:text-[#c61d70] transition-colors line-clamp-2 leading-relaxed">{rel.title}</h3>
                      <div className="mt-3 md:mt-4 flex items-center gap-2 text-[10px] md:text-xs font-bold text-[#c61d70]">
                        خواندن <ArrowRight size={12} className="md:w-3.5 md:h-3.5 group-hover:-translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}


==========================================================================================
FILE [149/255] src\app\journal\[slug]\reading-progress.tsx
SIZE 907 bytes
==========================================================================================
'use client';
import { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(scrolled);
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-transparent">
      <div 
        className="h-full bg-gradient-to-r from-[#c61d70] to-[#e84e9e] transition-[width] duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}


==========================================================================================
FILE [150/255] src\app\journal\loading.tsx
SIZE 1324 bytes
==========================================================================================
export default function JournalLoading() {
  return (
    <div className="min-h-screen bg-[#fafafc]">
      <div className="h-[74px] border-b border-[#e9e5eb] bg-white/80 backdrop-blur-md" />
      <div className="container-custom py-8 md:py-12 animate-pulse">
        <div className="text-center mb-12">
          <div className="w-48 h-5 bg-gray-200 rounded-full mx-auto mb-4" />
          <div className="w-80 h-10 bg-gray-200 rounded-lg mx-auto mb-3" />
          <div className="w-96 h-4 bg-gray-200 rounded mx-auto" />
        </div>
        <div className="flex gap-2 overflow-x-auto mb-10 justify-center">
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-24 h-10 bg-gray-200 rounded-full shrink-0" />)}
        </div>
        <div className="w-full h-96 bg-white border border-[#e9e5eb] rounded-3xl mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="space-y-3">
              <div className="aspect-[4/3] bg-gray-200 rounded-2xl" />
              <div className="w-20 h-4 bg-gray-200 rounded" />
              <div className="w-full h-5 bg-gray-200 rounded" />
              <div className="w-3/4 h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


==========================================================================================
FILE [151/255] src\app\journal\page.tsx
SIZE 11860 bytes
==========================================================================================
import { formatPersianDate, formatPersianDateTime } from '@/lib/format';
import { db } from '@/lib/db';
import { articles } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpLeft, BookOpen, Clock, Sparkles, Filter } from 'lucide-react';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';


export const metadata = {
  title: 'مجله فاطمه بیوتی لند | آموزش آرایش، مراقبت پوست و مو',
  description: 'جدیدترین مقالات آموزشی، راهنمای خرید محصولات آرایشی، مراقبت از پوست و مو را در مجله فاطمه بیوتی لند بخوانید.',
  keywords: ['مجله زیبایی', 'آموزش آرایش', 'مراقبت پوست', 'مراقبت مو', 'راهنمای خرید لوازم آرایشی'],
  alternates: { canonical: '/journal' },
  openGraph: {
    title: 'مجله فاطمه بیوتی لند',
    description: 'آموزش آرایش، مراقبت پوست و مو',
    type: 'website',
    locale: 'fa_IR',
  },
};

const categoryLabels: Record<string, string> = {
  education: 'آموزش',
  'buying-guide': 'راهنمای خرید',
  skincare: 'مراقبت پوست',
  haircare: 'مراقبت مو',
  makeup: 'آرایشی',
};

export const instant = false;

export default async function JournalPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ category?: string }> 
}) {
  const { category } = await searchParams;
  const activeCategory = category && categoryLabels[category] ? category : null;

  // ساخت کوئری
  const conditions = [eq(articles.status, 'published')];
  if (activeCategory) {
    conditions.push(eq(articles.category, activeCategory));
  }
  const whereClause = and(...conditions)!;

  const allArticles = await db
    .select()
    .from(articles)
    .where(whereClause)
    .orderBy(desc(articles.createdAt));

  const featured = !activeCategory ? (allArticles.find(a => a.featured) || allArticles[0]) : null;
  const rest = featured ? allArticles.filter(a => a.id !== featured.id) : allArticles;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fatemehbeautyland.ir';
  const jsonLdJournal = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "مجله فاطمه بیوتی لند",
    description: "مقالات آموزشی و راهنمای خرید",
    url: `${baseUrl}/journal`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: allArticles.map((a, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${baseUrl}/journal/${a.slug}`,
        name: a.title,
      })),
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafc]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdJournal) }} />
      <Header />
      
      {/* pb-32 برای جلوگیری از تداخل با نوار پایین (BottomNav) */}
      <main className="flex-1 pb-32 md:pb-12 overflow-x-hidden">
        
        {/* هدر مجله */}
        <section className="relative pt-16 pb-12 md:pt-24 md:pb-16 overflow-hidden bg-gradient-to-b from-[#fff0f7] to-[#fafafc] px-4">
          <div className="container-custom relative z-10 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 rounded-full bg-white/80 backdrop-blur-md border border-[#f2d7e5] text-[#c61d70] text-[10px] md:text-xs font-bold shadow-sm mb-4 md:mb-6">
              <Sparkles size={14} /> مجله اختصاصی فاطمه بیوتی لند
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#28242b] mb-4 md:mb-6 tracking-tight leading-tight">
              دنیای زیبایی<br className="md:hidden"/>
              <span className="text-[#c61d70]"> و مراقبت</span>
            </h1>
            <p className="text-[#77717b] text-xs md:text-base lg:text-lg max-w-xl mx-auto leading-relaxed px-2">
              جدیدترین مقالات، آموزش‌ها و راهنمای خرید محصولات آرایشی و بهداشتی را از زبان متخصصان بخوانید.
            </p>
          </div>
        </section>

        <section className="container-custom py-8 md:py-12 px-4 md:px-6">
          
          {/* فیلتر دسته‌بندی - اصلاح شده برای موبایل */}
          <div className="relative mb-10 w-full overflow-hidden">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide snap-x pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:justify-center">
              <div className="hidden md:flex items-center gap-2 text-[#c61d70] font-bold text-sm pl-2 shrink-0">
                <Filter size={16} /> فیلتر:
              </div>
              
              <Link href="/journal" className={`snap-start shrink-0 px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all border ${!activeCategory ? 'bg-[#28242b] text-white border-[#28242b] shadow-md' : 'bg-white text-[#77717b] border-[#e9e5eb] hover:border-[#c61d70] hover:text-[#c61d70]'}`}>
                همه
              </Link>
              
              {Object.entries(categoryLabels).map(([key, label]) => (
                <Link 
                  key={key} 
                  href={`/journal?category=${key}`} 
                  className={`snap-start shrink-0 px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all border ${activeCategory === key ? 'bg-[#c61d70] text-white border-[#c61d70] shadow-md shadow-[#c61d70]/20' : 'bg-white text-[#77717b] border-[#e9e5eb] hover:border-[#c61d70] hover:text-[#c61d70]'}`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* حالت خالی */}
          {allArticles.length === 0 && (
            <div className="text-center py-20 px-4">
              <div className="w-20 h-20 bg-[#fff0f7] rounded-full flex items-center justify-center mx-auto mb-6 text-[#c61d70]">
                <BookOpen size={32} />
              </div>
              <h3 className="text-xl font-black text-[#28242b] mb-2">مقاله‌ای یافت نشد</h3>
              <p className="text-[#77717b] text-sm">در این دسته‌بندی هنوز مقاله‌ای منتشر نشده است.</p>
              <Link href="/journal" className="inline-block mt-6 px-6 py-2.5 bg-[#c61d70] text-white text-sm font-bold rounded-xl">مشاهده همه مقالات</Link>
            </div>
          )}

          {/* مقاله ویژه */}
          {featured && (
            <Link href={`/journal/${featured.slug}`} className="group relative block w-full rounded-2xl md:rounded-[2rem] overflow-hidden mb-12 md:mb-20 shadow-xl shadow-[#c61d70]/5 bg-white border border-[#f2d7e5] flex flex-col md:flex-row">
              
              {/* تصویر */}
              <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:min-h-[400px] bg-[#fce5f0] overflow-hidden">
                {featured.coverImage ? (
                  <Image src={featured.coverImage} alt={featured.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#c61d70]/30"><BookOpen size={64} /></div>
                )}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-white/90 backdrop-blur-md px-3 py-1.5 md:px-5 md:py-2 rounded-full text-[10px] md:text-xs font-black text-[#c61d70] shadow-lg flex items-center gap-1 md:gap-2">
                  <Sparkles size={12} className="md:w-3.5 md:h-3.5" /> مقاله ویژه
                </div>
              </div>

              {/* محتوا */}
              <div className="w-full md:w-1/2 p-6 md:p-10 lg:p-14 flex flex-col justify-center bg-white">
                <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs text-[#77717b] mb-3 md:mb-6">
                  <span className="text-[#c61d70] font-black bg-[#fff0f7] px-2 py-1 md:px-3 md:py-1 rounded-md">{categoryLabels[featured.category] || featured.category}</span>
                  <span className="flex items-center gap-1 md:gap-1.5"><Clock size={12} className="md:w-4 md:h-4" /> {featured.readTime}</span>
                </div>
                <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-[#28242b] mb-3 md:mb-6 leading-[1.4] md:leading-[1.3] group-hover:text-[#c61d70] transition-colors line-clamp-3">
                  {featured.title}
                </h2>
                <p className="text-[#77717b] text-xs md:text-sm lg:text-base leading-loose line-clamp-3 mb-6 md:mb-10">
                  {featured.excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs md:text-sm font-black text-[#c61d70] bg-[#fff0f7] w-fit px-4 py-2 md:px-6 md:py-3 rounded-xl transition-all group-hover:bg-[#c61d70] group-hover:text-white mt-auto">
                  خواندن مقاله <ArrowUpLeft size={16} className="md:w-[18px] md:h-[18px] transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
            </Link>
          )}

          {/* گرید مقالات */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {rest.map((article) => (
                <Link key={article.id} href={`/journal/${article.slug}`} className="group flex flex-col bg-transparent">
                  <div className="relative aspect-[4/3] md:aspect-[4/5] rounded-xl md:rounded-2xl overflow-hidden mb-4 md:mb-5 bg-[#fafafc] border border-[#e9e5eb] shadow-sm">
                    {article.coverImage ? (
                      <Image src={article.coverImage} alt={article.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#c61d70]/20"><BookOpen size={32} /></div>
                    )}
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 md:px-3 md:py-1.5 rounded-md text-[9px] md:text-[10px] font-black text-[#c61d70] shadow-sm">
                      {categoryLabels[article.category] || article.category}
                    </span>
                  </div>
                  
                  <div className="flex-1 flex flex-col px-1">
                    <h3 className="text-base md:text-lg font-black text-[#28242b] mb-2 leading-[1.6] group-hover:text-[#c61d70] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-[#77717b] text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-[#e9e5eb] text-[10px] text-[#918a95] font-bold">
                      <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
                      <span>{formatPersianDate(article.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </section>
      </main>
      <Footer />
    </div>
  );
}

