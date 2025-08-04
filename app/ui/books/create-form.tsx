"use client";

import { createBook, State } from "@/app/lib/actions";
import { Button } from "@/app/ui/button";
import { BookOpenIcon, CalendarIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";

export default function Form({
  categoriasPrincipales,
  subcategorias,
  temas,
  autores,
}: any) {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(
    createBook,
    initialState
  );

  const [temaSeleccionado, setTemaSeleccionado] = useState(
    state.values?.tema ?? ""
  );

  const [autoresSeleccionados, setAutoresSeleccionados] = useState(
    state.values?.autores ?? []
  );

  useEffect(() => {
    if (state.values?.autores) {
      setAutoresSeleccionados(
        Array.isArray(state.values.autores)
          ? state.values.autores.map(String)
          : [String(state.values.autores)]
      );
    }
  }, [state.values?.autores]);

  console.log("autoresSeleccionados", autoresSeleccionados);
  // Estado para filtrar subcategorías según categoría principal
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<
    number | null
  >(null);

  const [subCategoriaSeleccionada, setSubCategoriaSeleccionada] = useState<
    number | null
  >(null);

  const [prefijoCodigo, setPrefijoCodigo] = useState(""); // ejemplo: 890,
  const [sufijoCodigo, setSufijoCodigo] = useState(""); // ejemplo: 0001

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const catId = Number(e.target.value);
    setCategoriaSeleccionada(catId);
    setSubCategoriaSeleccionada(null);
    setPrefijoCodigo("");
  };

  // Cuando cambia la subcategoría
  const handleSubcategoriaChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const subId = Number(e.target.value);
    setSubCategoriaSeleccionada(subId);
    const sub = subcategorias.find((s: any) => s.id === subId);
    if (sub) {
      setPrefijoCodigo(`${sub.codigo},`);
    }
  };
  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Categoría Principal */}
        <div className="mb-4">
          <label
            htmlFor="categoriaPrincipal"
            className="mb-2 block text-sm font-medium"
          >
            Categoría Principal
          </label>
          <select
            id="categoriaPrincipal"
            name="categoriaPrincipal"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            value={categoriaSeleccionada ?? ""}
            onChange={handleCategoriaChange}
            required
          >
            <option value="" disabled>
              Seleccione una categoría
            </option>
            {categoriasPrincipales.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre} ({cat.codigo})
              </option>
            ))}
          </select>
          <FieldError errors={state.errors?.categoriaPrincipal} />
        </div>

        {/* Subcategoría */}
        <div className="mb-4">
          <label
            htmlFor="subcategoria"
            className="mb-2 block text-sm font-medium"
          >
            Subcategoría
          </label>
          <select
            id="subcategoria"
            name="subcategoria"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            value={subCategoriaSeleccionada ?? ""}
            onChange={handleSubcategoriaChange}
            required
          >
            <option value="" disabled>
              Seleccione una subcategoría
            </option>
            {subcategorias
              .filter((sub: any) => sub.parent_id === categoriaSeleccionada)
              .map((sub: any) => (
                <option key={sub.id} value={sub.id}>
                  {sub.nombre} ({sub.codigo})
                </option>
              ))}
          </select>
          <FieldError errors={state.errors?.subcategoria} />
        </div>

        {/* Código */}
        <div className="mb-4">
          <label htmlFor="codigo" className="mb-2 block text-sm font-medium">
            Código del Libro
          </label>
          <div className="flex">
            {/* Prefijo bloqueado */}
            <input
              type="text"
              value={prefijoCodigo}
              disabled
              className="w-20 rounded-l-md border border-gray-200 bg-gray-100 py-2 px-2 text-sm font-mono text-gray-600"
            />
            {/* Sufijo editable */}
            <input
              id="codigo"
              name="codigo"
              type="number"
              value={sufijoCodigo}
              onChange={(e) => {
                let valor = e.target.value;
                if (valor.length > 4) {
                  valor = valor.slice(0, 4);
                }
                setSufijoCodigo(valor);
              }}
              className="flex-1 rounded-r-md border border-gray-200 py-2 px-2 text-sm font-mono"
              placeholder="0001"
              required
            />
          </div>
          <input
            type="hidden"
            name="codigoCompleto"
            value={prefijoCodigo + sufijoCodigo}
          />
          <FieldError errors={state.errors?.codigo} />
        </div>

        {/* Tema */}
        <div className="mb-4">
          <label htmlFor="tema" className="mb-2 block text-sm font-medium">
            Tema
          </label>
          <select
            id="tema"
            name="tema"
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            value={temaSeleccionado}
            onChange={(e) => setTemaSeleccionado(e.target.value)}
            required
          >
            <option value="" disabled>
              Seleccione un tema
            </option>
            {temas.map((tema: any) => (
              <option key={tema.id} value={tema.id}>
                {tema.nombre}
              </option>
            ))}
          </select>

          <FieldError errors={state.errors?.tema} />
        </div>

        {/* Autores */}
        <div className="mb-4">
          <label htmlFor="autores" className="mb-2 block text-sm font-medium">
            Autores
          </label>
          <select
            id="autores"
            name="autores"
            multiple
            className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
            value={autoresSeleccionados}
            onChange={(e) =>
              setAutoresSeleccionados(
                Array.from(e.target.selectedOptions, (opt) => opt.value)
              )
            }
            required
          >
            {autores.map((autor: any) => (
              <option key={autor.id} value={autor.id}>
                {autor.nombre}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Mantén presionada <kbd>Ctrl</kbd> (Windows) o <kbd>Cmd</kbd> (Mac)
            para seleccionar varios.
          </p>
          <FieldError errors={state.errors?.autores} />
        </div>

        {/* Título */}
        <div className="mb-4">
          <label htmlFor="titulo" className="mb-2 block text-sm font-medium">
            Título
          </label>
          <div className="relative">
            <input
              id="titulo"
              name="titulo"
              type="text"
              placeholder="Ej: Poemas Humanos"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
              defaultValue={state.values?.titulo ?? ""}
              required
            />
            <BookOpenIcon className="pointer-events-none absolute left-3 top-1/3 h-[18px] w-[18px] text-gray-500" />
          </div>
          <FieldError errors={state.errors?.titulo} />
        </div>

        {/* Fecha */}
        <div className="mb-4">
          <label htmlFor="anio" className="mb-2 block text-sm font-medium">
            Año
          </label>
          <div className="relative">
            <input
              id="anio"
              name="anio"
              placeholder="Ej: 1999 o SF"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm"
              defaultValue={state.values?.anio ?? ""}
              maxLength={4}
              required
            />
            <CalendarIcon className="pointer-events-none absolute left-3 top-1/3 h-[18px] w-[18px] text-gray-500" />
          </div>
          <FieldError errors={state.errors?.anio} />
        </div>

        {/* Origen */}
        <fieldset className="mb-4">
          <legend className="mb-2 block text-sm font-medium">Origen</legend>
          <div className="flex gap-4">
            {["Copia", "Original", "Otro"].map((origen) => (
              <label key={origen} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="origen"
                  value={origen}
                  className="h-4 w-4"
                  defaultChecked={state.values?.origen === origen}
                  required
                />

                <span
                  className={clsx(
                    "rounded-full px-2 py-1 text-xs font-medium",
                    {
                      "bg-red-100 text-red-800": origen === "Copia",
                      "bg-blue-100 text-blue-800": origen === "Original",
                    }
                  )}
                >
                  {origen}
                </span>
              </label>
            ))}
          </div>
          <FieldError errors={state.errors?.origen} />
        </fieldset>

        {/* Estado */}
        <fieldset className="mb-4">
          <legend className="mb-2 block text-sm font-medium">Estado</legend>
          <div className="flex flex-wrap gap-4">
            {[
              "Nuevo",
              "Como nuevo",
              "Buen estado",
              "Regular",
              "Mal estado",
            ].map((estado) => (
              <label key={estado} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="estado"
                  value={estado}
                  className="h-4 w-4"
                  defaultChecked={state.values?.estado === estado}
                  required
                />
                <span
                  className={clsx(
                    "rounded-full px-2 py-1 text-xs font-medium",
                    {
                      "bg-blue-100 text-blue-800": estado === "Nuevo",
                      "bg-cyan-100 text-cyan-800": estado === "Como nuevo",
                      "bg-green-100 text-green-800": estado === "Buen estado",
                      "bg-orange-100 text-orange-800": estado === "Regular",
                      "bg-red-100 text-red-800": estado === "Mal estado",
                    }
                  )}
                >
                  {estado}
                </span>
              </label>
            ))}
          </div>
          <FieldError errors={state.errors?.estado} />
        </fieldset>

        {/* Mensajes de error */}
        {state.message && (
          <div className="mt-4 rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">
            {state.message}
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3">
        <Link
          href="/dashboard/books"
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

      {/* Campos ocultos para enviar datos adicionales */}
    </form>
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
