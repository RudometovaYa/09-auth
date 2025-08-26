import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CreateNoteProps } from '../../types/note';

const initialDraft: CreateNoteProps = {
  title: '',
  content: '',
  tag: 'Todo',
};

type NoteDraft = {
  draft: CreateNoteProps;
  setDraft: (newData: CreateNoteProps) => void;
  clearDraft: () => void;
};

export const useNoteDraft = create<NoteDraft>()(
  persist(
    (set) => {
      return {
        draft: initialDraft,
        setDraft: (newData: CreateNoteProps) => set({ draft: newData }),
        clearDraft: () => set({ draft: initialDraft }),
      };
    },
    {
      name: 'draft',
      partialize: (state) => {
        return { draft: state.draft };
      },
    },
  ),
);
