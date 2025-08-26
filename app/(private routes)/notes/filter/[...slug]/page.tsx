import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';
import { Metadata } from 'next';
import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from '@tanstack/react-query';

interface NotesPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const filter = slug?.[0] || 'all';

  const title = `Notes filtered by ${filter} | NoteHub`;
  const description = `Viewing notes filtered by ${filter} on NoteHub.`;

  const url = `https://08-zustand-cb62s4pal-rodometovayas-projects.vercel.app/notes/filter/${filter}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub Filtered Notes',
        },
      ],
      type: 'website',
    },
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;

  const tag = slug?.[0] === 'all' ? undefined : slug?.[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    /*    queryKey: ['notes', '', 1, tag],
    queryFn: () => fetchNotes('', 1, 10, tag), */
    queryKey: ['notes', '', 1, tag],
    queryFn: () => fetchNotes('', 1, 10, tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
