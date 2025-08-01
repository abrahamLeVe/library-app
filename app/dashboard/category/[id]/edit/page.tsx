import { fetchCategoriaById, fetchCategoriasPrincipales } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/books/breadcrumbs";
import EditCategoryForm from "@/app/ui/categories/edit-fom";

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

  if (!categoria) {
    notFound();
  }

  return (
    <main>
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
      <EditCategoryForm
        categoria={categoria}
        categoriasPrincipales={categoriasPrincipales}
      />
    </main>
  );
}
