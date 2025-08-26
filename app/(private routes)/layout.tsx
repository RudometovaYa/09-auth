'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

const PrivateLayout = ({ children }: Props) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/session');
        if (!res.ok) {
          // Якщо сесії немає, редірект на сторінку входу
          router.replace('/sign-in');
          return;
        }
        const data = await res.json();

        // Якщо користувач не авторизований (порожній об'єкт чи null)
        if (!data || Object.keys(data).length === 0) {
          router.replace('/sign-in');
          return;
        }

        // Користувач авторизований — показуємо контент
        setLoading(false);
      } catch {
        router.replace('/sign-in');
      }
    };

    checkSession();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default PrivateLayout;
