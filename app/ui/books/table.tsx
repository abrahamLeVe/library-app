import { fetchFilteredBooks } from "@/app/lib/data";
import clsx from "clsx";
import { DeleteBook, UpdateBook } from "./buttons";

export default async function LibrosTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const libros = await fetchFilteredBooks(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          {/* Versión móvil con formato narrativo */}
          <div className="md:hidden">
            {libros?.map((libro) => (
              <div
                key={libro.id}
                className="mb-4 w-full rounded-md bg-white p-4 shadow"
              >
                <p className="text-sm text-gray-700">
                  <strong>CÓDIGO:</strong> {libro.codigo_principal},
                  {libro.codigo_categoria} – <strong>FECHA:</strong>{" "}
                  {libro.anio}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>CATEGORÍA PRINCIPAL:</strong>{" "}
                  {libro.categoria_principal} – <strong>CATEGORÍA:</strong>{" "}
                  {libro.categoria}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>TEMA:</strong> {libro.temas}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>AUTOR(ES):</strong> {libro.autores}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>TÍTULO:</strong> {libro.titulo}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>ORIGEN DEL LIBRO:</strong>{" "}
                  <span
                    className={clsx(
                      "rounded-full px-2 py-1 text-xs font-medium",
                      {
                        "bg-red-100 text-red-800": libro.origen === "Copia",
                        "bg-blue-100 text-blue-800":
                          libro.origen === "Original",
                      }
                    )}
                  >
                    {libro.origen}
                  </span>
                </p>
                <p className="text-sm text-gray-700">
                  <strong>ESTADO DEL LIBRO:</strong>{" "}
                  <span
                    className={clsx(
                      "rounded-full px-2 py-1 text-xs font-medium",
                      {
                        "bg-blue-100 text-blue-800": libro.estado === "Nuevo",
                        "bg-cyan-100 text-cyan-800":
                          libro.estado === "Como nuevo",
                        "bg-green-100 text-green-800":
                          libro.estado === "Buen estado",
                        "bg-orange-100 text-orange-800":
                          libro.estado === "Regular",
                        "bg-red-100 text-red-800":
                          libro.estado === "Mal estado",
                      }
                    )}
                  >
                    {libro.estado}
                  </span>
                </p>
              </div>
            ))}
          </div>

          {/* Versión escritorio con columnas */}
          <table className="hidden min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th className="px-4 py-5 font-medium sm:pl-6">Código</th>
                <th className="px-3 py-5 font-medium">Fecha</th>
                <th className="px-3 py-5 font-medium">Categoría Principal</th>
                <th className="px-3 py-5 font-medium">Categoría</th>
                <th className="px-3 py-5 font-medium">Temas</th>
                <th className="px-3 py-5 font-medium">Autor(es)</th>
                <th className="px-3 py-5 font-medium">Título</th>
                <th className="px-3 py-5 font-medium">Origen</th>
                <th className="px-3 py-5 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {libros?.map((libro) => (
                <tr
                  key={libro.id}
                  className="border-b text-sm last:border-none"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    {libro.codigo}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{libro.anio}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {libro.categoria_principal}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {libro.categoria}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{libro.temas}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {libro.autores}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {libro.titulo}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span
                      className={clsx(
                        "rounded-full px-2 py-1 text-xs font-medium",
                        {
                          "bg-red-100 text-red-800": libro.origen === "Copia",
                          "bg-blue-100 text-blue-800":
                            libro.origen === "Original",
                        }
                      )}
                    >
                      {libro.origen}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span
                      className={clsx(
                        "rounded-full px-2 py-1 text-xs font-medium",
                        {
                          "bg-blue-100 text-blue-800": libro.estado === "Nuevo",
                          "bg-cyan-100 text-cyan-800":
                            libro.estado === "Como nuevo",
                          "bg-green-100 text-green-800":
                            libro.estado === "Buen estado",
                          "bg-orange-100 text-orange-800":
                            libro.estado === "Regular",
                          "bg-red-100 text-red-800":
                            libro.estado === "Mal estado",
                        }
                      )}
                    >
                      {libro.estado}
                    </span>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateBook id={libro.id} />
                      <DeleteBook id={libro.id} />
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
