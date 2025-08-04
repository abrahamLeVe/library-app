"use client";

import { StateUser, updateUser } from "@/app/lib/actions";
import { User } from "@/app/lib/definitions";
import clsx from "clsx";
import Link from "next/link";
import { useActionState } from "react";
import { Button } from "../button";

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
            {isPending ? "Guardando..." : "Guardar cambios"}
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
