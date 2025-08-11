import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

interface NotesPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;

  // Якщо тег 'all' — передаємо undefined, інакше — тег
  const tag = slug?.[0] === 'all' ? undefined : slug?.[0];
  const data = await fetchNotes('', 1, 10, tag);

  return <NotesClient initialNotes={data} tag={tag} />;
}
