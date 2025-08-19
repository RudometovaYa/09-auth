'use client';

import css from './Notes.module.css';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import NoteList from '@/components/NoteList/NoteList';
import { fetchNotes } from '../../../../lib/api';
import Loader from '@/components/Loader/Loader';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useDebounce } from 'use-debounce';
import { FetchNotesProps } from '@/lib/api';
import Link from 'next/link';

type NotesClientProps = {
  initialNotes: FetchNotesProps;
  tag?: string;
};

export default function NotesClient({ initialNotes, tag }: NotesClientProps) {
  const [query, setQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [debouncedQuery] = useDebounce<string>(query, 500);
  const safeQuery = debouncedQuery.trim();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', safeQuery, currentPage, tag],
    queryFn: () => fetchNotes(safeQuery, currentPage, 10, tag),
    placeholderData: keepPreviousData,
    initialData:
      currentPage === 1 && safeQuery === '' ? initialNotes : undefined,
  });

  const handleSearch = (value: string) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const pageCount = data?.totalPages ?? 0;
  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <Link href="/notes/action/create" className={css.button}>
            Create note +
          </Link>
          {pageCount > 1 && (
            <Pagination
              pageCount={pageCount}
              currentPage={currentPage - 1}
              onPageChange={(page) => setCurrentPage(page + 1)}
            />
          )}
          <SearchBox onSearch={handleSearch} />
        </header>
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}

        {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

        {data && data.notes.length === 0 && <p>Нотатки не знайдено.</p>}
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}
