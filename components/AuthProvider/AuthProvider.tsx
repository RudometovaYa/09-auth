'use client';

import { useEffect, useState } from 'react';
import { getSession, getCurrentUser } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await getSession();
        if (session.valid) {
          const user = await getCurrentUser();
          if (user) {
            setAuth(user);
          } else {
            clearAuth();
          }
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [setAuth, clearAuth]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default AuthProvider;
