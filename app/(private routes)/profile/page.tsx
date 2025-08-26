'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import css from './edit/ProfilePage.module.css';
import { getCurrentUser } from '@/lib/api/clientApi';

export default function ProfilePage() {
  const [user, setUser] = useState<{
    username: string;
    email: string;
    avatar: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Profile</h1>

        <Image
          src={user.avatar || '/default-avatar.png'}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <p>Username: {user.username}</p>
        <p>Email: {user.email}</p>

        <div className={css.actions}>
          <button
            className={css.editButton}
            onClick={() => router.push('/profile/edit')}
          >
            Edit
          </button>
        </div>
      </div>
    </main>
  );
}
