'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import css from './AuthNavigation.module.css';

import { useAuthStore } from '@/lib/store/authStore';
import { logoutUser, getSession, getCurrentUser } from '@/lib/api/clientApi';

export default function AuthNavigation() {
  const {
    isAuthenticated,
    user,
    setUser,
    setIsAuthenticated,
    clearIsAuthenticated,
  } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await getSession();
        if (session.valid && !user) {
          const userData = await getCurrentUser();
          setUser(userData);
          setIsAuthenticated();
        }
      } catch (err: unknown) {
        console.error('Session check failed:', err);
        clearIsAuthenticated();
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [user, setUser, setIsAuthenticated, clearIsAuthenticated]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearIsAuthenticated();
      router.push('/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) return null;

  return (
    <>
      {isAuthenticated ? (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/profile"
              prefetch={false}
              className={css.navigationLink}
            >
              Profile
            </Link>
          </li>

          <li className={css.navigationItem}>
            <div className={css.userBlock}>
              <p className={css.userEmail}>{user?.email}</p>
              <button className={css.logoutButton} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </li>
        </>
      ) : (
        <>
          <li className={css.navigationItem}>
            <Link
              href="/sign-in"
              prefetch={false}
              className={css.navigationLink}
            >
              Login
            </Link>
          </li>

          <li className={css.navigationItem}>
            <Link
              href="/sign-up"
              prefetch={false}
              className={css.navigationLink}
            >
              Sign up
            </Link>
          </li>
        </>
      )}
    </>
  );
}
