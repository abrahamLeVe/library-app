"use client";

import { createUser, StateUser } from "@/app/lib/actions";
import { useActionState, useState } from "react";
import Link from "next/link";

const initialState: StateUser = { message: null, errors: {} };

export default function CreateUserForm() {
  const [state, formAction, isPending] = useActionState(
    createUser,
    initialState
  );

  const [errorEmail, setErrorEmail] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.trim();

    // Validar email simple
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
    if (!emailValido) {
      setErrorEmail("⚠️ El correo no es válido.");
    } else {
      setErrorEmail("");
    }
  };

  return (
    <div className="md:col-span-4">
      <form
        action={formAction}
        className="flex-1 space-y-5 bg-white p-6 rounded-xl shadow-md border"
      >
        <h2 className="text-xl font-bold text-gray-800">Registrar Usuario</h2>

        {/* Nombre */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={state.values?.name}
            placeholder="Ej: Juan Pérez"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
          <FieldError errors={state.errors?.name} />
        </div>

        {/* Correo */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Correo
          </label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={handleEmailChange}
            required
            defaultValue={state.values?.email}
            placeholder="Ej: usuario@email.com"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
          {errorEmail && (
            <p className="mt-1 text-sm text-red-600">{errorEmail}</p>
          )}
          <FieldError errors={state.errors?.email} />
        </div>

        {/* Contraseña */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Mínimo 6 caracteres"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
          <FieldError errors={state.errors?.password} />
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
            href="/dashboard/users"
            className="rounded-md border px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isPending || !!errorEmail}
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
