import { api } from './api';
import axios from 'axios';
import { Note, NewNoteData } from '@/types/note';
import { User, UpdateUserDto } from '@/types/user';

export interface NoteResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

interface CustomError extends Error {
  status?: number;
}

const cache: Record<string, NoteResponse> = {};

async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
): Promise<T> {
  try {
    return await fn();
  } catch (err: unknown) {
    if (
      axios.isAxiosError(err) &&
      err.response?.status === 429 &&
      retries > 0
    ) {
      await new Promise((res) => setTimeout(res, delay));
      return fetchWithRetry(fn, retries - 1, delay * 2);
    }
    throw err;
  }
}

export async function fetchNotes(
  page = 1,
  perPage = 12,
  search = '',
  category?: string,
): Promise<NoteResponse> {
  const params: FetchNotesParams = { page, perPage };
  if (search.trim()) params.search = search.trim();
  if (category && category.toLowerCase() !== 'all') params.tag = category;

  const cacheKey = JSON.stringify(params);
  if (cache[cacheKey]) return cache[cacheKey];

  const data = await fetchWithRetry(() =>
    api.get<NoteResponse>('/notes', { params }).then((res) => res.data),
  );

  cache[cacheKey] = data;
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  return fetchWithRetry(() =>
    api.get<Note>(`/notes/${id}`).then((res) => res.data),
  );
}

export async function createNote(newNote: NewNoteData): Promise<Note> {
  return fetchWithRetry(() =>
    api.post<Note>('/notes', newNote).then((res) => res.data),
  );
}

export async function deleteNote(noteId: string): Promise<Note> {
  return fetchWithRetry(() =>
    api.delete<Note>(`/notes/${noteId}`).then((res) => res.data),
  );
}

// 🔐 AUTH

export const registerUser = async (
  email: string,
  password: string,
): Promise<User> => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json();
    const error = new Error(
      errorData.error || 'Registration failed',
    ) as CustomError;
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<User> => {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json();
    const error = new Error(errorData.error || 'Login failed') as CustomError;
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export const logoutUser = async (): Promise<void> => {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json();
    const error = new Error(errorData.error || 'Logout failed') as CustomError;
    error.status = res.status;
    throw error;
  }
};

export const getSession = async (): Promise<{ valid: boolean }> => {
  return fetchWithRetry(() =>
    api.get<{ valid: boolean }>('/auth/session').then((res) => res.data),
  );
};

export const getCurrentUser = async (): Promise<User> => {
  return fetchWithRetry(() =>
    api.get<User>('/users/me').then((res) => res.data),
  );
};

export const updateCurrentUser = async (
  payload: UpdateUserDto,
): Promise<User> => {
  return fetchWithRetry(() =>
    api.patch<User>('/users/me', payload).then((res) => res.data),
  );
};

export { api };
