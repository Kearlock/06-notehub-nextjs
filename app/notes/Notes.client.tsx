"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import { useDebounce } from "use-debounce";
import css from "./NotesPage.module.css";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import Loader from "@/components/Loader/Loader";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

export default function AppClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(search, 500);
  const queryClient = useQueryClient();

  const { data, isPending, isLoading, isError } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
    placeholderData: () => ({
      notes: [],
      page,
      perPage: 12,
      totalPages: 1,
    }),
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox value={search} onChange={handleSearchChange} />
          <button className={css.button} onClick={() => setIsModalOpen(true)}>
            Create note +
          </button>
        </header>
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox value={search} onChange={handleSearchChange} />
          <button className={css.button} onClick={() => setIsModalOpen(true)}>
            Create note +
          </button>
        </header>
        <ErrorMessage />
        <button
          className={css.button}
          onClick={() => queryClient.invalidateQueries({ queryKey: ["notes"] })}
        >
          Try again ...
        </button>
      </div>
    );
  }

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </div>

      {notes.length === 0 && isPending ? (
        <Loader />
      ) : (
        // <div className={css["no-notes-message"]}>
        //   <p>No notes yet...</p>
        // </div>
        <NoteList notes={notes} />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
