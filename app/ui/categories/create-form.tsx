"use client";

import { createCategory } from "@/app/lib/actions";
import { Categoria } from "@/app/lib/definitions";
import { useActionState } from "react";
import Link from "next/link";

interface FormProps {
  categoriasPrincipales: Categoria[];
}

const initialState = { success: false, message: "" };

export default function CreateCategoryForm({
  categoriasPrincipales,
}: FormProps) {
  const [state, formAction, isPending] = useActionState(
    createCategory,
    initialState
  );

  return (
    <div className="md:col-span-4">
      <form
        action={formAction}
        className="flex-1 space-y-5 bg-white p-6 rounded-xl shadow-md border"
      >
        <h2 className="text-xl font-bold text-gray-800">Crear Categoría</h2>

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
            required
            placeholder="Ej: Literatura"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
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
            type="text"
            required
            placeholder="Ej: 800"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Categoría Padre */}
        <div>
          <label
            htmlFor="parent_id"
            className="block text-sm font-medium text-gray-700"
          >
            Categoría Padre (opcional)
          </label>
          <select
            id="parent_id"
            name="parent_id"
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
            {isPending ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
