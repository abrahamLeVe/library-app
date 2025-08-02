import { Categoria } from "@/app/lib/definitions";
import { DeleteCategory, UpdateCategory } from "./buttons";

interface TableProps {
  categorias: Categoria[];
}

export default function LatestCategories({ categorias }: TableProps) {
  return (
    <div className="md:col-span-4 overflow-y-auto h-[500px] text-sm">
      <div className="flow-root">
        <div className="inline-block min-w-full align-middle">
          <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
            <table className="min-w-full text-gray-900">
              <thead className="rounded-lg text-left text-sm font-normal sticky top-0 bg-gray-50">
                <tr>
                  <th className="px-4 py-5 font-medium sm:pl-6">Código</th>
                  <th className="px-3 py-5 font-medium">Nombre</th>
                  <th className="px-3 py-5 font-medium">Categoría Padre</th>
                  <th className="px-3 py-5 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {categorias.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-b text-sm last:border-none"
                  >
                    <td className="py-3 pl-6 pr-3">{cat.codigo}</td>
                    <td className="px-3 py-3">{cat.nombre}</td>
                    <td className="px-3 py-3 text-gray-500">
                      {cat.categoria_padre || "Principal"}
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdateCategory id={cat.id} />
                        <DeleteCategory id={cat.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
