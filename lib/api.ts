import axios from 'axios';
import { Note } from '@/types/note';

const API_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';

export interface FetchNotesProps {
  notes: Note[];
  page?: number;
  perPage?: number;
  totalPages?: number;
  tag?: string;
}

export const fetchNotes = async (
  search: string,
  page: number = 1,
  perPage: number = 10,
  tag?: string,
): Promise<FetchNotesProps> => {
  const params: Record<string, string | number> = {
    page: page.toString(),
    perPage: perPage.toString(),
  };

  // Додаємо search тільки якщо він не порожній
  if (search.trim() !== '') {
    params.search = search;
  }
  // Додаємо фільтрацію по тегу, тільки якщо він заданий і не "All"
  if (tag && tag !== 'All') {
    params.tag = tag;
  }

  const response = await axios.get<FetchNotesProps>(`/notes`, {
    params,
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });

  return response.data;
};

export interface CreateNoteProps {
  title: string;
  content: string;
  tag: string;
}

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await axios.get<Note>(`/notes/${id}`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });
  console.log(response);
  return response.data;
};

export const createNote = async (noteData: CreateNoteProps): Promise<Note> => {
  const response = await axios.post<Note>(`/notes`, noteData, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete<Note>(`/notes/${id}`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` },
  });
  return response.data;
};

export const getNotesByTag = async (tag: string): Promise<Note[]> => {
  const { data } = await axios.get<{ notes: Note[] }>(`/notes`, {
    params: { tag },
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  return data.notes;
};
