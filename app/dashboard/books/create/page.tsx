import {
  fetchAutores,
  fetchCategoriasPrincipales,
  fetchSubcategorias,
  fetchTemas,
} from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/books/breadcrumbs";
import Form from "@/app/ui/books/create-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear Libro",
};

export default async function Page() {
  const categoriasPrincipales = await fetchCategoriasPrincipales();
  const subcategorias = await fetchSubcategorias();
  const temas = await fetchTemas();
  const autores = await fetchAutores();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Libros", href: "/dashboard/books" },
          {
            label: "Crear Libro",
            href: "/dashboard/books/create",
            active: true,
          },
        ]}
      />
      <Form
        categoriasPrincipales={categoriasPrincipales}
        subcategorias={subcategorias}
        temas={temas}
        autores={autores}
      />
    </main>
  );
}
