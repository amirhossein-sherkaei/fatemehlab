import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';

export function useAdminNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [hasNew, setHasNew] = useState(false);
  const initialLoad = useRef(true);

  // 1. Safe check for browser environment
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    // 2. Guard against server-side execution
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast.error('مرورگر شما از اعلان‌ها پشتیبانی نمی‌کند');
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm === 'granted') {
        toast.success('اعلان‌ها با موفقیت فعال شدند');
        new Notification('فاطمه بیوتی لند', {
          body: 'سیستم اعلان‌ها با موفقیت فعال شد.',
          icon: '/logo.png',
        });
      } else if (perm === 'denied') {
        toast.error('شما دسترسی به اعلان‌ها را رد کردید.');
      }
    } catch (error) {
      toast.error('خطا در درخواست دسترسی');
    }
  };

  // 3. Safe polling
  useEffect(() => {
    if (permission !== 'granted') return;
    if (typeof window === 'undefined') return; // Extra guard

    const checkNotifications = async () => {
      try {
        const res = await fetch('/api/admin/notifications');
        if (!res.ok) return;
        
        const data = await res.json();
        if (!data.success) return;

        const lastOrders = Number(localStorage.getItem('lastPendingOrders') || data.orders);
        const lastReviews = Number(localStorage.getItem('lastPendingReviews') || data.reviews);

        if (data.orders > lastOrders && !initialLoad.current) {
          new Notification('سفارش جدید ثبت شد', {
            body: `شما ${data.orders - lastOrders} سفارش جدید دارید.`,
            icon: '/logo.png',
          });
          setHasNew(true);
        }

        if (data.reviews > lastReviews && !initialLoad.current) {
          new Notification('نظر جدید در انتظار تایید', {
            body: `شما ${data.reviews - lastReviews} نظر جدید دارید.`,
            icon: '/logo.png',
          });
          setHasNew(true);
        }

        localStorage.setItem('lastPendingOrders', data.orders);
        localStorage.setItem('lastPendingReviews', data.reviews);
        initialLoad.current = false;
      } catch (error) {
        // Silent fail
      }
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 30000);
    return () => clearInterval(interval);
  }, [permission]);

  return { permission, requestPermission, hasNew };
}