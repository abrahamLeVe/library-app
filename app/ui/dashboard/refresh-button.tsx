"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center text-gray-500 hover:text-gray-700"
    >
      <ArrowPathIcon
        className={clsx(`h-5 w-5 ${isPending ? "animate-spin" : ""}`)}
      />
      <span className="ml-2 text-sm">
        {isPending ? "Actualizando..." : "Actualizado ahora mismo"}
      </span>
    </button>
  );
}
