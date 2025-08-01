import { Tema } from "@/app/lib/definitions";
import { UpdateTema, DeleteTema } from "./buttons";

interface TableProps {
  temas: Tema[];
}

export default function TemasTable({ temas }: TableProps) {
  return (
    <table className="min-w-full border border-gray-200 rounded-lg">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left">ID</th>
          <th className="px-4 py-2 text-left">Nombre</th>
          <th className="px-4 py-2 text-left">Descripción</th>
          <th className="px-4 py-2 text-right">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {temas.map((tema) => (
          <tr key={tema.id} className="border-t">
            <td className="px-4 py-2">{tema.id}</td>
            <td className="px-4 py-2">{tema.nombre}</td>
            <td className="px-4 py-2">{tema.descripcion || "—"}</td>
            <td className="px-4 py-2 flex justify-end gap-2">
              <UpdateTema id={tema.id} />
              <DeleteTema id={tema.id} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
