import { fetchTemaById, fetchTemas } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/books/breadcrumbs";
import EditThemeForm from "@/app/ui/themes/edit-fom";
import LatestTemas from "@/app/ui/themes/latest-temas";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Editar Tema",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;
  const tema = await fetchTemaById(id);
  const temas = await fetchTemas();

  if (!tema) {
    notFound();
  }

  return (
    <main className="relative overflow-hidden">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Temas", href: "/dashboard/themes" },
          {
            label: "Editar tema",
            href: `/dashboard/themes/${id}/edit`,
            active: true,
          },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <EditThemeForm temas={temas} tema={tema} />

        <LatestTemas temas={temas} />
      </div>
    </main>
  );
}
