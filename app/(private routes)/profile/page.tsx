import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import css from './edit/ProfilePage.module.css';
import { getServerMe } from '@/lib/api/serverApi';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Профіль користувача',
};

export default async function ProfilePage() {
  let user = null;
  try {
    user = await getServerMe(); // <-- виклик серверної функції для отримання користувача
  } catch (error) {
    console.error('Failed to fetch user:', error);
  }

  if (!user) {
    return <p>Користувача не знайдено</p>;
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Профіль</h1>

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
          <Link href="/profile/edit" className={css.editButton}>
            Редагувати
          </Link>
        </div>
      </div>
    </main>
  );
}
