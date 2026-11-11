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