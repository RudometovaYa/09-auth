'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import css from './ProfilePage.module.css';
import { getCurrentUser, updateCurrentUser } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore'; // Імпортуємо глобальний стан

export default function EditProfilePage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth); // Дістанемо метод для оновлення користувача

  useEffect(() => {
    async function fetchUser() {
      try {
        const user = await getCurrentUser();
        setUsername(user.username);
        setEmail(user.email);
        setAvatar(user.avatar || '/default-avatar.png');
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = await updateCurrentUser({ username });
      setAuth(updatedUser); // Оновлюємо глобальний стан аутентифікації
      router.push('/profile');
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              className={css.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <p>Email: {email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
