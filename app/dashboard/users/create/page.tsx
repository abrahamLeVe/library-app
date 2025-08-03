import { fetchUsers } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/books/breadcrumbs";
import UserForm from "@/app/ui/users/create-form";
import LatestUsers from "@/app/ui/users/latest-categories";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrar Usuario",
};

export default async function Page() {
  const users = await fetchUsers();

  return (
    <main className="relative overflow-hidden ">
      <Breadcrumbs
        breadcrumbs={[
          { label: "Usuarios", href: "/dashboard/users" },
          {
            label: "Crear usuario",
            href: "/dashboard/users/create",
            active: true,
          },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* Formulario para crear usuario */}
        <UserForm />

        {/* Tabla con últimos usuarios registrados */}
        <LatestUsers users={users} />
      </div>
    </main>
  );
}
