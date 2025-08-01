import { fetchTemas } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/books/breadcrumbs";
import ThemeForm from "@/app/ui/themes/create-form";
import LatestTemas from "@/app/ui/themes/latest-temas";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear Tema",
};

export default async function Page() {
  const temas = await fetchTemas();

  return (
    <main className="relative overflow-hidden">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Temas", href: "/dashboard/themes" },
          {
            label: "Crear tema",
            href: "/dashboard/themes/create",
            active: true,
          },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <ThemeForm temas={temas} />

        <LatestTemas temas={temas} />
      </div>
    </main>
  );
}
