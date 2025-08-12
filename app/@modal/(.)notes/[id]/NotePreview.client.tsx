'use client';

import Modal from '@/components/ModalNotes/ModalNotes';

type Note = {
  title: string;
  content: string;
};

type Props = {
  note: Note;
};

const NotePreviewClient = ({ note }: Props) => {
  return (
    <Modal>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
    </Modal>
  );
};

export default NotePreviewClient;
