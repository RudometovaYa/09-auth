import { fetchNoteById } from '@/lib/api';
import { NoteDetailsClient } from './NoteDetails.client';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { id } = await params;
  const data = await fetchNoteById(id);

  return {
    title: data.title.slice(0, 60),
    description: data.content.slice(0, 155),
    openGraph: {
      title: data.title.slice(0, 60),
      description: data.content.slice(0, 155),
      url: `https://08-zustand-cb62s4pal-rodometovayas-projects.vercel.app/notes/${id}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `Preview of note titled "${data.title}"`,
        },
      ],
      type: 'article',
    },
  };
};

export default async function NoteDetails({ params }: Props) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
