'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserRound } from 'lucide-react';

export default function UserMenuButton() {
  const [customer, setCustomer] = useState<{ name: string; avatar?: string | null } | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch('/api/account/me')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.success && data.customer) setCustomer(data.customer);
      })
      .catch(() => {})
      .finally(() => setChecked(true));
  }, []);

  if (!checked) {
    return <span className="fbl-account-avatar-skeleton" aria-hidden="true" />;
  }

  if (customer) {
    const displayName = customer.name?.trim() || 'کاربر';
    const initial = displayName.charAt(0);

    return (
      <Link
        href="/account"
        className="fbl-account-avatar"
        aria-label={`حساب ${displayName}`}
        title={displayName}
      >
        {customer.avatar ? (
          <Image
            src={customer.avatar}
            alt=""
            fill
            sizes="44px"
            quality={90}
            className="fbl-account-avatar-image"
          />
        ) : (
          <span className="fbl-account-avatar-initial" aria-hidden="true">
            {initial || <UserRound size={19} strokeWidth={1.8} />}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link href="/account" className="fl-icon-button" aria-label="حساب کاربری" title="حساب کاربری">
      <UserRound size={19} strokeWidth={1.8} />
    </Link>
  );
}