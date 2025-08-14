import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

type SearchParams = Promise<{ page?: number; q?: string }>;

export default async function NotesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page = 1, q = "" } = await searchParams;
  const pageNum = page || 1;
  const search = q;

  const initialData = await fetchNotes({ page: pageNum, perPage: 12, search });

  return (
    <NotesClient
      initialData={initialData}
      initialPage={pageNum}
      initialSearch={search}
    />
  );
}
