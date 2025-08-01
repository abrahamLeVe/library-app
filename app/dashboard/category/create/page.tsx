import { fetchCategoriasPrincipales } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/books/breadcrumbs";
import CategoryForm from "@/app/ui/categories/create-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear Categoría",
};

export default async function Page() {
  const categoriasPrincipales = await fetchCategoriasPrincipales();

  return (
    <main className="p-6">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Categorías", href: "/dashboard/category" },
          {
            label: "Crear categoría",
            href: "/dashboard/category/create",
            active: true,
          },
        ]}
      />
      <CategoryForm categoriasPrincipales={categoriasPrincipales} />
    </main>
  );
}
