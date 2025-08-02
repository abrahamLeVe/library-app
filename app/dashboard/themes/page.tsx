import { nunito } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import Pagination from "@/app/ui/books/pagination";
import { BooksTableSkeleton } from "@/app/ui/skeletons";
import { fetchFilteredTemas, fetchTemasPages } from "@/app/lib/data";
import { Metadata } from "next";
import { Suspense } from "react";
import TemasTable from "@/app/ui/themes/table";
import { CreateTema } from "@/app/ui/themes/buttons";

export const metadata: Metadata = {
  title: "Temas",
};

export default async function Page(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchTemasPages(query);
  const temas = await fetchFilteredTemas(query, currentPage);

  return (
    <div className="relative overflow-x-hidden">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${nunito.className} text-2xl`}>Temas</h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar temas..." />
        <CreateTema />
      </div>

      <div className="mt-4">
        <Suspense key={query + currentPage} fallback={<BooksTableSkeleton />}>
          <div className="overflow-x-auto">
            <TemasTable temas={temas} />
          </div>
        </Suspense>
      </div>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
