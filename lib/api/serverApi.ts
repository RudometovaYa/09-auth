import { api } from './api';
import type { Note } from '@/types/note';
import { cookies } from 'next/headers';
import type { User } from '@/types/user';
import type { AxiosResponse } from 'axios';

export const serverGetSession = async (): Promise<AxiosResponse<unknown>> => {
  const store = await cookies();
  return api.get('/auth/session', { headers: { Cookie: store.toString() } });
};

export const getServerMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await api.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export const updateServerMe = async (payload: Partial<User>): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await api.patch<User>('/users/me', payload, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  search: string = '',
  page: number = 1,
  perPage: number = 12,
  tag?: string,
): Promise<FetchNotesResponse> => {
  const cookieStore = await cookies();
  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      ...(search.trim() ? { search } : {}),
      ...(tag && tag.toLowerCase() !== 'all' ? { tag } : {}),
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};
