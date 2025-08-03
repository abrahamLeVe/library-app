import { fetchFilteredAutores } from "@/app/lib/data";
import { DeleteAuthor, UpdateAuthor } from "./buttons";

export default async function AuthorsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const autores = await fetchFilteredAutores(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="min-w-full text-gray-900">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th className="px-4 py-5 font-medium sm:pl-6">ID</th>
                <th className="px-3 py-5 font-medium">Nombre</th>
                <th className="px-3 py-5 font-medium">Biografía</th>
                <th className="px-3 py-5 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {autores.map((autor) => (
                <tr
                  key={autor.id}
                  className="border-b text-sm last:border-none"
                >
                  <td className="py-3 pl-6 pr-3">{autor.id}</td>
                  <td className="px-3 py-3">{autor.nombre}</td>
                  <td className="px-3 py-3">{autor.biografia || "—"}</td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateAuthor id={autor.id} />
                      <DeleteAuthor id={autor.id} />
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
