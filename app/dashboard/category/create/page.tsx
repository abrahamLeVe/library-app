import { fetchCategorias, fetchCategoriasPrincipales } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/books/breadcrumbs";
import CategoryForm from "@/app/ui/categories/create-form";
import LatestCategories from "@/app/ui/categories/latest-categories";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear Categoría",
};

export default async function Page() {
  const categoriasPrincipales = await fetchCategoriasPrincipales();
  const categorias = await fetchCategorias();

  return (
    <main className="relative overflow-hidden ">
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

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <CategoryForm categoriasPrincipales={categoriasPrincipales} />
        <LatestCategories categorias={categorias} />
      </div>
    </main>
  );
}
