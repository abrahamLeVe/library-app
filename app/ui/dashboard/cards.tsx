import { fetchCardData } from "@/app/lib/data";
import {
  BookmarkIcon,
  BookOpenIcon,
  TagIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { nunito } from "../fonts";

const iconMap = {
  libros: BookOpenIcon,
  categorias: TagIcon,
  temas: BookmarkIcon,
  usuarios: UserGroupIcon,
};

export default async function CardWrapper() {
  const { totalLibros, totalCategorias, totalTemas, totalUsuarios } =
    await fetchCardData();

  return (
    <>
      <Card title="Total Libros" value={totalLibros} type="libros" />
      <Card title="Categorías" value={totalCategorias} type="categorias" />
      <Card title="Temas" value={totalTemas} type="temas" />
      <Card title="Usuarios" value={totalUsuarios} type="usuarios" />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: "libros" | "categorias" | "temas" | "usuarios";
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${nunito.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
