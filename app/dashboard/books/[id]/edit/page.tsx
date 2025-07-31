import {
  fetchBookById,
  fetchCategoriasPrincipales,
  fetchSubcategorias,
  fetchTemas,
} from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/books/breadcrumbs";
import EditBookForm from "@/app/ui/books/edit-form";
import { Metadata } from "next";
import { notFound } from "next/navigation";
export const metadata: Metadata = {
  title: "Editar Libro",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const [libro, categoriasPrincipales, subcategorias, temas] =
    await Promise.all([
      fetchBookById(id),
      fetchCategoriasPrincipales(),
      fetchSubcategorias(),
      fetchTemas(),
    ]);

  if (!libro) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Libros", href: "/dashboard/books" },
          {
            label: "Editar Libro",
            href: `/dashboard/books/${id}/edit`,
            active: true,
          },
        ]}
      />
      <EditBookForm
        libro={libro}
        categoriasPrincipales={categoriasPrincipales}
        subcategorias={subcategorias}
        temas={temas}
      />
    </main>
  );
}
