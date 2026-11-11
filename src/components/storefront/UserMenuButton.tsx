'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User } from 'lucide-react';

export default function UserMenuButton() {
  const [customer, setCustomer] = useState<{ name: string; avatar?: string | null } | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch('/api/account/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.success) setCustomer(data.customer);
      })
      .catch(() => {})
      .finally(() => setChecked(true));
  }, []);

  if (!checked) return <div className="w-10 h-10" />;

  if (customer) {
    return (
      <Link
        href="/account"
        className="flex items-center justify-center w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[#c61d70] to-[#e84e9e] text-white font-black text-sm shadow-md hover:scale-105 transition-transform ring-2 ring-white"
        aria-label={`حساب ${customer.name}`}
        title={customer.name}
      >
        {customer.avatar ? (
          <Image src={customer.avatar} alt={customer.name} width={40} height={40} className="w-full h-full object-cover" />
        ) : (
          customer.name.charAt(0)
        )}
      </Link>
    );
  }

  return (
    <Link href="/account" className="fl-icon-button" aria-label="حساب کاربری">
      <User size={18} strokeWidth={1.8} />
    </Link>
  );
}