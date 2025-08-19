'use client';

import css from './NoteForm.module.css';

import { useNoteDraft } from '@/lib/store/noteDraft';
import { useId } from 'react';
import { useRouter } from 'next/navigation';
import { ChangeEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createNote, CreateNoteProps } from '../../lib/api';

export default function NoteForm() {
  const { draft, setDraft, clearDraft } = useNoteDraft();
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      router.push('/notes');
    },
  });

  const fieldId = useId();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setDraft({
      ...(draft as CreateNoteProps),
      [e.target.name as keyof CreateNoteProps]: e.target.value,
    });
  };

  const handleSubmit = (formData: FormData) => {
    const data: CreateNoteProps = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      tag: formData.get('tag') as string,
    };

    mutate(data);
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}>Title</label>
        <input
          id={`${fieldId}-title`}
          type="text"
          name="title"
          className={css.input}
          onChange={handleChange}
          defaultValue={draft.title}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>Content</label>
        <textarea
          id={`${fieldId}-content`}
          name="content"
          className={css.textarea}
          onChange={handleChange}
          value={draft.content}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <select
          id={`${fieldId}-tag`}
          name="tag"
          className={css.select}
          onChange={handleChange}
          defaultValue={draft.tag}
          required
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitButton} disabled={isPending}>
          {isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}
