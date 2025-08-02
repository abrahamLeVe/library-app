import { nunito } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import Pagination from "@/app/ui/books/pagination";
import { BooksTableSkeleton } from "@/app/ui/skeletons";
import { fetchFilteredCategorias, fetchCategoriasPages } from "@/app/lib/data";
import { Metadata } from "next";
import { Suspense } from "react";
import CategoriesTable from "@/app/ui/categories/table";
import { CreateCategory } from "@/app/ui/categories/buttons";

export const metadata: Metadata = {
  title: "Categorías",
};

export default async function Page(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchCategoriasPages(query);
  const categorias = await fetchFilteredCategorias(query, currentPage);

  return (
    <div className="relative overflow-x-hidden">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${nunito.className} text-2xl`}>Categorías</h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar categorías..." />
        <CreateCategory />
      </div>

      <div className="mt-4">
        <Suspense key={query + currentPage} fallback={<BooksTableSkeleton />}>
          <div className="overflow-x-auto">
            <CategoriesTable categorias={categorias} />
          </div>
        </Suspense>
      </div>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
