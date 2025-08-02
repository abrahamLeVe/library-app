import { Tema } from "@/app/lib/definitions";
import { UpdateTema, DeleteTema } from "./buttons";

interface TableProps {
  temas: Tema[];
}

export default function TemasTable({ temas }: TableProps) {
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="min-w-full text-gray-900">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th className="px-4 py-5 font-medium sm:pl-6">ID</th>
                <th className="px-3 py-5 font-medium">Nombre</th>
                <th className="px-3 py-5 font-medium">Descripción</th>
                <th className="px-3 py-5 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {temas.map((tema) => (
                <tr key={tema.id} className="border-b text-sm last:border-none">
                  <td className="py-3 pl-6 pr-3">{tema.id}</td>
                  <td className="px-3 py-3">{tema.nombre}</td>
                  <td className="px-3 py-3">{tema.descripcion || "—"}</td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateTema id={tema.id} />
                      <DeleteTema id={tema.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
