"use client";

import { createTema, StateTema } from "@/app/lib/actions"; // Ojo, aquí debe ser createTema si son temas
import { Tema } from "@/app/lib/definitions";
import Link from "next/link";
import { useActionState, useState } from "react";
import { Button } from "../button";
import clsx from "clsx";

interface FormProps {
  temas: Tema[];
}

const initialState: StateTema = { message: null, errors: {} };

export default function CreateThemeForm({ temas }: FormProps) {
  const [state, formAction, isPending] = useActionState(
    createTema,
    initialState
  );

  const [errorNombre, setErrorNombre] = useState("");

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.trim();

    // Validar si ya existe
    const existe = temas.some(
      (tema) => tema.nombre.toLowerCase() === valor.toLowerCase()
    );
    if (existe) {
      setErrorNombre("⚠️ Este nombre ya existe.");
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
        <h2 className="text-xl font-bold text-gray-800">Crear Tema</h2>

        {/* Nombre */}
        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700"
          >
            Título del Tema
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            onChange={handleNombreChange}
            required
            placeholder="Ej: Autoayuda"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
          {errorNombre && (
            <p className="mt-1 text-sm text-red-600">{errorNombre}</p>
          )}
          <FieldError errors={state.errors?.nombre} />
        </div>

        {/* Descripción */}
        <div>
          <label
            htmlFor="descripcion"
            className="block text-sm font-medium text-gray-700"
          >
            Descripción (opcional)
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            placeholder="Ej: Libros de desarrollo personal."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            rows={3}
            maxLength={200}
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
            href="/dashboard/themes"
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
          <Button type="submit" disabled={isPending || !!errorNombre}>
            {isPending ? "Guardando..." : "Guardar"}
          </Button>
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
