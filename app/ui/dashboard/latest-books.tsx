import { fetchLatestBooks } from "@/app/lib/data";
import clsx from "clsx";
import { nunito } from "../fonts";
import RefreshButton from "./refresh-button";

export default async function LatestBooks() {
  const latestBooks = await fetchLatestBooks();
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className={`${nunito.className} mb-4 text-xl md:text-2xl`}>
        Últimos Libros
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {latestBooks.map((book, i) => (
            <div
              key={book.id}
              className={clsx(
                "flex flex-row items-center justify-between py-4",
                { "border-t": i !== 0 }
              )}
            >
              {/* Ícono con la inicial */}
              <div className="flex items-center">
                <div className="mr-4 h-8 w-8 rounded-full bg-green-200 flex items-center justify-center">
                  <span className="text-xs font-bold text-green-800">
                    {book.titulo.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Datos principales */}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold md:text-base">
                    {book.titulo}
                  </p>
                  <p className="hidden text-sm text-gray-500 sm:block">
                    {book.autor} — {book.categoria}
                  </p>
                </div>
              </div>

              {/* Código y Año */}
              <div className="text-right">
                <p className="truncate text-sm font-medium md:text-base text-gray-700">
                  {book.codigo}
                </p>
                <p className="truncate text-sm text-gray-500">{book.anio}</p>
              </div>
            </div>
          ))}
        </div>
        {/* Botón Actualizar */}
        <div className="flex items-center pb-2 pt-6">
          <RefreshButton />
        </div>
      </div>
    </div>
  );
}
