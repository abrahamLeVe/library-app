"use client";

import { Categoria } from "@/app/lib/definitions";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { DeleteCategory, UpdateCategory } from "./buttons";

interface TableProps {
  categorias: Categoria[];
}

export default function CategoriesTable({ categorias }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border divide-y divide-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              Código
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              Nombre
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
              Categoría Padre
            </th>
            <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categorias.map((cat) => (
            <tr key={cat.id}>
              <td className="px-4 py-2 text-sm text-gray-700">{cat.codigo}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{cat.nombre}</td>
              <td className="px-4 py-2 text-sm text-gray-500">
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
  );
}
