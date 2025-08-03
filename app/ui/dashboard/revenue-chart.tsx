import { CalendarIcon } from "@heroicons/react/24/outline";
import { nunito } from "../fonts";
import { fetchLibrosPorMes } from "@/app/lib/data";

export default async function LibrosChart() {
  const librosPorMes = await fetchLibrosPorMes();
  const chartHeight = 350;

  if (!librosPorMes || librosPorMes.length === 0) {
    return <p className="mt-4 text-gray-400">No hay datos disponibles.</p>;
  }

  const maxValue = Math.max(...librosPorMes.map((l) => Number(l.total)));
  const yAxisLabels = [0, Math.round(maxValue / 2), maxValue];

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${nunito.className} mb-4 text-xl md:text-2xl`}>
        Libros añadidos (últimos 12 meses)
      </h2>
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label, i) => (
              <p key={label + i}>{label}</p>
            ))}
          </div>

          {librosPorMes.map((mes) => (
            <div key={mes.mes} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md bg-green-400"
                style={{
                  height: `${(chartHeight / maxValue) * Number(mes.total)}px`,
                }}
              ></div>
              <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
                {mes.mes}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500">Últimos 12 meses</h3>
        </div>
      </div>
    </div>
  );
}
