import { fetchFilteredUsers } from "@/app/lib/data";
import { DeleteUser, UpdateUser } from "./buttons";

export default async function UsersTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const users = await fetchFilteredUsers(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="min-w-full text-gray-900">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th className="px-4 py-5 font-medium sm:pl-6">Nombre</th>
                <th className="px-3 py-5 font-medium">Correo</th>
                <th className="px-3 py-5 font-medium">Rol</th>
                <th className="px-3 py-5 font-medium">Creado</th>
                <th className="px-3 py-5 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {users.map((user) => (
                <tr key={user.id} className="border-b text-sm last:border-none">
                  <td className="py-3 pl-6 pr-3">{user.name}</td>
                  <td className="px-3 py-3">{user.email}</td>
                  <td className="px-3 py-3">{user.role}</td>
                  <td className="px-3 py-3 text-gray-500">
                    {new Date(user.created_at ?? "").toLocaleDateString(
                      "es-PE"
                    )}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateUser id={user.id} />
                      <DeleteUser id={user.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
