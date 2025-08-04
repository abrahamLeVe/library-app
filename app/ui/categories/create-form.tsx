"use client";

import { createCategory } from "@/app/lib/actions";
import { Categoria } from "@/app/lib/definitions";
import { useActionState } from "react";
import Link from "next/link";
import { Button } from "../button";
import clsx from "clsx";

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
            type="number"
            required
            min={0}
            max={999}
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
            className={clsx(
              "flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors",
              isPending
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
            onClick={(e) => isPending && e.preventDefault()}
          >
            Cancelar
          </Link>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </div>
  );
}
