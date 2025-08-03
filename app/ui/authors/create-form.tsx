"use client";

import { createAutor, StateAutor } from "@/app/lib/actions";
import { Autor } from "@/app/lib/definitions";
import Link from "next/link";
import { useActionState, useState } from "react";

interface FormProps {
  autores: Autor[];
}

const initialState: StateAutor = { message: null, errors: {} };

export default function AuthorForm({ autores }: FormProps) {
  const [state, formAction, isPending] = useActionState(
    createAutor,
    initialState
  );

  const [errorNombre, setErrorNombre] = useState("");

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.trim();

    // Validar si ya existe
    const existe = autores.some(
      (autor) => autor.nombre.toLowerCase() === valor.toLowerCase()
    );
    if (existe) {
      setErrorNombre("⚠️ Este autor ya existe.");
    } else {
      setErrorNombre("");
    }
  };

  return (
    <div className="md:col-span-4">
      <form
        action={formAction}
        className="flex-1 space-y-5 bg-white p-6 rounded-xl shadow-md border"
      >
        <h2 className="text-xl font-bold text-gray-800">Crear Autor</h2>

        {/* Nombre */}
        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre del Autor
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            onChange={handleNombreChange}
            required
            placeholder="Ej: César Vallejo"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
          {errorNombre && (
            <p className="mt-1 text-sm text-red-600">{errorNombre}</p>
          )}
          <FieldError errors={state.errors?.nombre} />
        </div>

        {/* Biografía */}
        <div>
          <label
            htmlFor="biografia"
            className="block text-sm font-medium text-gray-700"
          >
            Biografía (opcional)
          </label>
          <textarea
            id="biografia"
            name="biografia"
            placeholder="Ej: Poeta peruano considerado una de las figuras más innovadoras de la poesía universal."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            rows={4}
            maxLength={500}
          />
        </div>

        {/* Mensajes */}
        {state.message && (
          <div
            className={`p-3 rounded-md text-sm ${
              !state.errors
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
            href="/dashboard/author"
            className="rounded-md border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isPending || !!errorNombre}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500 disabled:opacity-50"
          >
            {isPending ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors) return null;
  return (
    <div aria-live="polite">
      {errors.map((err) => (
        <p key={err} className="mt-2 text-sm text-red-500">
          {err}
        </p>
      ))}
    </div>
  );
}
