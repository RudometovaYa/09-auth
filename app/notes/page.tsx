import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

export default async function NotesPage() {
  const initialNotes = await fetchNotes('', 1, 10);

  return <NotesClient initialNotes={initialNotes} />;
}
