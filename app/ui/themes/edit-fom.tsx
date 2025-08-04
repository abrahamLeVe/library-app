"use client";

import { StateTema, updateTema } from "@/app/lib/actions";
import { Tema } from "@/app/lib/definitions";
import Link from "next/link";
import { useActionState, useState } from "react";
import { Button } from "../button";
import clsx from "clsx";

interface FormProps {
  temas: Tema[];
  tema: Tema;
}

export default function EditThemeForm({ temas, tema }: FormProps) {
  const initialState: StateTema = { message: null, errors: {}, values: tema };
  const updateTemaWithId = updateTema.bind(null, tema.id);
  const [state, formAction, isPending] = useActionState(
    updateTemaWithId,
    initialState
  );

  const [nombre, setNombre] = useState(tema.nombre || "");
  const [descripcion, setDescripcion] = useState(tema.descripcion || "");
  const [errorNombre, setErrorNombre] = useState("");

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.trim();
    setNombre(valor);

    // Validar si ya existe (y no es el mismo tema que editamos)
    const existe = temas.some(
      (t) => t.nombre.toLowerCase() === valor.toLowerCase() && t.id !== tema.id
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
        <h2 className="text-xl font-bold text-gray-800">Editar Tema</h2>

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
            value={nombre}
            onChange={handleNombreChange}
            required
            placeholder="Ej: Autoayuda"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
          {errorNombre && (
            <p className="mt-2 text-sm text-red-500">{errorNombre}</p>
          )}
          <FieldError errors={state.errors?.nombre} />
        </div>

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
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

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
