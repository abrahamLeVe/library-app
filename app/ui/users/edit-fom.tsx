"use client";

import { updateUser, StateUser } from "@/app/lib/actions";
import { User } from "@/app/lib/definitions";
import Link from "next/link";
import { useActionState } from "react";

interface FormProps {
  user: User;
}

const initialState: StateUser = {
  message: null,
  errors: {},
  values: undefined,
};

export default function EditUserForm({ user }: FormProps) {
  const [state, formAction, isPending] = useActionState(
    updateUser.bind(null, user.id),
    initialState
  );

  return (
    <div className="md:col-span-4">
      <form
        action={formAction}
        className="flex-1 space-y-5 bg-white p-6 rounded-xl shadow-md border"
      >
        <h2 className="text-xl font-bold text-gray-800">Editar Usuario</h2>

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
            defaultValue={user.name}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
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
            defaultValue={user.email}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <FieldError errors={state.errors?.email} />
        </div>

        {/* Contraseña */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Contraseña (déjalo vacío para no cambiar)
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="********"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <FieldError errors={state.errors?.password} />
        </div>

        {/* Rol */}
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Rol
          </label>
          <select
            id="role"
            name="role"
            defaultValue={user.role}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
            required
          >
            <option value="ADMIN">Administrador</option>
            <option value="CLIENT">Cliente</option>
            <option value="ASISTENTE">Asistente</option>
          </select>
          <FieldError errors={state.errors?.role} />
        </div>

        {/* Mensajes */}
        {state.message && (
          <div
            className={`p-3 rounded-md text-sm ${
              !state.errors || Object.keys(state.errors).length === 0
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
