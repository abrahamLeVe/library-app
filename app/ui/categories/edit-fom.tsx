"use client";

import { updateCategory } from "@/app/lib/actions";
import { Categoria } from "@/app/lib/definitions";
import Link from "next/link";
import { useActionState } from "react";

interface FormProps {
  categoria: Categoria;
  categoriasPrincipales: Categoria[];
}

const initialState = { success: false, message: "" };

export default function EditCategoryForm({
  categoria,
  categoriasPrincipales,
}: FormProps) {
  const [state, formAction, isPending] = useActionState(
    updateCategory.bind(null, Number(categoria.id)),
    initialState
  );

  return (
    <div className="md:col-span-4">
      <form
        action={formAction}
        className="flex-1 space-y-5 bg-white p-6 rounded-xl shadow-md border"
      >
        <h2 className="text-xl font-bold text-gray-800">Editar Categoría</h2>

        {/* Nombre */}
        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            defaultValue={categoria.nombre}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Código */}
        <div>
          <label
            htmlFor="codigo"
            className="block text-sm font-medium text-gray-700"
          >
            Código
          </label>
          <input
            id="codigo"
            name="codigo"
            type="number"
            min={0}
            max={999}
            defaultValue={categoria.codigo}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Categoría Padre */}
        <div>
          <label
            htmlFor="parent_id"
            className="block text-sm font-medium text-gray-700"
          >
            Categoría Padre
          </label>
          <select
            id="parent_id"
            name="parent_id"
            defaultValue={categoria.parent_id ?? ""}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
          >
            <option value="">Ninguna (Principal)</option>
            {categoriasPrincipales.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre} ({cat.codigo})
              </option>
            ))}
          </select>
        </div>

        {/* Mensajes */}
        {state.message && (
          <div
            className={`p-3 rounded-md text-sm ${
              state.success
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {state.message}
          </div>
        )}

        {/* Botones */}
        <div className="flex justify-end gap-3">
          <Link
            href="/dashboard/category"
            className="rounded-md border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {isPending ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
