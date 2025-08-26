import NoteForm from '@/components/NoteForm/NoteForm';
import css from './CreateNote.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Note | NoteHub',
  description:
    'Create a new note in NoteHub and organize your thoughts efficiently.',
  openGraph: {
    title: 'Create Note | NoteHub',
    description:
      'Create a new note in NoteHub and organize your thoughts efficiently.',
    url: 'https://08-zustand-cb62s4pal-rodometovayas-projects.vercel.app/notes/action/create',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub Create Note',
      },
    ],
    type: 'website',
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
