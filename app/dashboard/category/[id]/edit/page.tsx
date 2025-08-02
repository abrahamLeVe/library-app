import {
  fetchCategoriaById,
  fetchCategorias,
  fetchCategoriasPrincipales,
} from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/books/breadcrumbs";
import EditCategoryForm from "@/app/ui/categories/edit-fom";
import LatestCategories from "@/app/ui/categories/latest-categories";

import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Editar Categoría",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const [categoria, categoriasPrincipales] = await Promise.all([
    fetchCategoriaById(id),
    fetchCategoriasPrincipales(),
  ]);
  const categorias = await fetchCategorias();

  if (!categoria) {
    notFound();
  }

  return (
    <main className="relative overflow-hidden">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Categorías", href: "/dashboard/category" },
          {
            label: "Editar Categoría",
            href: `/dashboard/category/${id}/edit`,
            active: true,
          },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <EditCategoryForm
          categoria={categoria}
          categoriasPrincipales={categoriasPrincipales}
          categorias={categorias}
        />
        <LatestCategories categorias={categorias} />
      </div>
    </main>
  );
}
